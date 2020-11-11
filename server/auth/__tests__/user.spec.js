const { User } = require('../user');

describe('User', () => {
  it('should construct when all parameters are passed', () => {
    const user = new User({
      prisonerId: 'A1234BC',
      firstName: 'Gerry',
      lastName: 'Harding',
      bookingId: 1234,
    });

    expect(user.prisonerId).toBe('A1234BC');
    expect(user.firstName).toBe('Gerry');
    expect(user.lastName).toBe('Harding');
    expect(user.bookingId).toBe(1234);
  });

  it('should construct without a booking ID', () => {
    const user = new User({
      prisonerId: 'A1234BC',
      firstName: 'Alan',
      lastName: 'Grant',
    });

    expect(user.prisonerId).toBe('A1234BC');
    expect(user.firstName).toBe('Alan');
    expect(user.lastName).toBe('Grant');
    expect(user.bookingId).not.toBeDefined();
  });

  describe('from', () => {
    it('should parse a JWT token and return a new User', () => {
      const jwt =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnaXZlbl9uYW1lIjoiUk9CRVJUIiwiZmFtaWx5X25hbWUiOiJNVUxET09OIiwidW5pcXVlX25hbWUiOiJBMTIzNEJDQGlkZW50aXR5LnByaXNvbmVyLnNlcnZpY2UuanVzdGljZS5nb3YudWsnIn0.g5yo43XdhGY0Ps-679wKjsH-aHXqfUZWAqqS7UbHJjw';

      const user = User.from(jwt);

      expect(user.prisonerId).toBe('A1234BC');
      expect(user.firstName).toBe('Robert');
      expect(user.lastName).toBe('Muldoon');
    });
  });

  describe('serialize', () => {
    it('should serialize the user object', () => {
      const user = new User({
        prisonerId: 'A1234BC',
        firstName: 'Henry',
        lastName: 'Wu',
        bookingId: 1234,
      });

      expect(user.serialize()).toBe(
        JSON.stringify({
          prisonerId: 'A1234BC',
          firstName: 'Henry',
          lastName: 'Wu',
          bookingId: 1234,
        }),
      );
    });
  });

  describe('deserialize', () => {
    it('should deserialize and return a user object', () => {
      const serializedUser = JSON.stringify({
        prisonerId: 'A1234BC',
        firstName: 'Ian',
        lastName: 'Malcolm',
        bookingId: 1234,
      });

      const user = User.deserialize(serializedUser);

      expect(user.prisonerId).toBe('A1234BC');
      expect(user.firstName).toBe('Ian');
      expect(user.lastName).toBe('Malcolm');
      expect(user.bookingId).toBe(1234);
    });
  });

  describe('setBookingId', () => {
    it('should set a booking ID', () => {
      const user = new User({
        prisonerId: 'A1234BC',
        firstName: 'Alan',
        lastName: 'Grant',
      });

      user.setBookingId(1234);

      expect(user.bookingId).toBe(1234);
    });
  });

  describe('getFullName', () => {
    it('should return the full name formed from first and last names', () => {
      const user = new User({
        prisonerId: 'A1234BC',
        firstName: 'Donald',
        lastName: 'Gennaro',
        bookingId: 1234,
      });

      expect(user.getFullName()).toBe('Donald Gennaro');
    });

    it('should still return a correctly formatted name if fields are missing', () => {
      let user = new User({
        prisonerId: 'A1234BC',
        firstName: 'Ray',
        bookingId: 1234,
      });

      expect(user.getFullName()).toBe('Ray');

      user = new User({
        prisonerId: 'A1234BC',
        lastName: 'Arnold',
        bookingId: 1234,
      });

      expect(user.getFullName()).toBe('Arnold');
    });
  });
});
