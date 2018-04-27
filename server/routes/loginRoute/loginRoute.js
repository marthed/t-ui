const puppeteer = require('puppeteer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const { getBrowser } = require('./browser');
const {
  EMAIL_SELECTOR,
  PASSWORD_SELECTOR,
  LOGIN_BUTTON_SELECTOR,
  CONFIRM_BUTTOM_SELECTOR,
  CONFIRM_URL,
  FACEBOOK_LOGIN_URL,
  CONTINUE_BUTTON,
  CONFIRM_RADIO_BUTTON_BIRTHDAY,
  CONFIRM_RADIO_BUTTON_DEVICE,
  CONFIRM_IDENTITY_SELECTOR,
  ASK_FOR_BIRTHDAY_SELECTOR,
} = require('./loginConstants');



function timeOut() {
  return new Promise(resolve => setTimeout(resolve, 3000)); // Improve
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

    const docOne = await page.content();
    fs.writeFileSync('./public/first.html', docOne);

    const isAskingForIdentity = await page.evaluate((sel) => {
      return document.querySelector(sel).innerHTML === 'Bekräfta din identitet';
    }, CONFIRM_IDENTITY_SELECTOR);
    console.log('isAskingForIdentity: ', isAskingForIdentity);

    if (isAskingForIdentity) {
      page.click(CONTINUE_BUTTON);
      await timeOut();

      const identityPage1 = await page.content();
      fs.writeFileSync('./public/second.html', identityPage1);

      const hasBirthdayConfirmOption = await page.evaluate((sel) => {
        return !!document.querySelector(sel);
      }, CONFIRM_RADIO_BUTTON_BIRTHDAY);
      
      console.log('hasBirthdayConfirmOption: ', hasBirthdayConfirmOption);
      const hasDeviceConfirmOption = await page.evaluate((sel) => {
        return !!document.querySelector(sel);
      }, CONFIRM_RADIO_BUTTON_DEVICE);
      
      console.log('hasDeviceConfirmOption: ', hasDeviceConfirmOption);
      const CONFIRM_RADIO_BUTTON = 
        hasDeviceConfirmOption ? 
        CONFIRM_RADIO_BUTTON_DEVICE :
        CONFIRM_RADIO_BUTTON_BIRTHDAY;

      page.click(CONFIRM_RADIO_BUTTON);
      await timeOut();
      page.click(CONTINUE_BUTTON);
      await timeOut();

      const docThree = await page.content();
      fs.writeFileSync('./public/third.html', docThree);

      page.click(CONTINUE_BUTTON);
      await timeOut();

      const docFour = await page.content();
      fs.writeFileSync('./public/fourth.html', docFour);

      const isAskingForBirthday = await page.evaluate((sel) => {
        return document.querySelector(sel).innerHTML === 'Ange ditt födelsedatum';
      }, ASK_FOR_BIRTHDAY_SELECTOR);
      console.log('isAskingForBirthday: ', isAskingForBirthday);

      if (isAskingForBirthday) return res.json({
        url: page.url(),
        confirmType: 'birthday',
        message: 'Ange ditt födelsedatum för att bekräfta din identitet.'
      });


      page.click(CONTINUE_BUTTON);
      await timeOut();
      
      await page.screenshot({path: './public/images/hej5.png'});
      const docFifth = await page.content();
      fs.writeFileSync('./public/fifth.html', docFifth);

      return res.sendStatus(200);
    }
    
    return res.sendStatus(200);

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