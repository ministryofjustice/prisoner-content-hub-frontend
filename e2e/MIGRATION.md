# Migration from Cypress to Playwright

This document outlines the migration from Cypress to Playwright with TypeScript for the Digital Hub Frontend project.

## What Changed

### Test Framework

- **From**: Cypress (JavaScript)
- **To**: Playwright (TypeScript)

### Project Structure

```
e2e/
├── tests/                  # Test files (.spec.ts)
├── utils/                  # Utility classes and helpers
├── fixtures/               # Test data and JSON fixtures
├── playwright.config.ts    # Playwright configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Updated dependencies and scripts
```

### Key Files

- `playwright.config.ts` - Main Playwright configuration
- `utils/test-setup.ts` - Central test setup with all mock utilities
- `utils/wiremock.ts` - Wiremock integration utilities
- `utils/auth.ts` - Authentication mocking utilities
- `utils/drupal.ts` - Drupal API mocking utilities
- `utils/incentives-api.ts` - Incentives API mocking utilities

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

## Running Tests

### Local Development

```bash
# Install Playwright browsers
npm run install-deps

# Run tests headless
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# View test reports
npm run report
```

### CI/Docker

```bash
# Build and run all services including tests
npm run start-ci
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

## Migration Checklist

- [x] Install Playwright and TypeScript dependencies
- [x] Create TypeScript configuration
- [x] Convert Cypress config to Playwright config
- [x] Migrate test files from .feature.js to .spec.ts
- [x] Convert fixtures to TypeScript-compatible format
- [x] Migrate mock API setup from Cypress tasks to TypeScript classes
- [x] Update npm scripts
- [x] Update Docker configuration
- [x] Update CI configuration

## Future Enhancements

1. Add more comprehensive test coverage
2. Implement visual regression testing with Playwright
3. Add performance testing capabilities
4. Integrate with existing CI/CD pipelines
5. Add test data management utilities
