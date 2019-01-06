const { storeMatchesFromTinder, storeMiscData, getMiscData, getStoredMatches } = require('./matches.js');
const filterMatches = require('./filterMatches.js');
const {
  tinderRequest,
  getMatchesFromPage,
  getMatchesFromPages,
} = require('./matchesHelper.js');

function validateClientRequest(req, res, next) {
  const { userId, accessToken } = req.body;

  if (!userId) {
    return res.status(400).json({ message: `userId: ${userId} is not valid` });
  }
  if (!accessToken) {
    return res
      .status(400)
      .json({ message: `accessToken: ${accessToken} is not valid` });
  }
  next();
}

async function getAllMatchesFromTinder(req, res) {
  console.log('Getting all matches from Tinder');
  const { userId, accessToken, filter = {} } = req.body;
  // TODO: Filter i mongo query istället.
  console.log(`Getting data for ${userId}`);
  const storedMatches = await getStoredMatches(userId);
  if (storedMatches.length) {
    console.log(`${storedMatches.length} stored matches found.`);
    const filteredMatches = filterMatches(storedMatches, filter);
    if (filteredMatches.length < storedMatches.length) {
      console.log('Filtered stored matches');
    }
    console.log(`Returning with ${filteredMatches.length} matches`);
    return res.json({ matches: filteredMatches });
  }

  console.log('Getting ALL matches from Tinder with token: ', accessToken);
  const { matches, next_page_token } = await getMatchesFromPages(accessToken, 'first');
  if (!matches.length) throw new Error('Did not get any matches');
  console.log('Storing matches...');
  await storeMatchesFromTinder(userId, matches);
  await storeMiscData(userId, { pageToken: next_page_token });

  console.log(`Returning with ${matches.length} matches`);
  return res.status(200).json({ matches });
}

async function syncMatchesFromTinderPage(req, res) {
  const { userId, accessToken } = req.body;
  const  { pageToken } = await getMiscData(userId, ['pageToken']);
  console.log('Syncing with page token: ', pageToken);
  const { matches, next_page_token } = await getMatchesFromPage(
    accessToken,
    pageToken
  );
  if (!matches.length)
    throw new Error('Sync failed: Did not get any matches from pageToken');
  console.log('Updating matches and/or adding new...');
  await storeMatchesFromTinder(userId, matches);
  await storeMiscData(userId, { pageToken: next_page_token });
  return res.status(200).json({ matches });
}

async function getMatchFromId(req, res) {
  const { matchId } = req.params;
  const { a } = req.headers;
  let currentAccessToken = a;
  if (!matchId) {
    return res
      .status(400)
      .json({ message: `matchId: ${matchId} is not valid` });
  }
  console.log('currentAccessToken: ', currentAccessToken);
  try {
    const tinderResponse = await tinderRequest(
      `https://api.gotinder.com/v2/matches/${matchId}`,
      'GET',
      currentAccessToken
    );
    return res.status(200).json({ match: tinderResponse.data });
  } catch (error) {
    console.log(`ERROR when getting a match with id ${matchId}`);
    console.log(':', error.status || error.code || error.message);
    console.log(error.statusMessage);
    console.log(error.stack);
    console.log('\n \n ');
    return res.status(500).json({
      message: 'Something went wrong in the server. Contact yourself',
    });
  }
}

async function sendMessage(req, res) {
  const { matchId } = req.params;
  const { a } = req.headers;
  console.log('matchId: ', matchId);
  console.log('a : ', a);
  console.log(req.body);

  const { message } = req.body;
  console.log('message: ', message);
  let currentAccessToken = a;
  if (!matchId) {
    return res
      .status(400)
      .json({ message: `matchId: ${matchId} is not valid` });
  }
  console.log('currentAccessToken: ', currentAccessToken);
  try {
    const tinderResponse = await tinderRequest(
      `https://api.gotinder.com/user/matches/${matchId}`,
      'POST',
      currentAccessToken,
      { message }
    );
    console.log('tinderResponse: ', tinderResponse);
    console.log(
      `RES: ${tinderResponse.statusCode} message: ${
        tinderResponse.statusMessage
      }`
    );
    return res.status(200).end();
  } catch (error) {
    console.log(`ERROR when sending a message with id ${matchId}`);
    console.log(error.statusMessage);
    console.log(error.stack);
    console.log('\n \n ');
    return res.status(500).json({
      message: 'Something went wrong in the server. Contact yourself',
    });
  }
}

module.exports = {
  syncMatchesFromTinderPage,
  getAllMatchesFromTinder,
  validateClientRequest,
  getMatchFromId,
  sendMessage,
};
