const express = require('express');
const router = express.Router();
const axios = require('axios');
const { facebookAccessToken } = require('./accessToken');
const userID = '712536446';

router.get('/', function(req, res) {
  res.send('index.html');
});

router.get('/login', async function(req, res) {
  try {
    const { data: { token }} = await axios.request({
      url: 'https://api.gotinder.com/auth',
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
      },
      data: JSON.stringify({facebook_token: facebookAccessToken, facebook_id: userID})
    });
    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
})


module.exports = router;