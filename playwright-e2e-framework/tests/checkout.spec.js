const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { users, products, checkoutInfo } = require('../utils/test-data');

test.describe('Checkout - Data Input Forms', () => {
  let inventoryPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);

    await inventoryPage.addProductToCart(products.backpack);
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('completes checkout end-to-end with valid customer information @smoke', async ({ page }) => {
    await checkoutPage.fillCustomerInfo(checkoutInfo.valid);

    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutPage.summaryTotal).toBeVisible();

    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    const confirmation = await checkoutPage.getConfirmationText();
    expect(confirmation).toContain('Thank you for your order');
  });

  test('calculates order total as subtotal plus tax correctly', async () => {
    await checkoutPage.fillCustomerInfo(checkoutInfo.valid);

    const subtotalText = await checkoutPage.getText(checkoutPage.summarySubtotal);
    const taxText = await checkoutPage.getText(checkoutPage.summaryTax);
    const total = await checkoutPage.getTotalAsNumber();

    const subtotal = parseFloat(subtotalText.replace('Item total: $', ''));
    const tax = parseFloat(taxText.replace('Tax: $', ''));

    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('blocks checkout when first name is missing @edge', async () => {
    await checkoutPage.fillCustomerInfo(checkoutInfo.missingFirstName);

    const error = await checkoutPage.getFormErrorText();
    expect(error).toContain('First Name is required');
  });

  test('blocks checkout when last name is missing @edge', async () => {
    await checkoutPage.fillCustomerInfo(checkoutInfo.missingLastName);

    const error = await checkoutPage.getFormErrorText();
    expect(error).toContain('Last Name is required');
  });

  test('blocks checkout when postal code is missing @edge', async () => {
    await checkoutPage.fillCustomerInfo(checkoutInfo.missingPostalCode);

    const error = await checkoutPage.getFormErrorText();
    expect(error).toContain('Postal Code is required');
  });

  test('allows returning to shopping from the cart before checkout', async ({ page }) => {
    await checkoutPage.page.goBack(); // back to cart
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory\.html/);
  });
});
