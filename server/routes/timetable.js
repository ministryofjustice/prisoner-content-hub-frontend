const express = require('express');
const { format, addDays, subDays } = require('date-fns');

const createTimetableRouter = ({ offenderService }) => {
  const router = express.Router();

  router.get('*', (req, res, next) => {
    res.locals.data = { contentType: 'profile' };
    next();
  });

  router.get('/', async (req, res, next) => {
    try {
      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        lastWeek: false,
        nextWeek: false,
      };

      let events = [];
      const today = new Date();
      const startDate = format(today, 'yyyy-MM-dd');
      const endDate = format(addDays(today, 6), 'yyyy-MM-dd');

      if (res.locals.isSignedIn) {
        events = await Promise.all([
          offenderService.getEventsFor(req.user, startDate, endDate),
        ]);
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
      };

      let events = [];
      const today = new Date();
      const yesterday = subDays(today, 1);
      const startDate = format(subDays(today, 7), 'yyyy-MM-dd');
      const endDate = format(yesterday, 'yyyy-MM-dd');

      if (res.locals.isSignedIn) {
        events = await Promise.all([
          offenderService.getEventsFor(req.user, startDate, endDate),
        ]);
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
      };

      let events = [];
      const today = new Date();
      const nextWeekStart = addDays(today, 7);
      const startDate = format(nextWeekStart, 'yyyy-MM-dd');
      const endDate = format(addDays(nextWeekStart, 6), 'yyyy-MM-dd');

      if (res.locals.isSignedIn) {
        events = await Promise.all([
          offenderService.getEventsFor(req.user, startDate, endDate),
        ]);
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
