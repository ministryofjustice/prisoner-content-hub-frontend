const express = require('express');

const createContentRouter = ({ cmsService }) => {
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

    const { establishmentName } = req.session;

    try {
      const data = await cmsService.getContent(
        establishmentName,
        parseInt(id, 10),
      );

      const contentType = data?.contentType;
      const categories = data?.categories || [];
      const topics = data?.topics?.filter(topic => topic?.name) || [];

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
