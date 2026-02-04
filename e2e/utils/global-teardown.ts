import { testSetup } from './test-setup';

async function globalTeardown() {
  console.log('Starting global teardown for Playwright tests');
  
  // Skip Wiremock teardown when testing against dev environment
  if (process.env.USE_DEV_ENV === 'true') {
    console.log('Skipping Wiremock teardown - tested against dev environment');
    console.log('Global teardown completed successfully');
    return;
  }
  
  try {
    // Clean up wiremock state
    console.log('Cleaning up Wiremock...');
    await testSetup.reset();
    console.log('Wiremock cleanup complete');
    
    console.log('Global teardown completed successfully');
  } catch (error) {
    console.error('Global teardown failed:', error);
    // Don't throw - teardown failures shouldn't fail the test run
  }
  
  return;
}

export default globalTeardown;
