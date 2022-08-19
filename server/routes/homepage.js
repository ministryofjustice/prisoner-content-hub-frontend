const express = require('express');

const createHomepageRouter = ({ cmsService, offenderService }) => {
  const router = express.Router();

  router.get('/old-homepage', async (req, res, next) => {
    try {
      const { establishmentName } = req.session;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }

      const homepage = await cmsService.getHomepage(establishmentName);

      const currentEvents = res.locals.isSignedIn
        ? await offenderService.getCurrentEvents(req.user)
        : {};

      res.render('pages/home', {
        config: {
          content: true,
          header: true,
          postscript: true,
          detailsType: 'large',
        },
        hideSignInLink: true,
        title: 'Home',
        homepage,
        currentEvents,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const { establishmentName } = req.session;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }

      const [
        { featuredContent, keyInfo, largeUpdateTile },
        recentlyAddedHomepageContent,
        exploreContent,
        { largeUpdateTileDefault, updatesContent, isLastPage },
      ] = await Promise.all([
        cmsService.getHomepageContent(establishmentName),
        cmsService.getRecentlyAddedHomepageContent(establishmentName),
        cmsService.getExploreContent(establishmentName),
        cmsService.getUpdatesContent(establishmentName),
      ]);
      const currentEvents = res.locals.isSignedIn
        ? await offenderService.getCurrentEvents(req.user)
        : {};
      const useLargeUpdateTile = Boolean(largeUpdateTile?.contentUrl);
      const updatesContentHideViewAll =
        isLastPage && (updatesContent.length < 5 || !useLargeUpdateTile);
      res.render('pages/home-new', {
        config: {
          content: true,
          header: true,
          postscript: true,
          detailsType: 'large',
        },
        hideSignInLink: true,
        title: 'Home',
        recentlyAddedHomepageContent,
        updatesContent: updatesContent.splice(useLargeUpdateTile ? 0 : 1, 4),
        updatesContentHideViewAll,
        featuredContent,
        keyInfo,
        largeUpdateTile: useLargeUpdateTile
          ? largeUpdateTile
          : largeUpdateTileDefault,
        exploreContent,
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
