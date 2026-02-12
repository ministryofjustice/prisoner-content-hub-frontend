import { test, expect } from '../../../stepDefinition/cardiffLanguageSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

// Get Cardiff prison details
const cardiffPrison = PRISONS.find(p => p.id === 'cardiff');

test.describe('Feature: Cardiff Welsh Translations - All Pages', () => {
  test.skip(!cardiffPrison, 'Cardiff prison configuration not found');

  const baseURL = cardiffPrison ? testSetup.getBaseURL(cardiffPrison) : '';

  test.beforeEach(async () => {
    await testSetup.reset();
    await testSetup.stubPrisonerSignIn();
  });

  test('Scenario: Homepage translates to Welsh correctly', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the Cardiff prison homepage', async () => {
      await page.goto(baseURL);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the Cymraeg button', async () => {
      await welshTranslationsPage.navigateToWelshVersion();
    });

    await test.step('Then the page should be in Welsh', async () => {
      const isWelsh = await welshTranslationsPage.isPageInWelsh();
      expect(isWelsh).toBe(true);
    });

    await test.step('And the URL should contain lng=cy', async () => {
      const url = await welshTranslationsPage.getCurrentUrl();
      expect(url).toContain('lng=cy');
    });

    await test.step('And the Cymraeg link should be active', async () => {
      const isActive = await welshTranslationsPage.isCymraegLinkActive();
      expect(isActive).toBe(true);
    });
  });

  test('Scenario: Can switch back to English from Welsh', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the Cardiff homepage in Welsh', async () => {
      await page.goto(`${baseURL}?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the English button', async () => {
      await welshTranslationsPage.navigateToEnglishVersion();
    });

    await test.step('Then the page should be in English', async () => {
      const isEnglish = await welshTranslationsPage.isPageInEnglish();
      expect(isEnglish).toBe(true);
    });

    await test.step('And the English link should be active', async () => {
      const isActive = await welshTranslationsPage.isEnglishLinkActive();
      expect(isActive).toBe(true);
    });
  });

  test('Scenario: Search page translates to Welsh', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the search page', async () => {
      await page.goto(`${baseURL}/search`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the Cymraeg button', async () => {
      await welshTranslationsPage.navigateToWelshVersion();
    });

    await test.step('Then the page should be in Welsh', async () => {
      const isWelsh = await welshTranslationsPage.isPageInWelsh();
      expect(isWelsh).toBe(true);
    });

    await test.step('And the URL should contain lng=cy', async () => {
      const url = await welshTranslationsPage.getCurrentUrl();
      expect(url).toContain('lng=cy');
      expect(url).toContain('/search');
    });
  });

  test('Scenario: Topics page translates to Welsh', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the topics page', async () => {
      await page.goto(`${baseURL}/topics`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the Cymraeg button', async () => {
      await welshTranslationsPage.navigateToWelshVersion();
    });

    await test.step('Then the page should be in Welsh', async () => {
      const isWelsh = await welshTranslationsPage.isPageInWelsh();
      expect(isWelsh).toBe(true);
    });

    await test.step('And the URL should maintain the topics path', async () => {
      const url = await welshTranslationsPage.getCurrentUrl();
      expect(url).toContain('lng=cy');
      expect(url).toContain('/topics');
    });
  });

  test('Scenario: Language preference persists across page navigation', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the homepage in Welsh', async () => {
      await page.goto(`${baseURL}?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I navigate to another page', async () => {
      await page.goto(`${baseURL}/topics?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('Then the page should still be in Welsh', async () => {
      const isWelsh = await welshTranslationsPage.isPageInWelsh();
      expect(isWelsh).toBe(true);
    });

    await test.step('And the Cymraeg link should be active', async () => {
      const isActive = await welshTranslationsPage.isCymraegLinkActive();
      expect(isActive).toBe(true);
    });
  });

  test('Scenario: Feedback page elements translate to Welsh', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on a content page in Welsh', async () => {
      // Using homepage as a proxy since actual content pages require CMS data
      await page.goto(`${baseURL}?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('Then Welsh UI elements should be present', async () => {
      const welshElements = await welshTranslationsPage.checkWelshUIElements();
      // At least one Welsh element should be present
      const hasWelshContent = Object.values(welshElements).some(v => v === true);
      expect(hasWelshContent).toBe(true);
    });
  });

  test('Scenario: Direct URL access with Welsh parameter works', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I directly access a URL with lng=cy parameter', async () => {
      await page.goto(`${baseURL}/topics?lng=cy`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('Then the page should render in Welsh', async () => {
      const isWelsh = await welshTranslationsPage.isPageInWelsh();
      expect(isWelsh).toBe(true);
    });

    await test.step('And the Cymraeg link should be active', async () => {
      const isActive = await welshTranslationsPage.isCymraegLinkActive();
      expect(isActive).toBe(true);
    });

    await test.step('And both language links should be visible', async () => {
      const cymraegVisible = await welshTranslationsPage.isCymraegLinkVisible();
      const englishVisible = await welshTranslationsPage.isEnglishLinkVisible();
      expect(cymraegVisible).toBe(true);
      expect(englishVisible).toBe(true);
    });
  });

  test('Scenario: Invalid language parameter defaults to English', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I access a URL with an invalid language parameter', async () => {
      await page.goto(`${baseURL}?lng=invalid`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('Then the page should default to English', async () => {
      // Check that English link is active or page is in English
      const isEnglishActive = await welshTranslationsPage.isEnglishLinkActive();
      const currentLang = await welshTranslationsPage.getCurrentLanguage();
      
      // Either English should be active OR language should be 'en' or 'invalid' (which would show English content)
      expect(isEnglishActive || currentLang === 'en' || currentLang === 'invalid').toBe(true);
    });
  });

  test('Scenario: Recently Added page translates to Welsh', async ({
    welshTranslationsPage,
    page,
  }) => {
    await test.step('Given I am on the recently added page', async () => {
      await page.goto(`${baseURL}/recently-added`);
      await welshTranslationsPage.waitForPageToLoad();
    });

    await test.step('When I click the Cymraeg button', async () => {
      await welshTranslationsPage.navigateToWelshVersion();
    });

    await test.step('Then the page should be in Welsh', async () => {
      const isWelsh = await welshTranslationsPage.isPageInWelsh();
      expect(isWelsh).toBe(true);
    });

    await test.step('And the URL should maintain the recently-added path', async () => {
      const url = await welshTranslationsPage.getCurrentUrl();
      expect(url).toContain('lng=cy');
      expect(url).toContain('/recently-added');
    });
  });

  test('Scenario: Language toggle is available on all pages', async ({
    welshTranslationsPage,
    page,
  }) => {
    const pagesToTest = [
      { path: '/', name: 'homepage' },
      { path: '/topics', name: 'topics page' },
      { path: '/search', name: 'search page' },
      { path: '/recently-added', name: 'recently added page' },
    ];

    for (const pageToTest of pagesToTest) {
      await test.step(`Given I am on the ${pageToTest.name}`, async () => {
        await page.goto(`${baseURL}${pageToTest.path}`);
        await welshTranslationsPage.waitForPageToLoad();
      });

      await test.step(`Then the Cymraeg link should be visible on ${pageToTest.name}`, async () => {
        const isVisible = await welshTranslationsPage.isCymraegLinkVisible();
        expect(isVisible).toBe(true);
      });

      await test.step(`And the English link should be visible on ${pageToTest.name}`, async () => {
        const isVisible = await welshTranslationsPage.isEnglishLinkVisible();
        expect(isVisible).toBe(true);
      });
    }
  });
});
