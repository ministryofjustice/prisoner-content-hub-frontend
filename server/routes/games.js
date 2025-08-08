const express = require('express');
const { createAnagramicaRouter } = require('./createAnagramicaRouter');
const { createBreadcrumbs } = require('../utils/breadcrumbs');

const createGamesRouter = () => {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.get('*splat', (req, res, next) => {
    res.locals.data = { contentType: 'games' };
    next();
  });

  router.get('/2048', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/2048', {
      title: '2048',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.get('/fadingsnake', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/fadingsnake', {
      title: 'Fading Snake',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.get('/sn4ke', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/sn4ke', {
      title: 'Sn4ke',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.use('/anagramica', createAnagramicaRouter(config));

  router.get('/chess', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/chess', {
      title: 'Chess',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.get('/sudoku', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/sudoku', {
      title: 'Sudoku',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.get('/neontroids', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/neontroids', {
      title: 'Neontroids',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.get('/mimstris', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/mimstris', {
      title: 'Mimstris',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.get('/invadersfromspace', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/invadersfromspace', {
      title: 'Invaders from Space',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.get('/crossword', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/crossword', {
      title: 'Crossword',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.get('/christmas-crossword', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/christmas-crossword', {
      title: 'Christmas Crossword',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.get('/solitaire', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/solitaire', {
      title: 'Solitaire',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  router.get('/smashout', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/smashout', {
      title: 'Smashout',
      config,
      data: {
        breadcrumbs: createBreadcrumbs(req),
        contentType: 'game',
      },
    });
  });

  return router;
};

module.exports = {
  createGamesRouter,
};
