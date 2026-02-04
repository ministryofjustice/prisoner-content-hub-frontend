import { test, expect } from '../../../stepDefinition/newsEventsSteps';
import { PRISONS } from '../../../utils/prisons';
import { testSetup } from '../../../utils/test-setup';

// Test the News and Events Series Tiles across all prison environments
for (const prison of PRISONS) {
  test.describe(`Feature: News and Events Series Tiles Navigation - ${prison.name}`, () => {
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

    test(`Scenario: View "In this section" series tiles at ${prison.name}`, async ({ newsEventsPage, page }) => {
      await test.step(`Given I am on the ${prison.name} News and Events page`, async () => {
        await page.goto(`${baseURL}/tags/644`);
        await newsEventsPage.waitForContentToLoad();
      });

      await test.step('Then I should see the "In this section" heading', async () => {
        await expect(newsEventsPage.seriesTilesSection).toBeVisible();
        const heading = await newsEventsPage.getSeriesTilesSectionHeading();
        expect(heading).toContain('In this section');
      });

      await test.step('And I should see multiple series tiles', async () => {
        const tilesCount = await newsEventsPage.getSeriesTilesCount();
        expect(tilesCount).toBeGreaterThan(0);
      });
    });

    test(`Scenario: Verify series tiles have required elements at ${prison.name}`, async ({ newsEventsPage, page }) => {
      await test.step(`Given I am on the ${prison.name} News and Events page`, async () => {
        await page.goto(`${baseURL}/tags/644`);
        await newsEventsPage.waitForContentToLoad();
      });

      await test.step('When I check the first series tile', async () => {
        const isVisible = await newsEventsPage.isSeriesTileVisible(0);
        expect(isVisible).toBe(true);
      });

      await test.step('Then it should have a title', async () => {
        const title = await newsEventsPage.getSeriesTileTitle(0);
        expect(title.length).toBeGreaterThan(0);
      });

      await test.step('And it should have an image', async () => {
        const hasImage = await newsEventsPage.hasSeriesTileImage(0);
        expect(hasImage).toBe(true);
      });

      await test.step('And it should have a valid href', async () => {
        const href = await newsEventsPage.getSeriesTileHref(0);
        expect(href).toMatch(/^\/tags\/\d+$/);
      });
    });

    test(`Scenario: Navigate to a series tile by clicking on it at ${prison.name}`, async ({ newsEventsPage, page }) => {
      let tileTitle: string;
      let tileHref: string;

      await test.step(`Given I am on the ${prison.name} News and Events page`, async () => {
        await page.goto(`${baseURL}/tags/644`);
        await newsEventsPage.waitForContentToLoad();
      });

      await test.step('And I note the first tile details', async () => {
        tileTitle = await newsEventsPage.getSeriesTileTitle(0);
        tileHref = await newsEventsPage.getSeriesTileHref(0);
        expect(tileTitle.length).toBeGreaterThan(0);
        expect(tileHref.length).toBeGreaterThan(0);
      });

      await test.step('When I click on the first series tile', async () => {
        await newsEventsPage.clickSeriesTileByIndex(0);
      });

      await test.step('Then I should navigate to the tile\'s page', async () => {
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(tileHref);
      });
    });
  });
}
