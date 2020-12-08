const R = require('ramda');

const HUB_CONTENT_TYPES = {
  moj_radio_item: 'radio',
  moj_pdf_item: 'pdf',
  moj_video_item: 'video',
  landing_page: 'landing-page',
  page: 'page',
  series: 'series',
  tags: 'tags',
};

const defaultThumbs = type => {
  const thumbs = {
    moj_radio_item: '/public/images/default_audio.png',
    moj_pdf_item: '/public/images/default_document.png',
    moj_video_item: '/public/images/default_video.png',
    page: '/public/images/default_document.png',
  };

  return thumbs[type] || thumbs.page;
};

const defaultAlt = type => {
  const alt = {
    moj_radio_item: 'Audio file',
    moj_pdf_item: 'Document file',
    moj_video_item: 'Video file',
    page: 'Document file',
  };
  return alt[type] || alt.page;
};

function imageFor(image) {
  return image
    ? {
        url: image.url,
        alt: image.alt,
      }
    : null;
}

function imageOrDefaultFor(image, contentType) {
  return image
    ? {
        url: image.url,
        alt: image.alt,
      }
    : {
        url: defaultThumbs(contentType),
        alt: defaultAlt(contentType),
      };
}

function featuredContentResponseFrom(response) {
  const type = R.prop('content_type', response);
  const id = R.prop('id', response);
  const contentUrl =
    type === 'series' || type === 'tags' ? `/tags/${id}` : `/content/${id}`;

  return {
    id,
    title: response.title,
    contentType: HUB_CONTENT_TYPES[type],
    summary: response.summary,
    image: imageOrDefaultFor(response.image, type),
    contentUrl,
  };
}

function featuredContentTileResponseFrom(response) {
  const [upperFeatured, lowerFeatured] = R.prop('large_tiles', response).map(
    item => ({
      id: item.id,
      contentUrl: `/content/${item.id}`,
      contentType: item.content_type,
      isSeries: Array.isArray(item.series) && item.series.length > 0,
      title: item.title,
      summary: item.summary,
      image: imageFor(item.image),
    }),
  );

  return {
    smallTiles: R.prop('small_tiles', response).map(item => ({
      id: item.id,
      contentUrl: `/content/${item.id}`,
      contentType: item.content_type,
      isSeries: Array.isArray(item.series) && item.series.length > 0,
      title: item.title,
      summary: item.summary,
      image: imageFor(item.image),
    })),
    upperFeatured,
    lowerFeatured,
  };
}

function contentResponseFrom(data = []) {
  return data.map(item => ({
    id: item.id,
    title: item.title,
    contentType: HUB_CONTENT_TYPES[item.content_type],
    summary: item.summary,
    image: imageFor(item.image),
    contentUrl: `/content/${item.id}`,
    categories: R.map(R.prop('target_id'), R.propOr([], 'categories', item)),
    secondaryTags: R.map(
      R.prop('target_id'),
      R.propOr([], 'secondary_tags', item),
    ),
  }));
}

function mediaResponseFrom(data) {
  return {
    id: data.id,
    episodeId: data.episode_id,
    programmeCode: data.programme_code,
    title: data.title,
    contentType: typeFrom(data.content_type),
    description: {
      raw: data?.description?.value,
      sanitized: data?.description?.processed,
      summary: data?.description?.summary,
    },
    media: data?.media?.url,
    image: imageOrDefaultFor(data.image),
    episode: data.episode,
    season: data.season,
    seriesId: data.series_id,
    contentUrl: `/content/${data.id}`,
    categories: R.map(R.prop('target_id'), R.propOr([], 'categories', data)),
    secondaryTags: R.map(
      R.prop('target_id'),
      R.propOr([], 'secondary_tags', data),
    ),
  };
}

function flatPageContentFrom(data) {
  return {
    id: data.id,
    title: data.title,
    contentType: typeFrom(data.content_type),
    description: {
      raw: data?.description?.value,
      sanitized: data?.description?.processed,
      summary: data?.description?.summary,
    },
    standFirst: data.stand_first,
    image: imageOrDefaultFor(data.image),
    contentUrl: `/content/${data.id}`,
    categories: R.map(R.prop('target_id'), R.propOr([], 'categories', data)),
    secondaryTags: R.map(
      R.prop('target_id'),
      R.propOr([], 'secondary_tags', data),
    ),
  };
}

function termResponseFrom(data) {
  return {
    id: data.id,
    contentType: data.content_type,
    name: data.title,
    description: {
      raw: data?.description?.value,
      sanitized: data?.description?.sanitized,
      summary: data.summary,
    },
    image: imageFor(data.image),
    video: {
      url: data?.video?.url,
    },
    audio: {
      url: data?.audio?.url,
      programmeCode: data.programme_code,
    },
  };
}

function landingResponseFrom(data) {
  return {
    id: data.id,
    title: data.title,
    contentType: typeFrom(data.content_type),
    featuredContentId: data.featured_content_id,
    description: {
      raw: data?.description?.value,
      sanitized: data?.description?.processed,
      summary: data?.description?.summary,
    },
    image: imageFor(data.image),
    categoryId: data.category_id,
  };
}

function pdfResponseFrom(data) {
  return {
    id: data.id,
    title: data.title,
    contentType: typeFrom(data.content_type),
    url: data?.media?.url,
    contentUrl: `/content/${data.id}`,
  };
}

function typeFrom(type) {
  return HUB_CONTENT_TYPES[type];
}

function seasonResponseFrom(data = []) {
  return R.map(mediaResponseFrom, data);
}

function searchResultFrom({ _id, _source }) {
  const idFrom = text => text.match(/\d+/)[0];
  const titleFrom = R.view(R.lensPath(['title', 0]));
  const summaryFrom = R.view(R.lensPath(['summary', 0]));
  return {
    title: titleFrom(_source),
    summary: summaryFrom(_source),
    url: `/content/${idFrom(_id)}`,
  };
}

module.exports = {
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
};
