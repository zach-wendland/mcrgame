/**
 * Test mode detection utility
 * Detects if the app is running in test/automation mode
 */

/**
 * Check if running in test mode
 * Detects via:
 * - NODE_ENV === 'test'
 * - URL query parameter ?testMode=true
 * - window.navigator.webdriver (Playwright/Selenium)
 * - window.__playwright (Playwright specific)
 */
export function isTestMode(): boolean {
  // Check environment variable
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return true;
  }

  // Check URL query parameter
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('testMode') === 'true') {
      return true;
    }

    // Check for Playwright-specific property
    if ((window as any).__playwright !== undefined) {
      return true;
    }

    // Check for webdriver (Playwright/Selenium indicator)
    if ((navigator as any).webdriver === true) {
      return true;
    }

    // Check for Playwright user agent
    if (navigator.userAgent.includes('Playwright')) {
      return true;
    }
  }

  return false;
}

/**
 * Get typewriter speed for test mode
 * Returns 0 in test mode for instant display
 */
export function getTypewriterSpeed(baseSpeed: number): number {
  return isTestMode() ? 0 : baseSpeed;
}
