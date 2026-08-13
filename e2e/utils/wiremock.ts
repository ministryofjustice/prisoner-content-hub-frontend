import * as superagent from 'superagent';

export class WiremockUtils {
  private host: string;
  private url: string;

  constructor() {
    this.host = process.env.WIREMOCK_BASE_URL || 'http://localhost:9091';
    this.url = `${this.host}/__admin`;
    console.log(`wiremock url: ${this.url}`);
  }

  async stubFor(mapping: any): Promise<superagent.Response> {
    return superagent.post(`${this.url}/mappings`).send(mapping);
  }

  async reset(): Promise<void> {
    await Promise.all([
      superagent.delete(`${this.url}/mappings`),
      superagent.delete(`${this.url}/requests`),
    ]);
  }
}