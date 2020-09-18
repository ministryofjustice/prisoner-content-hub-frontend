const { path } = require('ramda');
const express = require('express');

const createIncentivesRouter = ({ hubContentService, offenderService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const id = 4204;
      const establishmentId = path(['locals', 'establishmentId'], res);

      const data = await hubContentService.contentFor(id, establishmentId);

      const config = {
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        category: 'incentives',
        returnUrl: req.originalUrl,
      };

      if (req.user) {
        const userName = req.user && req.user.getFullName();
        const { bookingId } = req.user;
        const incentivesSummary = await offenderService.getIncentivesSummaryFor(
          bookingId,
        );
        data.personalisedData = incentivesSummary;
        config.userName = userName;
      }

      return res.render('pages/category', {
        title: 'Incentive level',
        config,
        data,
      });
    } catch (exp) {
      return next(exp);
    }
  });

  return router;
};

module.exports = {
  createIncentivesRouter,
};
