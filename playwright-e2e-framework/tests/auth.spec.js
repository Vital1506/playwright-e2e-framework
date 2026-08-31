const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { users } = require('../utils/test-data');

test.describe('User Authentication', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test('logs in successfully with valid standard-user credentials @smoke', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(users.standard.username, users.standard.password);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.pageTitle).toHaveText('Products');
  });

  test('logs out successfully and returns to the login screen', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory\.html/);

    await inventoryPage.logout();

    await expect(page).toHaveURL(/saucedemo\.com\/(index\.html)?$/);
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('rejects login for a locked-out user with a clear error message', async () => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('rejects login with invalid credentials', async () => {
    await loginPage.login(users.invalid.username, users.invalid.password);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('do not match');
  });

  test('shows a validation error when the password field is empty', async () => {
    await loginPage.login(users.standard.username, '');

    const error = await loginPage.getErrorText();
    expect(error).toContain('Password is required');
  });

  test('shows a validation error when the username field is empty', async () => {
    await loginPage.login('', users.standard.password);

    const error = await loginPage.getErrorText();
    expect(error).toContain('Username is required');
  });

  test('shows a validation error when both fields are empty', async () => {
    await loginPage.login('', '');

    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('allows dismissing the error banner and retrying login', async () => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.dismissError();
    await expect(loginPage.errorMessage).toBeHidden();

    await loginPage.login(users.standard.username, users.standard.password);
    await expect(loginPage.loginButton).toBeHidden();
  });

  test('is case-sensitive and rejects a mixed-case username @edge', async () => {
    await loginPage.login('Standard_User', users.standard.password);

    await expect(loginPage.errorMessage).toBeVisible();
  });
});
