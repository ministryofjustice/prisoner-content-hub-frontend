const express = require('express');
const { path } = require('ramda');
const {
  getEstablishmentHomepageLinks,
  getEstablishmentHomepageLinksTitle,
} = require('../utils');

const createIndexRouter = ({ logger, hubFeaturedContentService, config }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const userName = path(['session', 'user', 'name'], req);
      const establishmentId = path(['locals', 'establishmentId'], res);
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);
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
        newDesigns,
        userName: userName ? `Hi, ${userName}` : null,
        establishmentId,
        returnUrl: req.originalUrl,
      };

      res.render('pages/home', {
        config: pageConfig,
        title: 'Home',
        homePageLinks,
        homePageLinksTitle,
        featuredContent: featuredContent.featured[0],
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
