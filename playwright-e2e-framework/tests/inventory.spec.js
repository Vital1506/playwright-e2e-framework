const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { users, products } = require('../utils/test-data');

test.describe('Dynamic UI Interactions - Product Inventory', () => {
  let loginPage;
  let inventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('sorts products from A to Z @smoke', async () => {
    await inventoryPage.sortBy('az');

    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('sorts products from Z to A', async () => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('sorts products by price low to high', async () => {
    await inventoryPage.sortBy('lohi');

    const prices = await inventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('sorts products by price high to low', async () => {
    await inventoryPage.sortBy('hilo');

    const prices = await inventoryPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('updates the cart badge dynamically as items are added', async () => {
    expect(await inventoryPage.getCartCount()).toBe(0);

    await inventoryPage.addProductToCart(products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.addProductToCart(products.bikeLight);
    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('updates the cart badge dynamically as items are removed', async () => {
    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    expect(await inventoryPage.getCartCount()).toBe(2);

    await inventoryPage.removeProductFromCart(products.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);
  });

  test('does not show a cart badge when the cart is empty @edge', async () => {
    await expect(inventoryPage.cartBadge).toBeHidden();
  });

  test('carries added items through to the cart page', async ({ page }) => {
    const cartPage = new CartPage(page);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.boltTShirt);
    await inventoryPage.goToCart();

    await expect(page).toHaveURL(/cart\.html/);
    const itemNames = await cartPage.getCartItemNames();
    expect(itemNames).toEqual(expect.arrayContaining([products.backpack, products.boltTShirt]));
    expect(await cartPage.getCartItemCount()).toBe(2);
  });
});
