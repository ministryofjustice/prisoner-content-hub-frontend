const express = require('express');
const bodyParser = require('body-parser');

const finder = require('../../assets/javascript/games/anagramica/lib/finder');
const {
  toAlpha,
} = require('../../assets/javascript/games/anagramica/lib/helpers');

const createAnagramicaRouter = config => {
  express().use(bodyParser.urlencoded({ extended: true }));
  const router = express.Router();

  finder.load();

  router
    .route('/')
    .get((req, res) =>
      res.render('pages/games/anagramica.html', {
        title: 'Anagramica',
        config: { ...config, detailsType: 'small' },
      }),
    )
    .post((req, res) => {
      const { letters, words = [] } = req.body;
      const best = finder.best(toAlpha(letters));
      const scores = words.reduce((total, rawWord) => {
        const word = toAlpha(rawWord);
        return Object.assign(total, { [word]: finder.find(word) });
      }, {});
      res.send({
        best,
        scores,
        letters,
      });
    });
  return router;
};

module.exports = {
  createAnagramicaRouter,
};
