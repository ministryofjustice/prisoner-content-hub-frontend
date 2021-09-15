const getImage = (data, type) => {
  if (!data) return null;
  return {
    url: data?.imageStyleUri?.find(img => Boolean(img?.[type]))[type] || '',
    alt: data?.resourceIdObjMeta?.alt || '',
  };
};

const getLargeTile = data => getImage(data, 'tile_large');
const getSmallTile = data => getImage(data, 'tile_small');

module.exports = { getLargeTile, getSmallTile, getImage };
