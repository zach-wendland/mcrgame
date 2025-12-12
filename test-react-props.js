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

    // Check React Fiber to inspect props
    const reactProps = await page.evaluate(() => {
      const backgroundDiv = document.querySelector('[class*="background"]');
      if (!backgroundDiv) return null;

      // Try to access React internals (works in development mode)
      const fiberKey = Object.keys(backgroundDiv).find(key =>
        key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
      );

      if (fiberKey) {
        const fiber = backgroundDiv[fiberKey];
        return {
          hasFiber: true,
          pendingProps: fiber?.pendingProps,
          memoizedProps: fiber?.memoizedProps,
          style: fiber?.memoizedProps?.style,
          return: {
            type: fiber?.return?.type?.name,
            props: fiber?.return?.memoizedProps
          }
        };
      }

      return { hasFiber: false };
    });

    console.log('\n=== React Props Investigation ===');
    console.log(JSON.stringify(reactProps, null, 2));

    // Also check what App.tsx is passing
    const sceneProps = await page.evaluate(() => {
      const sceneDiv = document.querySelector('[data-scene-id]');
      if (!sceneDiv) return null;

      const fiberKey = Object.keys(sceneDiv).find(key =>
        key.startsWith('__reactFiber') || key.startsWith('__reactInternalInstance')
      );

      if (fiberKey) {
        const fiber = sceneDiv[fiberKey];
        return {
          sceneId: sceneDiv.getAttribute('data-scene-id'),
          props: fiber?.memoizedProps,
          type: fiber?.type?.name
        };
      }

      return null;
    });

    console.log('\n=== Scene Component Props ===');
    console.log(JSON.stringify(sceneProps, null, 2));
  }

  await page.waitForTimeout(2000);
  await browser.close();
})();
