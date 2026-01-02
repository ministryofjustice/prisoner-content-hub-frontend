import { test, expect } from '../../../stepDefinition/healthWellbeingSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Health and Wellbeing Series Tiles - ${prison.name}`, () => {
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

    test(`Scenario: View series tiles on Health and Wellbeing page - ${prison.name}`, async ({ healthWellbeingPage, page }) => {
      await test.step('Given I am on the Health and Wellbeing page', async () => {
        await page.goto(baseURL);
        await page.goto(`${baseURL}/tags/1284`);
      });

      await test.step('When the page loads', async () => {
        await healthWellbeingPage.waitForContentToLoad();
      });

      await test.step('Then I should see series tiles displayed', async () => {
        const hasTiles = await healthWellbeingPage.hasSeriesTiles();
        expect(hasTiles).toBe(true);
      });

      await test.step('And there should be at least one series tile', async () => {
        const tilesCount = await healthWellbeingPage.getSeriesTilesCount();
        expect(tilesCount).toBeGreaterThan(0);
      });
    });

    test(`Scenario: Verify series tile elements - ${prison.name}`, async ({ healthWellbeingPage, page }) => {
      await test.step('Given I am on the Health and Wellbeing page', async () => {
        await page.goto(baseURL);
        await page.goto(`${baseURL}/tags/1284`);
        await healthWellbeingPage.waitForContentToLoad();
      });

      await test.step('When I view a series tile', async () => {
        const hasTiles = await healthWellbeingPage.hasSeriesTiles();
        expect(hasTiles).toBe(true);
      });

      await test.step('Then each series tile should have a title', async () => {
        const tilesCount = await healthWellbeingPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          const title = await healthWellbeingPage.getSeriesTileTitle(0);
          expect(title.length).toBeGreaterThan(0);
        }
      });

      await test.step('And each series tile should have an image', async () => {
        const tilesCount = await healthWellbeingPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          const hasImage = await healthWellbeingPage.hasSeriesTileImage(0);
          expect(hasImage).toBe(true);
        }
      });

      await test.step('And tiles marked as series should have a "Series" tag', async () => {
        const tilesCount = await healthWellbeingPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          // Check if at least one tile has a series tag (not all tiles are series)
          let foundSeriesTag = false;
          for (let i = 0; i < tilesCount; i++) {
            const hasTag = await healthWellbeingPage.hasSeriesTileSeriesTag(i);
            if (hasTag) {
              foundSeriesTag = true;
              break;
            }
          }
          // At least one tile should have a series tag, but not all tiles need to
          expect(foundSeriesTag).toBe(true);
        }
      });
    });

    test(`Scenario: Navigate to series content from tile - ${prison.name}`, async ({ healthWellbeingPage, page }) => {
      await test.step('Given I am on the Health and Wellbeing page', async () => {
        await page.goto(baseURL);
        await page.goto(`${baseURL}/tags/1284`);
        await healthWellbeingPage.waitForContentToLoad();
      });

      await test.step('And series tiles are displayed', async () => {
        const hasTiles = await healthWellbeingPage.hasSeriesTiles();
        expect(hasTiles).toBe(true);
      });

      await test.step('When I click on a series tile', async () => {
        const tilesCount = await healthWellbeingPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          await healthWellbeingPage.clickSeriesTileByIndex(0);
        }
      });

      await test.step('Then I should navigate to the series content page', async () => {
        await page.waitForLoadState('networkidle');
        const currentUrl = page.url();
        // Should navigate away from the Health and Wellbeing page
        expect(currentUrl).not.toContain('/tags/1284');
      });
    });
  });
});
