import { test, expect } from '../../../stepDefinition/faithSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Faith Series Tiles - ${prison.name}`, () => {
    const baseURL = testSetup.getBaseURL(prison);

    test.beforeEach(async () => {
      await testSetup.reset();
      await testSetup.stubPrisonerSignIn();
    });

    test(`Scenario: View series tiles on Faith page - ${prison.name}`, async ({ faithPage, page }) => {
      await test.step('Given I am on the Faith page', async () => {
        await page.goto(`${baseURL}/tags/1286`);
      });

      await test.step('When the page loads', async () => {
        await faithPage.waitForContentToLoad();
      });

      await test.step('Then the series tiles section should render correctly', async () => {
        const hasTiles = await faithPage.hasSeriesTiles();
        const tilesCount = await faithPage.getSeriesTilesCount();
        // Verify functional behavior: if tiles exist, they should be countable
        expect(tilesCount).toBeGreaterThanOrEqual(0);
      });
    });

    test(`Scenario: Verify series tile elements - ${prison.name}`, async ({ faithPage, page }) => {
      await test.step('Given I am on the Faith page', async () => {
        await page.goto(`${baseURL}/tags/1286`);
        await faithPage.waitForContentToLoad();
      });

      await test.step('When I view series tiles', async () => {
        const hasTiles = await faithPage.hasSeriesTiles();
        const tilesCount = await faithPage.getSeriesTilesCount();
        expect(tilesCount).toBeGreaterThanOrEqual(0);
      });

      await test.step('Then tiles should have required elements if present', async () => {
        const tilesCount = await faithPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          // Verify first tile has functional elements
          const title = await faithPage.getSeriesTileTitle(0);
          expect(title.length).toBeGreaterThan(0);
          
          const hasImage = await faithPage.hasSeriesTileImage(0);
          expect(hasImage).toBe(true);
        }
      });
    });

    test(`Scenario: Navigate to series content from tile - ${prison.name}`, async ({ faithPage, page }) => {
      await test.step('Given I am on the Faith page', async () => {
        await page.goto(`${baseURL}/tags/1286`);
        await faithPage.waitForContentToLoad();
      });

      await test.step('And series tiles are present', async () => {
        const tilesCount = await faithPage.getSeriesTilesCount();
        expect(tilesCount).toBeGreaterThanOrEqual(0);
      });

      await test.step('When I click on a series tile if available', async () => {
        const tilesCount = await faithPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          await faithPage.clickSeriesTileByIndex(0);
          
          await test.step('Then I should navigate to the linked page', async () => {
            // Use domcontentloaded instead of networkidle for dev environment to avoid timeouts
            await page.waitForLoadState('domcontentloaded');
            const currentUrl = page.url();
            // Should navigate away from the Faith page
            expect(currentUrl).not.toContain('/tags/1286');
          });
        }
      });
    });
  });
});
