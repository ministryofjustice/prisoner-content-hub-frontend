import { test as base } from '@playwright/test';
import { InspireEntertainPage } from '../framework/pages/inspire_entertain/inspireEntertainPage';

type InspireEntertainFixtures = {
  inspireEntertainPage: InspireEntertainPage;
};

export const test = base.extend<InspireEntertainFixtures>({
  inspireEntertainPage: async ({ page }, use) => {
    const inspireEntertainPage = new InspireEntertainPage(page);
    await use(inspireEntertainPage);
  },
});

export { expect } from '@playwright/test';
