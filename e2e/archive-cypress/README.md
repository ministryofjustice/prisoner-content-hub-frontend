# Cypress Archive

**Status:** DEPRECATED - November 2025

This folder contains the legacy Cypress test framework that has been replaced by Playwright.

## Why Archived?

The project has migrated from Cypress to Playwright for the following reasons:

- Better TypeScript support
- Faster test execution
- More reliable cross-browser testing
- Better API testing capabilities
- Modern tooling and documentation

## Playwright Migration

All Cypress tests have been migrated to Playwright. The new test suite is located in:

- Tests: `/e2e/tests/`
- Utilities: `/e2e/utils/`
- Configuration: `/e2e/playwright.config.ts`

## Contents

This archive contains:

- Cypress test features
- Mock API utilities (migrated to Playwright)
- Cypress configuration files
- Original test fixtures

## Restoration

If you need to restore Cypress:

1. Move files back from this archive folder
2. Reinstall Cypress dependencies: `npm install cypress cypress-multi-reporters`
3. Restore the Cypress scripts in `package.json`

## Related PRs

- Migration to Playwright: LNP-1341, LNP-1342, LNP-1357, LNP-1358, LNP-1359, LNP-1360

---

_Archived on: November 7, 2025_
