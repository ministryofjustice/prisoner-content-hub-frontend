const express = require('express');
const { createAnagramicaRouter } = require('./createAnagramicaRouter');

const createGamesRouter = () => {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.get('*', (req, res, next) => {
    res.locals.data = { contentType: 'games' };
    next();
  });

  router.get('/2048', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/2048', {
      title: '2048',
      config,
    });
  });

  router.get('/fadingsnake', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/fadingsnake', {
      title: 'Fading Snake',
      config,
    });
  });

  router.get('/sn4ke', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/sn4ke', {
      title: 'Sn4ke',
      config,
    });
  });

  router.use('/anagramica', createAnagramicaRouter(config));

  router.get('/chess', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/chess', {
      title: 'Chess',
      config,
    });
  });

  router.get('/sudoku', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/sudoku', {
      title: 'Sudoku',
      config,
    });
  });

  router.get('/neontroids', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/neontroids', {
      title: 'Neontroids',
      config,
    });
  });

  router.get('/mimstris', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/mimstris', {
      title: 'Mimstris',
      config,
    });
  });

  router.get('/invadersfromspace', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/invadersfromspace', {
      title: 'Invaders from Space',
      config,
    });
  });

  router.get('/crossword', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/crossword', {
      title: 'Crossword',
      config,
    });
  });

  router.get('/christmas-crossword', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/christmas-crossword', {
      title: 'Christmas Crossword',
      config,
    });
  });

  router.get('/solitaire', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/solitaire', {
      title: 'Solitaire',
      config,
    });
  });

  router.get('/smashout', (req, res) => {
    config.detailsType = 'small';

    return res.render('pages/games/smashout', {
      title: 'Smashout',
      config,
    });
  });

  return router;
};

module.exports = {
  createGamesRouter,
};
