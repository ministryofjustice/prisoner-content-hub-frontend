const {
  contentResponseFrom,
  featuredContentResponseFrom,
  mediaResponseFrom,
  seasonResponseFrom,
  termResponseFrom,
  flatPageContentFrom,
  landingResponseFrom,
  pdfResponseFrom,
  typeFrom,
  searchResultFrom,
} = require('../adapters');

const radioShowResponse = require('../../../test/resources/radioShow.json');
const videoShowResponse = require('../../../test/resources/videoShow.json');
const termsResponse = require('../../../test/resources/terms.json');
const featuredItemResponse = require('../../../test/resources/featuredItem.json');
const featuredSeriesResponse = require('../../../test/resources/featuredSeries.json');
const flatPageContentResponse = require('../../../test/resources/flatPageContent.json');
const seasonResponse = require('../../../test/resources/season.json');
const landingPageResponse = require('../../../test/resources/landingPage.json');
const relatedContentResponse = require('../../../test/resources/relatedContent.json');
const pdfContentResponse = require('../../../test/resources/pdfContentResponse.json');
const searchResponse = require('../../../test/resources/rawSearchResponse.json');

describe('Adapters', () => {
  describe('.mediaResponseFrom', () => {
    it('returns formated data for an audio item', () => {
      const result = mediaResponseFrom(radioShowResponse);
      expect(result).toStrictEqual(radioContent());
    });

    it('returns formated data for a video item', () => {
      const result = mediaResponseFrom(videoShowResponse);
      expect(result).toStrictEqual(videoContent());
    });
  });

  describe('.flatContentResponseFrom', () => {
    it('return formated data for flat content', () => {
      const result = flatPageContentFrom(flatPageContentResponse);
      expect(result).toStrictEqual(flatPageContent());
    });
  });

  describe('.pdfResponseFrom', () => {
    it('returns formated data for a pdf item', () => {
      const result = pdfResponseFrom(pdfContentResponse);
      expect(result).toStrictEqual(pdfContent());
    });
  });

  describe('.landingResponseFrom', () => {
    it('returns formated data for a landing page', () => {
      const result = landingResponseFrom(landingPageResponse);
      expect(result).toStrictEqual(landingPageContent());
    });
  });

  describe('.seasonResponseFrom', () => {
    it('returns formated data for a season', () => {
      const result = seasonResponseFrom(seasonResponse);
      expect(result).toStrictEqual(seasonContent());
    });
  });

  describe('.contentResponseFrom', () => {
    it('returns formated data for related content', () => {
      const result = contentResponseFrom(relatedContentResponse);
      expect(result).toStrictEqual(relatedContent());
    });
  });

  describe('.termResponseFrom', () => {
    it('returns formated data for a term', () => {
      const result = termResponseFrom(termsResponse);
      expect(result).toStrictEqual(termContent());
    });
  });

  describe('.featuredContentResponseFrom', () => {
    it('returns formated data for featured item', () => {
      const result = featuredContentResponseFrom(featuredItemResponse);
      expect(result).toStrictEqual(featuredItem());
    });

    it('returns formated data for featured series', () => {
      const result = featuredContentResponseFrom(featuredSeriesResponse);
      expect(result).toStrictEqual(featuredSeries());
    });
  });

  describe('.searchResultFrom', () => {
    it('returns formated data for a search result', () => {
      const result = searchResultFrom(searchResponse);
      expect(result).toStrictEqual(searchResult());
    });
  });

  describe('.typeFrom', () => {
    it('should return the correct type for an audio item', () => {
      expect(typeFrom('moj_radio_item')).toBe('radio');
    });
    it('should return the correct type for an video item', () => {
      expect(typeFrom('moj_video_item')).toBe('video');
    });
    it('should strip "node--" from the type string', () => {
      expect(typeFrom('node--moj_video_item')).toBe('video');
    });
    it('should return the correct type for an pdf item', () => {
      expect(typeFrom('moj_pdf_item')).toBe('pdf');
    });

    it('should return the correct type for a landing page item', () => {
      expect(typeFrom('landing_page')).toBe('landing-page');
    });

    it('should return the correct type for a page', () => {
      expect(typeFrom('page')).toBe('page');
    });

    it('should return the correct type for a series', () => {
      expect(typeFrom('series')).toBe('series');
    });

    it('should return the correct type for a series', () => {
      expect(typeFrom('tags')).toBe('tags');
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
    media: 'http://foo.bar/audio.mp3',
    episode: 1,
    season: 1,
    episodeId: 1001,
    seriesId: 665,
    image: {
      alt: 'Foo Bar',
      url: 'http://foo.bar/image.png',
    },
    secondaryTags: [646],
    categories: [646],
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
    media: 'http://foo.bar/video.mp4',
    episode: 2,
    season: 1,
    seriesId: 665,
    image: {
      alt: 'Foo Bar',
      url: 'http://foo.bar/image.png',
    },
    secondaryTags: [],
    categories: [],
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
      url: 'http://foo.bar/image/foo.png',
    },
    standFirst: 'foo stand first',
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
        url: 'http://foo.bar/images/foo.jpg',
      },
      media: 'http://foo.bar/audio/foo.mp3',
      season: '1',
      seriesId: 660,
      secondaryTags: [646],
      categories: [646],
      title: 'Radio Item 1',
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
        url: 'http://foo.bar/images/bar.jpg',
      },
      media: 'http://foo.bar/audio/bar.mp3',
      season: '1',
      seriesId: 660,
      secondaryTags: [761],
      categories: [785],
      title: 'Radio Item 2',
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
      url: 'http://foo.bar/image/foo.jpg',
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
        url: 'http://foo.bar/image/foo.jpg',
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
        url: 'http://foo.bar/image/bar.jpg',
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
    url: 'http://foo.bar/content/foo.pdf',
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
      url: 'http://foo.bar/images/foo.jpg',
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
      url: 'http://foo.bar/images/foo.jpg',
    },
    contentType: 'series',
    contentUrl: '/tags/678',
  };
}

function termContent() {
  return {
    audio: {
      url: 'http://foo.bar/audio/foo.mp3',
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
      url: 'http://foo.bar/images/foo.jpg',
    },
    name: 'Foo term',
    contentType: 'series',
    video: {
      url: undefined,
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
