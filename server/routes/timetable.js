const express = require('express');
const { format, addDays, subDays } = require('date-fns');

const createTimetableRouter = ({ offenderService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        lastWeek: false,
        nextWeek: false,
        returnUrl: req.originalUrl,
      };

      let events = [];
      const today = new Date();
      const startDate = format(today, 'yyyy-MM-dd');
      const endDate = format(addDays(today, 6), 'yyyy-MM-dd');
      const { user } = req;

      if (user) {
        events = await Promise.all([
          offenderService.getEventsFor(user, startDate, endDate),
        ]);
        config.userName = user.getFullName();
      } else {
        events = [offenderService.getEmptyTimetable(startDate, endDate)];
      }

      res.render('pages/timetable', {
        title: 'Timetable',
        config,
        events,
      });
    } catch (exception) {
      next(exception);
    }
  });

  router.get('/lastweek', async (req, res, next) => {
    try {
      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        lastWeek: true,
        nextWeek: false,
        returnUrl: req.originalUrl,
      };

      let events = [];
      const today = new Date();
      const yesterday = subDays(today, 1);
      const startDate = format(subDays(today, 7), 'yyyy-MM-dd');
      const endDate = format(yesterday, 'yyyy-MM-dd');
      const { user } = req;

      if (user) {
        events = await Promise.all([
          offenderService.getEventsFor(user, startDate, endDate),
        ]);
        config.userName = user.getFullName();
      } else {
        events = [offenderService.getEmptyTimetable(startDate, endDate)];
      }

      res.render('pages/timetable', {
        title: 'Timetable',
        config,
        events,
      });
    } catch (exception) {
      next(exception);
    }
  });

  router.get('/nextweek', async (req, res, next) => {
    try {
      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        lastWeek: false,
        nextWeek: true,
        returnUrl: req.originalUrl,
      };

      let events = [];
      const today = new Date();
      const nextWeekStart = addDays(today, 7);
      const startDate = format(nextWeekStart, 'yyyy-MM-dd');
      const endDate = format(addDays(nextWeekStart, 6), 'yyyy-MM-dd');
      const { user } = req;

      if (req.user) {
        events = await Promise.all([
          offenderService.getEventsFor(user, startDate, endDate),
        ]);
        config.userName = user.getFullName();
      } else {
        events = [offenderService.getEmptyTimetable(startDate, endDate)];
      }

      res.render('pages/timetable', {
        title: 'Timetable',
        config,
        events,
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};

module.exports = {
  createTimetableRouter,
};
