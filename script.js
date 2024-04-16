const { firefox } = require("playwright");
const { genre, tone, timePeriod, pointOfView, twist } = require("./utils.js");

const PROMPT = () =>
  `1. Genre: ${genre} 2. Tone: ${tone} 3. Time Period: ${timePeriod} 4. Point of View: ${pointOfView} 5. Plot Twist: ${twist}`;


(async () => {
  try {
    const browser = await firefox.launchPersistentContext("./data", {
      headless: false,
      downloadsPath: "./downloads",
    });
    const page = await browser.newPage();

    await page.goto("https://chat.openai.com/g/g-Gzu4D5HYB-story-generator");

    await page.waitForSelector("textarea#prompt-textarea");
    await page.focus("textarea#prompt-textarea");
    await page.keyboard.type(PROMPT());
    await page.click('button[data-testid="send-button"]');

    await page.waitForSelector(".result-streaming");
    await page.waitForTimeout(30000);
    await page.waitForSelector(".result-streaming", { state: "hidden" });

    await page.waitForSelector("div.markdown.prose > p");

    const PROMPT_STAGE_1 = await page.evaluate(() => {
      return document.querySelector("div.markdown.prose > p").innerHTML;
    });

    console.log(PROMPT_STAGE_1);

    const page2 = await browser.newPage();
    await page2.goto("https://chat.openai.com/g/g-RVZ2GYWFe-story-phase-2");

    await page2.waitForSelector("textarea#prompt-textarea");
    await page2.focus("textarea#prompt-textarea");
    await page2.keyboard.type(JSON.stringify(PROMPT_STAGE_1));
    await page2.click('button[data-testid="send-button"]');

    await page2.waitForSelector(".result-streaming");
    await page2.waitForTimeout(30000);
    await page2.waitForSelector(".result-streaming", { state: "hidden" });

    await page2.waitForSelector("div.markdown.prose > p");

    const PROMPT_STAGE_2 = await page2.evaluate(() => {
      return document.querySelector("div.markdown.prose > p").innerHTML;
    });

    console.log(PROMPT_STAGE_2);

    let PROMPT_STAGE_3 = PROMPT_STAGE_2.split("&lt;br&gt;")

    const page3 = await browser.newPage();

    await page3.goto("https://chat.openai.com/g/g-2fkFE8rbu-dall-e");
  
    for (const prompt of PROMPT_STAGE_3) {
      await page3.waitForSelector("textarea#prompt-textarea");
      await page3.fill("textarea#prompt-textarea", prompt);
      await page3.click('button[data-testid="send-button"]');
  
      // Wait for the animation to complete (loader indication)
      await page3.waitForSelector(".pointer-events-none.absolute.inset-0.bg-token-main-surface-secondary.animate-pulse");
      await page3.waitForFunction(() => {
        const element = document.querySelector(".pointer-events-none.absolute.inset-0.bg-token-main-surface-secondary.animate-pulse");
        return !element || !element.childNodes.length;
      });
  
      // Extract URLs of the images
      const imageSrcs = await page3.$$eval(".group\\/dalle-image img", (imgs) => imgs.map((img) => img.getAttribute("src")));
      // Extract Text Response
      const textResponse = await page3.$eval('div[data-message-author-role="assistant"]', (element) => element.textContent);
      console.log("Text content:", textResponse);
      console.log("Image URLs:", imageSrcs[0]);
    }
  


    await browser.close();
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
