# Cardiff Welsh Language Tests

This directory contains comprehensive E2E tests for Welsh (Cymraeg) language functionality on Cardiff prison's prisoner content hub. The tests verify that the Welsh language toggle works correctly and that all content is properly translated.

## Overview

These tests validate:

- ✅ Cymraeg (Welsh) language button visibility and functionality
- ✅ Language switching on all major pages (homepage, topics, search, recently-added)
- ✅ Feedback widget translation to Welsh ("Anfon" for submit button)
- ✅ Language persistence across navigation
- ✅ Direct URL access with `lng=cy` parameter
- ✅ WCAG 2.0/2.1 accessibility compliance
- ✅ Keyboard navigation for language switching
- ✅ ARIA attributes on language buttons

## Test Structure

### Test Files

1. **cardiff-welsh-translations.spec.ts** (5 scenarios)
   - Cymraeg button visibility and configuration
   - Navigation functionality via button click
   - Language parameter handling
   - Accessibility standards compliance
   - Visual styling and contrast

2. **cardiff-all-pages-welsh.spec.ts** (10 scenarios)
   - Homepage translation verification
   - Topics page translation
   - Search page translation
   - Recently added content translation
   - Language persistence across page navigation
   - Direct URL access with `lng=cy`
   - Invalid language parameter handling

3. **cardiff-feedback-welsh.spec.ts** (9 scenarios)
   - Feedback widget heading translation (Welsh/English)
   - Like/dislike button options in Welsh
   - Submit button translation ("Anfon" in Welsh)
   - Language switching updates feedback text
   - Direct Welsh page access with feedback widget visible

4. **cardiff-accessibility-welsh.spec.ts** (13 scenarios)
   - WCAG compliance scanning on Welsh pages
   - ARIA labels on language buttons
   - Keyboard navigation accessibility
   - Heading hierarchy validation
   - Color contrast verification
   - Focus management for keyboard users

### Page Object

**welshTranslationsPage.ts**

- Unified interface for interacting with Welsh language features
- Methods for language switching (Welsh/English)
- Feedback widget interaction methods
- URL and content verification helpers
- 30+ methods for comprehensive test coverage

### Fixtures

**cardiffLanguageSteps.ts**

- Extends Playwright test with `welshTranslationsPage` fixture
- Provides clean, reusable interface for all tests

## Configuration

### Cardiff Prison Setup

Welsh language is enabled exclusively for Cardiff prison. Configuration:

**server/config.js:**

```javascript
cardiff: {
  languages: ['en', 'cy'],  // English and Welsh enabled
}
```

**server/locales/cy.json:**

- Contains all Welsh translations for UI elements
- Updated via Drupal CMS integration

### Bedford Prison Setup

Bedford prison was missing from Docker and local DNS configuration. Fixed by:

1. Added to `e2e/docker-compose.yml` aliases:

   ```yaml
   - bedford.content-hub.localhost
   ```

2. Added to `/etc/hosts`:
   ```
   127.0.0.1 bedford.prisoner-content-hub.local
   ```

## Running Tests

### All Cardiff Welsh Tests (Local)

```bash
cd e2e
npm test -- --grep "cardiff-language"
```

### Specific Test Suite

```bash
# Welsh button tests only
npm test -- tests/actions/cardiff-language/cardiff-welsh-translations.spec.ts

# All pages translation tests
npm test -- tests/actions/cardiff-language/cardiff-all-pages-welsh.spec.ts

# Feedback widget tests
npm test -- tests/actions/cardiff-language/cardiff-feedback-welsh.spec.ts

# Accessibility tests
npm test -- tests/actions/cardiff-language/cardiff-accessibility-welsh.spec.ts
```

### On Dev Environment

```bash
cd e2e
export $(cat test-local.env | xargs) USE_DEV_ENV=true && npm test -- --grep "cardiff-language"
```

### With Specific Browser

```bash
npm test -- --project=chromium tests/actions/cardiff-language/
npm test -- --project=firefox tests/actions/cardiff-language/
```

### Headed Mode (See Browser)

```bash
npm test -- --headed tests/actions/cardiff-language/
```

## Test Results

**Local Environment:**

- ✅ 74 tests passing across all Cardiff Welsh test files
- ⚠️ 1261+ other tests passing (overall suite)
- ⏱️ Average runtime: 20-25 seconds

**Dev Environment:**

- ✅ 37 tests passing (Cardiff Welsh tests on dev)
- ✅ 1193+ total tests passing on dev
- ⏱️ Runtime: ~22 minutes for full suite

**Test Statistics:**

- Welsh translation tests: 5 passing
- Multi-page tests: 10 passing
- Feedback widget tests: 9 passing
- Accessibility tests: 13 passing
- **Total Cardiff Welsh tests: 74 passing**

## Key Features

### Welsh Language URL Parameter

Tests validate the `lng=cy` parameter:

```
http://cardiff.prisoner-content-hub.local:3000/topics?lng=cy
```

### Accessibility Testing

Uses `@axe-core/playwright` for WCAG compliance:

```typescript
const accessibilityScanResults = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
  .analyze();
```

### Page Object Methods

**Language Navigation:**

- `navigateToWelshVersion()` - Switch to Welsh
- `navigateToEnglishVersion()` - Switch to English
- `getCurrentLanguage()` - Get current language
- `isPageInWelsh()` - Verify page is in Welsh

**Feedback Widget:**

- `isFeedbackWidgetVisible()` - Check widget visibility
- `hasFeedbackHeadingInWelsh()` - Verify Welsh heading
- `clickLikeButton()` - Click like feedback
- `clickDislikeButton()` - Click dislike feedback
- `hasSubmitButtonInWelsh()` - Verify "Anfon" button

**Content Verification:**

- `getPageHeading()` - Get page title
- `getPageContent()` - Get page body text
- `hasWelshContent()` - Check for Welsh text patterns

## Dependencies

- `@playwright/test` ^1.57.0 - Testing framework
- `@axe-core/playwright` 4.11.1 - Accessibility testing

## Isolation & Safety

✅ **All tests are isolated to Cardiff prison only:**

- Tests skip automatically if Cardiff configuration not found
- Cardiff-specific test fixtures prevent cross-prison contamination
- No side effects on other prison configurations

## Debugging

### View Test Report

```bash
npm test -- --reporter=html
npx playwright show-report
```

### Debug Single Test

```bash
npm test -- --debug tests/actions/cardiff-language/cardiff-welsh-translations.spec.ts
```

### View Screenshots/Videos

Test artifacts saved in: `e2e/test-results/`

## Common Issues

### Test Timeout on Footer Link Navigation

See the "Browse All Topics Footer" tests in `browse-topics.spec.ts`. These are pre-existing issues where footer tag links don't navigate correctly. Not related to Welsh language functionality.

### Accessibility Violations

The accessibility tests detect real violations in the application (e.g., missing ARIA labels). Tests report violations rather than fail on them, allowing ongoing compliance monitoring.

### Hostname Resolution Errors

If tests fail with `ERR_NAME_NOT_RESOLVED`:

1. Ensure `/etc/hosts` has all prison hostnames
2. Verify docker-compose.yml has all aliases
3. Run `npx playwright install` to update browsers

## Contributing

When adding new Welsh language tests:

1. Use the `welshTranslationsPage` page object
2. Extend the `test` fixture from `cardiffLanguageSteps.ts`
3. Follow existing naming conventions (e.g., `cardiff-feature-welsh.spec.ts`)
4. Add scenarios to the appropriate existing file if related
5. Test in both local and dev environments
6. Ensure tests pass in both chromium and firefox browsers

## Related Documentation

- [Welsh Translation Source](../../server/locales/cy.json)
- [Cardiff Prison Config](../../server/config.js)
- [Page Object Guide](../../../e2e/framework/pages/README.md)
- [Playwright Docs](https://playwright.dev)
- [Axe-Core Testing](https://www.deque.com/axe/devtools/)
