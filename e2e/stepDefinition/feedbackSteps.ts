import { test as base } from '@playwright/test';
import { FeedbackPage } from '../framework/pages/feedback/feedbackPage';

type FeedbackFixtures = {
  feedbackPage: FeedbackPage;
};

export const test = base.extend<FeedbackFixtures>({
  feedbackPage: async ({ page }, use) => {
    const feedbackPage = new FeedbackPage(page);
    await use(feedbackPage);
  },
});

export { expect } from '@playwright/test';
