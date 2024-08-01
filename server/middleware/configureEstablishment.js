const { v4: uuid } = require('uuid');
const { getEstablishmentId, getEstablishmentDisplayName } = require('../utils');
const config = require('../config');

const configureEstablishment = (req, res, next) => {
  const establishmentName = req.session?.establishmentName;
  if (!req.session?.establishmentId) {
    const establishmentId = getEstablishmentId(establishmentName);
    req.session.id = uuid();
    if (!Number.isNaN(establishmentId)) {
      req.session.establishmentId = establishmentId;
    }
  }

  res.locals.feedbackId = uuid();
  res.locals.establishmentName = establishmentName;
  res.locals.establishmentEnabled = config.sites[establishmentName]?.enabled;
  res.locals.establishmentDisplayName = `${getEstablishmentDisplayName(
    req.session.establishmentId,
  )}`;

  next();
};

module.exports = configureEstablishment;
