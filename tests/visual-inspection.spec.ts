import { test, expect } from '@playwright/test';

test.describe('Visual State Inspection', () => {
  test('should inspect background rendering after clicking New Game', async ({ page }) => {
    // Navigate to the game
    await page.goto('http://localhost:5173');

    // Take screenshot of title screen
    await page.screenshot({ path: 'test-results/01-title-screen.png', fullPage: true });
    console.log('Screenshot 1: Title screen captured');

    // Find and click New Game button
    const newGameButton = page.getByText('New Game');
    await expect(newGameButton).toBeVisible();
    await newGameButton.click();

    // Wait for scene to load
    await page.waitForTimeout(1000);

    // Take screenshot after clicking New Game
    await page.screenshot({ path: 'test-results/02-after-new-game.png', fullPage: true });
    console.log('Screenshot 2: After New Game captured');

    // Inspect the Scene component
    const sceneElement = page.locator('[data-scene-id]');
    await expect(sceneElement).toBeVisible();

    const sceneId = await sceneElement.getAttribute('data-scene-id');
    console.log('\n=== Scene Information ===');
    console.log('Current scene ID:', sceneId);

    // Check for background element
    const backgroundDiv = page.locator('.Scene_background__');
    const backgroundExists = await backgroundDiv.count();
    console.log('\n=== Background Element ===');
    console.log('Background divs found:', backgroundExists);

    if (backgroundExists > 0) {
      const backgroundStyle = await backgroundDiv.first().evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          backgroundImage: computed.backgroundImage,
          backgroundColor: computed.backgroundColor,
          width: computed.width,
          height: computed.height,
          position: computed.position,
          opacity: computed.opacity,
          display: computed.display,
          zIndex: computed.zIndex
        };
      });
      console.log('Background computed styles:', JSON.stringify(backgroundStyle, null, 2));

      // Get the inline style
      const inlineStyle = await backgroundDiv.first().getAttribute('style');
      console.log('Background inline style:', inlineStyle);
    }

    // Check for DialogueBox
    const dialogueBox = page.locator('.DialogueBox_container__');
    const dialogueExists = await dialogueBox.count();
    console.log('\n=== Dialogue Box ===');
    console.log('Dialogue box found:', dialogueExists > 0);

    if (dialogueExists > 0) {
      const dialogueText = await dialogueBox.textContent();
      console.log('Dialogue content:', dialogueText?.substring(0, 100));
    }

    // Check all elements with background-image
    const elementsWithBg = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const withBg: Array<{tag: string, classes: string, bgImage: string}> = [];
      elements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (computed.backgroundImage && computed.backgroundImage !== 'none') {
          withBg.push({
            tag: el.tagName,
            classes: el.className,
            bgImage: computed.backgroundImage.substring(0, 100)
          });
        }
      });
      return withBg;
    });

    console.log('\n=== Elements with background-image ===');
    console.log(JSON.stringify(elementsWithBg, null, 2));

    // Get all CSS classes being applied
    const sceneClasses = await sceneElement.getAttribute('class');
    console.log('\n=== Scene Classes ===');
    console.log('Classes applied:', sceneClasses);

    // Final screenshot after waiting
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/03-final-state.png', fullPage: true });
    console.log('\nScreenshot 3: Final state captured');
  });
});
