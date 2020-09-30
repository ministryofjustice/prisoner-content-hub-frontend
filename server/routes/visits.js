const { path } = require('ramda');
const express = require('express');

const createVisitsRouter = ({ hubContentService, offenderService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const id = 4203;
      const establishmentId = path(['session', 'establishmentId'], req);

      const data = await hubContentService.contentFor(id, establishmentId);

      const config = {
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        category: 'visits',
        returnUrl: req.originalUrl,
      };

      if (req.user) {
        const userName = req.user && req.user.getFullName();
        const { bookingId } = req.user;
        const visits = await offenderService.getVisitsFor(bookingId);
        data.personalisedData = visits;
        config.userName = userName;
      }

      return res.render('pages/category', {
        title: 'Visits',
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
  createVisitsRouter,
};
