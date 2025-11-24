import { test, expect, APIResponse } from '@playwright/test';
import { testSetup } from '../../utils/test-setup';

test.describe('Feature: Application Health Check', () => {
  test.beforeEach(async () => {
    await testSetup.reset();
  });

  test('Scenario: Check application health status', async ({ request }) => {
    await test.step('Given the application is running', async () => {
      // Application is running as part of test setup
    });

    let response: APIResponse;
    await test.step('When I request the health endpoint', async () => {
      response = await request.get('/health');
    });

    await test.step('Then the status should be "UP"', async () => {
      const body = await response.json();
      expect(body.status).toBe('UP');
    });

    await test.step('And the response should include health information', async () => {
      const body = await response.json();
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('uptime');
    });
  });

  test('Scenario: Check application uptime', async ({ request }) => {
    await test.step('Given the application is running', async () => {
      // Application is running as part of test setup
    });

    let response: APIResponse;
    await test.step('When I request the health endpoint', async () => {
      response = await request.get('/health');
    });

    await test.step('Then the uptime should be greater than 0', async () => {
      const body = await response.json();
      expect(body.uptime).toBeGreaterThan(0);
    });
  });

  test('Scenario: Check application readiness', async ({ request }) => {
    await test.step('Given the application is running', async () => {
      // Application is running as part of test setup
    });

    let response: APIResponse;
    await test.step('When I request the readiness endpoint', async () => {
      response = await request.get('/health/readiness');
    });

    await test.step('Then the readiness status should be "UP"', async () => {
      const body = await response.json();
      expect(body.status).toBe('UP');
    });
  });
});
