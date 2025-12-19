import { test as base, expect } from '@playwright/test';
import { LearningSkillsPage } from '../framework/pages/learning_skills/learningSkillsPage';

type LearningSkillsFixtures = {
  learningSkillsPage: LearningSkillsPage;
};

export const test = base.extend<LearningSkillsFixtures>({
  learningSkillsPage: async ({ page }, use) => {
    const learningSkillsPage = new LearningSkillsPage(page);
    await use(learningSkillsPage);
  },
});

export { expect };
