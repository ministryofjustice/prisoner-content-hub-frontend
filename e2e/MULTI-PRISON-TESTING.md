# Multi-Prison Testing Setup

This document explains how the Playwright test framework is configured to support testing across all 21 prison environments.

## Supported Prisons

The following prisons are configured for testing:

1. Berwyn
2. Bullingdon
3. Cardiff
4. Chelmsford
5. Cookham Wood
6. Erlestoke
7. Feltham A
8. Feltham B
9. Garth
10. Lindholme
11. New Hall
12. Ranby
13. Stoke Heath
14. Styal
15. Swaleside
16. The Mount
17. The Studio
18. Wayland
19. Werrington
20. Wetherby
21. Woodhill

## Local Development Setup

### Prerequisites

All prison hostnames must be added to your `/etc/hosts` file:

```bash
127.0.0.1 berwyn.prisoner-content-hub.local
127.0.0.1 bullingdon.prisoner-content-hub.local
127.0.0.1 cardiff.prisoner-content-hub.local
127.0.0.1 chelmsford.prisoner-content-hub.local
127.0.0.1 cookhamwood.prisoner-content-hub.local
127.0.0.1 erlestoke.prisoner-content-hub.local
127.0.0.1 felthama.prisoner-content-hub.local
127.0.0.1 felthamb.prisoner-content-hub.local
127.0.0.1 garth.prisoner-content-hub.local
127.0.0.1 lindholme.prisoner-content-hub.local
127.0.0.1 newhall.prisoner-content-hub.local
127.0.0.1 ranby.prisoner-content-hub.local
127.0.0.1 stokeheath.prisoner-content-hub.local
127.0.0.1 styal.prisoner-content-hub.local
127.0.0.1 swaleside.prisoner-content-hub.local
127.0.0.1 themount.prisoner-content-hub.local
127.0.0.1 thestudio.prisoner-content-hub.local
127.0.0.1 wayland.prisoner-content-hub.local
127.0.0.1 werrington.prisoner-content-hub.local
127.0.0.1 wetherby.prisoner-content-hub.local
127.0.0.1 woodhill.prisoner-content-hub.local
```

### Configuration

The base URL for tests is configured in `test-local.env`:

```env
PLAYWRIGHT_baseURL=http://berwyn.prisoner-content-hub.local:3000
```

You can change this to test against a different prison by updating the hostname to any of the supported prisons.

### Running Tests Locally

```bash
# Run all tests
cd e2e
npm run test

# Run tests in UI mode
npm run test:ui

# Run tests in headed mode (see browser)
npm run test:headed

# Debug tests
npm run test:debug
```

## CI/CD Configuration

### Docker Compose Setup

The `docker-compose.yml` file includes network aliases for all 21 prisons:

- Local domain pattern: `*.prisoner-content-hub.local`
- CI domain pattern: `*.content-hub.localhost`

All prison domains are aliased to the `web` service, allowing tests to run against any prison.

### CI Environment Configuration

The `test-ci.env` file configures the base URL for CI:

```env
PLAYWRIGHT_baseURL=http://berwyn.content-hub.localhost:3000
```

Both the `web` and `playwright` services in docker-compose use this env file.

### CircleCI Pipeline

The CircleCI job `run_e2e_tests`:

1. Checks out the repository
2. Restores dependencies
3. Sets up remote Docker
4. Runs `npm run test:e2e:ci` which executes `docker-compose up --build --abort-on-container-exit --exit-code-from playwright`
5. Stores test results and reports

## Testing Multiple Prisons

### Using the Prison Utility

The `utils/prisons.ts` file provides helpers for testing across prisons:

```typescript
import { PRISONS, getBaseURL } from './utils/prisons';

// Get all prisons
const allPrisons = PRISONS;

// Get base URL for a specific prison
const berwynURL = getBaseURL('berwyn'); // Local
const berwynCIURL = getBaseURL('berwyn'); // CI (auto-detects)

// Get prison by ID
import { getPrisonByIdName } from './utils/prisons';
const prison = getPrisonByIdName('berwyn');
```

### Parameterized Tests

To run tests against multiple prisons, you can use Playwright's parameterization:

```typescript
import { test } from '@playwright/test';
import { PRISONS } from '../utils/prisons';

// Test against specific prisons
const prisonsToTest = ['berwyn', 'wayland', 'cardiff'];

for (const prisonId of prisonsToTest) {
  test.describe(`Tests for ${prisonId}`, () => {
    test(`should load My Prison page on ${prisonId}`, async ({ page }) => {
      const prison = PRISONS.find(p => p.id === prisonId);
      const isCI = !!process.env.CI;
      const domain = isCI
        ? prison.url.replace(
            'prisoner-content-hub.local',
            'content-hub.localhost',
          )
        : prison.url;

      await page.goto(`http://${domain}:3000/tags/1283`);
      // ... rest of test
    });
  });
}
```

## Switching Test Prison

### Local Development

1. Edit `e2e/test-local.env`
2. Change `PLAYWRIGHT_baseURL` to desired prison:
   ```env
   PLAYWRIGHT_baseURL=http://wayland.prisoner-content-hub.local:3000
   ```

### CI/CD

1. Edit `e2e/test-ci.env`
2. Change `PLAYWRIGHT_baseURL` to desired prison:
   ```env
   PLAYWRIGHT_baseURL=http://wayland.content-hub.localhost:3000
   ```

## Troubleshooting

### Domain not resolving locally

- Verify `/etc/hosts` entries are correct
- Try `ping berwyn.prisoner-content-hub.local` to verify DNS resolution

### Tests failing in CI with connection errors

- Check docker-compose network aliases match the domain in test-ci.env
- Verify the `web` service health check is passing

### Environment variables not loading

- Ensure npm scripts use `export $(cat test-local.env | xargs) && playwright test`
- For CI, verify both `web` and `playwright` services have `env_file: - "./test-ci.env"`

## Architecture

```
┌─────────────────────────────────────────────┐
│  Local Development                          │
│  ┌────────────────────────────────────────┐ │
│  │ /etc/hosts                             │ │
│  │ *.prisoner-content-hub.local → 127.0.0.1│ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ Playwright Tests                       │ │
│  │ Uses: test-local.env                   │ │
│  │ Base URL from PLAYWRIGHT_baseURL       │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  CI/CD (CircleCI)                           │
│  ┌────────────────────────────────────────┐ │
│  │ Docker Compose                         │ │
│  │ ┌────────────────────────────────────┐ │ │
│  │ │ Web Service                        │ │ │
│  │ │ Network Aliases:                   │ │ │
│  │ │ - berwyn.content-hub.localhost     │ │ │
│  │ │ - wayland.content-hub.localhost    │ │ │
│  │ │ - ... (all 21 prisons)             │ │ │
│  │ │ Uses: test-ci.env                  │ │ │
│  │ └────────────────────────────────────┘ │ │
│  │ ┌────────────────────────────────────┐ │ │
│  │ │ Playwright Service                 │ │ │
│  │ │ Uses: test-ci.env                  │ │ │
│  │ │ Base URL from PLAYWRIGHT_baseURL   │ │ │
│  │ └────────────────────────────────────┘ │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

## Best Practices

1. **Single Prison per Test Run**: Currently, tests run against one prison at a time (configured via environment variable)
2. **Prison Selection**: Use Berwyn as the default prison for most tests
3. **Parameterized Tests**: For comprehensive testing, create parameterized tests that can run against multiple prisons
4. **Environment Consistency**: Keep test-local.env and test-ci.env in sync regarding which prison is being tested
5. **Health Checks**: The web service health check ensures the application is ready before tests run
