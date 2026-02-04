import { test, expect } from '../../../stepDefinition/learningSkillsSteps';
import { testSetup } from '../../../utils/test-setup';
import { PRISONS } from '../../../utils/prisons';

PRISONS.forEach((prison) => {
  test.describe(`Feature: Learning and Skills Page - ${prison.name}`, () => {
    let baseURL: string;

    test.beforeAll(() => {
      if (process.env.USE_DEV_ENV === 'true') {
        baseURL = prison.devUrl;
      } else {
        const isCI = !!process.env.CI;
        const domain = isCI 
          ? prison.url.replace('prisoner-content-hub.local', 'content-hub.localhost')
          : prison.url;
        baseURL = `http://${domain}:3000`;
      }
    });

    test.beforeEach(async () => {
      await testSetup.reset();
      await testSetup.stubPrisonerSignIn();
    });

    test(`Scenario: Navigate to Learning and Skills page directly - ${prison.name}`, async ({ learningSkillsPage, page }) => {
      await test.step('Given I am on the Prisoner Content Hub', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I navigate to the Learning and Skills page', async () => {
        await page.goto(`${baseURL}/tags/1341`);
      });

      await test.step('Then I should see the Learning and Skills page heading', async () => {
        await expect(learningSkillsPage.pageHeading).toBeVisible();
        const headingText = await learningSkillsPage.getPageTitle();
        expect(headingText).toBe('Learning and skills');
      });

      await test.step('And content should be loaded on the page', async () => {
        await learningSkillsPage.waitForContentToLoad();
        const isLoaded = await learningSkillsPage.isLoaded();
        expect(isLoaded).toBe(true);
      });
    });

    test(`Scenario: Navigate to Learning and Skills via navigation link - ${prison.name}`, async ({ learningSkillsPage, page }) => {
      await test.step('Given I am on the Prisoner Content Hub home page', async () => {
        await page.goto(baseURL);
      });

      await test.step('When I click on the "Learning and skills" navigation link', async () => {
        await learningSkillsPage.clickLearningSkillsNav();
      });

      await test.step('Then I should be on the Learning and Skills page', async () => {
        await expect(learningSkillsPage.pageHeading).toBeVisible();
        const headingText = await learningSkillsPage.getPageTitle();
        expect(headingText).toBe('Learning and skills');
      });

      await test.step('And the URL should contain "/tags/1341"', async () => {
        await expect(page).toHaveURL(/\/tags\/1341/);
      });
    });
  });
});
