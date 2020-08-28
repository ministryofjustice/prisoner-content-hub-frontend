const jwt = require('jsonwebtoken');
const { capitalize } = require('../utils');

class User {
  constructor(profile = {}) {
    this.id = profile.id;
    this.prisonerId = profile.prisonerId;
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.bookingId = profile.bookingId;
  }

  setBookingId(bookingId) {
    this.bookingId = bookingId;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      prisonerId: this.prisonerId,
      firstName: this.firstName,
      lastName: this.lastName,
      bookingId: this.bookingId,
    });
  }

  static deserialize(serialized) {
    const { id, prisonerId, firstName, lastName, bookingId } = JSON.parse(
      serialized,
    );

    return new User({
      id,
      prisonerId,
      firstName,
      lastName,
      bookingId,
    });
  }

  static from(token) {
    const profile = jwt.decode(token);

    return new User({
      id: profile.id,
      prisonerId: profile.unique_name.split('@').shift(),
      firstName: capitalize(profile.given_name),
      lastName: capitalize(profile.family_name),
    });
  }
}

module.exports = {
  User,
};
