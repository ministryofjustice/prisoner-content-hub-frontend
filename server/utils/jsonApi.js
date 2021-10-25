const { typeFrom } = require('./adapters');

const getImage = (data, type) => {
  if (!data) return null;
  return {
    url: data?.imageStyleUri?.find(img => Boolean(img?.[type]))[type] || '',
    alt: data?.resourceIdObjMeta?.alt || '',
  };
};

const getLargeImage = data => getImage(data, 'tile_large');
const getSmallImage = data => getImage(data, 'tile_small');

const getSmallTile = item => {
  const id = item?.drupalInternal_Nid;
  return !id
    ? null
    : {
        id,
        contentType: typeFrom(item?.type),
        title: item?.title,
        summary: item?.fieldMojDescription?.summary,
        contentUrl: `/content/${id}`,
        image: getSmallImage(item?.fieldMojThumbnailImage),
      };
};

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

module.exports = {
  getLargeImage,
  getSmallImage,
  getImage,
  getSmallTile,
  getCategoryIds,
  buildSecondaryTags,
};
