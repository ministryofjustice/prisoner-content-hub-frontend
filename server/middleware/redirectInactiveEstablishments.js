const { getEstablishmentActive } = require('../utils');
const { newContentHub } = require('../config');

module.exports = (req, res) => {
  if (!req.session?.establishmentId) return
  if (!newContentHub.url?.length) return
  if(!getEstablishmentActive(req.session?.establishmentId)) res.redirect(newContentHub.url)
};
