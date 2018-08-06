const axios = require('axios');
const querystring = require('querystring');
const { storeMatchesFromTinder, getStoredMatches } = require('./matches.js');
const filterMatches = require('./filterMatches.js');


async function getAllMatchesFromTinder(req, res) {
  try {
    const { userId, accessToken, filter=[] } = req.body;
    console.log('userId: ', userId);
    const storedMatches = getStoredMatches(userId);
    if (storedMatches) {
      const filteredMatches = filterMatches(storedMatches, filter);
      return res.json({ matches: filteredMatches });
    }

    console.log('Getting ALL matches from Tinder with token: ', accessToken);
    const matches = await getMatchesFromAllPages(accessToken, "first");
    await storeMatchesFromTinder(userId, matches);

    res.json({ matches });
  }
  catch (error) {
    console.log(error);
    res.send(error);
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
  const { matches=[], next_page_token } = await getMatchesFromTinderPage(accessToken, nextPageToken);
  const aggregatedMatches = allMatches.concat(matches);
  return getMatchesFromAllPages(accessToken, next_page_token, aggregatedMatches);
}

async function getMatchesFromTinderPage(accessToken, pageToken) {
  const queryParamters = pageToken ? { page_token: pageToken } : { count: 60 }
  const query = querystring.stringify(queryParamters);
  
  let userData;
  try {
    const { data: { matches=[], next_page_token } } = await tinderRequest(`https://api.gotinder.com/v2/matches?${query}`, 'GET', accessToken);
    userData = await Promise.all(matches.map(async (match) => {
      try {
        const { results={} } = await tinderRequest(`https://api.gotinder.com/user/${match.person._id}?locale=en-GB`, 'GET', accessToken);
        return {...results};
      }
      catch (e) {
        return {...match, error: e}
      }
    }));
  }
  catch (error) {
    console.log(error);
    console.log('\n \n Returning with what we got!');
    return { matches: userData}
  }
  console.log('next_page_token: ', next_page_token);
  return { matches: userData, next_page_token };
}

const routeWrapper = (handler) => async (req, res) => {
  try {
    const { accessToken, pageToken } = req.body;
    console.log('accessToken: ', accessToken);
    console.log('pageToken: ', pageToken);
    const { matches, next_page_token } = await handler(accessToken, pageToken);
    res.json({matches, next_page_token});
  } 
  catch (error) {
    console.log(error.message);
    return error;
  }
}

module.exports = {
  getMatchesFromTinderPage: routeWrapper(getMatchesFromTinderPage),
  getAllMatchesFromTinder
}