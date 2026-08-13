import { Page, Locator } from '@playwright/test';

export class FeedbackPage {
  readonly page: Page;
  readonly feedbackWidget: Locator;
  readonly likeButton: Locator;
  readonly dislikeButton: Locator;
  readonly feedbackForm: Locator;
  readonly feedbackText: Locator;
  readonly feedbackConfirmation: Locator;
  readonly feedbackMoreInfo: Locator;
  readonly likeOptions: Locator;
  readonly dislikeOptions: Locator;
  readonly submitButton: Locator;
  readonly feedbackHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.feedbackWidget = page.getByTestId('feedback-widget');
    this.likeButton = page.getByTestId('feedback-like-button');
    this.dislikeButton = page.getByTestId('feedback-dislike-button');
    this.feedbackForm = page.getByTestId('feedback-form');
    this.feedbackText = page.getByTestId('feedback-text');
    this.feedbackConfirmation = page.getByTestId('feedback-confirmation');
    this.feedbackMoreInfo = page.getByTestId('feedback-more-info');
    this.likeOptions = page.getByTestId('feedback-like-options');
    this.dislikeOptions = page.getByTestId('feedback-dislike-options');
    this.submitButton = page.getByTestId('feedback-submit-button');
    this.feedbackHeading = page.locator('.govuk-hub-feedback-heading');
  }

  // Navigation methods
  async gotoContentPage() {
    // Navigate to a page that has feedback widget (e.g., a video page)
    await this.page.goto('/tags/1284');
  }

  async waitForFeedbackWidget() {
    await this.feedbackWidget.waitFor({ state: 'visible', timeout: 5000 });
    // Ensure JavaScript has loaded and initialized
    await this.page.waitForFunction('typeof window._feedback !== "undefined"', { timeout: 5000 });
  }

  // Widget visibility methods
  async isFeedbackWidgetVisible(): Promise<boolean> {
    return await this.feedbackWidget.isVisible();
  }

  async isLikeButtonVisible(): Promise<boolean> {
    return await this.likeButton.isVisible();
  }

  async isDislikeButtonVisible(): Promise<boolean> {
    return await this.dislikeButton.isVisible();
  }

  // Button attribute methods
  async getLikeButtonAriaLabel(): Promise<string> {
    return await this.likeButton.getAttribute('aria-label') || '';
  }

  async getLikeButtonValue(): Promise<string> {
    return await this.likeButton.getAttribute('value') || '';
  }

  async getDislikeButtonAriaLabel(): Promise<string> {
    return await this.dislikeButton.getAttribute('aria-label') || '';
  }

  async getDislikeButtonValue(): Promise<string> {
    return await this.dislikeButton.getAttribute('value') || '';
  }

  async getLikeButtonClass(): Promise<string> {
    return await this.likeButton.getAttribute('class') || '';
  }

  async getDislikeButtonClass(): Promise<string> {
    return await this.dislikeButton.getAttribute('class') || '';
  }

  async hasLikeButtonClass(className: string): Promise<boolean> {
    const classes = await this.getLikeButtonClass();
    return classes.includes(className);
  }

  async hasDislikeButtonClass(className: string): Promise<boolean> {
    const classes = await this.getDislikeButtonClass();
    return classes.includes(className);
  }

  // Interaction methods
  async clickLikeButton() {
    await this.likeButton.click();
    // Wait for the is-selected class to be applied
    await this.page.waitForFunction(
      'document.querySelector("[data-testid=\\"feedback-like-button\\"]")?.classList.contains("is-selected")',
      { timeout: 3000 }
    );
  }

  async clickDislikeButton() {
    await this.dislikeButton.click();
    // Wait for the is-selected class to be applied
    await this.page.waitForFunction(
      'document.querySelector("[data-testid=\\"feedback-dislike-button\\"]")?.classList.contains("is-selected")',
      { timeout: 3000 }
    );
  }

  async waitForFeedbackForm() {
    await this.feedbackForm.waitFor({ state: 'visible', timeout: 3000 });
  }

  // Form visibility methods
  async isFeedbackFormVisible(): Promise<boolean> {
    const classes = await this.feedbackForm.getAttribute('class') || '';
    return !classes.includes('govuk-u-hidden') && await this.feedbackForm.isVisible();
  }

  async getFeedbackText(): Promise<string> {
    return await this.feedbackText.textContent() || '';
  }

  async areLikeOptionsVisible(): Promise<boolean> {
    // Check if the container is visible and the nested .feedbackOption-LIKE is not hidden
    const isVisible = await this.likeOptions.isVisible();
    if (!isVisible) return false;
    const nestedElement = this.likeOptions.locator('.feedbackOption-LIKE');
    const classes = await nestedElement.getAttribute('class') || '';
    return !classes.includes('govuk-u-hidden');
  }

  async areDislikeOptionsVisible(): Promise<boolean> {
    // Check if the container is visible and the nested .feedbackOption-DISLIKE is not hidden
    const isVisible = await this.dislikeOptions.isVisible();
    if (!isVisible) return false;
    const nestedElement = this.dislikeOptions.locator('.feedbackOption-DISLIKE');
    const classes = await nestedElement.getAttribute('class') || '';
    return !classes.includes('govuk-u-hidden');
  }

  // Feedback submission methods
  async selectFirstFeedbackOption() {
    const firstRadio = this.feedbackForm.locator('input[type="radio"]').first();
    await firstRadio.check();
  }

  async submitFeedbackForm() {
    // Wait for the feedback API call to complete
    const responsePromise = this.page.waitForResponse(
      response => response.url().includes('/feedback/') && response.request().method() === 'POST',
      { timeout: 5000 }
    ).catch(() => null); // Don't fail if API is mocked/stubbed
    
    await this.submitButton.click();
    await responsePromise;
    
    // Wait for confirmation to be visible
    await this.feedbackConfirmation.waitFor({ state: 'visible', timeout: 3000 });
  }

  async isFeedbackConfirmationVisible(): Promise<boolean> {
    const classes = await this.feedbackConfirmation.getAttribute('class') || '';
    return !classes.includes('govuk-u-hidden') && await this.feedbackConfirmation.isVisible();
  }

  async getConfirmationText(): Promise<string> {
    return await this.feedbackConfirmation.textContent() || '';
  }

  // Button state methods
  async isLikeButtonDisabled(): Promise<boolean> {
    return await this.likeButton.isDisabled();
  }

  async isDislikeButtonDisabled(): Promise<boolean> {
    return await this.dislikeButton.isDisabled();
  }

  async isSubmitButtonDisabled(): Promise<boolean> {
    return await this.submitButton.isDisabled();
  }

  // More info methods
  async isMoreInfoVisible(): Promise<boolean> {
    const classes = await this.feedbackMoreInfo.getAttribute('class') || '';
    return !classes.includes('govuk-u-hidden') && await this.feedbackMoreInfo.isVisible();
  }

  async getMoreInfoText(): Promise<string> {
    return await this.feedbackMoreInfo.textContent() || '';
  }

  // Keyboard navigation methods
  async focusLikeButton() {
    await this.likeButton.focus();
  }

  async pressEnterOnLikeButton() {
    await this.likeButton.press('Enter');
  }

  async tabThroughForm() {
    await this.page.keyboard.press('Tab');
  }

  async pressEnterOnSubmitButton() {
    await this.submitButton.press('Enter');
  }

  async isElementFocused(locator: Locator): Promise<boolean> {
    const element = await locator.elementHandle();
    if (!element) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const focused = await this.page.evaluate((el: any) => el === (globalThis as any).document.activeElement, element);
    return focused;
  }
}
