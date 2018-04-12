const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://www.facebook.com/login.php?skip_api_login=1&api_key=464891386855067&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fv2.8%2Fdialog%2Foauth%3Fchannel%3Dhttps%253A%252F%252Fstaticxx.facebook.com%252Fconnect%252Fxd_arbiter%252Fr%252FFdM1l_dpErI.js%253Fversion%253D42%2523cb%253Df18eb9befe6b8f8%2526domain%253Dtinder.com%2526origin%253Dhttps%25253A%25252F%25252Ftinder.com%25252Ff27bcaa340c43b4%2526relation%253Dopener%26redirect_uri%3Dhttps%253A%252F%252Fstaticxx.facebook.com%252Fconnect%252Fxd_arbiter%252Fr%252FFdM1l_dpErI.js%253Fversion%253D42%2523cb%253Df18ca71a8042a8%2526domain%253Dtinder.com%2526origin%253Dhttps%25253A%25252F%25252Ftinder.com%25252Ff27bcaa340c43b4%2526relation%253Dopener%2526frame%253Df3103a87280692c%26display%3Dpopup%26scope%3Duser_birthday%252Cuser_photos%252Cemail%252Cuser_friends%252Cuser_likes%26response_type%3Dtoken%252Csigned_request%26domain%3Dtinder.com%26origin%3D1%26client_id%3D464891386855067%26ret%3Dlogin%26sdk%3Djoey%26logger_id%3Df3dd104c-e73e-4c80-7916-51c38796209d&cancel_url=https%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2FFdM1l_dpErI.js%3Fversion%3D42%23cb%3Df18ca71a8042a8%26domain%3Dtinder.com%26origin%3Dhttps%253A%252F%252Ftinder.com%252Ff27bcaa340c43b4%26relation%3Dopener%26frame%3Df3103a87280692c%26error%3Daccess_denied%26error_code%3D200%26error_description%3DPermissions%2Berror%26error_reason%3Duser_denied%26e2e%3D%257B%257D&display=popup&locale=en_GB&logger_id=f3dd104c-e73e-4c80-7916-51c38796209d');
  await page.screenshot({path: './tinder.png'});

  browser.close();

}

run();