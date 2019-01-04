import axios from 'axios';

export const getMatches = async data => {

  const { accessToken, userId, filter, matchUrl } = data;

  const res = await axios.request({
    url: `/matches/${matchUrl || ''}`,
    method: 'POST',
    data: {
      accessToken,
      userId,
      filter,
    },
  });
  const { matches=[] } = res.data;

  return matches;
}

export const getMatchesAndSync = async data => {
  return getMatches({ ...data, matchUrl: 'syncMatchesFromPage' });
}