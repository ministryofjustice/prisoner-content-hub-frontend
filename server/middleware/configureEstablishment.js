const { path } = require('ramda');

const {
  getEstablishmentId,
  getEstablishmentFormattedName,
  getEstablishmentPrefix,
} = require('../utils');

const configureEstablishment = () => (req, res, next) => {
  req.session.prison = path(
    ['app', 'locals', 'config', 'establishmentName'],
    req,
  );

  const establishmentId = getEstablishmentId(req.session.prison);

  res.locals.establishmentId = establishmentId;
  res.locals.establishmentName = `${getEstablishmentPrefix(
    establishmentId,
  )} ${getEstablishmentFormattedName(establishmentId)}`;

  next();
};

module.exports = {
  configureEstablishment,
};
