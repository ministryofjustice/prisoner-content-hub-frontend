import { Page, Locator } from '@playwright/test';

export class MySentenceJourneyPage {
  readonly page: Page;
  readonly sentenceJourneyNavLink: Locator;
  readonly pageHeading: Locator;
  readonly contentCards: Locator;
  readonly contentTiles: Locator;
  readonly searchInput: Locator;
  readonly seriesTilesSection: Locator;
  readonly seriesTilesHeading: Locator;
  readonly seriesTiles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sentenceJourneyNavLink = page.locator('a.moj-primary-navigation__link[href="/tags/1285"]');
    this.pageHeading = page.locator('h1#title.govuk-heading-l');
    this.contentCards = page.locator('a[data-featured-tile-id], a[data-featured-id]');
    this.contentTiles = page.locator('.govuk-hub-contentTileSmall');
    this.searchInput = page.getByTestId('search-input');
    this.seriesTilesSection = page.locator('section#seriesTiles');
    this.seriesTilesHeading = page.locator('section#seriesTiles h2.govuk-heading-l');
    this.seriesTiles = page.locator('section#seriesTiles a[data-featured-tile-id]');
  }

  async goto() {
    await this.page.goto('/tags/1285');
  }

  async clickSentenceJourneyNav() {
    await this.sentenceJourneyNavLink.click();
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

  // Series Tiles specific methods
  async getSeriesTilesCount(): Promise<number> {
    return await this.seriesTiles.count();
  }

  async getSeriesTileByIndex(index: number): Promise<Locator> {
    return this.seriesTiles.nth(index);
  }

  getSeriesTileById(tileId: string): Locator {
    return this.page.locator(`section#seriesTiles a[data-featured-tile-id="${tileId}"]`);
  }

  async getSeriesTileTitle(index: number): Promise<string> {
    const tile = this.seriesTiles.nth(index);
    const heading = tile.locator('h3.govuk-heading-m');
    return await heading.textContent() || '';
  }

  async clickSeriesTileByIndex(index: number): Promise<void> {
    await this.seriesTiles.nth(index).click();
  }

  async clickSeriesTileById(tileId: string): Promise<void> {
    await this.getSeriesTileById(tileId).click();
  }

  async clickSeriesTileByTitle(title: string): Promise<void> {
    const tile = this.page.locator(`section#seriesTiles a[data-featured-tile-id] h3.govuk-heading-m:has-text("${title}")`);
    await tile.locator('..').locator('..').locator('..').click();
  }

  async isSeriesTileVisible(index: number): Promise<boolean> {
    return await this.seriesTiles.nth(index).isVisible();
  }

  async hasSeriesTileImage(index: number): Promise<boolean> {
    const tile = this.seriesTiles.nth(index);
    const image = tile.locator('img.tile-image');
    return await image.isVisible();
  }

  async hasSeriesTileSeriesTag(index: number): Promise<boolean> {
    const tile = this.seriesTiles.nth(index);
    const tag = tile.locator('strong.govuk-tag--purple');
    const count = await tag.count();
    return count > 0;
  }

  async getSeriesTileHref(index: number): Promise<string> {
    const tile = this.seriesTiles.nth(index);
    return await tile.getAttribute('href') || '';
  }

  async getAllSeriesTileTitles(): Promise<string[]> {
    const count = await this.getSeriesTilesCount();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      titles.push(await this.getSeriesTileTitle(i));
    }
    return titles;
  }

  async isSeriesTilesSectionVisible(): Promise<boolean> {
    return await this.seriesTilesSection.isVisible();
  }

  async getSeriesTilesSectionHeading(): Promise<string> {
    return await this.seriesTilesHeading.textContent() || '';
  }
}
