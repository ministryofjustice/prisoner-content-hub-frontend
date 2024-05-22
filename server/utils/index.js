const { logger } = require('./logger');
const defaultEstablishmentData = require('../content/establishmentData.json');

const getEstablishmentId = (
  establishmentName,
  establishmentData = defaultEstablishmentData,
) =>
  parseInt(
    Object.keys(establishmentData).find(
      id => establishmentData?.[id]?.name === establishmentName,
    ),
    10,
  );

const getEstablishment = (
  agencyId,
  establishmentData = defaultEstablishmentData,
) => {
  const establishmentId = Object.keys(establishmentData).find(
    id => establishmentData?.[id]?.agencyId === agencyId,
  );
  return {
    establishmentId,
    establishmentName: establishmentData[establishmentId]?.name,
  };
};

const updateSessionEstablishment = (req, agencyId) => {
  logger.info(`Calling updateSessionEstablishment with agencyId ${agencyId}`);
  if (!req.session?.establishmentName) {
    logger.info('No establishmentName found');
    const { establishmentId, establishmentName } = getEstablishment(agencyId);
    logger.info(
      `getEstablishment returned establishmentId=${establishmentId}, establishmentName=${establishmentName}`,
    );
    req.session.establishmentId = establishmentId;
    req.session.establishmentName = establishmentName;
  }
};

const getEstablishmentDisplayName = (
  id,
  establishmentData = defaultEstablishmentData,
) => establishmentData?.[id]?.displayName;

const capitalize = (str = '') =>
  str === '' ? '' : str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

function capitalizeAll(input, separator = ' ') {
  if (input === '') return '';

  const names = input.split(separator);

  return names.map(name => capitalize(name.trim())).join(separator);
}

function capitalizePersonName(input, separator = ' ') {
  if (input === '') return '';

  const names = input.split(separator);

  return names
    .map(name => capitalizeAll(capitalize(name.trim()), '-'))
    .join(separator);
}

function groupBy(items, keyAccessor) {
  return items.reduce((acc, item) => {
    const key = keyAccessor(item);
    const bucket = acc[key] || [];
    acc[key] = [...bucket, item];
    return acc;
  }, {});
}

const sortBy = key => (a, b) => {
  if (a === b) return 0;
  return a[key] < b[key] ? -1 : 1;
};

module.exports = {
  getEstablishmentId,
  getEstablishment,
  updateSessionEstablishment,
  getEstablishmentDisplayName,
  capitalize,
  capitalizeAll,
  capitalizePersonName,
  groupBy,
  sortBy,
};
