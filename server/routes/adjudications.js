const express = require('express');
const config = require('../config');
const { createBreadcrumbs } = require('../utils/breadcrumbs');

const createAdjudicationsRouter = ({ offenderService }) => {
  const router = express.Router();

  const getPersonalisation = async user => {
    const adjudications = await offenderService.getAdjudicationsFor(user);

    return {
      signedInUser: user.getFullName(),
      adjudications,
    };
  };

  router.get('/', async (req, res, next) => {
    const { user, originalUrl: returnUrl } = req;

    if (config.features.adjudicationsFeatureEnabled) {
      try {
        const personalisation = user ? await getPersonalisation(user) : {};

        return res.render('pages/adjudications', {
          title: 'My adjudications',
          content: false,
          header: false,
          postscript: true,
          detailsType: 'small',
          returnUrl,
          ...personalisation,
          data: { contentType: 'profile', breadcrumbs: createBreadcrumbs(req) },
          displayImportantNotice: true,
        });
      } catch (e) {
        return next(e);
      }
    }
    return next();
  });

  return router;
};

module.exports = {
  createAdjudicationsRouter,
};
