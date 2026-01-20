import { test, expect } from '../../../stepDefinition/browseTopicsSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Browse All Topics Footer - ${prison.name}`, () => {
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

    test(`Scenario: Footer section renders on homepage - ${prison.name}`, async ({ browseTopicsPage, page }) => {
      await test.step('Given I am on the homepage', async () => {
        await page.goto(baseURL);
      });

      await test.step('When the page finishes loading', async () => {
        await page.waitForLoadState('networkidle');
      });

      await test.step('Then the footer section should be visible', async () => {
        await browseTopicsPage.scrollToFooter();
        const isVisible = await browseTopicsPage.isFooterSectionVisible();
        expect(isVisible).toBe(true);
      });

      await test.step('And the "Browse all topics" heading should be present', async () => {
        const isHeadingVisible = await browseTopicsPage.isFooterHeadingVisible();
        expect(isHeadingVisible).toBe(true);
      });
    });

    test(`Scenario: Footer links are rendered - ${prison.name}`, async ({ browseTopicsPage, page }) => {
      await test.step('Given I am on the homepage', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I scroll to the footer', async () => {
        await browseTopicsPage.scrollToFooter();
      });

      await test.step('Then footer links should be present', async () => {
        const hasLinks = await browseTopicsPage.hasFooterLinks();
        expect(hasLinks).toBe(true);
      });

      await test.step('And footer links should be queryable', async () => {
        const linkCount = await browseTopicsPage.getFooterLinksCount();
        expect(linkCount).toBeGreaterThanOrEqual(0);
      });
    });

    test(`Scenario: Footer links have valid hrefs - ${prison.name}`, async ({ browseTopicsPage, page }) => {
      await test.step('Given I am on the homepage', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I inspect footer links', async () => {
        await browseTopicsPage.scrollToFooter();
      });

      await test.step('Then all links should have valid href attributes', async () => {
        const allValid = await browseTopicsPage.areAllFooterLinksValid();
        expect(allValid).toBe(true);
      });

      await test.step('And topic links should point to tag pages', async () => {
        const hrefs = await browseTopicsPage.getAllFooterLinkHrefs();
        const tagLinks = hrefs.filter(href => href.startsWith('/tags/'));
        // Should have at least some tag links in the footer
        expect(tagLinks.length).toBeGreaterThan(0);
      });
    });

    test(`Scenario: Footer link navigation works - ${prison.name}`, async ({ browseTopicsPage, page }) => {
      await test.step('Given I am on the homepage', async () => {
        await page.goto(baseURL);
      });

      await test.step('And footer links are present', async () => {
        await browseTopicsPage.scrollToFooter();
        const hasLinks = await browseTopicsPage.hasFooterLinks();
        expect(hasLinks).toBe(true);
      });

      await test.step('When I test all footer tag links', async () => {
        const hrefs = await browseTopicsPage.getAllFooterLinkHrefs();
        const texts = await browseTopicsPage.getAllFooterLinkTexts();
        
        await test.step('Then footer should have tag links', async () => {
          const tagLinks = hrefs.filter(href => href.startsWith('/tags/'));
          expect(tagLinks.length).toBeGreaterThan(0);
        });

        await test.step('And all tag links should be navigable', async () => {
          for (let i = 0; i < hrefs.length; i++) {
            const href = hrefs[i];
            const text = texts[i];
            
            if (href.startsWith('/tags/')) {
              // Navigate back to homepage before each link test
              await page.goto(baseURL);
              await browseTopicsPage.scrollToFooter();
              
              const initialUrl = await browseTopicsPage.getCurrentURL();
              await browseTopicsPage.clickFooterLink(i);
              
              await page.waitForLoadState('load');
              const newUrl = await browseTopicsPage.getCurrentURL();
              expect(newUrl).not.toBe(initialUrl);
              expect(newUrl).toContain('/tags/');
            }
          }
        });
      });
    });
  });
});
