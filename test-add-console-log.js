import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Listen to all console messages from the page
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    console.log(`[${type.toUpperCase()}] ${text}`);
  });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  // Inject debugging code
  await page.evaluate(() => {
    // Override console.log to make sure we see it
    const originalLog = console.log;
    window.console.log = function(...args) {
      originalLog.apply(console, args);
    };

    // Add mutation observer to watch for the background div
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target;
          if (target.className && target.className.includes('background')) {
            console.log('STYLE CHANGED on background div:', target.getAttribute('style'));
          }
        }
      });
    });

    // Wait for the background div to exist
    setTimeout(() => {
      const backgroundDiv = document.querySelector('[class*="background"]');
      if (backgroundDiv) {
        observer.observe(backgroundDiv, {
          attributes: true,
          attributeOldValue: true
        });
        console.log('Started observing background div for style changes');
      }
    }, 100);
  });

  const newGameButton = await page.locator('text="New Game"').first();
  if (await newGameButton.isVisible()) {
    console.log('\nClicking "New Game"...');
    await newGameButton.click();
    await page.waitForTimeout(3000);

    // Check final state
    const finalState = await page.evaluate(() => {
      const bg = document.querySelector('[class*="background"]');
      return {
        hasStyle: bg?.hasAttribute('style'),
        styleValue: bg?.getAttribute('style'),
        computedBg: window.getComputedStyle(bg).backgroundImage
      };
    });

    console.log('\nFinal state:', finalState);
  }

  await page.waitForTimeout(2000);
  await browser.close();
})();
