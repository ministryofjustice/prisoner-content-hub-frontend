# E2E Testing with Playwright

> **Note**: Cypress has been deprecated and moved to `archive-cypress/`. This project now uses Playwright for all end-to-end testing.

## Migration from Cypress to Playwright

This document outlines the migration from Cypress to Playwright with TypeScript for the Digital Hub Frontend project.

## What Changed

### Test Framework

- **From**: Cypress (JavaScript) - **DEPRECATED as of November 2025**
- **To**: Playwright (TypeScript)

### Project Structure

```
e2e/
├── tests/                      # Test files (.spec.ts)
│   ├── healthcheck/           # Health check tests
│   │   ├── health.spec.ts
│   │   └── setup-verification.spec.ts
│   └── actions/               # Feature tests organized by area
│       ├── feedback/          # Feedback widget tests
│       ├── privacy-policy/    # Privacy policy tests
│       ├── health-and-wellbeing/
│       ├── learning-and-skills/
│       ├── faith/
│       ├── inspire-and-entertain/
│       ├── sentence-journey/
│       ├── news-and-events/
│       └── my-prison/
├── framework/                  # Page Object Models
│   └── pages/                 # Page objects for each section
│       ├── feedback/          # Feedback page object
│       ├── privacy_policy/
│       ├── health_wellbeing/
│       ├── learning_skills/
│       ├── faith/
│       ├── inspire_entertain/
│       ├── sentence_journey/
│       ├── news_events/
│       └── my_prison/
├── stepDefinition/             # Test fixtures with shared setup
│   ├── feedbackSteps.ts       # Feedback test fixtures
│   ├── privacyPolicySteps.ts
│   └── ...
├── features/                   # Gherkin-style feature files (documentation)
│   └── e2e/                   # Feature scenarios
│       ├── feedback.feature   # Feedback widget scenarios
│       ├── privacy-policy.feature
│       └── ...
├── utils/                      # Utility classes and helpers
│   ├── test-setup.ts          # Central test setup
│   ├── wiremock.ts            # Wiremock utilities
│   ├── auth.ts                # Auth mocking
│   ├── drupal.ts              # Drupal API mocking
│   ├── incentives-api.ts      # Incentives API mocking
│   └── global-setup.ts        # Global test setup
├── fixtures/                   # Test data and JSON fixtures
│   ├── example.json           # Example fixture
│   └── drupalData/            # Drupal mock data
│       ├── primaryNavigation.json
│       ├── browseAllTopics.json
│       └── urgentBanners.json
├── TEST_ID_STRATEGY.md         # Test ID conventions and catalog
├── playwright.config.ts        # Playwright configuration
├── eslint.config.js           # ESLint configuration (flat config)
├── tsconfig.json              # TypeScript configuration
├── docker-compose.yml         # Updated with healthchecks
├── Dockerfile                 # Playwright test runner
└── package.json               # Updated dependencies and scripts
```

### Key Files

- `playwright.config.ts` - Main Playwright configuration (headless mode, CI detection, retries)
- `utils/test-setup.ts` - Central test setup with all mock utilities
- `utils/global-setup.ts` - Global setup run once before all tests
- `utils/wiremock.ts` - Wiremock integration utilities
- `utils/auth.ts` - Authentication mocking utilities (uses environment variables)
- `utils/drupal.ts` - Drupal API mocking utilities
- `utils/incentives-api.ts` - Incentives API mocking utilities
- `fixtures/drupalData/` - Sanitized fixture data with mock API URLs

## New Dependencies

### Added

- `@playwright/test` - Main Playwright testing framework
- `typescript` - TypeScript compiler
- `@types/node` - Node.js type definitions
- `@types/superagent` - Superagent type definitions
- `@types/jsonwebtoken` - JWT type definitions

### Removed (can be cleaned up)

- `cypress` - No longer needed
- `cypress-multi-reporters` - No longer needed

## Script Changes

### Updated npm scripts in package.json:

```json
{
  "test": "playwright test",
  "test:ui": "playwright test --ui",
  "test:headed": "playwright test --headed",
  "test:debug": "playwright test --debug",
  "start-ui": "concurrently ... \"npm run test:ui\" ...",
  "start-ci": "docker-compose up ... --exit-code-from playwright",
  "report": "playwright show-report",
  "install-deps": "playwright install"
}
```

## Configuration

### Environment Variables

Tests use environment-specific configuration files:

- `test-local.env` - Local development (points to localhost services)
- `test-ci.env` - CI/Docker environment (points to Docker container hostnames)

**Important**: These files are in `.gitignore` to prevent exposing sensitive data.

Key environment variables:

- `AUTH_ISSUER` - Auth token issuer URL (moved from hardcoded)
- `HUB_API_ENDPOINT` - Drupal API endpoint
- `ELASTICSEARCH_ENDPOINT` - Search endpoint
- `PLAYWRIGHT_baseURL` - Base URL for tests
- `WIREMOCK_BASE_URL` - Wiremock server URL

### Playwright Configuration

The `playwright.config.ts` includes:

- **Headless mode**: Always runs headless (set to `true`)
- **CI optimizations**: Reduced parallelization, retries enabled
- **Global setup**: Wiremock initialization before tests
- **Reporters**: HTML report + JUnit XML for CI
- **Multi-browser**: Tests run on Chromium, Firefox, and WebKit

### Docker Configuration

The `docker-compose.yml` has been updated with:

- **Healthcheck for web service**: Ensures app is ready before tests run
- **Service dependencies**: Playwright waits for web service health status
- **Network aliases**: Multiple prison subdomains configured

## Running Tests

### Local Development

**Important**: Always run tests from the `e2e` directory with environment variables loaded:

```bash
# Navigate to e2e directory
cd e2e

# Install Playwright browsers (first time only)
npm run install-deps

# Run ALL tests (loads environment from test-local.env)
npm test

# Run specific test file
export $(cat test-local.env | xargs) && npx playwright test tests/actions/my-prison.spec.ts

# Run all tests in actions directory
export $(cat test-local.env | xargs) && npx playwright test tests/actions/

# Run all multi-prison tests (tests across all 21 prisons)
export $(cat test-local.env | xargs) && npx playwright test \
  tests/actions/my-prison-all-prisons.spec.ts \
  tests/actions/sentence-journey-all-prisons.spec.ts \
  tests/actions/news-events-all-prisons.spec.ts \
  tests/actions/news-events-series-tiles-all-prisons.spec.ts \
  tests/actions/sentence-journey-series-tiles-all-prisons.spec.ts

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug

# View last test report
npm run report
```

### Test File Organization

Tests are organized into two categories:

1. **Single-prison tests** (e.g., `my-prison.spec.ts`, `news-events.spec.ts`)
   - Run against default prison (Berwyn)
   - Faster execution for development
   - Use relative URLs like `/tags/1283`

2. **All-prisons tests** (e.g., `*-all-prisons.spec.ts`)
   - Run against all 21 prison environments
   - Test prison-specific configurations
   - Use absolute URLs like `http://{prison}.prisoner-content-hub.local:3000`
   - **588 total tests** across all prisons

### Test Coverage

The test suite includes comprehensive coverage of:

- **Feedback Widget** (`tests/actions/feedback/feedback.spec.ts`)
  - Widget visibility and rendering across all pages
  - Like/dislike button interactions and attributes
  - Feedback form display with like/dislike options
  - Form submission with network handling
  - Confirmation messages and "more info" display
  - Button disabled states during and after submission
  - Keyboard accessibility (Tab, Enter, Space)
  - CSS class verification (thumbs-up/thumbs-down)
  - AJAX request handling with proper waits
  - State management and DOM updates
  - **12 test scenarios** covering full feedback flow

- **Navigation** (all page tests)
  - Primary navigation links
  - Page navigation (back/forward/home)
  - Search functionality

- **Content Display**
  - Series tiles rendering
  - Content cards display
  - Featured items

- **Footer & Privacy**
  - Privacy policy link
  - Browse all topics section

See [features/e2e/](features/e2e/) for detailed scenario documentation in Gherkin format.

### Running Tests from Root Directory

**Note**: Running `npx playwright test` from the root project directory will fail because:

- It tries to install a different Playwright version
- Environment variables are not loaded
- Incorrect working directory

**Always run from the `e2e` directory** or use the full command:

```bash
cd /path/to/prisoner-content-hub-frontend/e2e && export $(cat test-local.env | xargs) && npx playwright test
```

### CI/Docker

```bash
# Build and run all services including tests
npm run start-ci

# This will:
# 1. Build the web application
# 2. Start Wiremock
# 3. Wait for web service to be healthy
# 4. Run Playwright tests
# 5. Exit with test results
```

## Key Differences from Cypress

### Test Structure

**Cypress:**

```javascript
describe('Test Suite', () => {
  beforeEach(() => {
    cy.task('reset');
  });

  it('should do something', () => {
    cy.request('/api').its('body.status').should('equal', 'UP');
  });
});
```

**Playwright:**

```typescript
test.describe('Test Suite', () => {
  test.beforeEach(async () => {
    await testSetup.reset();
  });

  test('should do something', async ({ request }) => {
    const response = await request.get('/api');
    const body = await response.json();
    expect(body.status).toBe('UP');
  });
});
```

### Mock API Usage

**Cypress (plugins/index.js):**

```javascript
on('task', {
  reset: () => resetStubs(),
  stubAuth: () => auth.stubClientCredentialsToken(),
});
```

**Playwright (utils/test-setup.ts):**

```typescript
const testSetup = new TestSetup();
await testSetup.reset();
await testSetup.auth.stubClientCredentialsToken();
```

### Configuration

- **Cypress**: `cypress.config.js`
- **Playwright**: `playwright.config.ts` with full TypeScript support

## Test ID Strategy

All tests use `data-testid` attributes for stable, maintainable selectors. This approach provides:

- **Resilient selectors**: Tests don't break when CSS classes or HTML structure changes
- **Clear intent**: Elements are explicitly marked for testing
- **Better performance**: `getByTestId()` is Playwright's fastest selector method
- **Maintainability**: Easy to locate and update test selectors
- **Separation of concerns**: Test IDs separate from application styling/behavior
- **Industry standard**: Used by major companies (GitHub, Airbnb, Netflix)

### Why Test IDs?

Using `data-testid` instead of CSS classes or other selectors prevents test brittleness:

```typescript
// ✅ Stable - survives CSS refactoring
page.getByTestId('feedback-like-button');

// ❌ Fragile - breaks if classes change for styling
page.locator('.govuk-hub-thumbs.govuk-hub-thumbs--up');
```

### Key Test IDs

| Component           | Test ID                    | Template                          |
| ------------------- | -------------------------- | --------------------------------- |
| **Navigation**      |                            |                                   |
| Top Bar             | `top-bar`                  | `top-bar/template.njk`            |
| Search Input        | `search-input`             | `search/template.njk`             |
| Search Button       | `search-button`            | `search/template.njk`             |
| Page Nav Back       | `page-nav-back-button`     | `page-navigation/template.njk`    |
| Page Nav Forward    | `page-nav-forward-button`  | `page-navigation/template.njk`    |
| Page Nav Home       | `page-nav-home-button`     | `page-navigation/template.njk`    |
| **Feedback Widget** |                            |                                   |
| Widget Container    | `feedback-widget`          | `feedback-widget/template.njk`    |
| Like Button         | `feedback-like-button`     | `feedback-widget/template.njk`    |
| Dislike Button      | `feedback-dislike-button`  | `feedback-widget/template.njk`    |
| Feedback Text       | `feedback-text`            | `feedback-widget/template.njk`    |
| Feedback Form       | `feedback-form`            | `feedback-widget/template.njk`    |
| Like Options        | `feedback-like-options`    | `feedback-widget/template.njk`    |
| Dislike Options     | `feedback-dislike-options` | `feedback-widget/template.njk`    |
| Submit Button       | `feedback-submit-button`   | `feedback-widget/template.njk`    |
| Confirmation        | `feedback-confirmation`    | `feedback-widget/template.njk`    |
| More Info           | `feedback-more-info`       | `feedback-widget/template.njk`    |
| **Footer**          |                            |                                   |
| Footer Container    | `footer`                   | `footer/template.njk`             |
| Privacy Link        | `footer-privacy-link`      | `footer/template.njk`             |
| **Content**         |                            |                                   |
| Small Content Tile  | `content-tile-small-{id}`  | `content-tile-small/template.njk` |
| Large Content Tile  | `content-tile-large-{id}`  | `content-tile-large/template.njk` |

See [TEST_ID_STRATEGY.md](TEST_ID_STRATEGY.md) for the complete catalog, naming conventions, and implementation guidelines.

## Page Object Model

Tests use the Page Object Model pattern for better maintainability:

```typescript
// Example: Using the feedback page object
import { test, expect } from '../stepDefinition/feedbackSteps';

test('Clicking like button shows feedback form', async ({
  feedbackPage,
  page,
}) => {
  await page.goto(baseURL);
  await feedbackPage.waitForFeedbackWidget();
  await feedbackPage.clickLikeButton();

  const isVisible = await feedbackPage.isFeedbackFormVisible();
  expect(isVisible).toBe(true);
});
```

Each page object encapsulates:

- Element locators (using test IDs)
- Page-specific actions
- Wait strategies and state checks

## Benefits of Migration

1. **TypeScript Support**: Full type safety and better IDE support
2. **Better API Testing**: Native request context without additional setup
3. **Multi-Browser**: Built-in support for Chromium, Firefox, and WebKit
4. **Modern Async/Await**: No more callback-style programming
5. **Better Debugging**: Integrated debugging tools and trace viewer
6. **Performance**: Generally faster test execution
7. **Mobile Testing**: Built-in device emulation
8. **Test ID Strategy**: Stable selectors using data-testid attributes
9. **Page Object Model**: Maintainable, reusable test code

## Security Improvements

### Sanitized Fixture Data

All fixture files in `fixtures/drupalData/` have been sanitized:

- Replaced production API URLs with `https://mock-api.local`
- Prevents exposure of internal infrastructure

### Environment Variable Usage

Sensitive configuration moved to environment variables:

- Auth issuer URL (`AUTH_ISSUER`)
- API endpoints configurable per environment
- Test environment files excluded from git via `.gitignore`

## CI/CD Integration

### CircleCI Configuration

Updated `.circleci/config.yml`:

- **Artifact paths**: Changed from Cypress to Playwright
  - Test results: `e2e/test-results/`
  - HTML report: `e2e/playwright-report/`
- **Test execution**: Uses Docker Compose with proper service dependencies
- **Exit codes**: Playwright container exit code determines CI success/failure

### Root Project Configuration

Updated root ESLint configuration:

- Added `ignorePatterns: ["e2e/**"]` to `.eslintrc`
- Added `e2e/` to `.eslintignore`
- Updated `.lintstagedrc` to exclude e2e directory
- Separate ESLint config for e2e using flat config (`eslint.config.js`)

## Migration Checklist

- [x] Install Playwright and TypeScript dependencies
- [x] Create TypeScript configuration
- [x] Convert Cypress config to Playwright config
- [x] Migrate test files from .feature.js to .spec.ts
- [x] Convert fixtures to TypeScript-compatible format
- [x] Migrate mock API setup from Cypress tasks to TypeScript classes
- [x] Update npm scripts
- [x] Update Docker configuration with healthchecks
- [x] Update CI configuration (CircleCI)
- [x] Sanitize fixture data (remove exposed URLs)
- [x] Move sensitive config to environment variables
- [x] Configure headless mode for CI
- [x] Update root ESLint configuration
- [x] Add test environment files to .gitignore
- [x] Create missing fixture files

## Troubleshooting

### Tests Fail with ECONNREFUSED

\*\*IWriting New Tests

### Best Practices

1. **Always Use Test IDs**: Use `data-testid` attributes for all element selection

   ```typescript
   // ✅ Best practice - stable and fast
   page.getByTestId('feedback-like-button');

   // ❌ Avoid - breaks when CSS changes
   page.locator('.govuk-hub-thumbs--up');

   // ❌ Avoid - breaks when text changes or gets translated
   page.getByText('Like');
   ```

2. **Add Test IDs to Templates First**: Before writing tests for new features, add test IDs to Nunjucks templates:

   ```html
   <!-- Good: Test ID on interactive elements -->
   <button data-testid="my-action-button" class="govuk-button">Click me</button>

   <!-- Good: Test ID on containers -->
   <div data-testid="my-widget" class="widget-container">
     <!-- content -->
   </div>

   <!-- For GOV.UK Design System macros, use attributes parameter -->
   {{ govukButton({ text: "Submit", attributes: { "data-testid": "submit-button"
   } }) }}
   ```

3. **Use Page Objects**: Create page objects in `framework/pages/` for reusable, maintainable test code:

   ```typescript
   // framework/pages/my-feature/myFeaturePage.ts
   export class MyFeaturePage {
     readonly page: Page;
     readonly myButton: Locator;

     constructor(page: Page) {
       this.page = page;
       this.myButton = page.getByTestId('my-button');
     }

     async clickMyButton() {
       await this.myButton.click();
     }

     async isMyButtonVisible() {
       return await this.myButton.isVisible();
     }
   }
   ```

4. **Wait for State Changes Properly**: Use appropriate waits instead of arbitrary timeouts:

   ```typescript
   // ✅ Good - wait for network response
   await page.waitForResponse(
     response =>
       response.url().includes('/api/feedback') &&
       response.request().method() === 'POST',
   );

   // ✅ Good - wait for element state
   await page.getByTestId('confirmation').waitFor({ state: 'visible' });

   // ✅ Good - wait for JavaScript state
   await page.waitForFunction(() =>
     document.querySelector('[data-testid="widget"]'),
   );

   // ❌ Avoid - arbitrary timeout causes flaky tests
   await page.waitForTimeout(1000);
   ```

5. **Create Test Fixtures**: Use fixtures in `stepDefinition/` for shared page object setup:

   ```typescript
   // stepDefinition/myFeatureSteps.ts
   import { test as base } from '@playwright/test';
   import { MyFeaturePage } from '../framework/pages/my-feature/myFeaturePage';

   export const test = base.extend<{ myFeaturePage: MyFeaturePage }>({
     myFeaturePage: async ({ page }, use) => {
       await use(new MyFeaturePage(page));
     },
   });

   export { expect } from '@playwright/test';
   ```

6. **Document with Feature Files**: Create Gherkin feature files in `features/e2e/` to document test scenarios:

   ```gherkin
   Feature: My Feature
     As a user
     I want to perform an action
     So that I can achieve a goal

     Scenario: Successful action
       Given I am on the my feature page
       When I click the action button
       Then I should see a confirmation message
   ```

### Test Structure Template

For consistency, each test area should follow this structure:

```
e2e/
├── features/e2e/
│   └── my-feature.feature              # Gherkin documentation
├── framework/pages/
│   └── my-feature/
│       └── myFeaturePage.ts            # Page object with test ID locators
├── stepDefinition/
│   └── myFeatureSteps.ts               # Test fixtures
└── tests/actions/
    └── my-feature/
        └── my-feature.spec.ts          # Test specifications
```

**Reference Implementation**: See `feedback/` directories for a complete example of this pattern.

### Anti-Flaky Test Patterns

The feedback tests demonstrate anti-flaky patterns:

- **Network waits**: Wait for AJAX requests to complete
- **State verification**: Check element visibility before interaction
- **Graceful error handling**: Handle network timeouts without failing
- **No arbitrary timeouts**: Never use `waitForTimeout()` in production tests
- **JavaScript initialization**: Wait for client-side code to be ready

```typescript
// Example: Robust form submission test
async submitFeedbackForm(text: string) {
  await this.feedbackText.fill(text);

  // Wait for network response
  const responsePromise = this.page.waitForResponse(
    response => response.url().includes('/api/feedback') &&
                response.request().method() === 'POST'
  ).catch(() => null); // Graceful handling

  await this.submitButton.click();
  await responsePromise;

  // Wait for confirmation to be visible
  await this.confirmationMessage.waitFor({ state: 'visible' });
}
```

## Future Enhancements

1. Expand test coverage to more user journeys
2. Implement visual regression testing with Playwright
3. Add performance testing capabilities
4. Implement API contract testing
5. Add more accessibility testing with Playwright's built-in tools
6. Add cross-prison configuration testing
   **Solution**: The e2e directory is now excluded from root ESLint via `.eslintignore` and `.eslintrc`. The e2e directory uses its own `eslint.config.js`.

### Fixture File Not Found

**Issue**: Tests fail because fixture files are missing.

**Solution**: Ensure all fixture files exist in `e2e/fixtures/` and `e2e/fixtures/drupalData/`. The required files are:

- `example.json`
- `drupalData/primaryNavigation.json`
- `drupalData/browseAllTopics.json`
- `drupalData/urgentBanners.json`

## Cypress Deprecation

Cypress has been deprecated as of **November 7, 2025** and moved to the `archive-cypress/` directory.

### Why We Migrated

- **Better TypeScript support**: Playwright has first-class TypeScript support
- **Faster execution**: Playwright tests run faster with better parallelization
- **Cross-browser testing**: More reliable testing across Chromium, Firefox, and WebKit
- **Modern tooling**: Better documentation, active development, and modern API design
- **API testing**: Superior capabilities for testing APIs alongside UI tests

### Archived Cypress Files

All Cypress-related files have been moved to `archive-cypress/`:

- `archive-cypress/cypress/` - All Cypress test files and configurations
- `archive-cypress/cypress.config.js` - Cypress configuration
- `archive-cypress/README.md` - Documentation on restoration if needed

### Restoring Cypress (Not Recommended)

If you absolutely need to restore Cypress:

1. Review `archive-cypress/README.md` for instructions
2. Move files back from the archive folder
3. Reinstall dependencies: `npm install cypress@14.5.4 cypress-multi-reporters@^2.0.5`
4. Note: Cypress support is no longer maintained for this project

## Future Enhancements

1. Add more comprehensive test coverage
2. Implement visual regression testing with Playwright
3. Add performance testing capabilities
4. Add test data management utilities
5. Implement API contract testing
6. Add accessibility testing with Playwright's built-in tools
