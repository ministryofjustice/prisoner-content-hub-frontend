import { Page, Locator } from '@playwright/test';

export class BrowseTopicsPage {
  readonly page: Page;
  readonly footerSection: Locator;
  readonly footerHeading: Locator;
  readonly footerLinks: Locator;
  readonly footerList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footerSection = page.locator('.govuk-footer__section').filter({ hasText: 'Browse all topics' });
    this.footerHeading = page.locator('.govuk-footer__heading', { hasText: 'Browse all topics' });
    this.footerLinks = this.footerSection.locator('a.govuk-footer__link');
    this.footerList = this.footerSection.locator('.govuk-footer__list');
  }

  async goto() {
    await this.page.goto('/');
  }

  async gotoHomePage() {
    await this.page.goto('/');
  }

  async scrollToFooter() {
    await this.footerSection.scrollIntoViewIfNeeded();
  }

  async isFooterSectionVisible(): Promise<boolean> {
    return await this.footerSection.isVisible();
  }

  async isFooterHeadingVisible(): Promise<boolean> {
    return await this.footerHeading.isVisible();
  }

  async getFooterHeadingText(): Promise<string> {
    return await this.footerHeading.textContent() || '';
  }

  // Footer links methods
  async getFooterLinksCount(): Promise<number> {
    return await this.footerLinks.count();
  }

  async getFooterLinkByIndex(index: number): Promise<Locator> {
    return this.footerLinks.nth(index);
  }

  async getFooterLinkText(index: number): Promise<string> {
    const link = await this.getFooterLinkByIndex(index);
    return await link.textContent() || '';
  }

  async getFooterLinkHref(index: number): Promise<string> {
    const link = await this.getFooterLinkByIndex(index);
    return await link.getAttribute('href') || '';
  }

  async clickFooterLink(index: number) {
    const link = await this.getFooterLinkByIndex(index);
    await link.click();
  }

  async clickFooterLinkByText(text: string) {
    await this.footerLinks.filter({ hasText: text }).first().click();
  }

  async isFooterLinkVisible(index: number): Promise<boolean> {
    const link = await this.getFooterLinkByIndex(index);
    return await link.isVisible();
  }

  async getAllFooterLinkTexts(): Promise<string[]> {
    const count = await this.getFooterLinksCount();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.getFooterLinkText(i);
      texts.push(text);
    }
    return texts;
  }

  async getAllFooterLinkHrefs(): Promise<string[]> {
    const count = await this.getFooterLinksCount();
    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await this.getFooterLinkHref(i);
      hrefs.push(href);
    }
    return hrefs;
  }

  async hasFooterLinks(): Promise<boolean> {
    const count = await this.getFooterLinksCount();
    return count > 0;
  }

  // Validation methods
  async areAllFooterLinksValid(): Promise<boolean> {
    const count = await this.getFooterLinksCount();
    for (let i = 0; i < count; i++) {
      const href = await this.getFooterLinkHref(i);
      if (!href || href === '#' || href === '') {
        return false;
      }
    }
    return true;
  }

  async doAllFooterLinksStartWith(prefix: string): Promise<boolean> {
    const hrefs = await this.getAllFooterLinkHrefs();
    return hrefs.every(href => href.startsWith(prefix));
  }

  // Navigation
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }
}
