const { test, expect } = require("@playwright/test");

function testURL(pathname = "/") {
  return "http://localhost:5000" + pathname;
}

test.describe("Bookmarking pages", () => {
  const SELECTOR = '[data-testid="bookmark-toggle"]';

  test.beforeEach(async ({ context }) => {
    // Necessary hack to make sure any existing 'sessionid' cookies don't
    // interfere on the re-used `page` across tests.
    await context.clearCookies();
  });

  test("view a document without being a signed in subscriber", async ({
    page,
  }) => {
    await page.goto(testURL("/en-US/docs/Web/Foo"));
    expect(await page.isVisible(SELECTOR)).toBeFalsy();
  });

  test("view a document and being a signed in subscriber", async ({ page }) => {
    await page.goto(testURL("/en-US/docs/Web/Foo"));

    // Sign in
    await page.click("text='Already a subscriber?'");
    await page.waitForLoadState("networkidle");

    await page.goto(testURL("/en-US/docs/Web/Foo"));
    await page.waitForSelector(SELECTOR);

    expect(await page.isVisible('button[title="Add bookmark"]')).toBeTruthy();

    await page.click('button[title="Add bookmark"]');
    await page.waitForLoadState("networkidle");

    expect(await page.isVisible('button[title="Add bookmark"]')).toBeFalsy();
    expect(await page.isVisible('button[title^="Bookmarked"]')).toBeTruthy();

    // Reload the page to prove that it sticks
    await page.goto(testURL("/en-US/docs/Web/Foo"));
    await page.waitForSelector(SELECTOR);

    expect(await page.isVisible('button[title^="Bookmarked"]')).toBeTruthy();
  });

  test("view your listing of all bookmarks", async ({ page }) => {
    await page.goto(testURL("/en-US/plus/bookmarks"));
    await page.waitForLoadState("networkidle");
    await page.waitForSelector("text=You have not signed in");

    // Sign in
    await page.click("text='Already a subscriber?'");
    await page.waitForLoadState("networkidle");

    await page.goto(testURL("/en-US/plus/bookmarks"));
    await page.waitForSelector("text=Nothing bookmarked yet.");

    // Open a bunch of pages
    const urls = [
      "/en-US/docs/Web/Foo",
      "/en-US/docs/Web/BrokenLinks",
      "/en-US/docs/Web/HTML/Element/a",
      "/en-US/docs/Web/CSS/number",
      "/en-US/docs/Web/Images",
      "/en-US/docs/Web/HTML_Headings",
    ];
    for (const url of urls) {
      await page.goto(testURL(url));
      await page.waitForSelector(SELECTOR);
      await page.click('button[title="Add bookmark"]');
    }

    const locator = page.locator(".pagination");

    await page.goto(testURL("/en-US/plus/bookmarks"));
    await page.waitForSelector("text=My bookmarks");

    await expect(locator).toBeVisible();

    // This picks one of the un-toggle buttons
    await page.click('button[title="Remove bookmark"]');
    await page.waitForLoadState("networkidle");

    await expect(locator).not.toBeVisible();
  });
});
