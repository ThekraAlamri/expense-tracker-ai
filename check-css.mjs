import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3000');
await page.waitForTimeout(2000);

const result = await page.evaluate(() => {
  const sheets = Array.from(document.styleSheets);
  for (const sheet of sheets) {
    try {
      const rules = Array.from(sheet.cssRules || []);
      for (const rule of rules) {
        const text = rule.cssText || '';
        const idx = text.indexOf('.ml-60');
        if (idx !== -1) return text.slice(Math.max(0, idx - 20), idx + 120);
      }
    } catch(e) {}
  }
  return 'not found';
});

console.log('ml-60 definition:', result);
await browser.close();
