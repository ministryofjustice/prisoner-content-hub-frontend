const createTiles = items =>
  items.map(item => {
    const image = item.fieldMojThumbnailImage || item.fieldImage;
    const meta = image.resourceIdObjMeta;
    return {
      id: item.drupalInternal_Nid.toString(),
      title: item.title,
      content_type: item.type.replace('node--', ''),
      summary: item?.fieldMojDescription?.summary,
      image: {
        target_id: image.drupalInternal_Fid,
        alt: meta.alt,
        title: meta.title,
        width: meta.width,
        height: meta.height,
        target_type: 'file',
        target_uuid: image.id,
        url: image.uri.url,
      },
      series: [],
    };
  });

const createFeaturedContentResponse = data => {
  const {
    drupalInternal_Nid: id,
    title,
    fieldMojFeaturedTileLarge: largeTiles,
    fieldMojFeaturedTileSmall: smallTiles,
  } = data[0];
  return {
    id: id.toString(),
    title,
    content_type: 'featured_articles',
    large_tiles: createTiles(largeTiles),
    small_tiles: createTiles(smallTiles),
  };
};

module.exports = { createFeaturedContentResponse };
