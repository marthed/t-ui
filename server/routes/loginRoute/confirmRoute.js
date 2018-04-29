const puppeteer = require('puppeteer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const { getBrowser } = require('./browser');


module.exports = async function confirmLogin(res, res) {

  try {
    
    const browser = await getBrowser();
    const pages = await browser.pages();
    console.log('pages: ', pages);
    if (pages.length > 0) {
      const page = pages[0];
      await page.screenshot({path: './public/images/confirm.png'});
    }
    console.log('Hej: ', res.body.data);
    // Connecta till browser
    // Var på samma sida som innan
    // Skriv in födelsedagsdatumetet och confirma

  } catch (error){
    console.log(error);
    res.send(error.message);
  }; 

}