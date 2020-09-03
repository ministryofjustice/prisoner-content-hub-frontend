const { capitalize } = require('../../../utils');
const {
  placeholders: { DEFAULT },
} = require('../../../utils/enums');

class KeyWorker {
  constructor(options = {}) {
    this.firstName = options.firstName;
    this.lastName = options.lastName;
  }

  format() {
    const fullName = [this.firstName, this.lastName]
      .map(capitalize)
      .join(' ')
      .trim();

    return {
      current: fullName !== '' ? fullName : DEFAULT,
      lastMeeting: DEFAULT,
    };
  }

  static from(response = {}) {
    return new KeyWorker(response);
  }
}

module.exports = {
  KeyWorker,
};
