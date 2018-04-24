const puppeteer = require('puppeteer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const EMAIL_SELECTOR = '#email';
const PASSWORD_SELECTOR = '#pass';
const LOGIN_BUTTON_SELECTOR = '#loginbutton';
const CONFIRM_BUTTOM_SELECTOR = '#platformDialogForm > div._5lnf.uiOverlayFooter._5a8u._5eh1 > button._42ft._4jy0.layerConfirm._1flv._51_n.autofocus.uiOverlayButton._4jy5._4jy1.selected._51sy';
const CONFIRM_URL = 'https://www.facebook.com/v2.6/dialog/oauth/confirm?dpr=';
const FACEBOOK_LOGIN_URL = "https://www.facebook.com/v2.6/dialog/oauth?redirect_uri=fb464891386855067%3A%2F%2Fauthorize%2F&display=touch&state=%7B%22challenge%22%3A%22IUUkEUqIGud332lfu%252BMJhxL4Wlc%253D%22%2C%220_auth_logger_id%22%3A%2230F06532-A1B9-4B10-BB28-B29956C71AB1%22%2C%22com.facebook.sdk_client_state%22%3Atrue%2C%223_method%22%3A%22sfvc_auth%22%7D&scope=user_birthday%2Cuser_photos%2Cuser_education_history%2Cemail%2Cuser_relationship_details%2Cuser_friends%2Cuser_work_history%2Cuser_likes&response_type=token%2Csigned_request&default_audience=friends&return_scopes=true&auth_type=rerequest&client_id=464891386855067&ret=login&sdk=ios&logger_id=30F06532-A1B9-4B10-BB28-B29956C71AB1&ext=1470840777&hash=AeZqkIcf-NEW6vBd";

const CONTINUE_BUTTON = '#checkpointSubmitButton';

let browserWSEndPoint = null;
async function getBrowser() {
  if (!browserWSEndPoint) {
    console.log('No browser exists');

    const browser =
      await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'], headless: true });
    browserWSEndPoint = browser.wsEndpoint();
    console.log(`Browser running on: ${browserWSEndPoint}`);
    return browser;
  }
    console.log(`Connecting to browser on: ${browserWSEndpoint}`)
    const connectedBrowser = await puppeteer.connect({ browserWSEndpoint });
    return connectedBrowser;
}

function timeOut() {
  return new Promise(resolve => setTimeout(resolve, 2000)); // Improve
}

async function getUserId(accessToken) {
  const { data } = await axios.request({
    url: `https://graph.facebook.com/me?access_token=${accessToken}`,
    method: 'GET'
  });
  return data;
}

function extractTokenData(text) {
  const extractedArray = text.match(/access_token=.*?(?=")/)[0].split('&');
  const accessToken = extractedArray[0].split('=')[1];
  const expiresIn = extractedArray[1].split('=')[1];
  return { accessToken, expiresIn };
}

async function tinderLogin(accessToken, userId) {
  const { data: { token }} = await axios.request({
    url: 'https://api.gotinder.com/auth',
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
    },
    data: JSON.stringify({facebook_token: accessToken, facebook_id: userId})
  });
  return token;
};

module.exports = async function login(req, res) {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();

    const { email, password } = req.body;

    await page.bringToFront();
    await page.goto(FACEBOOK_LOGIN_URL);
    await page.click(EMAIL_SELECTOR);
    await page.keyboard.type(email);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(password);
    await page.setJavaScriptEnabled(true); // Maybe remove

    const navResponse = page.waitForNavigation(['networkidle0']);
    page.click(LOGIN_BUTTON_SELECTOR);
    await navResponse;
    await timeOut();

    const docOne = await page.content();
    fs.writeFileSync('./public/first.html', docOne);

    const button1 = await page.$(CONTINUE_BUTTON);

    const navResponse2 = page.waitForNavigation(['networkidle0']);
    page.evaluate(e => e.click(), button1);
    await navResponse2;
    await timeOut();

    const docTwo = await page.content();
    fs.writeFileSync('./public/second.html', docTwo);


    page.on('response', async response => {
      if (response.url().startsWith(CONFIRM_URL)) {
        const body = await response.text();
        const { accessToken, expiresIn } = extractTokenData(body);
        const { name, id } = await getUserId(accessToken);
        const token = await tinderLogin(accessToken, id);
        console.log('tinderToken: ', token);
        const pages = await browser.pages();
        if (!pages) browser.disconnect();
        res.json({tinderToken: token, expiresIn, userId: id, user: name})
      }
    });

    await page.screenshot({path: './public/images/chrome.png'});


    const button = await page.$(CONFIRM_BUTTOM_SELECTOR);
    console.log('button: ', button);

    page.evaluate(e => e.click(), button);
    await timeOut();
    await page.close();

    const pages = await browser.pages();
    if (!pages) browser.disconnect();

    throw new Error('TimeOut: Did not receive confirm response');
    // Close brower in SetTimeOut
    // Use promise canceller if connected to before timeout.
  }
  catch (error) {
    console.log(error);
    res.json({
      message: error.message,
      code: error.code
    });
  }
}