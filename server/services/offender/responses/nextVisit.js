const {
  placeholders: { DEFAULT },
  dateFormats: {
    PRETTY_DAY,
    PRETTY_DAY_AND_MONTH,
    LONG_PRETTY_DATE,
    PRETTY_TIME,
  },
} = require('../../../utils/enums');
const { formatDateOrDefault } = require('../../../utils/date');
const { fullNameOrDefault } = require('../../../utils/string');
const visitTypeDisplayText = require('../../../content/visitType.json');

module.exports = (response = []) => {
  if (!response?.length) {
    return { hasNextVisit: false };
  }

  const { visitDetails, visitors } = response[0];
  const { startTime, endTime, visitTypeDescription: visitType } = visitDetails;

  return {
    hasNextVisit: startTime != null,
    nextVisit: formatDateOrDefault(DEFAULT, LONG_PRETTY_DATE, startTime),
    nextVisitDay: formatDateOrDefault(DEFAULT, PRETTY_DAY, startTime),
    nextVisitDate: formatDateOrDefault(
      DEFAULT,
      PRETTY_DAY_AND_MONTH,
      startTime,
    ),
    visitors: visitors.map(({ firstName, lastName }) =>
      fullNameOrDefault(DEFAULT, firstName, lastName),
    ),
    visitType: visitTypeDisplayText?.[visitType] || DEFAULT,
    startTime: formatDateOrDefault(DEFAULT, PRETTY_TIME, startTime),
    endTime: formatDateOrDefault(DEFAULT, PRETTY_TIME, endTime),
  };
};
