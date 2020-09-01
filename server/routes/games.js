const express = require('express');

const createGamesRouter = ({ logger }) => {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.get('/chess', (req, res) => {
    logger.info('GET /games/chess');

    config.detailsType = 'small';
    config.userName = req.user && req.user.getFullName();

    return res.render('pages/games/chess', {
      title: 'Chess',
      config,
    });
  });

  router.get('/sudoku', (req, res) => {
    logger.info('GET /games/sudoku');

    config.detailsType = 'small';
    config.userName = req.user && req.user.getFullName();

    return res.render('pages/games/sudoku', {
      title: 'Sudoku',
      config,
    });
  });

  router.get('/neontroids', (req, res) => {
    logger.info('GET /games/neontroids');

    config.detailsType = 'small';
    config.userName = req.user && req.user.getFullName();

    return res.render('pages/games/neontroids', {
      title: 'Neontroids',
      config,
    });
  });

  router.get('/mimstris', (req, res) => {
    logger.info('GET /games/mimstris');

    config.detailsType = 'small';
    config.userName = req.user && req.user.getFullName();

    return res.render('pages/games/mimstris', {
      title: 'Mimstris',
      config,
    });
  });

  router.get('/invadersfromspace', (req, res) => {
    logger.info('GET /games/invadersfromspace');

    config.detailsType = 'small';
    config.userName = req.user && req.user.getFullName();

    return res.render('pages/games/invadersfromspace', {
      title: 'Invaders from Space',
      config,
    });
  });

  router.get('/crossword', (req, res) => {
    logger.info('GET /games/crossword');

    config.detailsType = 'small';
    config.userName = req.user && req.user.getFullName();

    return res.render('pages/games/crossword', {
      title: 'Crossword',
      config,
    });
  });

  router.get('/solitaire', (req, res) => {
    logger.info('GET /games/solitaire');

    config.detailsType = 'small';
    config.userName = req.user && req.user.getFullName();

    return res.render('pages/games/solitaire', {
      title: 'Solitaire',
      config,
    });
  });

  router.get('/smashout', (req, res) => {
    logger.info('GET /games/smashout');

    config.detailsType = 'small';
    config.userName = req.user && req.user.getFullName();

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
