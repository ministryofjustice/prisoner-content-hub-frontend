import { test as base } from '@playwright/test';
import { BrowseTopicsPage } from '../framework/pages/browse_topics/browseTopicsPage';

type BrowseTopicsFixtures = {
  browseTopicsPage: BrowseTopicsPage;
};

export const test = base.extend<BrowseTopicsFixtures>({
  browseTopicsPage: async ({ page }, use) => {
    const browseTopicsPage = new BrowseTopicsPage(page);
    await use(browseTopicsPage);
  },
});

export { expect } from '@playwright/test';
