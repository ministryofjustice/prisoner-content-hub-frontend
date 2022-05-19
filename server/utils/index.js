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

const getEstablishmentIsYoi = (
  establishmentId,
  establishmentData = defaultEstablishmentData,
) => establishmentData[establishmentId]?.youth || false;

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
  if (!req.session?.establishmentName) {
    const { establishmentId, establishmentName } = getEstablishment(agencyId);
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

module.exports = {
  getEstablishmentId,
  getEstablishment,
  getEstablishmentIsYoi,
  updateSessionEstablishment,
  getEstablishmentDisplayName,
  capitalize,
  capitalizeAll,
  capitalizePersonName,
  groupBy,
};
