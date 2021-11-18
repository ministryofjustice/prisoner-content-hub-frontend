const getImage = (data, type) => {
  if (!data) return null;
  return {
    url: data?.imageStyleUri?.find(img => Boolean(img?.[type]))[type] || '',
    alt: data?.resourceIdObjMeta?.alt || '',
  };
};

const getLargeImage = data => getImage(data, 'tile_large');

const getTile = (item, imageSize = 'tile_small') => ({
  id: item?.drupalInternal_Nid,
  contentType: typeFrom(item?.type),
  title: item?.title,
  summary: item?.fieldMojDescription?.summary,
  contentUrl: item?.path?.alias,
  image: getImage(item?.fieldMojThumbnailImage, imageSize),
});

const getSeriesTile = (item, imageSize = 'tile_small') => ({
  id: item?.drupalInternal_Tid,
  contentType: typeFrom(item?.type),
  title: item?.name,
  summary: item?.description?.processed,
  contentUrl: item?.path?.alias,
  image: getImage(item?.fieldFeaturedImage, imageSize),
});

const isTag = ({ type }) =>
  [
    'taxonomy_term--series',
    'taxonomy_term--moj_categories',
    'taxonomy_term--tags',
  ].includes(type);

const getSmallTile = item =>
  isTag(item) ? getSeriesTile(item) : getTile(item);
const getLargeTile = item =>
  isTag(item) ? getSeriesTile(item, 'tile_large') : getTile(item, 'tile_large');

const getCategoryIds = arr =>
  arr.map(
    ({
      resourceIdObjMeta: { drupal_internal__target_id: id },
      id: uuid,
      name,
    }) => ({
      id,
      uuid,
      name,
    }),
  );

const buildSecondaryTags = arr =>
  arr.map(({ drupalInternal_Tid: id, name, id: uuid }) => ({
    id,
    uuid,
    name,
  }));

const HUB_CONTENT_TYPES = {
  moj_radio_item: 'radio',
  moj_pdf_item: 'pdf',
  moj_video_item: 'video',
  page: 'page',
  series: 'series',
  tags: 'tags',
};

const typeFrom = type => {
  const matches = type.match(/(?<=--)(.*)/g);
  return HUB_CONTENT_TYPES[matches ? matches[0] : type];
};

module.exports = {
  getSmallTile,
  getLargeTile,
  getLargeImage,
  getCategoryIds,
  buildSecondaryTags,
  typeFrom,
};
