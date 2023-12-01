const express = require('express');
const config = require('../config');
const { createBreadcrumbs } = require('../utils/breadcrumbs');
const { createPagination } = require('../utils/pagination');
const { logger } = require('../utils/logger');

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

    if (
      config.features.adjudicationsFeatureEnabled &&
      config.features.adjudicationsFeatureEnabledAt.includes(
        req.session.establishmentName,
      )
    ) {
      let personalisation;
      let error = null;

      try {
        personalisation = user ? await getPersonalisation(user, query) : {};
      } catch (e) {
        logger.error(
          `Adjudications Route (/) (getAdjudicationsFor) - Failed: ${e.message} - User: ${user.prisonerId}`,
        );
        logger.debug(e.stack);
        error = e.message;
      }

      return res.render('pages/adjudications', {
        title: 'My adjudications',
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        returnUrl,
        error,
        ...personalisation,
        data: { contentType: 'profile', breadcrumbs: createBreadcrumbs(req) },
        displayImportantNotice: true,
      });
    }
    return next();
  });

  router.get('/:adjudicationId', async (req, res, next) => {
    const { user, originalUrl: returnUrl } = req;
    const { adjudicationId } = req.params;

    if (
      config.features.adjudicationsFeatureEnabled &&
      config.features.adjudicationsFeatureEnabledAt.includes(
        req.session.establishmentName,
      ) &&
      adjudicationId
    ) {
      try {
        const adjudication = await offenderService.getAdjudicationFor(
          user?.prisonerId,
          adjudicationId,
        );

        return res.render('pages/adjudication', {
          title: `View details of ${adjudication.adjudicationNumber}`,
          content: false,
          header: false,
          postscript: true,
          detailsType: 'small',
          returnUrl,
          data: {
            contentType: 'profile',
            breadcrumbs: createBreadcrumbs(req),
            adjudication,
          },
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
