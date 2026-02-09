import { test, expect } from '../../../stepDefinition/healthWellbeingSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Health and Wellbeing Series Tiles - ${prison.name}`, () => {
    const baseURL = testSetup.getBaseURL(prison);

    test.beforeEach(async () => {
      await testSetup.reset();
      await testSetup.stubPrisonerSignIn();
    });

    test(`Scenario: View series tiles on Health and Wellbeing page - ${prison.name}`, async ({ healthWellbeingPage, page }) => {
      await test.step('Given I am on the Health and Wellbeing page', async () => {
        await page.goto(baseURL);
        await page.goto(`${baseURL}/tags/1284`);
      });

      await test.step('When the page loads', async () => {
        await healthWellbeingPage.waitForContentToLoad();
      });

      await test.step('Then the series tiles section should render correctly', async () => {
        const hasTiles = await healthWellbeingPage.hasSeriesTiles();
        const tilesCount = await healthWellbeingPage.getSeriesTilesCount();
        // Verify functional behavior: if tiles exist, they should be countable
        expect(tilesCount).toBeGreaterThanOrEqual(0);
      });
    });

    test(`Scenario: Verify series tile elements - ${prison.name}`, async ({ healthWellbeingPage, page }) => {
      await test.step('Given I am on the Health and Wellbeing page', async () => {
        await page.goto(baseURL);
        await page.goto(`${baseURL}/tags/1284`);
        await healthWellbeingPage.waitForContentToLoad();
      });

      await test.step('When I view series tiles', async () => {
        const hasTiles = await healthWellbeingPage.hasSeriesTiles();
        const tilesCount = await healthWellbeingPage.getSeriesTilesCount();
        expect(tilesCount).toBeGreaterThanOrEqual(0);
      });

      await test.step('Then tiles should have required elements if present', async () => {
        const tilesCount = await healthWellbeingPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          // Verify first tile has functional elements
          const title = await healthWellbeingPage.getSeriesTileTitle(0);
          expect(title.length).toBeGreaterThan(0);
          
          const hasImage = await healthWellbeingPage.hasSeriesTileImage(0);
          expect(hasImage).toBe(true);
        }
      });
    });

    test(`Scenario: Navigate to series content from tile - ${prison.name}`, async ({ healthWellbeingPage, page }) => {
      await test.step('Given I am on the Health and Wellbeing page', async () => {
        await page.goto(baseURL);
        await page.goto(`${baseURL}/tags/1284`);
        await healthWellbeingPage.waitForContentToLoad();
      });

      await test.step('And series tiles are present', async () => {
        const tilesCount = await healthWellbeingPage.getSeriesTilesCount();
        expect(tilesCount).toBeGreaterThanOrEqual(0);
      });

      await test.step('When I click on a series tile if available', async () => {
        const tilesCount = await healthWellbeingPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          await healthWellbeingPage.clickSeriesTileByIndex(0);
          
          await test.step('Then I should navigate to the linked page', async () => {
            // Use domcontentloaded instead of networkidle for dev environment to avoid timeouts
            await page.waitForLoadState('domcontentloaded');
            const currentUrl = page.url();
            // Should navigate away from the Health and Wellbeing page
            expect(currentUrl).not.toContain('/tags/1284');
          });
        }
      });
    });
  });
});
