const {
  contentResponseFrom,
  featuredContentResponseFrom,
  featuredContentTileResponseFrom,
  mediaResponseFrom,
  seasonResponseFrom,
  termResponseFrom,
  flatPageContentFrom,
  landingResponseFrom,
  pdfResponseFrom,
  typeFrom,
  searchResultFrom,
} = require('../../server/utils/adapters');

const radioShowResponse = require('../resources/radioShow.json');
const videoShowResponse = require('../resources/videoShow.json');
const termsResponse = require('../resources/terms.json');
const featuredItemResponse = require('../resources/featuredItem.json');
const featuredSeriesResponse = require('../resources/featuredSeries.json');
const flatPageContentResponse = require('../resources/flatPageContent.json');
const seasonResponse = require('../resources/season.json');
const landingPageResponse = require('../resources/landingPage.json');
const relatedContentResponse = require('../resources/relatedContent.json');
const pdfContentResponse = require('../resources/pdfContentResponse.json');
const searchResponse = require('../resources/rawSearchResponse.json');
const featuredItems = require('../resources/featuredItems.json');

describe('Adapters', () => {
  describe('.mediaResponseFrom', () => {
    it('returns formated data for an audio item', () => {
      const result = mediaResponseFrom(radioShowResponse);
      expect(result).to.eql(radioContent());
    });

    it('returns formated data for a video item', () => {
      const result = mediaResponseFrom(videoShowResponse);
      expect(result).to.eql(videoContent());
    });
  });

  describe('.flatContentResponseFrom', () => {
    it('return formated data for flat content', () => {
      const result = flatPageContentFrom(flatPageContentResponse);
      expect(result).to.eql(flatPageContent());
    });
  });

  describe('.pdfResponseFrom', () => {
    it('returns formated data for a pdf item', () => {
      const result = pdfResponseFrom(pdfContentResponse);
      expect(result).to.eql(pdfContent());
    });
  });

  describe('.landingResponseFrom', () => {
    it('returns formated data for a landing page', () => {
      const result = landingResponseFrom(landingPageResponse);
      expect(result).to.eql(landingPageContent());
    });
  });

  describe('.seasonResponseFrom', () => {
    it('returns formated data for a season', () => {
      const result = seasonResponseFrom(seasonResponse);
      expect(result).to.eql(seasonContent());
    });
  });

  describe('.contentResponseFrom', () => {
    it('returns formated data for related content', () => {
      const result = contentResponseFrom(relatedContentResponse);
      expect(result).to.eql(relatedContent());
    });
  });

  describe('.termResponseFrom', () => {
    it('returns formated data for a term', () => {
      const result = termResponseFrom(termsResponse);
      expect(result).to.eql(termContent());
    });
  });

  describe('.featuredContentResponseFrom', () => {
    it('returns formated data for featured item', () => {
      const result = featuredContentResponseFrom(featuredItemResponse);
      expect(result).to.eql(featuredItem());
    });

    it('returns formated data for featured series', () => {
      const result = featuredContentResponseFrom(featuredSeriesResponse);
      expect(result).to.eql(featuredSeries());
    });
  });

  describe('.featuredContentTileResponseFrom', () => {
    featuredItems.forEach(({ scenario, input, output }) => {
      it(scenario, () => {
        const result = featuredContentTileResponseFrom(input);
        expect(result.upperFeatured).to.eql(output);
        expect(result.lowerFeatured).to.eql(output);
        expect(result.smallTiles.length).to.eql(input.small_tiles.length);
        expect(result.smallTiles[0]).to.eql(output);
      });
    });
  });

  describe('.searchResultFrom', () => {
    it('returns formated data for a search result', () => {
      const result = searchResultFrom(searchResponse);
      expect(result).to.eql(searchResult());
    });
  });

  describe('.typeFrom', () => {
    it('should return the correct type for an audio item', () => {
      expect(typeFrom('moj_radio_item')).to.eql('radio');
    });
    it('should return the correct type for an video item', () => {
      expect(typeFrom('moj_video_item')).to.eql('video');
    });

    it('should return the correct type for an pdf item', () => {
      expect(typeFrom('moj_pdf_item')).to.eql('pdf');
    });

    it('should return the correct type for a landing page item', () => {
      expect(typeFrom('landing_page')).to.eql('landing-page');
    });

    it('should return the correct type for a page', () => {
      expect(typeFrom('page')).to.eql('page');
    });

    it('should return the correct type for a series', () => {
      expect(typeFrom('series')).to.eql('series');
    });

    it('should return the correct type for a series', () => {
      expect(typeFrom('tags')).to.eql('tags');
    });
  });
});

function radioContent() {
  return {
    id: 3546,
    title: 'Foo radio show',
    description: {
      raw: '<p>Hello world</p>\r\n',
      sanitized: '<p>Hello world</p>',
      summary: 'hello world',
    },
    contentType: 'radio',
    media: '/audio.mp3',
    episode: 1,
    season: 1,
    episodeId: 1001,
    seriesId: 665,
    image: {
      alt: 'Foo Bar',
      url: '/image.png',
    },
    secondaryTags: [646],
    categories: [646],
    establishmentIds: [792, 793],
    contentUrl: '/content/3546',
    programmeCode: 'foo code',
  };
}

function videoContent() {
  return {
    id: 3546,
    episodeId: 1002,
    title: 'Foo video show',
    description: {
      raw: '<p>Hello world</p>\r\n',
      sanitized: '<p>Hello world</p>',
      summary: 'hello world',
    },
    contentType: 'video',
    media: '/video.mp4',
    episode: 2,
    season: 1,
    seriesId: 665,
    image: {
      alt: 'Foo Bar',
      url: '/image.png',
    },
    secondaryTags: [],
    categories: [],
    establishmentIds: [792],
    contentUrl: '/content/3546',
    programmeCode: 'foo code',
  };
}

function flatPageContent() {
  return {
    id: 3456,
    title: 'foo title',
    contentType: 'page',
    description: {
      raw: '<h2>foo text</h2>',
      sanitized: '<h2>foo text</h2>',
      summary: 'foo text',
    },
    image: {
      alt: 'foo alt',
      url: '/image/foo.png',
    },
    standFirst: 'foo stand first',
    establishmentIds: [],
    contentUrl: '/content/3456',
    secondaryTags: [],
    categories: [644],
  };
}

function seasonContent() {
  return [
    {
      contentType: 'radio',
      contentUrl: '/content/3456',
      description: {
        raw: '<p>Series radio item</p>\r\n',
        sanitized: '<p>Series radio item</p>',
        summary: 'Series radio item summary',
      },
      episode: '1',
      episodeId: 1001,
      id: '3456',
      image: {
        alt: '',
        url: '/images/foo.jpg',
      },
      media: '/audio/foo.mp3',
      season: '1',
      seriesId: 660,
      secondaryTags: [646],
      categories: [646],
      title: 'Radio Item 1',
      establishmentIds: [],
      programmeCode: undefined,
    },
    {
      contentType: 'radio',
      contentUrl: '/content/3457',
      description: {
        raw: '<p>Series radio item</p>\r\n',
        sanitized: '<p>Series radio item</p>',
        summary: 'Series radio item summary',
      },
      episode: '2',
      episodeId: 1002,
      id: '3457',
      image: {
        alt: '',
        url: '/images/bar.jpg',
      },
      media: '/audio/bar.mp3',
      season: '1',
      seriesId: 660,
      secondaryTags: [761],
      categories: [785],
      title: 'Radio Item 2',
      establishmentIds: [],
      programmeCode: undefined,
    },
  ];
}

function landingPageContent() {
  return {
    id: '3456',
    categoryId: '678',
    title: 'Music',
    contentType: 'landing-page',
    featuredContentId: '3456',
    description: {
      raw: '<p>Landing page item</p>\r\n',
      sanitized: '<p>Landing page item</p>',
      summary: 'Landing page item summary',
    },
    image: {
      url: '/image/foo.jpg',
      alt: 'foo image',
    },
  };
}

function relatedContent() {
  return [
    {
      id: '3456',
      title: 'Video Item 1',
      contentType: 'video',
      summary: 'Item summary 1',
      image: {
        url: '/image/foo.jpg',
        alt: 'Video Item 1 alt',
      },
      contentUrl: '/content/3456',
      secondaryTags: [],
      categories: [],
    },
    {
      id: '3457',
      title: 'Video Item 2',
      contentType: 'video',
      summary: 'Item summary 2',
      image: {
        url: '/image/bar.jpg',
        alt: 'Video Item 2 alt',
      },
      contentUrl: '/content/3457',
      secondaryTags: [],
      categories: [],
    },
  ];
}

function pdfContent() {
  return {
    id: '3456',
    title: 'Food and catering',
    contentType: 'pdf',
    url: '/content/foo.pdf',
    establishmentIds: [],
    contentUrl: '/content/3456',
  };
}

function featuredItem() {
  return {
    id: '3456',
    title: 'Featured Video 1',
    summary: 'Featured video summary',
    image: {
      alt: 'Featured Video 1',
      url: '/images/foo.jpg',
    },
    contentType: 'video',
    contentUrl: '/content/3456',
  };
}

function featuredSeries() {
  return {
    id: '678',
    title: 'Featured Item 1',
    summary: 'Featured item summary',
    image: {
      alt: 'Featured Item 1',
      url: '/images/foo.jpg',
    },
    contentType: 'series',
    contentUrl: '/tags/678',
  };
}

function termContent() {
  return {
    audio: {
      url: '/audio/foo.mp3',
      programmeCode: 'xyz',
    },
    description: {
      raw: '<p>Foo Term</p>\r\n',
      sanitized: undefined,
      summary: 'Foo Term summary',
    },
    id: '678',
    image: {
      alt: 'Foo Term',
      url: '/images/foo.jpg',
    },
    name: 'Foo term',
    contentType: 'series',
    video: {
      url: '',
    },
  };
}

function searchResult() {
  return {
    title: 'Foo Content',
    summary: 'Foo Summary',
    url: '/content/1234',
  };
}
