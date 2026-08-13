import { Page, Locator } from '@playwright/test';

export class WelshTranslationsPage {
  readonly page: Page;
  readonly cymraegLink: Locator;
  readonly englishLink: Locator;
  readonly pageHeading: Locator;
  readonly feedbackWidget: Locator;
  readonly feedbackHeading: Locator;
  readonly likeButton: Locator;
  readonly dislikeButton: Locator;
  readonly feedbackForm: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // The Cymraeg link with Welsh language parameter - match by lang attribute and link text
    this.cymraegLink = page.locator('a[lang="cy"]').filter({ hasText: /Cymraeg/ });
    this.englishLink = page.locator('a[lang="en"]').filter({ hasText: /English/ });
    this.pageHeading = page.locator('h1');
    // Feedback elements
    this.feedbackWidget = page.getByTestId('feedback-widget');
    this.feedbackHeading = page.locator('.govuk-hub-feedback-heading');
    this.likeButton = page.getByTestId('feedback-like-button');
    this.dislikeButton = page.getByTestId('feedback-dislike-button');
    this.feedbackForm = page.getByTestId('feedback-form');
    this.submitButton = page.getByTestId('feedback-submit-button');
  }

  async goto() {
    await this.page.goto('/');
  }

  async gotoPage(path: string) {
    await this.page.goto(path);
  }

  async isCymraegLinkVisible(): Promise<boolean> {
    return await this.cymraegLink.isVisible();
  }

  async isEnglishLinkVisible(): Promise<boolean> {
    return await this.englishLink.isVisible();
  }

  async getCymraegLinkText(): Promise<string> {
    return await this.cymraegLink.textContent() || '';
  }

  async getCymraegLinkHref(): Promise<string> {
    return await this.cymraegLink.getAttribute('href') || '';
  }

  async getCymraegLinkLangAttribute(): Promise<string | null> {
    return await this.cymraegLink.getAttribute('lang');
  }

  async hasCymraegLinkClass(className: string): Promise<boolean> {
    const classAttribute = await this.cymraegLink.getAttribute('class');
    return classAttribute ? classAttribute.includes(className) : false;
  }

  async clickCymraegLink() {
    await this.cymraegLink.click();
  }

  async clickEnglishLink() {
    await this.englishLink.click();
  }

  async waitForPageToLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentLanguage(): Promise<string> {
    const url = new URL(this.page.url());
    return url.searchParams.get('lng') || 'en';
  }

  async isPageInWelsh(): Promise<boolean> {
    const lang = await this.getCurrentLanguage();
    return lang === 'cy';
  }

  async isPageInEnglish(): Promise<boolean> {
    const lang = await this.getCurrentLanguage();
    return lang === 'en';
  }

  async getCymraegLinkClasses(): Promise<string[]> {
    const classAttribute = await this.cymraegLink.getAttribute('class');
    return classAttribute ? classAttribute.split(' ').filter(c => c.length > 0) : [];
  }

  async isCymraegLinkActive(): Promise<boolean> {
    const classes = await this.getCymraegLinkClasses();
    return classes.includes('active');
  }

  async isEnglishLinkActive(): Promise<boolean> {
    const classAttribute = await this.englishLink.getAttribute('class');
    const classes = classAttribute ? classAttribute.split(' ').filter(c => c.length > 0) : [];
    return classes.includes('active');
  }

  async verifyWelshTranslationLink(): Promise<boolean> {
    const text = await this.getCymraegLinkText();
    const href = await this.getCymraegLinkHref();
    const lang = await this.getCymraegLinkLangAttribute();
    const hasGovukClass = await this.hasCymraegLinkClass('govuk-link');
    
    return text.trim() === 'Cymraeg' && 
           href.includes('lng=cy') && 
           lang === 'cy' && 
           hasGovukClass;
  }

  async navigateToWelshVersion() {
    await this.clickCymraegLink();
    await this.waitForPageToLoad();
  }

  async navigateToEnglishVersion() {
    await this.clickEnglishLink();
    await this.waitForPageToLoad();
  }

  // Helper method to check if text on page is in Welsh by looking for known Welsh translations
  async getTextContent(selector: string): Promise<string> {
    const element = this.page.locator(selector);
    return await element.textContent() || '';
  }

  async hasWelshContent(welshText: string): Promise<boolean> {
    const content = await this.page.textContent('body');
    return content ? content.includes(welshText) : false;
  }

  async hasEnglishContent(englishText: string): Promise<boolean> {
    const content = await this.page.textContent('body');
    return content ? content.includes(englishText) : false;
  }

  // Check common Welsh UI elements
  async checkWelshUIElements(): Promise<{ feedbackHeading?: boolean; contentLabel?: boolean }> {
    const feedbackHeading = await this.hasWelshContent('Rhowch adborth');
    const contentLabel = await this.hasWelshContent('Cynnwys');
    return { feedbackHeading, contentLabel };
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // Feedback-specific methods
  async isFeedbackWidgetVisible(): Promise<boolean> {
    try {
      return await this.feedbackWidget.isVisible({ timeout: 3000 });
    } catch {
      return false;
    }
  }

  async waitForFeedbackWidget() {
    await this.feedbackWidget.waitFor({ state: 'visible', timeout: 5000 });
  }

  async getFeedbackHeadingText(): Promise<string> {
    return await this.feedbackHeading.textContent() || '';
  }

  async hasFeedbackHeadingInWelsh(): Promise<boolean> {
    const heading = await this.getFeedbackHeadingText();
    // Check for Welsh feedback heading: "Rhowch adborth i ni" or "Dywedwch wrthym"
    return heading.includes('Rhowch adborth') || heading.includes('Dywedwch wrthym');
  }

  async hasFeedbackHeadingInEnglish(): Promise<boolean> {
    const heading = await this.getFeedbackHeadingText();
    return heading.includes('Give us feedback') || heading.includes('Tell us what you think');
  }

  async clickLikeButton() {
    await this.likeButton.click();
  }

  async clickDislikeButton() {
    await this.dislikeButton.click();
  }

  async isFeedbackFormVisible(): Promise<boolean> {
    // Wait a moment for the form to potentially appear
    await this.page.waitForTimeout(500);
    return await this.feedbackForm.isVisible();
  }

  async getFeedbackOptionText(index: number): Promise<string> {
    const options = this.page.locator('input[name="feedbackOption"]');
    const option = options.nth(index);
    const id = await option.getAttribute('id');
    if (!id) return '';
    const label = this.page.locator(`label[for="${id}"]`);
    return await label.textContent() || '';
  }

  async hasFeedbackOptionsInWelsh(): Promise<boolean> {
    // Check for Welsh feedback options like "Mi wnes i fwynhau hwn", "Roedd hwn o fudd i mi"
    const bodyText = await this.page.textContent('body');
    return bodyText ? (
      bodyText.includes('Mi wnes i fwynhau') || 
      bodyText.includes('Roedd hwn o fudd') ||
      bodyText.includes('Wnes i ddim mwynhau') ||
      bodyText.includes('Doedd hwn ddim yn berthnasol')
    ) : false;
  }

  async hasFeedbackOptionsInEnglish(): Promise<boolean> {
    const bodyText = await this.page.textContent('body');
    return bodyText ? (
      bodyText.includes('I enjoyed this') || 
      bodyText.includes('This was beneficial') ||
      bodyText.includes("I didn't enjoy") ||
      bodyText.includes("This wasn't relevant")
    ) : false;
  }

  async getSubmitButtonText(): Promise<string> {
    return await this.submitButton.textContent() || '';
  }

  async hasSubmitButtonInWelsh(): Promise<boolean> {
    const buttonText = await this.getSubmitButtonText();
    return buttonText.trim() === 'Anfon';
  }

  async hasSubmitButtonInEnglish(): Promise<boolean> {
    const buttonText = await this.getSubmitButtonText();
    return buttonText.trim() === 'Send';
  }
}
