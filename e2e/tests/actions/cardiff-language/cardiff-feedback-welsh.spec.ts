import { test, expect } from '../../../stepDefinition/cardiffLanguageSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

// Get Cardiff prison details
const cardiffPrison = PRISONS.find(p => p.id === 'cardiff');

test.describe('Feature: Cardiff Welsh Translations - Feedback Buttons', () => {
  test.skip(!cardiffPrison, 'Cardiff prison configuration not found');

  const baseURL = cardiffPrison ? testSetup.getBaseURL(cardiffPrison) : '';

  test.beforeEach(async () => {
    await testSetup.reset();
    await testSetup.stubPrisonerSignIn();
  });

  test('Scenario: Feedback widget heading displays in Welsh', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page with feedback in English', async () => {
      await page.goto(`${baseURL}/tags/1284`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I switch to Welsh', async () => {
      await welshTranslationsPage.navigateToWelshVersion();
    });

    await test.step('Then the feedback widget should be visible', async () => {
      const isVisible = await welshTranslationsPage.isFeedbackWidgetVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And the feedback heading should be in Welsh', async () => {
      const isWelsh = await welshTranslationsPage.hasFeedbackHeadingInWelsh();
      expect(isWelsh).toBe(true);
    });
  });

  test('Scenario: Feedback widget heading displays in English when language is English', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page in English', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=en`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('Then the feedback widget should be visible', async () => {
      const isVisible = await welshTranslationsPage.isFeedbackWidgetVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And the feedback heading should be in English', async () => {
      const isEnglish = await welshTranslationsPage.hasFeedbackHeadingInEnglish();
      expect(isEnglish).toBe(true);
    });
  });

  test('Scenario: Feedback like options display in Welsh', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page in Welsh', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the like button', async () => {
      await welshTranslationsPage.clickLikeButton();
    });

    await test.step('Then the feedback form should appear', async () => {
      const isVisible = await welshTranslationsPage.isFeedbackFormVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And the feedback options should be in Welsh', async () => {
      const hasWelshOptions = await welshTranslationsPage.hasFeedbackOptionsInWelsh();
      expect(hasWelshOptions).toBe(true);
    });
  });

  test('Scenario: Feedback dislike options display in Welsh', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page in Welsh', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the dislike button', async () => {
      await welshTranslationsPage.clickDislikeButton();
    });

    await test.step('Then the feedback form should appear', async () => {
      const isVisible = await welshTranslationsPage.isFeedbackFormVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And the feedback options should be in Welsh', async () => {
      const hasWelshOptions = await welshTranslationsPage.hasFeedbackOptionsInWelsh();
      expect(hasWelshOptions).toBe(true);
    });
  });

  test('Scenario: Feedback submit button displays in Welsh', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page in Welsh', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the like button', async () => {
      await welshTranslationsPage.clickLikeButton();
    });

    await test.step('Then the feedback form should appear', async () => {
      const isVisible = await welshTranslationsPage.isFeedbackFormVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And the submit button should display "Anfon" (Send in Welsh)', async () => {
      const isWelsh = await welshTranslationsPage.hasSubmitButtonInWelsh();
      expect(isWelsh).toBe(true);
    });
  });

  test('Scenario: Feedback like options display in English when language is English', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page in English', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=en`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the like button', async () => {
      await welshTranslationsPage.clickLikeButton();
    });

    await test.step('Then the feedback form should appear', async () => {
      const isVisible = await welshTranslationsPage.isFeedbackFormVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And the feedback options should be in English', async () => {
      const hasEnglishOptions = await welshTranslationsPage.hasFeedbackOptionsInEnglish();
      expect(hasEnglishOptions).toBe(true);
    });
  });

  test('Scenario: Feedback submit button displays in English when language is English', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page in English', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=en`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the like button', async () => {
      await welshTranslationsPage.clickLikeButton();
    });

    await test.step('Then the feedback form should appear', async () => {
      const isVisible = await welshTranslationsPage.isFeedbackFormVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And the submit button should display "Send" in English', async () => {
      const isEnglish = await welshTranslationsPage.hasSubmitButtonInEnglish();
      expect(isEnglish).toBe(true);
    });
  });

  test('Scenario: Switching language updates feedback text', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page in English', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=en`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('And the feedback heading is in English', async () => {
      const isEnglish = await welshTranslationsPage.hasFeedbackHeadingInEnglish();
      expect(isEnglish).toBe(true);
    });

    await test.step('When I switch to Welsh', async () => {
      await welshTranslationsPage.navigateToWelshVersion();
    });

    await test.step('Then the feedback heading should be in Welsh', async () => {
      const isWelsh = await welshTranslationsPage.hasFeedbackHeadingInWelsh();
      expect(isWelsh).toBe(true);
    });
  });

  test('Scenario: Direct access to Welsh page shows Welsh feedback', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I directly access a content page with lng=cy', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('Then the feedback widget should be visible', async () => {
      const isVisible = await welshTranslationsPage.isFeedbackWidgetVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And the feedback heading should be in Welsh', async () => {
      const isWelsh = await welshTranslationsPage.hasFeedbackHeadingInWelsh();
      expect(isWelsh).toBe(true);
    });

    await test.step('When I click the like button', async () => {
      await welshTranslationsPage.clickLikeButton();
    });

    await test.step('Then the feedback options should be in Welsh', async () => {
      const hasWelshOptions = await welshTranslationsPage.hasFeedbackOptionsInWelsh();
      expect(hasWelshOptions).toBe(true);
    });
  });
});
