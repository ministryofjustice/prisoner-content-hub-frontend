import { WiremockUtils } from './wiremock';
import { AuthUtils } from './auth';
import { DrupalUtils } from './drupal';
import { IncentivesApiUtils } from './incentives-api';
import { PRISONS } from './prisons';

type Prison = typeof PRISONS[number];

export class TestSetup {
  public wiremock: WiremockUtils;
  public auth: AuthUtils;
  public drupal: DrupalUtils;
  public incentivesApi: IncentivesApiUtils;

  constructor() {
    this.wiremock = new WiremockUtils();
    this.auth = new AuthUtils();
    this.drupal = new DrupalUtils();
    this.incentivesApi = new IncentivesApiUtils();
  }

  async stubPrisonerSignIn(): Promise<void> {
    // Skip Wiremock stubs when testing against dev environment
    if (process.env.USE_DEV_ENV === 'true') {
      return;
    }
    await this.auth.stubClientCredentialsToken();
  }

  async reset(): Promise<void> {
    // Skip Wiremock reset when testing against dev environment
    if (process.env.USE_DEV_ENV === 'true') {
      return;
    }
    await this.wiremock.reset();
  }

  getBaseURL(prison: Prison): string {
    if (process.env.USE_DEV_ENV === 'true') {
      return prison.devUrl;
    }
    const isCI = !!process.env.CI;
    const domain = isCI 
      ? prison.url.replace('prisoner-content-hub.local', 'content-hub.localhost')
      : prison.url;
    return `http://${domain}:3000`;
  }
}

export const testSetup = new TestSetup();