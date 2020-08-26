const { path } = require('ramda');
const express = require('express');

const createNprRouter = ({ logger }) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    logger.info(`GET /npr`);

    const userName = path(['session', 'user', 'name'], req);
    const personalInformation = path(
      ['locals', 'features', 'personalInformation'],
      res,
    );
    const nprStream = path(['app', 'locals', 'config', 'npr', 'stream'], req);

    const config = {
      content: true,
      header: false,
      postscript: false,
      detailsType: 'small',
      personalInformation,
      userName,
    };

    return res.render('pages/npr', {
      title: 'NPR Listen Live',
      config,
      data: {
        title: 'NPR Listen Live',
        contentType: 'audio',
        series: 'none',
        description: {
          sanitized: '',
        },
        media: nprStream,
      },
    });
  });

  return router;
};

module.exports = {
  createNprRouter,
};
