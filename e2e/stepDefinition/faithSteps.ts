import { test as base } from '@playwright/test';
import { FaithPage } from '../framework/pages/faith/faithPage';

type FaithFixtures = {
  faithPage: FaithPage;
};

export const test = base.extend<FaithFixtures>({
  faithPage: async ({ page }, use) => {
    const faithPage = new FaithPage(page);
    await use(faithPage);
  },
});

export { expect } from '@playwright/test';
