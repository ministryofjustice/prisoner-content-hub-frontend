const {
  placeholders: { DEFAULT },
  dateFormats: { GDS_PRETTY_DATE_TIME, GDS_PRETTY_DATE },
} = require('./enums');

const { formatDateOrDefault } = require('./date');

const formatName = (first, last) => {
  const firstName = first ? first.charAt(0).toUpperCase().concat('.') : '';

  const lastName = last
    ? last[0].toUpperCase() + last.substring(1).toLowerCase()
    : '';

  return `${firstName} ${lastName}`;
};

const formatSanction = sanction =>
  sanction
    ? {
        sanctionType: sanction.sanctionType || DEFAULT,
        sanctionDays: sanction.sanctionDays
          ? `${sanction.sanctionDays} days`
          : DEFAULT,
        effectiveDate: formatDateOrDefault(
          DEFAULT,
          GDS_PRETTY_DATE,
          sanction.effectiveDate,
        ),
        status: sanction.status || DEFAULT,
        statusDate: formatDateOrDefault(
          DEFAULT,
          GDS_PRETTY_DATE,
          sanction.statusDate,
        ),
      }
    : {};

const formatOffence = offence =>
  offence
    ? {
        offenceCode: offence.oicOffenceCode || DEFAULT,
        offenceType: offence.offenceType || DEFAULT,
        offenceDescription: offence.offenceDescription || DEFAULT,
        plea: offence.plea || DEFAULT,
        finding: offence.finding || DEFAULT,
        sanctions: offence.sanctions?.map(formatSanction) || DEFAULT,
      }
    : {};

const formatHearing = hearing => {
  let formattedHearing = {};

  if (hearing) {
    const formattedName = formatName(
      hearing.heardByFirstName,
      hearing.heardByLastName,
    );
    const heardBy = formattedName !== ' ' ? formattedName : DEFAULT;

    formattedHearing = {
      hearingTime: formatDateOrDefault(
        DEFAULT,
        GDS_PRETTY_DATE_TIME,
        hearing.hearingTime,
      ),
      hearingType: hearing.hearingType || DEFAULT,
      location: `${hearing.location}, ${hearing.establishment}` || DEFAULT,
      heardBy,
      comment: hearing.comment || DEFAULT,
      offences: hearing.results?.map(formatOffence) || DEFAULT,
    };
  }

  return formattedHearing;
};

module.exports = {
  formatName,
  formatSanction,
  formatOffence,
  formatHearing,
};
