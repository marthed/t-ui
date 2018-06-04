
const fs = require('fs');

let matches;

async function storeMatchesFromTinder(key, m) {
  matches = m;
  await fs.writeFile(`storedMatches/${key}-matches.json`, JSON.stringify(matches), 'utf8', function(){
    console.log(`${key}-matches.json stored`);
  });
};

function getStoredMatches(key) {
  try {
    const matchesFromFile = require(`storedMatches/${key}-matches.json`);
    if (matchesFromFile) return matchesFromFile;
  }
  catch (e) {
    console.log(e.message);
    console.log(`Did not find stored matches for storedMatches/${key}-matches.json`);
  }
  if (matches) return matches;
}

module.exports = {
  storeMatchesFromTinder,
  getStoredMatches
}