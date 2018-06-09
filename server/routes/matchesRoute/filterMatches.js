
const isWithinRange = (range, match) => {
   if (range.max && range.max > match.distance_mi) return false;
   if (range.min && range.min < match.distance_mi) return false;
   return true;
}

module.exports = async function filterMatches(matches, filter) {

  const filterNames = Object.keys(filter);

  const filteredmatches = matches.filter((match) => {

    if (filter.distance && !isWithinRange(filter.distance, match)) return false;

    return true;
  });

  return filteredMatches;
}

