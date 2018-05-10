const puppeteer = require('puppeteer');

let page;

var BrowserEP = (function () {
  var instance;
  function createInstance(ep) {
    var endPoint = ep;
    return endPoint;
  }
  return {
    getInstance: function (ep) {
      if (!instance) {
        instance = createInstance(ep);
      }
      return instance;
    }
  }
})();

getBrowser = async () => {
  if (BrowserEP.getInstance()) {
    const browserWSEndpoint = BrowserEP.getInstance();
    console.log(`Connecting to browser on: ${browserWSEndpoint}`)
    const connectedBrowser = await puppeteer.connect({ browserWSEndpoint });
    return connectedBrowser;
  }
  console.log('No browser exists');
  const browser =
     await puppeteer.launch({
     args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'], headless: true });
    BrowserEP.getInstance(browser.wsEndpoint());
    console.log(`Browser running on: ${BrowserEP.getInstance()}`);
    return browser;
}

setPage = (p) => {
  page = p; 
}

getPage = () => page;

module.exports = {
  getBrowser,
  setPage,
  getPage
};