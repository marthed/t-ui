const { storeMatchesFromTinder, getAllStoredMatches } = require('../server/routes/matchesRoute/matches');
const key = process.env.DEVID;


async function main () {
  console.log('UPDATING MATCHES...');
  if (!key) {
    console.log('Invalid key!');
    return;
  }
  const matches = await getAllStoredMatches(key);
  await storeMatchesFromTinder(key, matches);
  console.log('UPDATE COMPLETED. CHECK THE DB');
  return;
}

main();