const { firefox } = require("playwright");

const PROMPT = "Generate an image of a cat";

(async () => {
  const browser = await firefox.launchPersistentContext("./data", {
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto("https://chat.openai.com/g/g-2fkFE8rbu-dall-e");

  await page.waitForSelector("textarea#prompt-textarea");
  await page.focus("textarea#prompt-textarea");
  await page.keyboard.type(PROMPT);
  await page.click('button[data-testid="send-button"]');

  //   loader
  await page.waitForSelector(
    ".pointer-events-none.absolute.inset-0.bg-token-main-surface-secondary.animate-pulse"
  );
  await page.waitForFunction(() => {
    const element = document.querySelector(
      ".pointer-events-none.absolute.inset-0.bg-token-main-surface-secondary.animate-pulse"
    );
    return !element || !element.childNodes.length;
  });

  // dall-e response
  const element = await page.waitForSelector(".group\\/dalle-image");
  // Extract URLs of the images
  const imageSrcs = await page.$$eval(".group\\/dalle-image img", (imgs) =>
    imgs.map((img) => img.getAttribute("src"))
  );
  // Extract Text Response
  const textResponse = await page.$eval(
    'div[data-message-author-role="assistant"]',
    (element) => element.textContent
  );

  console.log("Text content:", textResponse);
  console.log("Image URLs:", imageSrcs);

  await browser.close();
})();
