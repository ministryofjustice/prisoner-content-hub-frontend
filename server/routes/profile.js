const express = require('express');
const { format } = require('date-fns');

const createProfileRouter = ({ offenderService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const templateParams = {
        title: 'Your profile',
        content: true,
        header: false,
        postscript: true,
        detailsType: 'small',
        category: 'profile',
        returnUrl: req.originalUrl,
      };

      const today = new Date();
      const todayDate = format(today, 'yyyy-MM-dd');
      const { user } = req;

      if (user) {
        templateParams.events = await Promise.all([
          offenderService.getEventsFor(user, todayDate, todayDate),
        ]);
        templateParams.signedInUser = user.getFullName();
      } else {
        templateParams.events = [
          offenderService.getEmptyTimetable(todayDate, todayDate),
        ];
      }

      templateParams.morning =
        templateParams.events[0].events[todayDate].morning;
      console.log(JSON.stringify(templateParams.morning));

      return res.render('pages/profile', templateParams);
    } catch (e) {
      return next(e);
    }
  });

  return router;
};

module.exports = {
  createProfileRouter,
};
