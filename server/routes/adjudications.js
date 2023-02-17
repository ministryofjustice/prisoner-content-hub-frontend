const express = require('express');
const config = require('../config');
const { createBreadcrumbs } = require('../utils/breadcrumbs');
const { createPagination } = require('../utils/pagination');

const createAdjudicationsRouter = ({ offenderService }) => {
  const router = express.Router();

  const getPersonalisation = async (user, query) => {
    const adjudications = await offenderService.getAdjudicationsFor(user);

    const { paginatedData, pageData } = createPagination({
      data: adjudications,
      maxItemsPerPage: config.prisonApi.adjudications.maxAdjudicationsPerPage,
      query,
    });

    return {
      signedInUser: user.getFullName(),
      paginatedData,
      pageData,
    };
  };

  router.get('/', async (req, res, next) => {
    const { user, originalUrl: returnUrl, query } = req;

    if (config.features.adjudicationsFeatureEnabled) {
      try {
        const personalisation = user
          ? await getPersonalisation(user, query)
          : {};

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
