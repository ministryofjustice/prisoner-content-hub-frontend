import { test as base, expect } from '@playwright/test';
import { NewsEventsPage } from '../framework/pages/news_events/newsEventsPage';

type NewsEventsFixtures = {
  newsEventsPage: NewsEventsPage;
};

export const test = base.extend<NewsEventsFixtures>({
  newsEventsPage: async ({ page }, use) => {
    const newsEventsPage = new NewsEventsPage(page);
    await use(newsEventsPage);
  },
});

export { expect };
