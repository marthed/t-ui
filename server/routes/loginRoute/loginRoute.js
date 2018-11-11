const axios = require('axios');
const fs = require('fs');

const { getBrowser, setPage } = require('./browser');
const {
  EMAIL_SELECTOR,
  PASSWORD_SELECTOR,
  LOGIN_BUTTON_SELECTOR,
  CONFIRM_BUTTOM_SELECTOR,
  CONFIRM_URL,
  FACEBOOK_LOGIN_URL,
  CONTINUE_BUTTON,
  CONFIRM_IDENTITY_SELECTOR,
} = require('./loginConstants');


function timeOut(time=3000) {
  return new Promise(resolve => setTimeout(resolve, time)); // Improve
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


setPageOn = (page, res, browser) => {
  console.log('set page on');
  page.on('response', async response => {
    console.log('response: ', response.url());
    if (response.url().startsWith(CONFIRM_URL)) {
      console.log('in!');
      const body = await response.text();
      const { accessToken, expiresIn } = extractTokenData(body);
      const { name, id } = await getUserId(accessToken);
      const token = await tinderLogin(accessToken, id);
      console.log('tinderToken: ', token);
      try {
        await page.close();
        browser.disconnect();
      }
      catch (e) {
        console.log(e);
      }
      return res.json({tinderToken: token, expiresIn, userId: id, user: name})
    }
  });
  return page;
}

bla = async (page, res, browser) => {
  const confirmButton = await page.$(CONFIRM_BUTTOM_SELECTOR);
  console.log('confirmButton: ', confirmButton);
  if (confirmButton) {
    console.log('confirm button');
    const listeningPage = setPageOn(page, res, browser);
    console.log('click confirm button');
    listeningPage.evaluate(e => e.click(), confirmButton);
    await timeOut(1000);
    await timeOut(1000);
    await timeOut(1000);
    await timeOut(1000);
    await timeOut(1000);
  }
  else {
    return res.json('Could not find stuff');
  }
}

module.exports = async function login(req, res) {
  try {
    // Steg 1. Gå till login adressen.
    const browser = await getBrowser();
    const page = await browser.newPage();
    const { email, password } = req.body;

    await page.bringToFront();
    await page.goto(FACEBOOK_LOGIN_URL);

    const startPage = await page.content();
      fs.writeFileSync('./public/debug/startPage.html', startPage);

    await timeOut();

    // Om bekräfta-sidan redan finns.
    if (await page.$(CONFIRM_BUTTOM_SELECTOR)) {
      console.log('return bla');
      return bla(page, res, browser);
    }

    await page.click(EMAIL_SELECTOR);
    console.log('clicked');
    await page.keyboard.type(email);
    await page.click(PASSWORD_SELECTOR);
    console.log('password');
    await page.keyboard.type(password);
    await page.setJavaScriptEnabled(true); // Maybe remove

    const navResponse = page.waitForNavigation(['networkidle0']);
    page.click(LOGIN_BUTTON_SELECTOR);
    console.log('login button selector');
    await navResponse;

    const docOne = await page.content();
    fs.writeFileSync('./public/debug/first.html', docOne);

    const isAskingForIdentity = await page.evaluate((sel) => {
      return document.querySelector(sel).innerHTML === 'Bekräfta din identitet';
    }, CONFIRM_IDENTITY_SELECTOR);
    console.log('isAskingForIdentity: ', isAskingForIdentity);

    if (isAskingForIdentity) {
      page.click(CONTINUE_BUTTON);
      await timeOut();

      const identityPage1 = await page.content();
      fs.writeFileSync('./public/debug/identity1.html', identityPage1);

      const radioButtons = await page.$$('input[type=radio]');

      await radioButtons[1].click();
      await timeOut();

      page.click(CONTINUE_BUTTON);
      await timeOut();

      const identityPage2 = await page.content();
      fs.writeFileSync('./public/debug/identity2.html', identityPage2);

      setPage(page);

      return res.send({
        confirmType: 'device',
        message: 'Fortsätt genom att godkänna den här inloggningen på en telefon eller dator som du har använt tidigare.'
      });
    }
 
    page.on('response', async response => {
      console.log('response: ', response.url());
      if (response.url().startsWith(CONFIRM_URL)) {
        console.log('in!');
        const body = await response.text();
        const { accessToken, expiresIn } = extractTokenData(body);
        const { name, id } = await getUserId(accessToken);
        const token = await tinderLogin(accessToken, id);
        console.log('tinderToken: ', token);
        try {
          await page.close();
          browser.disconnect();
        }
        catch (e) {
          console.log(e);
        }
        res.json({tinderToken: token, expiresIn, userId: id, user: name})
      }
    });

    const interval = setInterval(async () => {
      const confirmButton = await page.$(CONFIRM_BUTTOM_SELECTOR);
      console.log(`Found the confirm button: ${confirmButton}`);
      if (confirmButton) {
        page.evaluate(e => e.click(), confirmButton);
        setTimeout(() => {
          console.log('Disconnecting from the browser');
          browser.disconnect();
        }, 10000);
        clearInterval(interval);
      }

    }, 500);

    const docTwo = await page.content();
    fs.writeFileSync('./public/debug/second.html', docTwo);
    
    //browser.disconnect();

    //throw new Error('TimeOut: Did not receive confirm response');
    // Close brower in SetTimeOut
    // Use promise canceller if connected to before timeout.
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      code: error.code
    });
  }
}