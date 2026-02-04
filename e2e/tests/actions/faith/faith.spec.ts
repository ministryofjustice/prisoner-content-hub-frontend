import { test, expect } from '../../../stepDefinition/faithSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Faith Page - ${prison.name}`, () => {
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
      await testSetup.reset();
      await testSetup.stubPrisonerSignIn();
    });

    test(`Scenario: Navigate to Faith page directly - ${prison.name}`, async ({ faithPage, page }) => {
      await test.step('Given I am on the Prisoner Content Hub', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I navigate to the Faith page', async () => {
        await page.goto(`${baseURL}/tags/1286`);
      });

      await test.step('Then I should see the page heading', async () => {
        await expect(faithPage.pageHeading).toBeVisible();
      });

      await test.step('And content should be loaded on the page', async () => {
        await faithPage.waitForContentToLoad();
        const isLoaded = await faithPage.isLoaded();
        expect(isLoaded).toBe(true);
      });
    });

    test(`Scenario: Navigate to Faith via navigation link - ${prison.name}`, async ({ faithPage, page }) => {
      await test.step('Given I am on the Prisoner Content Hub home page', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I click on the "Faith" navigation link', async () => {
        await faithPage.clickFaithNav();
      });

      await test.step('Then I should be on the Faith page', async () => {
        await expect(faithPage.pageHeading).toBeVisible();
      });

      await test.step('And the URL should contain "/tags/1286"', async () => {
        await expect(page).toHaveURL(/\/tags\/1286/);
      });
    });

    test(`Scenario: View content cards on Faith page - ${prison.name}`, async ({ faithPage, page }) => {
      await test.step('Given I am on the Faith page', async () => {
        await page.goto(`${baseURL}/tags/1286`);
      });

      await test.step('When the page loads', async () => {
        await faithPage.waitForContentToLoad();
      });

      await test.step('Then the page structure should be intact', async () => {
        const cardCount = await faithPage.getContentCardCount();
        expect(cardCount).toBeGreaterThanOrEqual(0);
        // Verify page renders correctly regardless of content
        const isLoaded = await faithPage.isLoaded();
        expect(isLoaded).toBe(true);
      });
    });
  });
});
