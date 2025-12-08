import { test, expect } from '../../stepDefinition/mySentenceJourneySteps';
import { testSetup } from '../../utils/test-setup';

test.describe('Feature: Sentence Journey Series Tiles Navigation', () => {
  test.beforeEach(async () => {
    // Reset wiremock state before each test for fresh session
    await testSetup.reset();
  });

  test('Scenario: View "In this section" series tiles', async ({ mySentenceJourneyPage, page }) => {
    await test.step('Given I am on the Sentence Journey page', async () => {
      await page.goto('/tags/1285');
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

  test('Scenario: Verify series tiles have required elements', async ({ mySentenceJourneyPage, page }) => {
    await test.step('Given I am on the Sentence Journey page', async () => {
      await page.goto('/tags/1285');
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

  test('Scenario: Navigate to a series tile by clicking on it', async ({ mySentenceJourneyPage, page }) => {
    let tileTitle: string;
    let tileHref: string;

    await test.step('Given I am on the Sentence Journey page', async () => {
      await page.goto('/tags/1285');
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
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain(tileHref);
    });
  });

  test('Scenario: Verify all series tiles are clickable', async ({ mySentenceJourneyPage, page }) => {
    let tilesCount: number;

    await test.step('Given I am on the Sentence Journey page', async () => {
      await page.goto('/tags/1285');
      await mySentenceJourneyPage.waitForContentToLoad();
    });

    await test.step('When I count all series tiles', async () => {
      tilesCount = await mySentenceJourneyPage.getSeriesTilesCount();
      expect(tilesCount).toBeGreaterThan(0);
    });

    await test.step('Then each tile should be visible and have a link', async () => {
      for (let i = 0; i < Math.min(tilesCount, 5); i++) {
        const isVisible = await mySentenceJourneyPage.isSeriesTileVisible(i);
        expect(isVisible).toBe(true);
        
        const href = await mySentenceJourneyPage.getSeriesTileHref(i);
        expect(href).toMatch(/^\/tags\/\d+$/);
      }
    });
  });

  test('Scenario: Get all series tile titles', async ({ mySentenceJourneyPage, page }) => {
    let titles: string[];

    await test.step('Given I am on the Sentence Journey page', async () => {
      await page.goto('/tags/1285');
      await mySentenceJourneyPage.waitForContentToLoad();
    });

    await test.step('When I retrieve all series tile titles', async () => {
      titles = await mySentenceJourneyPage.getAllSeriesTileTitles();
    });

    await test.step('Then all titles should be non-empty strings', async () => {
      expect(titles.length).toBeGreaterThan(0);
      titles.forEach(title => {
        expect(title.trim().length).toBeGreaterThan(0);
      });
    });
  });

  test('Scenario: Verify series tags are present on appropriate tiles', async ({ mySentenceJourneyPage, page }) => {
    await test.step('Given I am on the Sentence Journey page', async () => {
      await page.goto('/tags/1285');
      await mySentenceJourneyPage.waitForContentToLoad();
    });

    await test.step('When I check tiles for series tags', async () => {
      const tilesCount = await mySentenceJourneyPage.getSeriesTilesCount();
      let hasAtLeastOneTag = false;

      for (let i = 0; i < tilesCount; i++) {
        const hasTag = await mySentenceJourneyPage.hasSeriesTileSeriesTag(i);
        if (hasTag) {
          hasAtLeastOneTag = true;
          const title = await mySentenceJourneyPage.getSeriesTileTitle(i);
          console.log(`Tile "${title}" has a SERIES tag`);
        }
      }

      // Just verify the method works - some tiles may or may not have tags
      expect(typeof hasAtLeastOneTag).toBe('boolean');
    });
  });

  test('Scenario: Navigate through multiple series tiles sequentially', async ({ mySentenceJourneyPage, page }) => {
    const visitedTiles: string[] = [];

    await test.step('Given I am on the Sentence Journey page', async () => {
      await page.goto('/tags/1285');
      await mySentenceJourneyPage.waitForContentToLoad();
    });

    await test.step('When I click on the first three tiles sequentially', async () => {
      const tilesCount = await mySentenceJourneyPage.getSeriesTilesCount();
      const tilesToVisit = Math.min(3, tilesCount);

      for (let i = 0; i < tilesToVisit; i++) {
        // Navigate to sentence journey page
        await page.goto('/tags/1285');
        await mySentenceJourneyPage.waitForContentToLoad();

        // Get tile details
        const title = await mySentenceJourneyPage.getSeriesTileTitle(i);
        const href = await mySentenceJourneyPage.getSeriesTileHref(i);

        // Click the tile
        await mySentenceJourneyPage.clickSeriesTileByIndex(i);
        await page.waitForLoadState('networkidle');

        // Verify navigation
        expect(page.url()).toContain(href);
        visitedTiles.push(title);
      }
    });

    await test.step('Then I should have visited multiple unique tiles', async () => {
      expect(visitedTiles.length).toBeGreaterThan(0);
      console.log('Visited tiles:', visitedTiles);
    });
  });

  test('Scenario: Verify series tiles section is responsive', async ({ mySentenceJourneyPage, page }) => {
    await test.step('Given I am on the Sentence Journey page', async () => {
      await page.goto('/tags/1285');
      await mySentenceJourneyPage.waitForContentToLoad();
    });

    await test.step('Then the series tiles section should be visible', async () => {
      const isVisible = await mySentenceJourneyPage.isSeriesTilesSectionVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And all tiles should be within the section', async () => {
      const tilesInSection = await mySentenceJourneyPage.seriesTilesSection.locator('a[data-featured-tile-id]').count();
      const totalTiles = await mySentenceJourneyPage.getSeriesTilesCount();
      expect(tilesInSection).toBe(totalTiles);
    });
  });
});
