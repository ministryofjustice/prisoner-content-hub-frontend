const jwt = require('jsonwebtoken');
const { stubFor } = require('./wiremock');

const createClientCredsToken = () => {
  const payload = {
    access_token: 'token',
    token_type: 'bearer',
    expires_in: 1199,
    scope: 'read',
    sub: 'use-of-force-system',
    auth_source: 'none',
    iss: 'https://sign-in-dev.hmpps.service.justice.gov.uk/auth/issuer',
  };

  return jwt.sign(payload, 'secret', { expiresIn: '1h' });
};

const stubClientCredentialsToken = () =>
  stubFor({
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
        access_token: createClientCredsToken(),
        token_type: 'bearer',
        refresh_token: 'refresh',
        expires_in: 600,
        scope: 'read write',
        internalUser: true,
      },
    },
  });

module.exports = {
  stubClientCredentialsToken,
};
