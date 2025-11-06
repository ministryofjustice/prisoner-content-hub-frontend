import * as jwt from 'jsonwebtoken';
import { WiremockUtils } from './wiremock';

export class AuthUtils {
  private wiremock: WiremockUtils;

  constructor() {
    this.wiremock = new WiremockUtils();
  }

  private createClientCredsToken(): string {
    const payload = {
      access_token: 'token',
      token_type: 'bearer',
      expires_in: 1199,
      scope: 'read',
      sub: 'hub-sub',
      auth_source: 'none',
      iss: process.env.AUTH_ISSUER || 'auth-issuer',
    };

    return jwt.sign(payload, 'secret', { expiresIn: '1h' });
  }

  async stubClientCredentialsToken(): Promise<void> {
    await this.wiremock.stubFor({
      request: {
        method: 'POST',
        urlPattern: '/auth/oauth/token.*',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          access_token: this.createClientCredsToken(),
          token_type: 'bearer',
          refresh_token: 'refresh',
          expires_in: 600,
          scope: 'read write',
          internalUser: true,
        },
      },
    });
  }
}