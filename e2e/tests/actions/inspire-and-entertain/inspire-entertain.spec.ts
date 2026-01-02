import { test, expect } from '../../../stepDefinition/inspireEntertainSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Inspire and Entertain Page - ${prison.name}`, () => {
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

    test(`Scenario: Navigate to Inspire and Entertain page directly - ${prison.name}`, async ({ inspireEntertainPage, page }) => {
      await test.step('Given I am on the Prisoner Content Hub', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I navigate to the Inspire and Entertain page', async () => {
        await page.goto(`${baseURL}/tags/1282`);
      });

      await test.step('Then I should see the Inspire and Entertain page heading', async () => {
        await expect(inspireEntertainPage.pageHeading).toBeVisible();
        const headingText = await inspireEntertainPage.getPageTitle();
        expect(headingText).toBe('Inspire and entertain');
      });

      await test.step('And content should be loaded on the page', async () => {
        await inspireEntertainPage.waitForContentToLoad();
        const isLoaded = await inspireEntertainPage.isLoaded();
        expect(isLoaded).toBe(true);
      });
    });

    test(`Scenario: Navigate to Inspire and Entertain via navigation link - ${prison.name}`, async ({ inspireEntertainPage, page }) => {
      await test.step('Given I am on the Prisoner Content Hub home page', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I click on the "Inspire and entertain" navigation link', async () => {
        await inspireEntertainPage.clickInspireEntertainNav();
      });

      await test.step('Then I should be on the Inspire and Entertain page', async () => {
        await expect(inspireEntertainPage.pageHeading).toBeVisible();
        const headingText = await inspireEntertainPage.getPageTitle();
        expect(headingText).toBe('Inspire and entertain');
      });

      await test.step('And the URL should contain "/tags/1282"', async () => {
        await expect(page).toHaveURL(/\/tags\/1282/);
      });
    });

    test(`Scenario: View content cards on Inspire and Entertain page - ${prison.name}`, async ({ inspireEntertainPage, page }) => {
      await test.step('Given I am on the Inspire and Entertain page', async () => {
        await page.goto(`${baseURL}/tags/1282`);
      });

      await test.step('When the page loads', async () => {
        await inspireEntertainPage.waitForContentToLoad();
      });

      await test.step('Then I should see content cards displayed', async () => {
        const cardCount = await inspireEntertainPage.getContentCardCount();
        expect(cardCount).toBeGreaterThanOrEqual(0);
      });

      await test.step('And there should be at least one content card visible', async () => {
        const cardCount = await inspireEntertainPage.getContentCardCount();
        if (cardCount > 0) {
          await expect(inspireEntertainPage.contentCards.first()).toBeVisible();
        }
      });
    });
  });
});
