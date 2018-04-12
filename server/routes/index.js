const express = require('express');
const router = express.Router();
const axios = require('axios');
const querystring = require('querystring');
const puppeteer = require('puppeteer');

const CREDS = require('./creds');
const { facebookAccessToken } = require('./accessToken');
const facebookTinderLoginURL = "https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&display=touch&state=%7B%22challenge%22%3A%22IUUkEUqIGud332lfu%252BMJhxL4Wlc%253D%22%2C%220_auth_logger_id%22%3A%2230F06532-A1B9-4B10-BB28-B29956C71AB1%22%2C%22com.facebook.sdk_client_state%22%3Atrue%2C%223_method%22%3A%22sfvc_auth%22%7D&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&default_audience=friends&return_scopes=true&auth_type=rerequest&client_id=464891386855067&ret=login&sdk=ios&logger_id=30F06532-A1B9-4B10-BB28-B29956C71AB1&ext=1470840777&hash=AeZqkIcf-NEW6vBd";
const userID = '712536446';

const EMAIL_SELECTOR = '#email';
const PASSWORD_SELECTOR = '#pass';
const LOGIN_BUTTON_SELECTOR = '#loginbutton';
const CONFIRM_BUTTOM_SELECTOR = '#platformDialogForm > div._5lnf.uiOverlayFooter._5a8u._5eh1 > button._42ft._4jy0.layerConfirm._1flv._51_n.autofocus.uiOverlayButton._4jy5._4jy1.selected._51sy';

router.get('/', function(req, res) {
  res.send('index.html');
});


router.get('/newLogin', async function(req, res) {
  const browser = await puppeteer.launch({ headless: false });
  try {
    const page = await browser.newPage();

    await page.goto(facebookTinderLoginURL);
    await page.click(EMAIL_SELECTOR);
    await page.keyboard.type(CREDS.email);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);

    await page.setJavaScriptEnabled(true);

    const navResponse = page.waitForNavigation(['networkidle0']);
    page.click(LOGIN_BUTTON_SELECTOR);
    await navResponse;
    function timeOut() {
      return new Promise(resolve => setTimeout(resolve, 2000));
    }
    await timeOut();

    page.on('response', response => {
      console.log('\n \n Response!');
      const url = response.url();
      console.log(url);
    });

    page.on('request', request => {
      console.log('\n \n Request!');
      const url = request.url()
      console.log(url);
    });

    const content = await page.evaluate(() => {
      return document.body.innerText;
    });
    console.log('CONTENT: ', content);

    const button = await page.$(CONFIRM_BUTTOM_SELECTOR);
    await button.screenshot({path: './button.png'});

    page.evaluate(e => e.click(), button);


    await timeOut();
    // await page.waitForNavigation();

    await page.screenshot({path: './login.png'});

  } catch (error) {
    console.log(error);
  }
  browser.close();

  res.json({}).sendStatus(200);
})


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
    console.log('ERROR!');
    res.status(500);
  }
});


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