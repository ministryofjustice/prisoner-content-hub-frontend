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
│   ├── health.spec.ts         # Health check tests
│   └── setup-verification.spec.ts
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

## Benefits of Migration

1. **TypeScript Support**: Full type safety and better IDE support
2. **Better API Testing**: Native request context without additional setup
3. **Multi-Browser**: Built-in support for Chromium, Firefox, and WebKit
4. **Modern Async/Await**: No more callback-style programming
5. **Better Debugging**: Integrated debugging tools and trace viewer
6. **Performance**: Generally faster test execution
7. **Mobile Testing**: Built-in device emulation

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

**Issue**: Playwright tries to connect before the web server is ready.

**Solution**: The `docker-compose.yml` now includes a healthcheck on the web service. Playwright waits for the service to be healthy before starting tests.

### ESLint Errors in Pre-commit Hook

**Issue**: Root ESLint tries to lint e2e TypeScript files.

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
