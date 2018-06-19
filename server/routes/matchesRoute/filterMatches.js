
const isWithinRange = (range, match) => {
   if (range.max && range.max > match.distance_mi) return false;
   if (range.min && range.min < match.distance_mi) return false;
   return true;
}

module.exports = function filterMatches(matches, filter) {

  try {
    const filteredmatches = matches.filter((match) => {
      if (filter.distance && !isWithinRange(filter.distance, match)) return false;
      return true;
    });
    return filteredmatches;
  }
  catch (e) {
    console.log(e);
    return [];
  }
}

