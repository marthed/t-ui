import axios from 'axios';

export const getMatches = async (data, filters={}) => {

  const { accessToken, pageToken, userId } = data;

  const res = await axios.request({
    url: `/matches`,
    method: 'POST',
    data: {
      accessToken,
      pageToken,
      userId,
      filters,
    }
  });
  const { matches=[] } = res.data;

  return matches;
}