const {
  createSignInMiddleware,
  createSignInCallbackMiddleware,
  createSignOutMiddleware,
} = require('../../server/auth/middleware');

describe('AuthMiddleware', () => {
  describe('createSignInMiddleware', () => {
    it('should return a middleware function', () => {
      const signInMiddleware = createSignInMiddleware();
      expect(typeof signInMiddleware).to.equal('function');
    });
  });

  describe('createSignInCallbackMiddleware', () => {
    it('should return a middleware function', () => {
      const signInMiddleware = createSignInCallbackMiddleware({
        offenderService: () => {},
      });
      expect(typeof signInMiddleware).to.equal('function');
    });
  });

  describe('createSignOutMiddleware', () => {
    it('should return a middleware function', () => {
      const signInMiddleware = createSignOutMiddleware();
      expect(typeof signInMiddleware).to.equal('function');
    });
  });
});
