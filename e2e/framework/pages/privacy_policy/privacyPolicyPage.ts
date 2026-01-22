import { Page, Locator } from '@playwright/test';

export class PrivacyPolicyPage {
  readonly page: Page;
  readonly footer: Locator;
  readonly privacyLink: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.footer = page.getByTestId('footer');
    this.privacyLink = page.getByTestId('footer-privacy-link');
    this.pageHeading = page.locator('h1#title');
  }

  async goto() {
    await this.page.goto('/');
  }

  async gotoHomePage() {
    await this.page.goto('/');
  }

  async gotoPrivacyPage() {
    await this.page.goto('/content/4856');
  }

  async scrollToFooter() {
    await this.footer.scrollIntoViewIfNeeded();
  }

  // Privacy link methods
  async isPrivacyLinkVisible(): Promise<boolean> {
    return await this.privacyLink.isVisible();
  }

  async getPrivacyLinkText(): Promise<string> {
    return await this.privacyLink.textContent() || '';
  }

  async getPrivacyLinkHref(): Promise<string> {
    return await this.privacyLink.getAttribute('href') || '';
  }

  async clickPrivacyLink() {
    await this.privacyLink.click();
  }

  async hasPrivacyLink(): Promise<boolean> {
    const count = await this.privacyLink.count();
    return count > 0;
  }

  // Page validation methods
  async isPageHeadingVisible(): Promise<boolean> {
    return await this.pageHeading.isVisible();
  }

  async getPageHeadingText(): Promise<string> {
    return await this.pageHeading.textContent() || '';
  }

  // Navigation methods
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async waitForNavigation() {
    await this.page.waitForLoadState('load');
  }
}
