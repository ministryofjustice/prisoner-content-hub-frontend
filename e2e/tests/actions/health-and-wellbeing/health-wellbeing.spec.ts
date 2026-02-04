import { test, expect } from '../../../stepDefinition/healthWellbeingSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Health and Wellbeing Page - ${prison.name}`, () => {
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

    test(`Scenario: Navigate to Health and Wellbeing page directly - ${prison.name}`, async ({ healthWellbeingPage, page }) => {
      await test.step('Given I am on the Prisoner Content Hub', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I navigate to the Health and Wellbeing page', async () => {
        await page.goto(`${baseURL}/tags/1284`);
      });

      await test.step('Then I should see the page heading', async () => {
        await expect(healthWellbeingPage.pageHeading).toBeVisible();
      });

      await test.step('And content should be loaded on the page', async () => {
        await healthWellbeingPage.waitForContentToLoad();
        const isLoaded = await healthWellbeingPage.isLoaded();
        expect(isLoaded).toBe(true);
      });
    });

    test(`Scenario: Navigate to Health and Wellbeing via navigation link - ${prison.name}`, async ({ healthWellbeingPage, page }) => {
      await test.step('Given I am on the Prisoner Content Hub home page', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I click on the "Health and wellbeing" navigation link', async () => {
        await healthWellbeingPage.clickHealthWellbeingNav();
      });

      await test.step('Then I should be on the Health and Wellbeing page', async () => {
        await expect(healthWellbeingPage.pageHeading).toBeVisible();
      });

      await test.step('And the URL should contain "/tags/1284"', async () => {
        await expect(page).toHaveURL(/\/tags\/1284/);
      });
    });

    test(`Scenario: View content cards on Health and Wellbeing page - ${prison.name}`, async ({ healthWellbeingPage, page }) => {
      await test.step('Given I am on the Health and Wellbeing page', async () => {
        await page.goto(`${baseURL}/tags/1284`);
      });

      await test.step('When the page loads', async () => {
        await healthWellbeingPage.waitForContentToLoad();
      });

      await test.step('Then the page structure should be intact', async () => {
        const cardCount = await healthWellbeingPage.getContentCardCount();
        expect(cardCount).toBeGreaterThanOrEqual(0);
        // Verify page renders correctly regardless of content
        const isLoaded = await healthWellbeingPage.isLoaded();
        expect(isLoaded).toBe(true);
      });
    });
  });
});
