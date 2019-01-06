import axios from 'axios';
import querystring from 'query-string';

const request = (method, url, headers, data={}) => {
  return axios.request({
    method,
    url,
    headers,
    data,
  });
}

export const getMatches = async data => {
  const userId = sessionStorage.getItem('userId');
  const res = await request('POST', '/matches', { id: userId }, data)
  const { matches=[] } = res.data;
  return matches;
}

export const syncMatches = async data => {
  const userId = sessionStorage.getItem('userId');
  return request('POST', '/matches/syncMatchesFromPage', {}, { userId, ...data})
}

export const getMetaData = async data => {
  const userId = sessionStorage.getItem('userId');
  const query = querystring.stringify(data);
  console.log('query: ', query);
  return request('GET', `/meta?${query}`, { id: userId })
}