
const fs = require('fs');
var path = require('path');

let matches;

async function storeMatchesFromTinder(key, m) {
  matches = m;
  await fs.writeFile(path.join(__dirname, `/storedMatches/${key}-matches.json`), JSON.stringify(m), 'utf8', function(){
    console.log(`${path.join(__dirname, `/storedMatches/${key}-matches.json`)} stored`);
  });
  return;
};

function getStoredMatches(key) {
  try {
    const matchesFromFile = require(path.join(__dirname, `/storedMatches/${key}-matches.json`));
    if (matchesFromFile) return matchesFromFile;
  }
  catch (e) {
    console.log(e.message);
    console.log(`Did not find stored matches for /storedMatches/${key}-matches.json`);
  }
  if (matches) return matches;
}

module.exports = {
  storeMatchesFromTinder,
  getStoredMatches
}