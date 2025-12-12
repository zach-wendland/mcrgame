import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Capture console messages
  page.on('console', msg => {
    console.log(`[BROWSER ${msg.type()}]:`, msg.text());
  });

  // Capture errors
  page.on('pageerror', error => {
    console.error('[PAGE ERROR]:', error.message);
  });

  // Capture network failures
  page.on('requestfailed', request => {
    console.error('[REQUEST FAILED]:', request.url(), request.failure()?.errorText);
  });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  // Click New Game
  const newGameButton = await page.locator('text="New Game"').first();
  if (await newGameButton.isVisible()) {
    console.log('\nClicking "New Game"...');
    await newGameButton.click();
    await page.waitForTimeout(2000);

    // Get detailed background information
    const backgroundDetails = await page.evaluate(() => {
      const backgroundDiv = document.querySelector('[class*="background"]');
      if (!backgroundDiv) return { error: 'No background div found' };

      const computedStyle = window.getComputedStyle(backgroundDiv);
      const inlineStyle = backgroundDiv.getAttribute('style');

      return {
        element: {
          className: backgroundDiv.className,
          inlineStyle: inlineStyle,
          innerHTML: backgroundDiv.innerHTML,
          tagName: backgroundDiv.tagName
        },
        computedStyle: {
          backgroundImage: computedStyle.backgroundImage,
          backgroundColor: computedStyle.backgroundColor,
          width: computedStyle.width,
          height: computedStyle.height,
          display: computedStyle.display,
          position: computedStyle.position,
          opacity: computedStyle.opacity,
          visibility: computedStyle.visibility,
          zIndex: computedStyle.zIndex,
          inset: computedStyle.inset
        },
        parentInfo: {
          className: backgroundDiv.parentElement?.className,
          tagName: backgroundDiv.parentElement?.tagName,
          dataSceneId: backgroundDiv.parentElement?.getAttribute('data-scene-id')
        }
      };
    });

    console.log('\n=== Background Element Details ===');
    console.log(JSON.stringify(backgroundDetails, null, 2));

    // Check if the background image is actually set in the inline style
    const backgroundImageUrl = await page.evaluate(() => {
      const backgroundDiv = document.querySelector('[class*="background"]');
      if (!backgroundDiv) return null;

      const style = backgroundDiv.getAttribute('style');
      const match = style?.match(/url\((.*?)\)/);
      return match ? match[1] : null;
    });

    console.log('\n=== Background Image URL ===');
    console.log(backgroundImageUrl ? backgroundImageUrl.substring(0, 200) + '...' : 'No URL found');

    // Check if it's an SVG data URI
    if (backgroundImageUrl?.startsWith('data:image/svg+xml')) {
      console.log('\nBackground is an SVG data URI ✓');

      // Try to decode and display part of it
      try {
        const decoded = decodeURIComponent(backgroundImageUrl);
        console.log('\nDecoded SVG (first 500 chars):');
        console.log(decoded.substring(0, 500));
      } catch (e) {
        console.log('Could not decode URI:', e.message);
      }
    }

    // Take a screenshot
    await page.screenshot({ path: 'screenshot-detailed.png', fullPage: true });
    console.log('\nScreenshot saved: screenshot-detailed.png');

    // Test if we can manually set a simple background color to verify CSS is working
    await page.evaluate(() => {
      const backgroundDiv = document.querySelector('[class*="background"]');
      if (backgroundDiv) {
        backgroundDiv.style.backgroundColor = 'red';
      }
    });

    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshot-red-test.png', fullPage: true });
    console.log('Red background test screenshot saved: screenshot-red-test.png');

    // Restore the original background
    await page.evaluate(() => {
      const backgroundDiv = document.querySelector('[class*="background"]');
      if (backgroundDiv) {
        backgroundDiv.style.backgroundColor = '';
      }
    });

    console.log('\nKeeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);
  }

  await browser.close();
})();
