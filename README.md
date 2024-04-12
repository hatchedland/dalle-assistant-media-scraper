#  dalle-assistant-media-scraper
  Playwright based tool for scraping media, eliminating the need for purchasing OPENAI API.

## Installation

Use the package manager [npm](https://nodejs.org/en/download) to install Playwright.

```bash
npm install
```

## Usage
1. Create an `.env` file in the root directory and define variables for email and password

2. Add the following lines to define variables for email and password:

   ```plaintext
   EMAIL=your-email@example.com
   PASSWORD=your-password
   ```

## Running the Script

To execute the scraping script, follow these steps:

1. **Start by running the login script:**

   ```bash
   node ./login.js
   ```

   If a CAPTCHA challenge appears, solve it manually.

2. **Once the login is successful, proceed to change the prompt in the `./script.js` file as needed.**

3. **Next, run the main scraping script:**

   ```bash
   node ./script.js
   ```

This will initiate the scraping process and gather media content.

## License

[GPL](https://choosealicense.com/licenses/gpl-3.0/)