import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');

  const newGameButton = await page.locator('text="New Game"').first();
  if (await newGameButton.isVisible()) {
    console.log('Clicking "New Game"...');
    await newGameButton.click();
    await page.waitForTimeout(2000);

    // Simple check of what's actually set
    const info = await page.evaluate(() => {
      const backgroundDiv = document.querySelector('[class*="background"]');
      const sceneDiv = document.querySelector('[data-scene-id]');

      return {
        background: {
          hasStyleAttribute: backgroundDiv?.hasAttribute('style'),
          styleAttribute: backgroundDiv?.getAttribute('style'),
          inlineBackgroundImage: backgroundDiv?.style?.backgroundImage,
          computedBackgroundImage: window.getComputedStyle(backgroundDiv).backgroundImage
        },
        scene: {
          sceneId: sceneDiv?.getAttribute('data-scene-id'),
          className: sceneDiv?.className
        }
      };
    });

    console.log('\n=== Element Check ===');
    console.log('Background has style attribute:', info.background.hasStyleAttribute);
    console.log('Style attribute value:', info.background.styleAttribute);
    console.log('Inline backgroundImage:', info.background.inlineBackgroundImage);
    console.log('Computed backgroundImage:', info.background.computedBackgroundImage);
    console.log('Scene ID:', info.scene.sceneId);
  }

  await page.waitForTimeout(2000);
  await browser.close();
})();
