const express = require('express');

const createVisitorRouter = ({ offenderService }) => {
  const router = express.Router();

  const getPersonalisation = async (user, page) => {
    const approvedVisitors = await offenderService.getVisitorsFor(user);
    const maxVisitorsPerPage = 10;
    const maxPageNumber = Math.ceil(
      approvedVisitors.length / maxVisitorsPerPage,
    );
    const currentVisitorsPage =
      Number.isNaN(page) || page > maxPageNumber ? 1 : page;
    return {
      signedInUser: user.getFullName(),
      currentVisitorsPage,
      maxVisitorsPerPage,
      approvedVisitors,
    };
  };

  router.get(
    '/',
    async (
      { user, originalUrl: returnUrl, query: { page = 1 } },
      res,
      next,
    ) => {
      try {
        const personalisation = user
          ? await getPersonalisation(user, page)
          : {};

        return res.render('pages/visitors', {
          title: 'Your approved visitors',
          content: false,
          header: false,
          postscript: true,
          detailsType: 'small',
          returnUrl,
          ...personalisation,
        });
      } catch (e) {
        return next(e);
      }
    },
  );

  return router;
};

module.exports = {
  createVisitorRouter,
};
