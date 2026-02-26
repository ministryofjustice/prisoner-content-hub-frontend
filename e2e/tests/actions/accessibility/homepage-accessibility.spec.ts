import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Homepage Accessibility - ${prison.name}`, () => {
    const baseURL = testSetup.getBaseURL(prison);

    test.beforeEach(async () => {
      await testSetup.reset();
      await testSetup.stubPrisonerSignIn();
    });

    test(`Scenario: Homepage can be scanned for accessibility issues - ${prison.name}`, async ({
      page,
    }) => {
      await test.step('Given I am on the Prisoner Content Hub homepage', async () => {
        await page.goto(baseURL);
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

    test(`Scenario: Homepage navigation buttons are visible and configured - ${prison.name}`, async ({
      page,
    }) => {
      const navButtons = [
        { label: 'My prison', href: '/tags/1283' },
        { label: 'Sentence journey', href: '/tags/1285' },
        { label: 'News and events', href: '/tags/644' },
        { label: 'Learning and skills', href: '/tags/1341' },
        { label: 'Inspire and entertain', href: '/tags/1282' },
        { label: 'Health and wellbeing', href: '/tags/1284' },
        { label: 'Faith', href: '/tags/1286' },
      ];

      await test.step('Given I am on the Prisoner Content Hub homepage', async () => {
        await page.goto(baseURL);
        await page.waitForLoadState('networkidle');
      });

      await test.step('Then the primary navigation should be visible', async () => {
        await expect(page.locator('ul.moj-primary-navigation__list')).toBeVisible();
      });

      await test.step('And each navigation button should be visible with a valid href', async () => {
        for (const nav of navButtons) {
          const navLink = page.locator('ul.moj-primary-navigation__list a.moj-primary-navigation__link', {
            hasText: nav.label,
          });
          await expect(navLink).toBeVisible();
          await expect(navLink).toHaveAttribute('href', nav.href);
        }
      });

      await test.step('And navigation buttons should be keyboard accessible', async () => {
        for (const nav of navButtons) {
          const navLink = page.locator('ul.moj-primary-navigation__list a.moj-primary-navigation__link', {
            hasText: nav.label,
          });
          await navLink.focus();
          await expect(navLink).toBeFocused();
        }
      });
    });
  });
});
