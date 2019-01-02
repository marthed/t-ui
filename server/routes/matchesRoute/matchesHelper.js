const axios = require('axios');
const querystring = require('querystring');
const { get } = require('lodash/fp');

async function tinderRequest(url, method, accessToken, postData) {
  const { data } = await axios.request({
    url,
    method,
    headers: {
      'X-Auth-Token': `${accessToken}`,
      'Content-type': 'application/json',
      'User-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
    },
    data: postData,
  });
  return data;
}

async function getMatchesFromAllPages(accessToken, pageToken, allMatches = []) {
  if (pageToken === undefined) return allMatches;
  const nextPageToken = pageToken === 'first' ? null : pageToken;
  const { matches, next_page_token } = await getMatchesFromPage(
    accessToken,
    nextPageToken
  );
  console.log('Get matches from all pages!');
  console.log('matches: ', matches && matches.length);
  console.log('next_page_token: ', next_page_token);
  const aggregatedMatches = allMatches.concat(matches);
  if (aggregatedMatches.length > 50) return aggregatedMatches;
  return getMatchesFromAllPages(
    accessToken,
    next_page_token,
    aggregatedMatches
  );
}

async function getMatchesFromPage(accessToken, pageToken) {
  const queryParamters = pageToken
    ? { page_token: pageToken, count: 60 }
    : { count: 60 };
  const query = querystring.stringify(queryParamters);

  try {
    console.log(`Trying to fetch matches with token:${pageToken}...`);
    const { data = {} } = await tinderRequest(
      `https://api.gotinder.com/v2/matches?${query}`,
      'GET',
      accessToken
    );
    const { matches = [], next_page_token = undefined } = data;
    console.log('Getting more data for the matches');
    const matchesWithMoreData = await getPersonDataFromMatch(
      accessToken,
      matches
    );

    if (!matchesWithMoreData.length)
      return { matches: matchesWithMoreData, next_page_token: undefined };
    console.log('More data fetch completed');
    console.log('next_page_token: ', next_page_token);
    return { matches: matchesWithMoreData, next_page_token };
  } catch (error) {
    console.log('ERROR when getting matches from a page');
    console.log(':', error.status || error.code || error.message);
    console.log(error.stack);
    console.log('\n \n ');
    return { matches: [], next_page_token: undefined };
  }
}

async function getPersonDataFromMatch(
  accessToken,
  matches,
  updatedMatches = [],
  idx = 0
) {
  const match = matches[idx];
  const personId = get('person._id', match);
  if (!personId) return updatedMatches;

  try {
    const res = await tinderRequest(
      `https://api.gotinder.com/user/${personId}?locale=sv`,
      'GET',
      accessToken
    );
    return getPersonDataFromMatch(
      accessToken,
      matches,
      [{ person: { ...res.results }, ...match }, ...updatedMatches],
      idx + 1
    );
  } catch (error) {
    console.log('An Error occured when fetching data from match');
    console.log(error);
    return updatedMatches;
  }
}

module.exports = {
  getMatchesFromPage,
  getMatchesFromAllPages,
  tinderRequest,
}