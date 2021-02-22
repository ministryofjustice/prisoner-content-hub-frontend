const { formatPrisonName } = require('../../../utils/string');

class Prison {
  constructor(options = {}) {
    const { agencyId, description, longDescription } = options;
    this.prisonId = agencyId;
    this.description = description;
    this.longDescription = longDescription;
  }

  format() {
    return {
      prisonId: this.prisonId,
      description: this.description,
      longDescription: formatPrisonName(this.longDescription),
    };
  }

  static from(response = {}) {
    return new Prison(response);
  }
}

module.exports = {
  Prison,
};
