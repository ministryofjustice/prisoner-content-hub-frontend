const express = require('express');
const { path } = require('ramda');
const {
  FACILITY_LIST_CONTENT_IDS: facilitiesList,
} = require('../constants/hub');

const getFacilitiesListFor = id =>
  Object.prototype.hasOwnProperty.call(facilitiesList, id)
    ? facilitiesList[id]
    : '/404';

module.exports = function Home({
  logger,
  offenderService,
  hubFeaturedContentService,
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET home');

      const notification = path(['session', 'notification'], req);
      const userDetails = path(['session', 'user'], req);
      const bookingId = path(['bookingId'], userDetails);
      const establishmentId = path(
        ['app', 'locals', 'envVars', 'establishmentId'],
        req,
      );
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);

      const [{ todaysEvents, isTomorrow }, featuredContent] = await Promise.all(
        [
          offenderService.getEventsForToday(bookingId),
          hubFeaturedContentService.hubFeaturedContent({ establishmentId }),
        ],
      );

      const config = {
        content: true,
        header: true,
        postscript: true,
        newDesigns,
        detailsType: 'large',
        userName: path(['name'], userDetails),
        establishmentId,
      };

      const popularTopics = {
        Visits: '/content/4203',
        Incentives: '/content/4204',
        Games: '/content/3621',
        Inspiration: '/content/3659',
        'Music & talk': '/content/3662',
        'PSIs & PSOs': '/tags/796',
        'Facilities list & catalogues': getFacilitiesListFor(establishmentId),
        'Healthy mind & body': '/content/3657',
        'Money & debt': '/content/4201',
      };

      res.render('pages/home', {
        notification,
        config,
        todaysEvents,
        isTomorrow,
        popularTopics,
        featuredContent: featuredContent.featured[0],
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
