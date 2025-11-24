import { test, expect } from '@playwright/test';
import { testSetup } from '../../utils/test-setup';

test.describe('Playwright Setup Verification', () => {
  test.beforeEach(async () => {
    await testSetup.reset();
  });

  test('should initialize Wiremock utilities correctly', async () => {
    // Test that our utilities are properly initialized
    expect(testSetup).toBeDefined();
    expect(testSetup.wiremock).toBeDefined();
    expect(testSetup.auth).toBeDefined();
    expect(testSetup.drupal).toBeDefined();
    expect(testSetup.incentivesApi).toBeDefined();
  });

  test('should be able to stub authentication', async () => {
    // Test that we can set up auth stubs
    await expect(testSetup.auth.stubClientCredentialsToken()).resolves.not.toThrow();
  });

  test('should load fixture data correctly', async () => {
    // Test fixture loading
    const fs = require('fs');
    const path = require('path');
    
    const fixturePath = path.join(__dirname, '../fixtures/example.json');
    const fixtureExists = fs.existsSync(fixturePath);
    
    expect(fixtureExists).toBe(true);
    
    if (fixtureExists) {
      const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
      expect(fixtureData).toHaveProperty('name');
      expect(fixtureData.email).toBe('hello@playwright.dev');
    }
  });

  test('should handle TypeScript compilation correctly', async () => {
    // Test TypeScript functionality
    interface TestInterface {
      message: string;
      status: number;
    }
    
    const testObj: TestInterface = {
      message: 'TypeScript is working',
      status: 200
    };
    
    expect(testObj.message).toBe('TypeScript is working');
    expect(testObj.status).toBe(200);
  });
});