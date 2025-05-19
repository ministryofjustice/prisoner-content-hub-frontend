const {
  placeholders: { DEFAULT },
} = require('../../../utils/enums');
const { fullNameOrDefault } = require('../../../utils/string');

class KeyWorker {
  constructor(options = {}) {
    this.firstName = options.firstName;
    this.lastName = options.lastName;
  }

  format() {
    return {
      current: fullNameOrDefault(DEFAULT, this.firstName, this.lastName),
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
