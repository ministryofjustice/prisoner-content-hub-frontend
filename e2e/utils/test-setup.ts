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
    await this.auth.stubClientCredentialsToken();
  }

  async reset(): Promise<void> {
    await this.wiremock.reset();
  }
}

export const testSetup = new TestSetup();