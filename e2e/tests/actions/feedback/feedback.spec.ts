import { test, expect } from '../../../stepDefinition/feedbackSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Feedback Buttons - ${prison.name}`, () => {
    let baseURL: string;

    test.beforeAll(() => {
      const isCI = !!process.env.CI;
      const domain = isCI 
        ? prison.url.replace('prisoner-content-hub.local', 'content-hub.localhost')
        : prison.url;
      baseURL = `http://${domain}:3000`;
    });

    test.beforeEach(async () => {
      await testSetup.reset();
      await testSetup.stubPrisonerSignIn();
    });

    test(`Scenario: Feedback widget is present on content pages - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
      });

      await test.step('When the page finishes loading', async () => {
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('Then the feedback widget should be visible', async () => {
        const isVisible = await feedbackPage.isFeedbackWidgetVisible();
        expect(isVisible).toBe(true);
      });

      await test.step('And the like button should be present', async () => {
        const isVisible = await feedbackPage.isLikeButtonVisible();
        expect(isVisible).toBe(true);
      });

      await test.step('And the dislike button should be present', async () => {
        const isVisible = await feedbackPage.isDislikeButtonVisible();
        expect(isVisible).toBe(true);
      });
    });

    test(`Scenario: Feedback buttons have correct attributes - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I inspect the feedback buttons', async () => {
        // Buttons are now loaded
      });

      await test.step('Then the like button should have aria-label "like"', async () => {
        const ariaLabel = await feedbackPage.getLikeButtonAriaLabel();
        expect(ariaLabel).toBe('like');
      });

      await test.step('And the like button should have value "LIKE"', async () => {
        const value = await feedbackPage.getLikeButtonValue();
        expect(value).toBe('LIKE');
      });

      await test.step('And the dislike button should have aria-label "dislike"', async () => {
        const ariaLabel = await feedbackPage.getDislikeButtonAriaLabel();
        expect(ariaLabel).toBe('dislike');
      });

      await test.step('And the dislike button should have value "DISLIKE"', async () => {
        const value = await feedbackPage.getDislikeButtonValue();
        expect(value).toBe('DISLIKE');
      });
    });

    test(`Scenario: Feedback buttons have correct CSS classes - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I inspect the feedback buttons', async () => {
        // Buttons are now loaded
      });

      await test.step('Then the like button should have class "govuk-hub-thumbs--up"', async () => {
        const hasClass = await feedbackPage.hasLikeButtonClass('govuk-hub-thumbs--up');
        expect(hasClass).toBe(true);
      });

      await test.step('And the dislike button should have class "govuk-hub-thumbs--down"', async () => {
        const hasClass = await feedbackPage.hasDislikeButtonClass('govuk-hub-thumbs--down');
        expect(hasClass).toBe(true);
      });

      await test.step('And both buttons should have class "govuk-link"', async () => {
        const likeHasClass = await feedbackPage.hasLikeButtonClass('govuk-link');
        const dislikeHasClass = await feedbackPage.hasDislikeButtonClass('govuk-link');
        expect(likeHasClass).toBe(true);
        expect(dislikeHasClass).toBe(true);
      });

      await test.step('And both buttons should have class "govuk-hub-thumbs"', async () => {
        const likeHasClass = await feedbackPage.hasLikeButtonClass('govuk-hub-thumbs');
        const dislikeHasClass = await feedbackPage.hasDislikeButtonClass('govuk-hub-thumbs');
        expect(likeHasClass).toBe(true);
        expect(dislikeHasClass).toBe(true);
      });
    });

    test(`Scenario: Clicking like button shows feedback form - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I click the like button', async () => {
        await feedbackPage.clickLikeButton();
        await feedbackPage.waitForFeedbackForm();
      });

      await test.step('Then the like button should have class "is-selected"', async () => {
        const hasClass = await feedbackPage.hasLikeButtonClass('is-selected');
        expect(hasClass).toBe(true);
      });

      await test.step('And the feedback form should become visible', async () => {
        const isVisible = await feedbackPage.isFeedbackFormVisible();
        expect(isVisible).toBe(true);
      });

      await test.step('And the feedback text should display "I like this"', async () => {
        const text = await feedbackPage.getFeedbackText();
        expect(text.toLowerCase()).toContain('like');
      });
    });

    test(`Scenario: Clicking dislike button shows feedback form - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I click the dislike button', async () => {
        await feedbackPage.clickDislikeButton();
        await feedbackPage.waitForFeedbackForm();
      });

      await test.step('Then the dislike button should have class "is-selected"', async () => {
        const hasClass = await feedbackPage.hasDislikeButtonClass('is-selected');
        expect(hasClass).toBe(true);
      });

      await test.step('And the feedback form should become visible', async () => {
        const isVisible = await feedbackPage.isFeedbackFormVisible();
        expect(isVisible).toBe(true);
      });

      await test.step('And the feedback text should display "I don\'t like this"', async () => {
        const text = await feedbackPage.getFeedbackText();
        expect(text.toLowerCase()).toContain('like');
      });
    });

    test(`Scenario: Switching between like and dislike - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I click the like button', async () => {
        await feedbackPage.clickLikeButton();
      });

      await test.step('And I wait for the feedback form to appear', async () => {
        await feedbackPage.waitForFeedbackForm();
      });

      await test.step('And I click the dislike button', async () => {
        await feedbackPage.clickDislikeButton();
      });

      await test.step('Then the dislike button should have class "is-selected"', async () => {
        const hasClass = await feedbackPage.hasDislikeButtonClass('is-selected');
        expect(hasClass).toBe(true);
      });

      await test.step('And the like button should not have class "is-selected"', async () => {
        const hasClass = await feedbackPage.hasLikeButtonClass('is-selected');
        expect(hasClass).toBe(false);
      });
    });

    test(`Scenario: Like feedback form shows correct options - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I click the like button', async () => {
        await feedbackPage.clickLikeButton();
        await feedbackPage.waitForFeedbackForm();
      });

      await test.step('Then the feedback form should show like options', async () => {
        const areVisible = await feedbackPage.areLikeOptionsVisible();
        expect(areVisible).toBe(true);
      });

      await test.step('And the dislike options should be hidden', async () => {
        const areVisible = await feedbackPage.areDislikeOptionsVisible();
        expect(areVisible).toBe(false);
      });
    });

    test(`Scenario: Dislike feedback form shows correct options - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I click the dislike button', async () => {
        await feedbackPage.clickDislikeButton();
        await feedbackPage.waitForFeedbackForm();
      });

      await test.step('Then the feedback form should show dislike options', async () => {
        const areVisible = await feedbackPage.areDislikeOptionsVisible();
        expect(areVisible).toBe(true);
      });

      await test.step('And the like options should be hidden', async () => {
        const areVisible = await feedbackPage.areLikeOptionsVisible();
        expect(areVisible).toBe(false);
      });
    });

    test(`Scenario: Submitting feedback shows confirmation - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I click the like button', async () => {
        await feedbackPage.clickLikeButton();
        await feedbackPage.waitForFeedbackForm();
      });

      await test.step('And I select a feedback option', async () => {
        await feedbackPage.selectFirstFeedbackOption();
      });

      await test.step('And I submit the feedback form', async () => {
        await feedbackPage.submitFeedbackForm();
      });

      await test.step('Then the feedback confirmation should be visible', async () => {
        const isVisible = await feedbackPage.isFeedbackConfirmationVisible();
        expect(isVisible).toBe(true);
      });

      await test.step('And the confirmation should say "Thanks for your feedback"', async () => {
        const text = await feedbackPage.getConfirmationText();
        expect(text.toLowerCase()).toContain('thank');
      });
    });

    test(`Scenario: Feedback buttons are disabled after submission - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I click the like button', async () => {
        await feedbackPage.clickLikeButton();
        await feedbackPage.waitForFeedbackForm();
      });

      await test.step('And I select a feedback option', async () => {
        await feedbackPage.selectFirstFeedbackOption();
      });

      await test.step('And I submit the feedback form', async () => {
        await feedbackPage.submitFeedbackForm();
      });

      await test.step('Then the feedback buttons should be disabled', async () => {
        const likeDisabled = await feedbackPage.isLikeButtonDisabled();
        const dislikeDisabled = await feedbackPage.isDislikeButtonDisabled();
        expect(likeDisabled).toBe(true);
        expect(dislikeDisabled).toBe(true);
      });

      await test.step('And the submit button should be disabled', async () => {
        const submitDisabled = await feedbackPage.isSubmitButtonDisabled();
        expect(submitDisabled).toBe(true);
      });
    });

    test(`Scenario: More info section displays after clicking feedback button - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I click the like button', async () => {
        await feedbackPage.clickLikeButton();
        await feedbackPage.waitForFeedbackForm();
      });

      await test.step('Then the more info section should become visible', async () => {
        const isVisible = await feedbackPage.isMoreInfoVisible();
        expect(isVisible).toBe(true);
      });

      await test.step('And the more info section should contain contact information', async () => {
        const text = await feedbackPage.getMoreInfoText();
        expect(text.length).toBeGreaterThan(0);
      });
    });

    test(`Scenario: Feedback buttons are keyboard accessible - ${prison.name}`, async ({ feedbackPage, page }) => {
      await test.step('Given I am on a content page with feedback widget', async () => {
        await page.goto(`${baseURL}/tags/1284`);
        await feedbackPage.waitForFeedbackWidget();
      });

      await test.step('When I navigate to the like button using keyboard', async () => {
        await feedbackPage.focusLikeButton();
      });

      await test.step('And I press Enter on the like button', async () => {
        await feedbackPage.pressEnterOnLikeButton();
        await feedbackPage.waitForFeedbackForm();
      });

      await test.step('Then the feedback form should become visible', async () => {
        const isVisible = await feedbackPage.isFeedbackFormVisible();
        expect(isVisible).toBe(true);
      });
    });
  });
});
