import axios from 'axios';

export const getMatches = async data => {

  const { accessToken, pageToken, userId, filter } = data;

  const res = await axios.request({
    url: `/matches`,
    method: 'POST',
    data: {
      accessToken,
      pageToken,
      userId,
      filter,
    }
  });
  const { matches=[] } = res.data;

  return matches;
}