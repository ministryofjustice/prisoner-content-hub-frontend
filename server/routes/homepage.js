const express = require('express');
const { checkFeatureEnabledAtSite } = require('../utils');

const createHomepageRouter = ({ cmsService, offenderService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const { establishmentName } = req.session;

      if (!establishmentName) {
        throw new Error('Could not determine establishment!');
      }

      const [
        { featuredContent, keyInfo, largeUpdateTile: largeUpdateTileSpecified },
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
      const useLargeUpdateTile = Boolean(largeUpdateTileSpecified?.contentUrl);

      const largeUpdateTile = useLargeUpdateTile
        ? largeUpdateTileSpecified
        : largeUpdateTileDefault;

      const updatesContentWithDuplicatesRemoved = removeDuplicateUpdates(
        updatesContent,
        largeUpdateTile,
      );

      const updatesContentHideViewAll =
        isLastPage &&
        (updatesContentWithDuplicatesRemoved.length < 5 || !useLargeUpdateTile);

      res.render('pages/home', {
        config: {
          content: true,
          header: true,
          postscript: true,
          detailsType: 'large',
        },
        hideSignInLink: true,
        title: 'Home',
        recentlyAddedHomepageContent,
        updatesContent: updatesContentWithDuplicatesRemoved.splice(0, 4),
        updatesContentHideViewAll,
        featuredContent,
        keyInfo,
        largeUpdateTile,
        exploreContent,
        currentEvents,
        displayTimetable: checkFeatureEnabledAtSite(
          req.session.establishmentName,
          'timetable',
        ),
      });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

const removeDuplicateUpdates = (updatesContent, { id }) =>
  updatesContent.filter(update => update.id !== id);

module.exports = {
  createHomepageRouter,
  removeDuplicateUpdates,
};
