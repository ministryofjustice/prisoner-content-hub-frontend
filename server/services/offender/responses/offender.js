// eslint-disable-next-line import/no-useless-path-segments
const { capitalize } = require('../../../utils');
const {
  placeholders: { DEFAULT },
} = require('../../../utils/enums');

class Offender {
  constructor(options = {}) {
    const { bookingId, offenderNo, firstName, lastName } = options;

    this.bookingId = bookingId;
    this.offenderNo = offenderNo;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  format() {
    const fullName = [this.firstName, this.lastName]
      .map(capitalize)
      .join(' ')
      .trim();

    return {
      bookingId: this.bookingId,
      offenderNo: this.offenderNo,
      name: fullName !== '' ? fullName : DEFAULT,
    };
  }

  static from(response = {}) {
    return new Offender(response);
  }
}

module.exports = {
  Offender,
};
