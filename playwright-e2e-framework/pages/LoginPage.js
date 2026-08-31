const { BasePage } = require('./BasePage');

/**
 * LoginPage
 * Encapsulates all locators and actions for the authentication workflow.
 */
class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorCloseButton = page.locator('.error-button');
  }

  async open() {
    await this.goto('/');
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async getErrorText() {
    return this.getText(this.errorMessage);
  }

  async isErrorVisible() {
    return this.isVisible(this.errorMessage);
  }

  async dismissError() {
    await this.click(this.errorCloseButton);
  }
}

module.exports = { LoginPage };
