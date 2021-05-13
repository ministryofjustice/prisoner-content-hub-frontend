const createTiles = ({ data: items }) =>
  items.map(item => {
    const image =
      item.relationships?.field_moj_thumbnail_image?.data ||
      item.relationships?.field_image?.data;

    return {
      id: item.attributes.drupal_internal__nid.toString(),
      title: item.attributes.title,
      content_type: item.type.replace('node--', ''),
      summary: item.attributes.field_moj_description?.summary,
      image: {
        target_id: image.attributes.drupal_internal__fid,
        alt: image.meta.alt,
        title: image.meta.title,
        width: image.meta.width,
        height: image.meta.height,
        target_type: 'file',
        target_uuid: image.id,
        url: image.attributes.uri.url,
      },
      series: [],
    };
  });

const createFeaturedContentResponse = data => {
  const {
    attributes,
    relationships: {
      field_moj_featured_tile_large: largeTiles,
      field_moj_featured_tile_small: smallTiles,
    },
  } = data[0];

  const { drupal_internal__nid: id, title } = attributes;

  return {
    id: id.toString(),
    title,
    content_type: 'featured_articles',
    large_tiles: createTiles(largeTiles),
    small_tiles: createTiles(smallTiles),
  };
};

module.exports = { createFeaturedContentResponse };
