const express = require('express');

const createIncentivesRouter = ({ hubContentService, offenderService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const id = 4204;
      const establishmentId = req?.session?.establishmentId;

      const data = await hubContentService.contentFor(id, establishmentId);

      const config = {
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        category: 'incentives',
        returnUrl: req.originalUrl,
      };

      const { user } = req;

      if (user) {
        const incentivesSummary = await offenderService.getIncentivesSummaryFor(
          user,
        );
        data.personalisedData = incentivesSummary;
        config.userName = user.getFullName();
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
