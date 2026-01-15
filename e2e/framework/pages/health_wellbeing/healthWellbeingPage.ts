import { Page, Locator } from '@playwright/test';

export class HealthWellbeingPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly contentCards: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly navLink: Locator;
  readonly seriesTilesSection: Locator;
  readonly seriesTilesHeading: Locator;
  readonly seriesTiles: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageHeading = page.locator('h1#title.govuk-heading-l');
    this.contentCards = page.locator('a[data-featured-tile-id]');
    this.searchInput = page.getByTestId('search-input');
    this.searchButton = page.getByTestId('search-button');
    this.navLink = page.locator('a.moj-primary-navigation__link[href="/tags/1284"]');
    this.seriesTilesSection = page.locator('section#seriesTiles');
    this.seriesTilesHeading = this.seriesTilesSection.locator('h2');
    this.seriesTiles = page.locator('a[data-featured-tile-id]');
  }

  async goto() {
    await this.page.goto('/tags/1284');
  }

  async clickHealthWellbeingNav() {
    await this.navLink.click();
  }

  async waitForContentToLoad() {
    await this.pageHeading.waitFor({ state: 'visible' });
  }

  async isLoaded(): Promise<boolean> {
    return await this.pageHeading.isVisible();
  }

  async getPageTitle(): Promise<string> {
    return await this.pageHeading.textContent() || '';
  }

  // Content methods
  async getContentCardCount(): Promise<number> {
    return await this.contentCards.count();
  }

  async clickContentCard(index: number) {
    await this.contentCards.nth(index).click();
  }

  // Search methods
  async searchContent(query: string) {
    await this.searchInput.fill(query);
  }

  async submitSearch() {
    await this.searchButton.click();
  }

  async getSearchSuggestions() {
    return this.page.locator('.search-suggestions');
  }

  async searchWithSpecialCharacters(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500);
  }

  // Series tiles methods
  async hasSeriesTiles(): Promise<boolean> {
    const count = await this.seriesTiles.count();
    return count > 0;
  }

  async getSeriesTilesCount(): Promise<number> {
    return await this.seriesTiles.count();
  }

  async getSeriesTilesSectionHeading(): Promise<string> {
    return await this.seriesTilesHeading.textContent() || '';
  }

  async getSeriesTileByIndex(index: number): Promise<Locator> {
    return this.seriesTiles.nth(index);
  }

  async getSeriesTileById(tileId: string): Promise<Locator> {
    return this.page.locator(`a[data-featured-tile-id="${tileId}"]`);
  }

  async getSeriesTileTitle(index: number): Promise<string> {
    const tile = await this.getSeriesTileByIndex(index);
    const titleElement = tile.locator('h3.govuk-heading-m');
    return await titleElement.textContent() || '';
  }

  async clickSeriesTileByIndex(index: number) {
    const tile = await this.getSeriesTileByIndex(index);
    await tile.click();
  }

  async clickSeriesTileById(tileId: string) {
    const tile = await this.getSeriesTileById(tileId);
    await tile.click();
  }

  async isSeriesTileVisible(index: number): Promise<boolean> {
    const tile = await this.getSeriesTileByIndex(index);
    return await tile.isVisible();
  }

  async hasSeriesTileImage(index: number): Promise<boolean> {
    const tile = await this.getSeriesTileByIndex(index);
    const image = tile.locator('img');
    return await image.isVisible();
  }

  async hasSeriesTileSeriesTag(index: number): Promise<boolean> {
    const tile = await this.getSeriesTileByIndex(index);
    const seriesTag = tile.locator('strong.govuk-tag.govuk-tag--purple');
    const count = await seriesTag.count();
    return count > 0;
  }

  async getSeriesTileHref(index: number): Promise<string> {
    const tile = await this.getSeriesTileByIndex(index);
    return await tile.getAttribute('href') || '';
  }

  async getAllSeriesTileTitles(): Promise<string[]> {
    const count = await this.getSeriesTilesCount();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const title = await this.getSeriesTileTitle(i);
      titles.push(title);
    }
    return titles;
  }

  // Error handling methods
  async hasErrorMessage(): Promise<boolean> {
    const errorSelector = this.page.locator('.govuk-error-message, .error-summary');
    return await errorSelector.isVisible().catch(() => false);
  }

  async hasNoContentMessage(): Promise<boolean> {
    const noContentSelector = this.page.locator('text=/no content|nothing found/i');
    return await noContentSelector.isVisible().catch(() => false);
  }

  async isLayoutIntact(): Promise<boolean> {
    return await this.pageHeading.isVisible();
  }

  async isPageResponsive(): Promise<boolean> {
    return await this.page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return document.readyState === 'complete';
    });
  }

  async hasLoadingIndicator(): Promise<boolean> {
    const loadingSelector = this.page.locator('.loading, .spinner');
    return await loadingSelector.isVisible().catch(() => false);
  }

  async clickMultipleCardsRapidly(count: number) {
    for (let i = 0; i < count; i++) {
      await this.contentCards.nth(i).click({ timeout: 1000 }).catch(() => {});
    }
  }

  async hasJavaScriptErrors(): Promise<boolean> {
    const errors = await this.page.evaluate(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return (window as any).jsErrors || [];
    });
    return errors.length > 0;
  }

  async navigateBack() {
    await this.page.goBack();
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async isOnHealthWellbeingPage(): Promise<boolean> {
    return this.page.url().includes('/tags/1284');
  }
}
