import { Page, Locator } from '@playwright/test';

export class MyPrisonPage {
  readonly page: Page;
  readonly myPrisonNavLink: Locator;
  readonly pageHeading: Locator;
  readonly contentCards: Locator;
  readonly contentTiles: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myPrisonNavLink = page.locator('a.moj-primary-navigation__link[href="/tags/1283"]');
    this.pageHeading = page.locator('h1#title.govuk-heading-l');
    // Content can appear as tiles with data-featured-tile-id or in search results
    this.contentCards = page.locator('a[data-featured-tile-id], a[data-featured-id]');
    this.contentTiles = page.locator('.govuk-hub-contentTileSmall');
    this.searchInput = page.locator('input#search');
  }

  async goto() {
    await this.page.goto('/tags/1283');
  }

  async clickMyPrisonNav() {
    await this.myPrisonNavLink.click();
  }

  async isLoaded(): Promise<boolean> {
    return await this.pageHeading.isVisible();
  }

  async getPageTitle(): Promise<string> {
    return await this.pageHeading.textContent() || '';
  }

  async getContentCardCount(): Promise<number> {
    return await this.contentCards.count();
  }

  async searchContent(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    // Wait a moment for typeahead suggestions to appear
    await this.page.waitForTimeout(500);
  }

  async submitSearch() {
    await this.searchInput.press('Enter');
    // Wait for navigation to search results page
    await this.page.waitForLoadState('networkidle');
  }

  getSearchSuggestions(): Locator {
    return this.page.locator('.tt-suggestion');
  }

  getContentCard(index: number): Locator {
    return this.contentCards.nth(index);
  }

  async clickContentCard(index: number) {
    await this.getContentCard(index).click();
  }

  async waitForContentToLoad() {
    // Wait for either content cards or page sections to be visible
    await Promise.race([
      this.contentCards.first().waitFor({ state: 'visible', timeout: 10000 }),
      this.page.locator('section').first().waitFor({ state: 'visible', timeout: 10000 })
    ]);
  }
}
