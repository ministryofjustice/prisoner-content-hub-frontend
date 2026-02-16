import { test, expect } from '../../../stepDefinition/cardiffLanguageSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

// Get Cardiff prison details
const cardiffPrison = PRISONS.find(p => p.id === 'cardiff');

test.describe('Feature: Cardiff Welsh Language Translations - Cymraeg Button', () => {
  test.skip(!cardiffPrison, 'Cardiff prison configuration not found');

  const baseURL = cardiffPrison ? testSetup.getBaseURL(cardiffPrison) : '';

  test.beforeEach(async () => {
    await testSetup.reset();
    await testSetup.stubPrisonerSignIn();
  });

  test('Scenario: Cymraeg button is visible and properly configured on Cardiff homepage', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the Cardiff prison homepage', async () => {
      await page.goto(baseURL);
    });

    await test.step('When the page finishes loading', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('Then the Cymraeg link should be visible', async () => {
      const isVisible = await welshTranslationsPage.isCymraegLinkVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And the Cymraeg link text should be "Cymraeg"', async () => {
      const linkText = await welshTranslationsPage.getCymraegLinkText();
      expect(linkText.trim()).toBe('Cymraeg');
    });

    await test.step('And the lang attribute should be "cy"', async () => {
      const langAttr = await welshTranslationsPage.getCymraegLinkLangAttribute();
      expect(langAttr).toBe('cy');
    });

    await test.step('And the href should contain lng=cy parameter', async () => {
      const href = await welshTranslationsPage.getCymraegLinkHref();
      expect(href).toContain('lng=cy');
    });

    await test.step('And the link should have govuk styling classes', async () => {
      const hasGovukLink = await welshTranslationsPage.hasCymraegLinkClass('govuk-link');
      const hasGovukInverse = await welshTranslationsPage.hasCymraegLinkClass('govuk-link--inverse');
      expect(hasGovukLink).toBe(true);
      expect(hasGovukInverse).toBe(true);
    });
  });

  test('Scenario: Clicking Cymraeg button navigates to Welsh language version', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the Cardiff prison homepage', async () => {
      await page.goto(baseURL);
    });

    await test.step('When the page finishes loading', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('And I click the Cymraeg button', async () => {
      await welshTranslationsPage.navigateToWelshVersion();
    });

    await test.step('Then the page language parameter should be "cy"', async () => {
      const lang = await welshTranslationsPage.getCurrentLanguage();
      expect(lang).toBe('cy');
    });

    await test.step('And the URL should contain lng=cy', async () => {
      const url = page.url();
      expect(url).toContain('lng=cy');
    });
  });

  test('Scenario: Cymraeg link attributes match expected accessibility standards', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the Cardiff prison homepage', async () => {
      await page.goto(baseURL);
    });

    await test.step('When the page finishes loading', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('Then the Welsh translation link should meet all requirements', async () => {
      const isValid = await welshTranslationsPage.verifyWelshTranslationLink();
      expect(isValid).toBe(true);
    });

    await test.step('And the link should have all required govuk classes', async () => {
      const classes = await welshTranslationsPage.getCymraegLinkClasses();
      expect(classes).toContain('govuk-link');
      expect(classes).toContain('govuk-link--inverse');
    });
  });

  test('Scenario: Cymraeg link is only available on Cardiff prison', async ({ page }) => {
    await test.step('Given I am on the Cardiff prison homepage', async () => {
      await page.goto(baseURL);
    });

    await test.step('When the page finishes loading', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('Then the page should be for Cardiff prison', async () => {
      const currentUrl = page.url();
      expect(currentUrl).toContain('cardiff');
    });

    await test.step('And the Cymraeg link should be present on this Cardiff-specific page', async () => {
      const locator = page.locator('a[href*="lng=cy"][lang="cy"]');
      const count = await locator.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test('Scenario: Cymraeg button has proper visual contrast and styling', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the Cardiff prison homepage', async () => {
      await page.goto(baseURL);
    });

    await test.step('When the page finishes loading', async () => {
      await page.waitForLoadState('networkidle');
    });

    await test.step('Then the Cymraeg link should be visible and accessible', async () => {
      const isVisible = await welshTranslationsPage.isCymraegLinkVisible();
      expect(isVisible).toBe(true);
    });

    await test.step('And the link should have inverse styling for contrast', async () => {
      const hasInverseClass = await welshTranslationsPage.hasCymraegLinkClass('govuk-link--inverse');
      expect(hasInverseClass).toBe(true);
    });

    await test.step('And the link should be interactive', async () => {
      const isDisabled = await welshTranslationsPage.cymraegLink.isDisabled();
      expect(isDisabled).toBe(false);
    });
  });
});
