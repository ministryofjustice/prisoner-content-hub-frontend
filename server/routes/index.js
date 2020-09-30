const express = require('express');
const { path } = require('ramda');
const {
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
} = require('../utils');

const createIndexRouter = ({
  hubFeaturedContentService,
  offenderService,
  config,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const establishmentId = path(['session', 'establishmentId'], req);

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

      const featuredContent = await hubFeaturedContentService.hubFeaturedContent(
        { establishmentId },
      );

      const pageConfig = {
        content: true,
        header: true,
        postscript: true,
        detailsType: 'large',
        personalInformation,
        establishmentId,
        returnUrl: req.originalUrl,
      };

      let todaysEvents = {};

      if (req.user) {
        pageConfig.userName = req.user.getFullName();
        pageConfig.welcomeMessage = `Hi, ${req.user.getFullName()}`;

        const { bookingId } = req.user;
        todaysEvents = await offenderService.getEventsForToday(bookingId);
      }

      res.render('pages/home', {
        config: pageConfig,
        title: 'Home',
        homePageLinks,
        homePageLinksTitle,
        featuredContent: featuredContent.featured[0],
        todaysEvents,
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
