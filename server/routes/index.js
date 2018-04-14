const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');

const loginRoute = require('./loginRoute').login;


router.get('/', function(req, res) { res.send('index.html') });
router.get('/login', loginRoute);
router.post('/matches', async function(req, res) {
    console.log('Getting matches with token: ', req.body.accessToken);
    console.log('Page token: ', req.body.pageToken);
    try {
      const query = querystring.stringify({page_token: req.body.pageToken});
      const { data } = await axios.request({
        url: `https://api.gotinder.com/v2/matches?${query}`,
        method: 'GET',
        headers: {
          'X-Auth-Token': `${req.body.accessToken}`,
          'Content-type': 'application/json',
          'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
        }
      });
      const { matches, next_page_token } = data.data;
      const userData = await Promise.all(matches.map(async (match) => {
        const { data: { results }} = await axios.request({
          url: `https://api.gotinder.com/user/${match.person._id}?locale=en-GB`,
          method: 'GET',
          headers: {
            'X-Auth-Token': `${req.body.accessToken}`,
            'Content-type': 'application/json',
            'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
          }
        });
        return {...match, ...results};
      }));
      console.log('next_page_token: ', next_page_token);
      res.json({matches: userData, next_page_token: next_page_token });
    }
    catch (error) {
      console.log(error);
      res.status(500);
    }
});


module.exports = router;