require('dotenv').config();

const { firefox } = require("playwright");

(async () => {
  const browser = await firefox.launchPersistentContext("./data", { headless: false });
  const page = await browser.newPage();


  await page.goto("https://chat.openai.com/");

  // sidebar with login button
  await page.waitForSelector("nav");

  await page.click("nav button.btn-neutral");
  await page.waitForSelector("input.email-input");

  await page.fill("input.email-input", process.env.EMAIL);
  await page.click("button.continue-btn");
 
  await page.waitForSelector("input#password");
  await page.fill("input#password", process.env.PASSWORD);

  // Click on the login button
  await page.click("button._button-login-password");

})();
