const { BasePage } = require('./BasePage');

/**
 * InventoryPage
 * Encapsulates the product listing screen: dynamic sorting, add-to-cart
 * interactions, and the live-updating cart badge.
 */
class InventoryPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async isLoaded() {
    return this.isVisible(this.pageTitle);
  }

  /**
   * @param {'az'|'za'|'lohi'|'hilo'} option
   */
  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames() {
    return this.itemNames.allInnerTexts();
  }

  async getItemPrices() {
    const texts = await this.itemPrices.allInnerTexts();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  /**
   * Adds a product to the cart by its visible name.
   * @param {string} productName
   */
  async addProductToCart(productName) {
    const item = this.page.locator('.inventory_item', { hasText: productName });
    await this.click(item.locator('button', { hasText: 'Add to cart' }));
  }

  /**
   * Removes a product from the cart by its visible name (button toggles in place).
   * @param {string} productName
   */
  async removeProductFromCart(productName) {
    const item = this.page.locator('.inventory_item', { hasText: productName });
    await this.click(item.locator('button', { hasText: 'Remove' }));
  }

  async getCartCount() {
    if (await this.cartBadge.isVisible()) {
      const text = await this.getText(this.cartBadge);
      return parseInt(text, 10);
    }
    return 0;
  }

  async goToCart() {
    await this.click(this.cartLink);
  }

  async logout() {
    await this.click(this.menuButton);
    await this.click(this.logoutLink);
  }
}

module.exports = { InventoryPage };
