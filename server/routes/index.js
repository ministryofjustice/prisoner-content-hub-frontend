const express = require('express');
const { path } = require('ramda');
const {
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
} = require('../utils');

const createIndexRouter = ({
  hubFeaturedContentService,
  offenderService,
  establishmentData,
}) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const establishmentId = path(['session', 'establishmentId'], req);

      const envPersonalisationEnabled = path(
        ['locals', 'features', 'personalInformation'],
        res,
      );

      const personalInformation =
        path(['session', 'establishmentPersonalisationEnabled'], req) &&
        envPersonalisationEnabled;

      const homePageLinks = getEstablishmentHomepageLinks(
        establishmentId,
        establishmentData,
      );

      const homePageLinksTitle = getEstablishmentHomepageLinksTitle(
        establishmentId,
        establishmentData,
      );

      const featuredContent =
        await hubFeaturedContentService.hubFeaturedContent({ establishmentId });

      const pageConfig = {
        content: true,
        header: true,
        postscript: true,
        detailsType: 'large',
        personalInformation,
        establishmentId,
        returnUrl: req.originalUrl,
      };

      let currentEvents = {};
      const { user } = req;

      if (user) {
        const userName = user.getFullName();
        pageConfig.userName = userName;
        pageConfig.welcomeMessage = `Hi, ${userName}`;
        currentEvents = await offenderService.getCurrentEvents(user);
      }
      res.render('pages/home', {
        config: pageConfig,
        title: 'Home',
        homePageLinks,
        homePageLinksTitle,
        featuredContent: featuredContent.featured[0],
        currentEvents,
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
