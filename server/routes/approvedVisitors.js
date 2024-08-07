const express = require('express');
const { createBreadcrumbs } = require('../utils/breadcrumbs');
const { checkFeatureEnabledAtSite } = require('../utils');

const createApprovedVisitorsRouter = ({ offenderService }) => {
  const router = express.Router();

  const getPersonalisation = async (user, rawQuery) => {
    const { approvedVisitors: rawApprovedVisitors, error = null } =
      await offenderService.getApprovedVisitorsFor(user);

    if (error) return { signedInUser: user.getFullName(), error };
    const maxVisitorsPerPage = 10;
    const totalCount = rawApprovedVisitors.length;
    const totalPages = Math.ceil(totalCount / maxVisitorsPerPage);
    const rawPage = Math.round(rawQuery.page) || 1;
    const page = rawPage > 0 && rawPage <= totalPages ? rawPage : 1;
    const max = Math.min(page * maxVisitorsPerPage, totalCount);
    const min = (page - 1) * maxVisitorsPerPage + 1;
    const pageData = { page, totalPages, min, max, totalCount };

    const approvedVisitors = rawApprovedVisitors.slice(min - 1, max);

    return {
      signedInUser: user.getFullName(),
      pageData,
      rawQuery,
      approvedVisitors,
    };
  };

  router.get('/', async (req, res, next) => {
    const { user, originalUrl: returnUrl, query } = req;

    if (
      checkFeatureEnabledAtSite(
        req.session.establishmentName,
        'approvedVisitors',
      )
    ) {
      try {
        const personalisation = user
          ? await getPersonalisation(user, query)
          : {};

        return res.render('pages/approvedVisitors', {
          title: 'My visitors - social',
          content: false,
          header: false,
          postscript: true,
          detailsType: 'small',
          returnUrl,
          ...personalisation,
          data: { contentType: 'profile', breadcrumbs: createBreadcrumbs(req) },
          displayImportantNotice: true,
        });
      } catch (e) {
        return next(e);
      }
    }
    return next();
  });

  return router;
};

module.exports = {
  createApprovedVisitorsRouter,
};
