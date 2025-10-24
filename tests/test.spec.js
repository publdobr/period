const { test, expect } = require('@playwright/test');
const fs = require('fs');

test('dump google calendar html', async ({ page }) => {
  await page.goto('https://calendar.google.com/');

  // Just get the HTML content of the page
  const htmlContent = await page.content();
  console.log('Dumping HTML content to google_calendar.html');
  fs.writeFileSync('google_calendar.html', htmlContent);
});
