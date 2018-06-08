
const fs = require('fs');
var path = require('path');

let matches;

async function storeMatchesFromTinder(key, m) {
  matches = m;
  await fs.writeFile(path.join(__dirname, `/storedMatches/${key}-matches.json`), JSON.stringify(matches), 'utf8', function(){
    console.log(`${path.join(__dirname, `/storedMatches/'${key}'-matches.json`)} stored`);
  });
};

function getStoredMatches(key) {
  try {
    const matchesFromFile = require(path.join(__dirname, `/storedMatches/${key}-matches.json`));
    console.log('matchesFromFile: ', matchesFromFile);
    if (matchesFromFile) return matchesFromFile;
  }
  catch (e) {
    console.log(e.message);
    console.log(`Did not find stored matches for /storedMatches/${key}-matches.json`);
  }
  console.log('matches: ', matches);
  if (matches) return matches;
}

module.exports = {
  storeMatchesFromTinder,
  getStoredMatches
}