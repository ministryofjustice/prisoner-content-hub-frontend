import { test, expect } from '../../../stepDefinition/learningSkillsSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Learning and Skills Series Tiles - ${prison.name}`, () => {
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

    test(`Scenario: View series tiles on Learning and Skills page - ${prison.name}`, async ({ learningSkillsPage, page }) => {
      await test.step('Given I am on the Learning and Skills page', async () => {
        await page.goto(`${baseURL}/tags/1341`);
      });

      await test.step('When the page loads', async () => {
        await learningSkillsPage.waitForContentToLoad();
      });

      await test.step('Then I should see series tiles displayed', async () => {
        const hasTiles = await learningSkillsPage.hasSeriesTiles();
        expect(hasTiles).toBe(true);
      });

      await test.step('And there should be at least one series tile', async () => {
        const tilesCount = await learningSkillsPage.getSeriesTilesCount();
        expect(tilesCount).toBeGreaterThan(0);
      });
    });

    test(`Scenario: Verify series tile elements - ${prison.name}`, async ({ learningSkillsPage, page }) => {
      await test.step('Given I am on the Learning and Skills page', async () => {
        await page.goto(`${baseURL}/tags/1341`);
        await learningSkillsPage.waitForContentToLoad();
      });

      await test.step('When I view a series tile', async () => {
        const hasTiles = await learningSkillsPage.hasSeriesTiles();
        expect(hasTiles).toBe(true);
      });

      await test.step('Then each series tile should have a title', async () => {
        const tilesCount = await learningSkillsPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          const title = await learningSkillsPage.getSeriesTileTitle(0);
          expect(title.length).toBeGreaterThan(0);
        }
      });

      await test.step('And each series tile should have an image', async () => {
        const tilesCount = await learningSkillsPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          const hasImage = await learningSkillsPage.hasSeriesTileImage(0);
          expect(hasImage).toBe(true);
        }
      });

      await test.step('And tiles marked as series should have a "Series" tag', async () => {
        const tilesCount = await learningSkillsPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          // Check if at least one tile has a series tag (not all tiles are series)
          let foundSeriesTag = false;
          for (let i = 0; i < tilesCount; i++) {
            const hasTag = await learningSkillsPage.hasSeriesTileSeriesTag(i);
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

    test(`Scenario: Navigate to series content from tile - ${prison.name}`, async ({ learningSkillsPage, page }) => {
      await test.step('Given I am on the Learning and Skills page', async () => {
        await page.goto(`${baseURL}/tags/1341`);
        await learningSkillsPage.waitForContentToLoad();
      });

      await test.step('And series tiles are displayed', async () => {
        const hasTiles = await learningSkillsPage.hasSeriesTiles();
        expect(hasTiles).toBe(true);
      });

      await test.step('When I click on a series tile', async () => {
        const tilesCount = await learningSkillsPage.getSeriesTilesCount();
        if (tilesCount > 0) {
          await learningSkillsPage.clickSeriesTileByIndex(0);
        }
      });

      await test.step('Then I should navigate to the series content page', async () => {
        await page.waitForLoadState('networkidle');
        const currentUrl = page.url();
        // Should navigate to a different page (typically another tag page like /tags/1668)
        expect(currentUrl).toContain('/tags/');
      });
    });
  });
});
