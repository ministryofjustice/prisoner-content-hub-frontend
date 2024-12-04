const { randomUUID } = require('crypto');
const { getEstablishmentId, getEstablishmentDisplayName } = require('../utils');
const config = require('../config');

const configureEstablishment = (req, res, next) => {
  const establishmentName = req.session?.establishmentName;
  if (!req.session?.establishmentId) {
    const establishmentId = getEstablishmentId(establishmentName);
    req.session.id = randomUUID();
    if (!Number.isNaN(establishmentId)) {
      req.session.establishmentId = establishmentId;
    }
  }

  res.locals.feedbackId = randomUUID();
  res.locals.establishmentName = establishmentName;
  res.locals.establishmentEnabled = config.sites[establishmentName]?.enabled;
  res.locals.establishmentDisplayName = `${getEstablishmentDisplayName(
    req.session.establishmentId,
  )}`;

  next();
};

module.exports = configureEstablishment;
