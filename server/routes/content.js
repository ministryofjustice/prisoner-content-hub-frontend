const { prop, path } = require('ramda');
const express = require('express');

const createContentRouter = ({ cmsService, analyticsService }) => {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    if (!id) {
      return next();
    }

    const config = {
      content: true,
      header: false,
      postscript: false,
    };

    const userAgent = path(['headers', 'user-agent'], req);
    const { establishmentName } = req.session;

    try {
      const data = await cmsService.getContent(
        establishmentName,
        parseInt(id, 10),
      );

      const contentType = prop('contentType', data);
      const sessionId = path(['session', 'id'], req);
      const categories = data?.categories || [];
      const topics = data?.topics || [];

      switch (contentType) {
        case 'radio':
          return res.render('pages/audio', {
            title: data.title,
            config,
            data: {
              ...data,
              categories,
              topics,
            },
          });
        case 'video':
          return res.render('pages/video', {
            title: data.title,
            config,
            data: {
              ...data,
              categories,
              topics,
            },
          });
        case 'page':
          config.content = false;

          return res.render('pages/flat-content', {
            title: data.title,
            config,
            data: {
              ...data,
              categories,
              topics,
            },
          });
        case 'pdf': {
          const { url } = data;

          analyticsService.sendEvent({
            category: 'PDFs',
            action: `${data.title}`,
            label: 'Downloads',
            sessionId,
            value: 1,
            userAgent,
          });

          return res.redirect(303, url);
        }
        default:
          // send to the 404 page
          return next();
      }
    } catch (exp) {
      return next(exp);
    }
  });

  return router;
};

module.exports = {
  createContentRouter,
};
