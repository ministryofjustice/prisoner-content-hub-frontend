// eslint-disable-next-line import/no-useless-path-segments
const {
  placeholders: { DEFAULT },
} = require('../../../utils/enums');
const { fullNameOrDefault } = require('../../../utils/string');

class Offender {
  constructor(options = {}) {
    this.bookingId = options.bookingId;
    this.offenderNo = options.offenderNo;
    this.firstName = options.firstName;
    this.lastName = options.lastName;
    this.agencyId = options.agencyId;
    this.dateOfBirth = options.dateOfBirth;
  }

  format() {
    return {
      bookingId: this.bookingId,
      offenderNo: this.offenderNo,
      agencyId: this.agencyId,
      dateOfBirth: this.dateOfBirth,
      name: fullNameOrDefault(DEFAULT, this.firstName, this.lastName),
    };
  }

  static from(response = {}) {
    return new Offender(response);
  }
}

module.exports = {
  Offender,
};
