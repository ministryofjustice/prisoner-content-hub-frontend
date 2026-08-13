import { WiremockUtils } from './wiremock';

export class IncentivesApiUtils {
  private wiremock: WiremockUtils;

  constructor() {
    this.wiremock = new WiremockUtils();
  }

  private async stub(urlPattern: string, jsonBody: any): Promise<void> {
    await this.wiremock.stubFor({
      request: {
        method: 'GET',
        urlPattern,
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody,
      },
    });
  }

  async stubIncentives(incentives: any): Promise<void> {
    await this.stub(`/incentivesapi/incentive-reviews/booking/.*?`, incentives);
  }
}