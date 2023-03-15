const express = require('express');
const config = require('../config');
const { createBreadcrumbs } = require('../utils/breadcrumbs');
const { createPagination } = require('../utils/pagination');

const createAdjudicationsRouter = ({ offenderService }) => {
  const router = express.Router();

  const getPersonalisation = async (user, query) => {
    try {
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
    } catch (error) {
      throw ('error', error);
    }
  };

  router.get('/', async (req, res, next) => {
    const { user, originalUrl: returnUrl, query } = req;

    if (
      config.features.adjudicationsFeatureEnabled &&
      config.features.adjudicationsFeatureEnabledAt.includes(
        req.session.establishmentName,
      )
    ) {
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
          user,
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
