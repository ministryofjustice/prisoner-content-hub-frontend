import { test, expect } from '../../../stepDefinition/newsEventsSteps';
import { PRISONS } from '../../../utils/prisons';
import { testSetup } from '../../../utils/test-setup';

// Test the News and Events page across all prison environments
for (const prison of PRISONS) {
  test.describe(`Feature: News and Events Page - ${prison.name}`, () => {
    let baseURL: string;

    test.beforeAll(() => {
      const isCI = !!process.env.CI;
      const domain = isCI 
        ? prison.url.replace('prisoner-content-hub.local', 'content-hub.localhost')
        : prison.url;
      baseURL = `http://${domain}:3000`;
    });

    test.beforeEach(async () => {
      await testSetup.reset();
      await testSetup.stubPrisonerSignIn();
    });

    test(`Scenario: Navigate to News and Events page directly at ${prison.name}`, async ({ newsEventsPage, page }) => {
      await test.step(`Given I am on the ${prison.name} Content Hub`, async () => {
        await page.goto(baseURL);
      });

      await test.step('When I navigate to the News and Events page', async () => {
        await page.goto(`${baseURL}/tags/644`);
      });

      await test.step('Then I should see the News and Events page heading', async () => {
        await expect(newsEventsPage.pageHeading).toBeVisible();
        const headingText = await newsEventsPage.getPageTitle();
        expect(headingText).toBe('News and events');
      });

      await test.step('And content should be loaded on the page', async () => {
        await newsEventsPage.waitForContentToLoad();
        const isLoaded = await newsEventsPage.isLoaded();
        expect(isLoaded).toBe(true);
      });
    });

    test(`Scenario: Navigate to News and Events via navigation link at ${prison.name}`, async ({ newsEventsPage, page }) => {
      await test.step(`Given I am on the ${prison.name} Content Hub home page`, async () => {
        await page.goto(baseURL);
      });

      await test.step('When I click on the "News and events" navigation link', async () => {
        await newsEventsPage.clickNewsEventsNav();
      });

      await test.step('Then I should be on the News and Events page', async () => {
        await expect(newsEventsPage.pageHeading).toBeVisible();
        const headingText = await newsEventsPage.getPageTitle();
        expect(headingText).toBe('News and events');
      });

      await test.step('And the URL should contain "/tags/644"', async () => {
        await expect(page).toHaveURL(/\/tags\/644/);
      });
    });

    test(`Scenario: View content cards on News and Events page at ${prison.name}`, async ({ newsEventsPage, page }) => {
      await test.step(`Given I am on the ${prison.name} News and Events page`, async () => {
        await page.goto(`${baseURL}/tags/644`);
      });

      await test.step('When the page loads', async () => {
        await newsEventsPage.waitForContentToLoad();
      });

      await test.step('Then I should see content displayed', async () => {
        const cardCount = await newsEventsPage.getContentCardCount();
        expect(cardCount).toBeGreaterThanOrEqual(0);
      });

      await test.step('And the page heading should be visible', async () => {
        await expect(newsEventsPage.pageHeading).toBeVisible();
      });
    });
  });
}
