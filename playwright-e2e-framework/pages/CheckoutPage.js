const { BasePage } = require('./BasePage');

/**
 * CheckoutPage
 * Encapsulates the two-step checkout flow: the customer-info form
 * (data input, validation/edge cases) and the order overview/finish step.
 */
class CheckoutPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // Step One: customer information form
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step Two: order overview
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');
    this.finishButton = page.locator('[data-test="finish"]');

    // Confirmation
    this.completeHeader = page.locator('.complete-header');
  }

  /**
   * Fills and submits the customer information form.
   * @param {{firstName?: string, lastName?: string, postalCode?: string}} info
   */
  async fillCustomerInfo({ firstName = '', lastName = '', postalCode = '' }) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
    await this.click(this.continueButton);
  }

  async getFormErrorText() {
    return this.getText(this.errorMessage);
  }

  async getTotalAsNumber() {
    const text = await this.getText(this.summaryTotal);
    return parseFloat(text.replace('Total: $', ''));
  }

  async finishOrder() {
    await this.click(this.finishButton);
  }

  async getConfirmationText() {
    return this.getText(this.completeHeader);
  }
}

module.exports = { CheckoutPage };
