import { test as base } from '@playwright/test';
import { WelshTranslationsPage } from '../framework/pages/cardiff_language/welshTranslationsPage';

type WelshTranslationsFixtures = {
  welshTranslationsPage: WelshTranslationsPage;
};

export const test = base.extend<WelshTranslationsFixtures>({
  welshTranslationsPage: async ({ page }, use) => {
    const welshTranslationsPage = new WelshTranslationsPage(page);
    await use(welshTranslationsPage);
  },
});

export { expect } from '@playwright/test';
