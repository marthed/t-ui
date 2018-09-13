const axios = require('axios');
const querystring = require('querystring');
const _ = require('lodash/fp');
const { storeMatchesFromTinder, getStoredMatches } = require('./matches.js');
const filterMatches = require('./filterMatches.js');

async function getAllMatchesFromTinder(req, res) {
  try {
    const { userId, accessToken, filter={} } = req.body;

    if (!userId) {
      return res.status(400).json({ message: `userId: ${userId} is not valid`});
    }
    if (!accessToken) {
      return res.status(400).json({ message: `accessToken: ${accessToken} is not valid`});
    }

    console.log(`Getting ALL matches for user ${userId}`);
    const storedMatches = getStoredMatches(userId);
    if (storedMatches) {
      console.log(`${storedMatches.length} stored matches found.`);
      const filteredMatches = filterMatches(storedMatches, filter);
      if (filteredMatches.length < storedMatches.length) {
        console.log('Filtered stored matches');
      }
      console.log(`Returning with ${filteredMatches.length} matches`);
      return res.json({ matches: filteredMatches });
    }

    console.log('Getting ALL matches from Tinder with token: ', accessToken);
    const matches = await getMatchesFromAllPages(accessToken, "first");
    if (!matches.length) throw new Error('Did not get any matches');
    await storeMatchesFromTinder(userId, matches);

    console.log(`Returning with ${matches.length} matches`);
    return res.status(200).json({ matches });
  }
  catch (error) {
    console.log('An Error occured while fetching matches');
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
}

async function tinderRequest(url, method, accessToken) {
  const { data } = await
  axios.request({
    url,
    method,
    headers: {
      'X-Auth-Token': `${accessToken}`,
      'Content-type': 'application/json',
      'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    }
  });
  return data;
}

async function getMatchesFromAllPages(accessToken, pageToken, allMatches=[]){
  if (pageToken === undefined) return allMatches;
  const nextPageToken = (pageToken === 'first') ? null : pageToken;
  const { matches, next_page_token } = await getMatchesFromTinderPage(accessToken, nextPageToken);
  console.log('Get matches from all pages!');
  console.log('matches: ', matches && matches.length);
  console.log('next_page_token: ', next_page_token);
  const aggregatedMatches = allMatches.concat(matches);
  if (aggregatedMatches.length > 150) return aggregatedMatches;
  return getMatchesFromAllPages(accessToken, next_page_token, aggregatedMatches);
}

async function getDataFromMatch(accessToken, matchIds, updatedMatches=[], idx=0) {
  const matchId = matchIds[idx];
  if (!matchId) return updatedMatches;

  try {
    const res = await tinderRequest(`https://api.gotinder.com/user/${matchId}?locale=en-GB`, 'GET', accessToken);
    return getDataFromMatch(accessToken, matchIds, [{ ...res.results }, ...updatedMatches], idx+1);
  }
  catch (error) {
    console.log('An Error occured when fetching data from match');
    console.log(error);
    return updatedMatches;
  } 
}

async function getMatchesFromTinderPage(accessToken, pageToken) {
  const queryParamters = pageToken ? { page_token: pageToken, count: 60 } : { count: 60 }
  const query = querystring.stringify(queryParamters);

  try {
    console.log(`Trying to fetch matches with token:${pageToken}...`);
    const { data={} } = await tinderRequest(`https://api.gotinder.com/v2/matches?${query}`, 'GET', accessToken);
    const  { matches=[], next_page_token=undefined } = data;
    console.log('Getting more data for the matches');
    const matchIds = matches.map(match => _.get('person._id', match));
    const matchesWithMoreData = await getDataFromMatch(accessToken, matchIds);
    if (!matchesWithMoreData.length) return { matches: matchesWithMoreData, next_page_token: undefined };
    console.log('More data fetch completed');
    console.log('next_page_token: ', next_page_token);
    return { matches: matchesWithMoreData, next_page_token }; 
  }
  catch (error) {
    console.log('ERROR when getting matches from a page');
    console.log(':', error.status || error.code || error.message);
    console.log(error.stack);
    console.log('\n \n ');
    return { matches: [], next_page_token: undefined }
  }
}

module.exports = {
  getMatchesFromTinderPage,
  getAllMatchesFromTinder
}