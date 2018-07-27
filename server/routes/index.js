const express = require('express');

module.exports = function Index({ logger, demoDataService }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET index');

    const promotalcontentdata = demoDataService.getPromotalContentData();
    const submenudata = demoDataService.getSubMenuData();
    const inspirationdata = demoDataService.getInspirationData();
    const newseventsData = demoDataService.getNewsEventsData();
    const seriesdata = demoDataService.geSeriesData();

    res.render('pages/index', {
      extras: ['www', 'eeee'],
      inspirationdata,
      submenudata,
      newseventsData,
      promotalcontentdata,
      seriesdata,
    });
  });

  router.get('/flat-content', (req, res) => {
    res.render('pages/flat-content', {
      title: 'Criminal Cases Review Commission (CCRC)',
      data: [
        {
          leadParagraph: 'The Criminal Cases Review Commission (CCRC) is the organisation set up to independently investigate miscarriages of justice.',
        },
        {
          paragraph: 'crime, and who has lost their appeal, still says that they were wrongly convicted or sentenced.',
        },
        {
          paragraph: 'If the CCRC think there are good reasons, we can send cases back to court for another appeal.',
        },
        {
          paragraph: 'We don’t decide whether the conviction should be overturned or the sentence reduced – the appeal courts make that decision.  But if we decide to send a case to them they have to hear a full appeal and no extra time can be added to the sentence.',
        },
        {
          video: '<video id="video1" style="width:600px;max-width:100%;" controls=""> <source src="mov_bbb.mp4" type="video/mp4"> <source src="mov_bbb.ogg" type="video/ogg"> Your browser does not support HTML5 video. </video>',
        },
        {
          insertText: 'For the CCRC to be able to send a case back for appeal, we need to find a really good reason like some strong new evidence that makes the case look different now.',
        },
        {
          paragraph: 'It is hard to find find reason strong enough to send a case back to the appeal courts. Since we started work in 1997 we have sent almost 650 cases for appeal. This is around one in 30 of the cases we have looked at.',
        },
        {
          paragraph: 'The CCRC has special legal powers to help us investigate cases. We can use those powers to get hold of whatever we think we need to look into a case. We can hire experts and scientists and carry out forensic tests if we think we need to.',
        },
        {
          paragraph: 'We are completely independent of the police, the prosecution and the rest of the justice system.',
        },
        {
          heading: 'How to apply',
        },
        {
          paragraph: 'You can apply to us using our simple application form. Most people who apply have already tried to appeal their case in the courts.',
        },
        {
          paragraph: 'If you think you might need to apply to us, you can call us and speak to someone',
        },
        {
          blockText: "The Criminal Cases Review Commission \n 5 St Philip's Place\n Birmingham \n B3 2PW",
        },
        {
          strongParagraph: 'Telephone: 0121 233 1473',
        },
      ],
    });
  });

  return router;
};
