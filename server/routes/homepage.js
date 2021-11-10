const express = require('express');

const {
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
} = require('../utils');

const createHomepageRouter = ({
  cmsService,
  offenderService,
  establishmentData,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const establishmentId = req.session?.establishmentId;

      const homePageLinks = getEstablishmentHomepageLinks(
        establishmentId,
        establishmentData,
      );

      const homePageLinksTitle = getEstablishmentHomepageLinksTitle(
        establishmentId,
        establishmentData,
      );

      const { establishmentName } = req.session;

      if (!establishmentId) {
        throw new Error('Could not determine establishment!');
      }

      const homepage = await cmsService.getHomepage(establishmentName);

      const pageConfig = {
        content: true,
        header: true,
        postscript: true,
        detailsType: 'large',
        establishmentId,
        returnUrl: req.originalUrl,
      };

      let currentEvents = {};

      if (res.locals.isSignedIn) {
        currentEvents = await offenderService.getCurrentEvents(req.user);
      }
      res.render('pages/home', {
        config: pageConfig,
        title: 'Home',
        homePageLinks,
        homePageLinksTitle,
        homepage,
        currentEvents,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

module.exports = {
  createHomepageRouter,
};
