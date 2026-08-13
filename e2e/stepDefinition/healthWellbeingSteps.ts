import { test as base } from '@playwright/test';
import { HealthWellbeingPage } from '../framework/pages/health_wellbeing/healthWellbeingPage';

type HealthWellbeingFixtures = {
  healthWellbeingPage: HealthWellbeingPage;
};

export const test = base.extend<HealthWellbeingFixtures>({
  healthWellbeingPage: async ({ page }, use) => {
    const healthWellbeingPage = new HealthWellbeingPage(page);
    await use(healthWellbeingPage);
  },
});

export { expect } from '@playwright/test';
