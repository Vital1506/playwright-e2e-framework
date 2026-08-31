const { BasePage } = require('./BasePage');

/**
 * CartPage
 * Encapsulates the shopping cart review screen.
 */
class CartPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getCartItemNames() {
    return this.cartItemNames.allInnerTexts();
  }

  async getCartItemCount() {
    return this.cartItems.count();
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton);
  }

  async continueShopping() {
    await this.click(this.continueShoppingButton);
  }
}

module.exports = { CartPage };
