import { testSetup } from './test-setup';

async function globalSetup() {
  console.log('Starting global setup for Playwright tests');
  
  // Skip Wiremock setup when testing against dev environment
  if (process.env.USE_DEV_ENV === 'true') {
    console.log('Skipping Wiremock setup - testing against dev environment');
    console.log('Global setup completed successfully');
    return;
  }
  
  try {
    // Reset wiremock to ensure clean state
    console.log('Resetting Wiremock...');
    await testSetup.reset();
    console.log('Wiremock reset complete');
    
    console.log('Global setup completed successfully');
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  }
  
  return;
}

export default globalSetup;