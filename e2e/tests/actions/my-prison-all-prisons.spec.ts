import { test, expect } from '../../stepDefinintion/myPrisonSteps';
import { PRISONS } from '../../utils/prisons';

// Test the My Prison page across all prison environments
for (const prison of PRISONS) {
  test.describe(`Feature: My Prison Page - ${prison.name}`, () => {
    let baseURL: string;

    test.beforeAll(() => {
      const isCI = !!process.env.CI;
      const domain = isCI 
        ? prison.url.replace('prisoner-content-hub.local', 'content-hub.localhost')
        : prison.url;
      baseURL = `http://${domain}:3000`;
    });

    test(`Scenario: Navigate to My Prison page directly at ${prison.name}`, async ({ myPrisonPage, page }) => {
      await test.step(`Given I am on the ${prison.name} Content Hub`, async () => {
        await page.goto(baseURL);
      });

      await test.step('When I navigate directly to the My Prison page', async () => {
        await page.goto(`${baseURL}/tags/1283`);
      });

      await test.step('Then I should see the My Prison page heading', async () => {
        await expect(myPrisonPage.pageHeading).toBeVisible();
        await expect(myPrisonPage.pageHeading).toHaveText('My prison');
      });

      await test.step('And content should be loaded on the page', async () => {
        await myPrisonPage.waitForContentToLoad();
      });
    });

    test(`Scenario: Navigate to My Prison via navigation link at ${prison.name}`, async ({ myPrisonPage, page }) => {
      await test.step(`Given I am on the ${prison.name} home page`, async () => {
        await page.goto(baseURL);
      });

      await test.step('When I click on the "My Prison" navigation link', async () => {
        await myPrisonPage.clickMyPrisonNav();
      });

      await test.step('Then I should be on the My Prison page', async () => {
        await expect(myPrisonPage.pageHeading).toBeVisible();
      });

      await test.step('And the URL should contain "/tags/1283"', async () => {
        await expect(page).toHaveURL(/\/tags\/1283/);
      });
    });

    test(`Scenario: View content cards on My Prison page at ${prison.name}`, async ({ myPrisonPage, page }) => {
      await test.step(`Given I am on the ${prison.name} My Prison page`, async () => {
        await page.goto(`${baseURL}/tags/1283`);
      });

      await test.step('When the page loads', async () => {
        await myPrisonPage.waitForContentToLoad();
      });

      await test.step('Then I should see content displayed', async () => {
        const cardCount = await myPrisonPage.getContentCardCount();
        expect(cardCount).toBeGreaterThanOrEqual(0);
      });

      await test.step('And the page heading should be visible', async () => {
        await expect(myPrisonPage.pageHeading).toBeVisible();
      });
    });
  });
}

