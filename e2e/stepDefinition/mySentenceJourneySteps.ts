import { test as base, expect } from '@playwright/test';
import { MySentenceJourneyPage } from '../framework/pages/sentence_journey/mySentenceJourneyPage';

type MySentenceJourneyFixtures = {
  mySentenceJourneyPage: MySentenceJourneyPage;
};

export const test = base.extend<MySentenceJourneyFixtures>({
  mySentenceJourneyPage: async ({ page }, use) => {
    const mySentenceJourneyPage = new MySentenceJourneyPage(page);
    await use(mySentenceJourneyPage);
  },
});

export { expect };
