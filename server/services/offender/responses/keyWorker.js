const {
  placeholders: { DEFAULT },
} = require('../../../utils/enums');
const { fullNameOr } = require('../../../utils/string');

class KeyWorker {
  constructor(options = {}) {
    this.firstName = options.firstName;
    this.lastName = options.lastName;
  }

  format() {
    return {
      current: fullNameOr(DEFAULT, this.firstName, this.lastName),
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
