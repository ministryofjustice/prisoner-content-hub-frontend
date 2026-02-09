import { test, expect } from '../../../stepDefinition/mySentenceJourneySteps';
import { PRISONS } from '../../../utils/prisons';
import { testSetup } from '../../../utils/test-setup';

// Test the Sentence Journey Series Tiles across all prison environments
for (const prison of PRISONS) {
  test.describe(`Feature: Sentence Journey Series Tiles Navigation - ${prison.name}`, () => {
    const baseURL = testSetup.getBaseURL(prison);

    test.beforeEach(async () => {
      await testSetup.reset();
      await testSetup.stubPrisonerSignIn();
    });

    test(`Scenario: View "In this section" series tiles at ${prison.name}`, async ({ mySentenceJourneyPage, page }) => {
      await test.step(`Given I am on the ${prison.name} Sentence Journey page`, async () => {
        await page.goto(`${baseURL}/tags/1285`);
        await mySentenceJourneyPage.waitForContentToLoad();
      });

      await test.step('Then I should see the "In this section" heading', async () => {
        await expect(mySentenceJourneyPage.seriesTilesSection).toBeVisible();
        const heading = await mySentenceJourneyPage.getSeriesTilesSectionHeading();
        expect(heading).toContain('In this section');
      });

      await test.step('And I should see multiple series tiles', async () => {
        const tilesCount = await mySentenceJourneyPage.getSeriesTilesCount();
        expect(tilesCount).toBeGreaterThan(0);
      });
    });

    test(`Scenario: Verify series tiles have required elements at ${prison.name}`, async ({ mySentenceJourneyPage, page }) => {
      await test.step(`Given I am on the ${prison.name} Sentence Journey page`, async () => {
        await page.goto(`${baseURL}/tags/1285`);
        await mySentenceJourneyPage.waitForContentToLoad();
      });

      await test.step('When I check the first series tile', async () => {
        const isVisible = await mySentenceJourneyPage.isSeriesTileVisible(0);
        expect(isVisible).toBe(true);
      });

      await test.step('Then it should have a title', async () => {
        const title = await mySentenceJourneyPage.getSeriesTileTitle(0);
        expect(title.length).toBeGreaterThan(0);
      });

      await test.step('And it should have an image', async () => {
        const hasImage = await mySentenceJourneyPage.hasSeriesTileImage(0);
        expect(hasImage).toBe(true);
      });

      await test.step('And it should have a valid href', async () => {
        const href = await mySentenceJourneyPage.getSeriesTileHref(0);
        expect(href).toMatch(/^\/tags\/\d+$/);
      });
    });

    test(`Scenario: Navigate to a series tile by clicking on it at ${prison.name}`, async ({ mySentenceJourneyPage, page }) => {
      let tileTitle: string;
      let tileHref: string;

      await test.step(`Given I am on the ${prison.name} Sentence Journey page`, async () => {
        await page.goto(`${baseURL}/tags/1285`);
        await mySentenceJourneyPage.waitForContentToLoad();
      });

      await test.step('And I note the first tile details', async () => {
        tileTitle = await mySentenceJourneyPage.getSeriesTileTitle(0);
        tileHref = await mySentenceJourneyPage.getSeriesTileHref(0);
        expect(tileTitle.length).toBeGreaterThan(0);
        expect(tileHref.length).toBeGreaterThan(0);
      });

      await test.step('When I click on the first series tile', async () => {
        await mySentenceJourneyPage.clickSeriesTileByIndex(0);
      });

      await test.step('Then I should navigate to the tile\'s page', async () => {
        // Use domcontentloaded instead of networkidle for dev environment to avoid timeouts
        await page.waitForLoadState('domcontentloaded');
        expect(page.url()).toContain(tileHref);
      });
    });
  });
}
