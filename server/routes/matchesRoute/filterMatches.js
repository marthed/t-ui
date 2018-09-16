const { get, pipe } = require('lodash/fp');
const moment = require('moment');


const isWithinRange = rangeFilter => matchValue => {
    console.log(`value:${matchValue}`);
   if (rangeFilter.max && rangeFilter.max < matchValue) return false;
   if (rangeFilter.min && rangeFilter.min > matchValue) return false;
   return true;
}

const getMatchValue = path => match => get(path, match);


const isWithinDistance = filter => pipe(
  getMatchValue('distance_mi'),
  isWithinRange(filter),
);

const isWithinAge = filter => pipe(
  getMatchValue('birth_date'),
  matchValue => moment().diff(moment(matchValue).valueOf(), 'years'),
  isWithinRange(filter),
);

module.exports = function filterMatches(matches, filter) {

  try {
    const filteredmatches = matches.filter((match) => {
      if (filter.distance && !isWithinDistance(filter.distance)(match)) return false;
      if (filter.birth_date && !isWithinAge(filter.birth_date)(match)) return false;
      return true;
    });
    return filteredmatches;
  }
  catch (e) {
    console.log(e);
    return [];
  }
}

