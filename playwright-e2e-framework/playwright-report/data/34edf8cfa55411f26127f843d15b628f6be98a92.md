# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory.spec.js >> Dynamic UI Interactions - Product Inventory >> sorts products by price low to high
- Location: tests\inventory.spec.js:36:3

# Error details

```
Error: page.goto: NS_ERROR_UNKNOWN_SOCKET_TYPE
Call log:
  - navigating to "https://www.saucedemo.com/", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - heading "Oops." [level=1] [ref=e5]
    - paragraph [ref=e6]: Firefox doesn’t know how to communicate with the server.
    - paragraph
  - button "Try Again" [active] [ref=e8]
```

# Test source

```ts
  1  | /**
  2  |  * BasePage
  3  |  * Parent class for every Page Object. Centralizes common actions/waits
  4  |  * so individual page objects stay small and declarative.
  5  |  */
  6  | class BasePage {
  7  |   /**
  8  |    * @param {import('@playwright/test').Page} page
  9  |    */
  10 |   constructor(page) {
  11 |     this.page = page;
  12 |   }
  13 | 
  14 |   async goto(path = '/') {
> 15 |     await this.page.goto(path);
     |                     ^ Error: page.goto: NS_ERROR_UNKNOWN_SOCKET_TYPE
  16 |   }
  17 | 
  18 |   /** @param {string} title */
  19 |   async expectTitle(title) {
  20 |     await this.page.waitForFunction(
  21 |       (expected) => document.title.includes(expected),
  22 |       title
  23 |     );
  24 |   }
  25 | 
  26 |   /**
  27 |    * @param {import('@playwright/test').Locator} locator
  28 |    */
  29 |   async click(locator) {
  30 |     await locator.waitFor({ state: 'visible' });
  31 |     await locator.click();
  32 |   }
  33 | 
  34 |   /**
  35 |    * @param {import('@playwright/test').Locator} locator
  36 |    * @param {string} text
  37 |    */
  38 |   async fill(locator, text) {
  39 |     await locator.waitFor({ state: 'visible' });
  40 |     await locator.fill(text);
  41 |   }
  42 | 
  43 |   /**
  44 |    * @param {import('@playwright/test').Locator} locator
  45 |    */
  46 |   async getText(locator) {
  47 |     await locator.waitFor({ state: 'visible' });
  48 |     return locator.innerText();
  49 |   }
  50 | 
  51 |   /**
  52 |    * @param {import('@playwright/test').Locator} locator
  53 |    */
  54 |   async isVisible(locator) {
  55 |     return locator.isVisible();
  56 |   }
  57 | 
  58 |   async waitForUrl(pattern) {
  59 |     await this.page.waitForURL(pattern);
  60 |   }
  61 | }
  62 | 
  63 | module.exports = { BasePage };
  64 | 
```