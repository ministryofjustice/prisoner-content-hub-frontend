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

const getEstablishmentByName = (
  name,
  establishmentData = defaultEstablishmentData,
) =>
  Object.values(establishmentData).find(
    establishment => establishment.name === name,
  );

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

const getHomepageLinks = (
  establishmentName,
  establishmentData = defaultEstablishmentData,
) =>
  getEstablishmentByName(establishmentName, establishmentData)?.homePageLinks;

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

module.exports = {
  getEstablishmentId,
  getEstablishment,
  updateSessionEstablishment,
  getEstablishmentDisplayName,
  getHomepageLinks,
  capitalize,
  capitalizeAll,
  capitalizePersonName,
};
