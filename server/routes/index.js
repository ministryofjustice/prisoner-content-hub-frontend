const express = require('express');
const { path } = require('ramda');
const {
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
} = require('../utils');

const createIndexRouter = ({
  logger,
  hubFeaturedContentService,
  offenderService,
  config,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');
      const establishmentId = path(['locals', 'establishmentId'], res);

      const personalInformation = path(
        ['locals', 'features', 'personalInformation'],
        res,
      );

      const homePageLinks = getEstablishmentHomepageLinks(
        establishmentId,
        config,
      );

      const homePageLinksTitle = getEstablishmentHomepageLinksTitle(
        establishmentId,
        config,
      );

      const featuredContentResults = await hubFeaturedContentService.hubFeaturedContent(
        { establishmentId },
      );
      const featuredContent =
        featuredContentResults !== [] && featuredContentResults.featured
          ? featuredContentResults.featured[0]
          : [];

      const pageConfig = {
        content: true,
        header: true,
        postscript: true,
        detailsType: 'large',
        personalInformation,
        establishmentId,
        returnUrl: req.originalUrl,
      };

      const data = {};

      if (req.user) {
        pageConfig.userName = req.user.getFullName();
        pageConfig.welcomeMessage = `Hi, ${req.user.getFullName()}`;

        const { bookingId } = req.user;
        const {
          todaysEvents,
          isTomorrow,
        } = await offenderService.getEventsForToday(bookingId);
        data.todaysEvents = todaysEvents;
        data.isTomorrow = isTomorrow;
      }

      res.render('pages/home', {
        config: pageConfig,
        title: 'Home',
        homePageLinks,
        homePageLinksTitle,
        featuredContent,
        ...data,
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

module.exports = {
  createIndexRouter,
};
