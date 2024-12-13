const { randomUUID } = require('crypto');
const { getEstablishmentId, getEstablishmentDisplayName } = require('../utils');
const config = require('../config');

const configureEstablishment = (req, res, next) => {
  const buildHref = lng => {
    const url = new URL(
      `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    );
    url.searchParams.set('lng', lng);
    return url.toString();
  };

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

  res.locals.currentLng = req.language?.split('-')[0] || 'en';
  if (config.sites[establishmentName]?.languages.length > 1) {
    res.locals.multilingual = true;
    res.locals.translations = config.languages.reduce(
      (result, { lang, text }) =>
        config.sites[establishmentName].languages.includes(lang)
          ? result.push({ href: buildHref(lang), lang, text }) && result
          : result,
      [],
    );
  }
  next();
};

module.exports = configureEstablishment;
