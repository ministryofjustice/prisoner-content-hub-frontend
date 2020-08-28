const jwt = require('jsonwebtoken');

class User {
  constructor(profile = {}) {
    this.id = profile.id;
    this.prisonerId = profile.prisonerId;
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
  }

  serialize() {
    return JSON.stringify({
      id: this.id,
      prisonerId: this.prisonerId,
      firstName: this.firstName,
      lastName: this.lastName,
    });
  }

  static deserialize(serialized) {
    const { id, prisonerId, firstName, lastName } = JSON.parse(serialized);

    return new User({
      id,
      prisonerId,
      firstName,
      lastName,
    });
  }

  static from(token) {
    const profile = jwt.decode(token);

    return new User({
      id: profile.id,
      prisonerId: profile.unique_name.split('@').shift(),
      firstName: profile.given_name,
      lastName: profile.family_name,
    });
  }
}

module.exports = {
  User,
};
