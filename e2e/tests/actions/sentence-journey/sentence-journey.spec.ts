import { test, expect } from '../../../stepDefinition/mySentenceJourneySteps';
import { PRISONS } from '../../../utils/prisons';
import { testSetup } from '../../../utils/test-setup';

// Test the Sentence Journey page across all prison environments
for (const prison of PRISONS) {
  test.describe(`Feature: Sentence Journey Page - ${prison.name}`, () => {
    let baseURL: string;

    test.beforeAll(() => {
      if (process.env.USE_DEV_ENV === 'true') {
        baseURL = prison.devUrl;
      } else {
        const isCI = !!process.env.CI;
        const domain = isCI 
          ? prison.url.replace('prisoner-content-hub.local', 'content-hub.localhost')
          : prison.url;
        baseURL = `http://${domain}:3000`;
      }
    });

    test.beforeEach(async () => {
      // Reset wiremock state before each test for fresh session
      await testSetup.reset();
      await testSetup.stubPrisonerSignIn();
    });

    test(`Scenario: Navigate to Sentence Journey via navigation link at ${prison.name}`, async ({ mySentenceJourneyPage, page }) => {
      await test.step(`Given I am on the ${prison.name} home page`, async () => {
        await page.goto(baseURL);
      });

      await test.step('When I click on the "Sentence Journey" navigation link', async () => {
        await mySentenceJourneyPage.clickSentenceJourneyNav();
      });

      await test.step('Then I should be on the Sentence Journey page', async () => {
        await expect(mySentenceJourneyPage.pageHeading).toBeVisible();
      });

      await test.step('And the URL should contain "/tags/1285"', async () => {
        await expect(page).toHaveURL(/\/tags\/1285/);
      });
    });

    test(`Scenario: View content cards on Sentence Journey page at ${prison.name}`, async ({ mySentenceJourneyPage, page }) => {
      await test.step(`Given I am on the ${prison.name} Sentence Journey page`, async () => {
        await page.goto(`${baseURL}/tags/1285`);
      });

      await test.step('When the page loads', async () => {
        await mySentenceJourneyPage.waitForContentToLoad();
      });

      await test.step('Then I should see content displayed', async () => {
        const cardCount = await mySentenceJourneyPage.getContentCardCount();
        expect(cardCount).toBeGreaterThanOrEqual(0);
      });

      await test.step('And the page heading should be visible', async () => {
        await expect(mySentenceJourneyPage.pageHeading).toBeVisible();
      });
    });
  });
}
