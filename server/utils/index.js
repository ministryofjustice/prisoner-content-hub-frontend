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
  groupBy,
  sortBy,
};
