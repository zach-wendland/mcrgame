/**
 * E2E tests for The Black Parade: Carry On
 */

import { test, expect } from '@playwright/test';

test.describe('Title Screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display title screen on load', async ({ page }) => {
    await expect(page.getByText('THE BLACK PARADE')).toBeVisible();
    await expect(page.getByText('CARRY ON')).toBeVisible();
    await expect(page.getByText('An Interactive Experience')).toBeVisible();
  });

  test('should show New Game button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /new game/i })).toBeVisible();
  });

  test('should not show Continue button on fresh start', async ({ page }) => {
    // Fresh start should not have continue
    await expect(page.getByRole('button', { name: /continue/i })).not.toBeVisible();
  });

  test('should navigate to first scene when clicking New Game', async ({ page }) => {
    await page.getByRole('button', { name: /new game/i }).click();

    // Should transition to Draag opening
    await expect(page.locator('[data-scene-id="draag-opening"]')).toBeVisible();
  });
});

test.describe('Dialogue System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new game/i }).click();
    // Wait for scene to load
    await page.waitForSelector('[data-scene-id="draag-opening"]');
  });

  test('should display dialogue text with typewriter effect', async ({ page }) => {
    // Wait for first dialogue to appear
    const dialogueBox = page.locator('[class*="DialogueBox"]');
    await expect(dialogueBox).toBeVisible();

    // Text should be present
    await expect(page.getByText(/stadium/i)).toBeVisible({ timeout: 10000 });
  });

  test('should advance dialogue on click', async ({ page }) => {
    const dialogueContainer = page.locator('[class*="DialogueBox"]');

    // Get initial text (wait for typewriter)
    await page.waitForTimeout(3000);

    // Click to skip/advance
    await dialogueContainer.click();
    await page.waitForTimeout(500);

    // Should show new content
    await dialogueContainer.click();
  });

  test('should display character names', async ({ page }) => {
    // Skip through narrator dialogue to get to The Clerk
    const dialogueContainer = page.locator('[class*="DialogueBox"]');

    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(1000);
      await dialogueContainer.click();
    }

    // Eventually The Clerk should speak
    await expect(page.getByText(/The Clerk/i)).toBeVisible({ timeout: 15000 });
  });
});

test.describe('Choice System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new game/i }).click();
    await page.waitForSelector('[data-scene-id="draag-opening"]');
  });

  test('should display choices when available', async ({ page }) => {
    const dialogueContainer = page.locator('[class*="DialogueBox"]');

    // Click through to reach the first choice
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(300);
      await dialogueContainer.click();
    }

    // Look for choice buttons (may need more clicks depending on dialogue length)
    const choiceButtons = page.locator('[class*="ChoiceButton"]');

    // Wait for choices to appear (they appear after certain dialogue nodes)
    await expect(choiceButtons.first()).toBeVisible({ timeout: 30000 });
  });

  test('choices should be clickable and advance story', async ({ page }) => {
    const dialogueContainer = page.locator('[class*="DialogueBox"]');

    // Navigate to first choice
    for (let i = 0; i < 15; i++) {
      await page.waitForTimeout(300);
      await dialogueContainer.click();
    }

    // Wait for choices
    const choiceButtons = page.locator('[class*="ChoiceButton"]');
    await expect(choiceButtons.first()).toBeVisible({ timeout: 30000 });

    // Click first choice
    await choiceButtons.first().click();

    // Should advance past the choice
    await page.waitForTimeout(1000);

    // Choices should be gone
    await expect(choiceButtons.first()).not.toBeVisible();
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.goto('/');

    // Title should be visible
    await expect(page.getByText('THE BLACK PARADE')).toBeVisible();

    // Button should be touchable size
    const button = page.getByRole('button', { name: /new game/i });
    await expect(button).toBeVisible();

    const buttonBox = await button.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(44); // Min touch target
  });

  test('dialogue box should be readable on mobile', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new game/i }).click();

    await page.waitForSelector('[data-scene-id="draag-opening"]');

    const dialogueBox = page.locator('[class*="DialogueBox"]');
    await expect(dialogueBox).toBeVisible();

    // Dialogue box should not overflow viewport
    const box = await dialogueBox.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});

test.describe('Accessibility', () => {
  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');

    // Tab should focus on New Game button
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveText(/new game/i);
  });

  test('buttons should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Focus and activate with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Should navigate to game
    await expect(page.locator('[data-scene-id="draag-opening"]')).toBeVisible();
  });

  test('dialogue should have aria labels', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /new game/i }).click();

    await page.waitForSelector('[data-scene-id="draag-opening"]');

    const dialogueBox = page.locator('[class*="DialogueBox"]');
    await expect(dialogueBox).toHaveAttribute('aria-label');
  });
});

test.describe('Save/Load System', () => {
  test('should show Continue button after playing', async ({ page }) => {
    await page.goto('/');

    // Start game
    await page.getByRole('button', { name: /new game/i }).click();
    await page.waitForSelector('[data-scene-id="draag-opening"]');

    // Play a bit (advance dialogue)
    const dialogueContainer = page.locator('[class*="DialogueBox"]');
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(500);
      await dialogueContainer.click();
    }

    // Wait for autosave
    await page.waitForTimeout(5000);

    // Reload page
    await page.reload();

    // Continue button should now be visible
    await expect(page.getByRole('button', { name: /continue/i })).toBeVisible({ timeout: 10000 });
  });
});
