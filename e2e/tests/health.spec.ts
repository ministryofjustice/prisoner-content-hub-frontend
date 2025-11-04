import { test, expect } from '@playwright/test';
import { testSetup } from '../utils/test-setup';

test.describe('Healthcheck', () => {
  test.describe('All healthy', () => {
    test.beforeEach(async () => {
      await testSetup.reset();
    });

    test("'healthy' key/value pair is present with the expected value", async ({ request }) => {
      const response = await request.get('/health');
      const body = await response.json();
      expect(body.status).toBe('UP');
    });

    test("'uptime' key/value pair is present with the expected value", async ({ request }) => {
      const response = await request.get('/health');
      const body = await response.json();
      expect(body.uptime).toBeGreaterThan(0);
    });

    test('Health/readiness is visible and UP', async ({ request }) => {
      const response = await request.get('/health/readiness');
      const body = await response.json();
      expect(body.status).toBe('UP');
    });
  });
});