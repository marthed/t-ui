const puppeteer = require('puppeteer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const { getBrowser } = require('./browser');
const {
  CONTINUE_BUTTON,
  CONFIRM_URL,
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

module.exports = async function confirmLogin(res, res) {

  try {
    
    const browser = await getBrowser();
    const pages = await browser.pages();
    console.log('pages: ', pages.length);
    let page;
    if (pages.length > 0) {
      page = pages[0];
      await page.bringToFront();
      const docFour = await page.content();
      fs.writeFileSync('./public/fourth.html', docFour);
      }
    console.log('Hej: ', res.data);

    page.on('response', async response => {
      if (response.url().startsWith(CONFIRM_URL)) {
        const body = await response.text();
        const { accessToken, expiresIn } = extractTokenData(body);
        const { name, id } = await getUserId(accessToken);
        const token = await tinderLogin(accessToken, id);
        console.log('tinderToken: ', token);
        await page.close();
        const remainingPages = await browser.pages();
        if (!remainingPages) browser.disconnect();
        res.json({tinderToken: token, expiresIn, userId: id, user: name})
      }
    });

    page.click(CONTINUE_BUTTON);
    await timeOut();

    const docFive = await page.content();
    fs.writeFileSync('./public/fourth.html', docFive);

    await timeOut();
    await page.close();

    if (!pages) browser.disconnect();

    throw new Error('TimeOut: Did not receive confirm response');


  } catch (error){
    console.log(error);
    res.send(error.message);
  }; 

}