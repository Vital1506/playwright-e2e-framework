/**
 * BasePage
 * Parent class for every Page Object. Centralizes common actions/waits
 * so individual page objects stay small and declarative.
 */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  /** @param {string} title */
  async expectTitle(title) {
    await this.page.waitForFunction(
      (expected) => document.title.includes(expected),
      title
    );
  }

  /**
   * @param {import('@playwright/test').Locator} locator
   */
  async click(locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * @param {import('@playwright/test').Locator} locator
   * @param {string} text
   */
  async fill(locator, text) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  /**
   * @param {import('@playwright/test').Locator} locator
   */
  async getText(locator) {
    await locator.waitFor({ state: 'visible' });
    return locator.innerText();
  }

  /**
   * @param {import('@playwright/test').Locator} locator
   */
  async isVisible(locator) {
    return locator.isVisible();
  }

  async waitForUrl(pattern) {
    await this.page.waitForURL(pattern);
  }
}

module.exports = { BasePage };
