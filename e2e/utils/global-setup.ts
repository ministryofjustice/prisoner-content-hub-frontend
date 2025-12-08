import { testSetup } from './test-setup';

async function globalSetup() {
  console.log('Starting global setup for Playwright tests');
  
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