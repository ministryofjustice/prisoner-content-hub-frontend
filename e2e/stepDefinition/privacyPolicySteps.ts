import { test as base } from '@playwright/test';
import { PrivacyPolicyPage } from '../framework/pages/privacy_policy/privacyPolicyPage';

type PrivacyPolicyFixtures = {
  privacyPolicyPage: PrivacyPolicyPage;
};

export const test = base.extend<PrivacyPolicyFixtures>({
  privacyPolicyPage: async ({ page }, use) => {
    const privacyPolicyPage = new PrivacyPolicyPage(page);
    await use(privacyPolicyPage);
  },
});

export { expect } from '@playwright/test';
