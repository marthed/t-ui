const puppeteer = require('puppeteer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const { getBrowser, getPage } = require('./browser');
const {
  CONTINUE_BUTTON,
  CONFIRM_URL,
  CONFIRM_URL_2,
  CONFIRM_BUTTOM_SELECTOR,
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

module.exports = async function confirmLogin(req, res) {

  try {

    let page = getPage();
    const browser = await getBrowser();
    const docFour = await page.content();
    fs.writeFileSync('./public/fourth.html', docFour);


    page.on('response', async response => {
      console.log('response: ', response.url());
      if (response.url().startsWith(CONFIRM_URL_2)) {
        console.log('Confirmed!');
        const body = await response.text();
        const { accessToken, expiresIn } = extractTokenData(body);
        const { name, id } = await getUserId(accessToken);
        const token = await tinderLogin(accessToken, id);
        console.log('tinderToken: ', token);
        await page.close();
        return res.json({tinderToken: token, expiresIn, userId: id, user: name})
      }
    });

    const button = await page.$(CONFIRM_BUTTOM_SELECTOR);
    const navResponse = page.waitForNavigation(['networkidle0']);
    page.evaluate(e => e.click(), button);
    await navResponse;


    const docFive = await page.content();
    fs.writeFileSync('./public/fifth.html', docFive);

    await timeOut();
    await page.close();

    await timeOut();
    browser.disconnect();

    throw new Error('TimeOut: Did not receive confirm response');


  } catch (error){
    console.log(error);
    res.send(error.message);
  }; 

}