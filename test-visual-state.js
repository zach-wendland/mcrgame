const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);

  // Take screenshot of initial state
  await page.screenshot({ path: 'screenshot-1-initial.png', fullPage: true });
  console.log('Screenshot 1: Initial state captured');

  // Check what's visible on the page
  const bodyText = await page.textContent('body');
  console.log('\n=== Page Text Content ===');
  console.log(bodyText);

  // Look for New Game button
  const newGameButton = await page.locator('text=New Game').first();
  const isVisible = await newGameButton.isVisible().catch(() => false);
  console.log('\n=== New Game Button ===');
  console.log('Visible:', isVisible);

  if (isVisible) {
    console.log('\nClicking New Game button...');
    await newGameButton.click();
    await page.waitForTimeout(2000);

    // Take screenshot after clicking New Game
    await page.screenshot({ path: 'screenshot-2-after-new-game.png', fullPage: true });
    console.log('Screenshot 2: After clicking New Game captured');

    // Check for dialogue content
    const dialogueText = await page.textContent('body');
    console.log('\n=== Dialogue Content ===');
    console.log(dialogueText);

    // Check for background/scene elements
    const canvas = await page.locator('canvas').count();
    const images = await page.locator('img').count();
    const svgs = await page.locator('svg').count();

    console.log('\n=== Visual Elements Count ===');
    console.log('Canvas elements:', canvas);
    console.log('Image elements:', images);
    console.log('SVG elements:', svgs);

    // Check computed styles of body and main container
    const bodyStyles = await page.evaluate(() => {
      const body = document.body;
      const computed = window.getComputedStyle(body);
      return {
        backgroundColor: computed.backgroundColor,
        backgroundImage: computed.backgroundImage,
        width: computed.width,
        height: computed.height
      };
    });
    console.log('\n=== Body Styles ===');
    console.log(JSON.stringify(bodyStyles, null, 2));

    // Check for Scene component
    const sceneElement = await page.locator('[class*="scene"]').first();
    const sceneExists = await sceneElement.count();
    console.log('\n=== Scene Component ===');
    console.log('Scene elements found:', sceneExists);

    if (sceneExists > 0) {
      const sceneStyles = await sceneElement.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          position: computed.position,
          width: computed.width,
          height: computed.height,
          backgroundImage: computed.backgroundImage,
          backgroundColor: computed.backgroundColor,
          zIndex: computed.zIndex,
          opacity: computed.opacity
        };
      });
      console.log('Scene styles:', JSON.stringify(sceneStyles, null, 2));
    }

    // Wait a bit to see if anything loads
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'screenshot-3-final.png', fullPage: true });
    console.log('Screenshot 3: Final state captured');
  }

  console.log('\n=== Test Complete ===');
  console.log('Screenshots saved to project root');

  await browser.close();
})();
