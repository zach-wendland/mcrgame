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

  // Take initial screenshot
  console.log('Taking initial screenshot...');
  await page.screenshot({ path: 'screenshot-1-initial.png', fullPage: true });

  // Check what's visible on the page
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  console.log('\n=== Initial Page Content ===');
  console.log('Body classes:', await page.evaluate(() => document.body.className));

  // Look for the New Game button
  const newGameButton = await page.locator('text="New Game"').first();
  const isVisible = await newGameButton.isVisible().catch(() => false);
  console.log('New Game button visible:', isVisible);

  if (isVisible) {
    console.log('\nClicking "New Game" button...');
    await newGameButton.click();
    await page.waitForTimeout(2000); // Wait for game to start

    // Take screenshot after clicking New Game
    console.log('Taking screenshot after New Game click...');
    await page.screenshot({ path: 'screenshot-2-after-new-game.png', fullPage: true });

    // Check for Scene component
    const sceneInfo = await page.evaluate(() => {
      const sceneElements = document.querySelectorAll('[class*="scene"]');
      const backgroundElements = document.querySelectorAll('[class*="background"]');
      const canvasElements = document.querySelectorAll('canvas');
      const imgElements = document.querySelectorAll('img');

      return {
        sceneCount: sceneElements.length,
        sceneClasses: Array.from(sceneElements).map(el => el.className),
        backgroundCount: backgroundElements.length,
        backgroundStyles: Array.from(backgroundElements).map(el => ({
          className: el.className,
          style: el.getAttribute('style'),
          backgroundImage: window.getComputedStyle(el).backgroundImage,
          width: window.getComputedStyle(el).width,
          height: window.getComputedStyle(el).height,
          display: window.getComputedStyle(el).display,
          position: window.getComputedStyle(el).position
        })),
        canvasCount: canvasElements.length,
        imgCount: imgElements.length,
        imgSrcs: Array.from(imgElements).map(img => img.src)
      };
    });

    console.log('\n=== Scene Analysis ===');
    console.log(JSON.stringify(sceneInfo, null, 2));

    // Check dialogue visibility
    const dialogueInfo = await page.evaluate(() => {
      const dialogueElements = document.querySelectorAll('[class*="dialogue"]');
      const textElements = document.querySelectorAll('[class*="text"]');

      return {
        dialogueCount: dialogueElements.length,
        dialogueClasses: Array.from(dialogueElements).map(el => el.className),
        dialogueVisible: Array.from(dialogueElements).map(el => ({
          className: el.className,
          text: el.textContent?.substring(0, 100),
          display: window.getComputedStyle(el).display,
          opacity: window.getComputedStyle(el).opacity,
          zIndex: window.getComputedStyle(el).zIndex
        })),
        textCount: textElements.length
      };
    });

    console.log('\n=== Dialogue Analysis ===');
    console.log(JSON.stringify(dialogueInfo, null, 2));

    // Check for Three.js renderer
    const threeInfo = await page.evaluate(() => {
      const canvases = Array.from(document.querySelectorAll('canvas'));
      return canvases.map(canvas => ({
        width: canvas.width,
        height: canvas.height,
        style: canvas.getAttribute('style'),
        className: canvas.className,
        parent: canvas.parentElement?.className,
        computedStyle: {
          display: window.getComputedStyle(canvas).display,
          position: window.getComputedStyle(canvas).position,
          zIndex: window.getComputedStyle(canvas).zIndex,
          width: window.getComputedStyle(canvas).width,
          height: window.getComputedStyle(canvas).height
        }
      }));
    });

    console.log('\n=== Three.js Canvas Analysis ===');
    console.log(JSON.stringify(threeInfo, null, 2));

    // Check computed styles of main container
    const containerInfo = await page.evaluate(() => {
      const app = document.getElementById('root');
      if (!app) return null;

      const firstChild = app.firstElementChild;
      return {
        rootId: app.id,
        rootClasses: app.className,
        childCount: app.children.length,
        firstChildTag: firstChild?.tagName,
        firstChildClasses: firstChild?.className,
        firstChildStyles: firstChild ? {
          position: window.getComputedStyle(firstChild).position,
          width: window.getComputedStyle(firstChild).width,
          height: window.getComputedStyle(firstChild).height,
          display: window.getComputedStyle(firstChild).display
        } : null
      };
    });

    console.log('\n=== Container Analysis ===');
    console.log(JSON.stringify(containerInfo, null, 2));

    // Wait a bit more and take final screenshot
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'screenshot-3-final.png', fullPage: true });

    console.log('\nScreenshots saved:');
    console.log('  - screenshot-1-initial.png');
    console.log('  - screenshot-2-after-new-game.png');
    console.log('  - screenshot-3-final.png');
  } else {
    console.log('New Game button not found!');
  }

  // Keep browser open for manual inspection
  console.log('\nBrowser will stay open for 10 seconds for manual inspection...');
  await page.waitForTimeout(10000);

  await browser.close();
})();
