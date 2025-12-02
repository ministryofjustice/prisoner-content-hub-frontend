import { test, expect } from '../../stepDefinition/myPrisonSteps';

test.describe('Feature: My Prison Page', () => {
  
  test('Scenario: Navigate to My Prison page directly', async ({ myPrisonPage }) => {
    await test.step('Given I am on the Prisoner Content Hub', async () => {
      await myPrisonPage.page.goto('/');
    });

    await test.step('When I navigate directly to the My Prison page', async () => {
      await myPrisonPage.goto();
    });

    await test.step('Then I should see the My Prison page heading', async () => {
      await expect(myPrisonPage.pageHeading).toBeVisible();
    });
  });

  test('Scenario: Navigate to My Prison via navigation link', async ({ myPrisonPage, page }) => {
    await test.step('Given I am on the Prisoner Content Hub home page', async () => {
      await page.goto('/');
    });

    await test.step('When I click on the "My Prison" navigation link', async () => {
      await myPrisonPage.clickMyPrisonNav();
    });

    await test.step('Then I should be on the My Prison page', async () => {
      await expect(myPrisonPage.pageHeading).toBeVisible();
    });

    await test.step('And the URL should contain "/tags/1283"', async () => {
      await expect(page).toHaveURL(/\/tags\/1283/);
    });
  });

  test('Scenario: View content cards on My Prison page', async ({ myPrisonPage }) => {
    await test.step('Given I am on the My Prison page', async () => {
      await myPrisonPage.goto();
    });

    await test.step('When the page loads', async () => {
      await myPrisonPage.waitForContentToLoad();
    });

    await test.step('Then I should see content cards displayed', async () => {
      const cardCount = await myPrisonPage.getContentCardCount();
      expect(cardCount).toBeGreaterThan(0);
    });

    await test.step('And there should be at least one content card visible', async () => {
      await expect(myPrisonPage.contentCards.first()).toBeVisible();
    });
  });

  test('Scenario: Search for content on My Prison page', async ({ myPrisonPage, page }) => {
    await test.step('Given I am on the My Prison page', async () => {
      await myPrisonPage.goto();
    });

    await test.step('When I search for "health"', async () => {
      await myPrisonPage.searchContent('health');
    });

    await test.step('And I submit the search', async () => {
      await myPrisonPage.submitSearch();
    });

    await test.step('Then I should be on the search results page', async () => {
      await expect(page).toHaveURL(/\/search/);
    });

    await test.step('And search results heading should be visible', async () => {
      await page.waitForLoadState('networkidle');
      const searchHeading = page.locator('h1#title.govuk-heading-l');
      await expect(searchHeading).toBeVisible();
      await expect(searchHeading).toHaveText('Search');
    });
  });

  test('Scenario: Click on a content card', async ({ myPrisonPage, page }) => {
    await test.step('Given I am on the My Prison page', async () => {
      await myPrisonPage.goto();
    });

    await test.step('And content cards are loaded', async () => {
      await myPrisonPage.waitForContentToLoad();
    });

    await test.step('When I click on the first content card', async () => {
      await myPrisonPage.clickContentCard(0);
    });

    await test.step('Then I should navigate to the content detail page', async () => {
      await page.waitForLoadState('networkidle');
    });
  });
});
