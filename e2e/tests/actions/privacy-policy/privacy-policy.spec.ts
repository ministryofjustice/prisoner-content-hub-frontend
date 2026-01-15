import { test, expect } from '../../../stepDefinition/privacyPolicySteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Privacy Policy Footer Link - ${prison.name}`, () => {
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

    test(`Scenario: Privacy link is present in footer - ${prison.name}`, async ({ privacyPolicyPage, page }) => {
      await test.step('Given I am on the homepage', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I scroll to the footer', async () => {
        await privacyPolicyPage.scrollToFooter();
      });

      await test.step('Then the privacy link should be visible', async () => {
        const isVisible = await privacyPolicyPage.isPrivacyLinkVisible();
        expect(isVisible).toBe(true);
      });

      await test.step('And the privacy link should have text "Privacy"', async () => {
        const text = await privacyPolicyPage.getPrivacyLinkText();
        expect(text.trim()).toBe('Privacy');
      });
    });

    test(`Scenario: Privacy link has valid href - ${prison.name}`, async ({ privacyPolicyPage, page }) => {
      await test.step('Given I am on the homepage', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I inspect the privacy link', async () => {
        await privacyPolicyPage.scrollToFooter();
      });

      await test.step('Then the privacy link should have a valid href attribute', async () => {
        const href = await privacyPolicyPage.getPrivacyLinkHref();
        expect(href).toBeTruthy();
        expect(href).not.toBe('');
        expect(href).not.toBe('#');
      });

      await test.step('And the href should point to "/content/4856"', async () => {
        const href = await privacyPolicyPage.getPrivacyLinkHref();
        expect(href).toBe('/content/4856');
      });
    });

    test(`Scenario: Privacy link navigation works - ${prison.name}`, async ({ privacyPolicyPage, page }) => {
      await test.step('Given I am on the homepage', async () => {
        await page.goto(baseURL);
      });

      await test.step('And the privacy link is present in the footer', async () => {
        await privacyPolicyPage.scrollToFooter();
        const hasLink = await privacyPolicyPage.hasPrivacyLink();
        expect(hasLink).toBe(true);
      });

      await test.step('When I click the privacy link', async () => {
        const initialUrl = await privacyPolicyPage.getCurrentURL();
        await privacyPolicyPage.clickPrivacyLink();
        
        await test.step('Then the URL should change', async () => {
          await privacyPolicyPage.waitForNavigation();
          const newUrl = await privacyPolicyPage.getCurrentURL();
          expect(newUrl).not.toBe(initialUrl);
        });

        await test.step('And I should navigate to the privacy page', async () => {
          const newUrl = await privacyPolicyPage.getCurrentURL();
          expect(newUrl).toContain('/content/4856');
        });

        await test.step('And the privacy page should load successfully', async () => {
          const hasHeading = await privacyPolicyPage.isPageHeadingVisible();
          expect(hasHeading).toBe(true);
        });
      });
    });
  });
});
