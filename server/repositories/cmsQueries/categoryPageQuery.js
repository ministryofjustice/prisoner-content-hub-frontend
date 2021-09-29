/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { getSmallTile } = require('../../utils/jsonApi');
const { typeFrom } = require('../../utils/adapters');

class CategoryPageQuery {
  constructor(establishmentName, uuid) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    this.query = new Query()
      .addInclude([
        'field_featured_tiles',
        'field_featured_tiles.field_featured_image',
        'field_featured_tiles.field_moj_thumbnail_image',
      ])

      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/taxonomy_term/moj_categories/${this.uuid}?${this.query}`;
  }

  getTile(item) {
    console.log(`getting Tile... ${item?.type}`);
    switch (typeFrom(item?.type)) {
      case 'radio':
      case 'pdf':
      case 'video':
      case 'page':
        return getSmallTile(item);
      case 'landing_page':
      case 'series':
      case 'tags':
      default:
        console.log('HUZZAH!');
        console.log(item?.type);
        console.log(item);
        console.log('HOO-HAR!!');
        break;
    }
    return null;
  }

  transform(data) {
    console.log('111111111111111');
    console.log(data);
    console.log('222222222222222');
    const id =
      data?.fieldLegacyLandingPage?.resourceIdObjMeta
        ?.drupal_internal__target_id;
    return {
      title: data?.name,
      contentType: 'landing-page',
      description: data?.description?.processed,
      config: {
        content: true,
        header: false,
        postscript: true,
        returnUrl: `/content/${id}`,
      },
      categoryFeaturedContent: data?.fieldFeaturedTiles.map(this.getTile),
    };
  }
}

module.exports = { CategoryPageQuery };
