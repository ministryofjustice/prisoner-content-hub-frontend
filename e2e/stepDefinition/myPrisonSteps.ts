import { test as base, expect } from '@playwright/test';
import { MyPrisonPage } from '../framework/pages/my_prison/myPrisonPage';

type MyPrisonFixtures = {
  myPrisonPage: MyPrisonPage;
};

export const test = base.extend<MyPrisonFixtures>({
  myPrisonPage: async ({ page }, use) => {
    const myPrisonPage = new MyPrisonPage(page);
    await use(myPrisonPage);
  },
});

export { expect };
