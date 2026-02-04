import { WiremockUtils } from './wiremock';
import { AuthUtils } from './auth';
import { DrupalUtils } from './drupal';
import { IncentivesApiUtils } from './incentives-api';

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
}

export const testSetup = new TestSetup();