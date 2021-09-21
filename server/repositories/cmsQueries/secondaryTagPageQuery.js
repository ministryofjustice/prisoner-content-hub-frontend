/* eslint-disable class-methods-use-this */
const { DrupalJsonApiParams: Query } = require('drupal-jsonapi-params');
const { typeFrom } = require('../../utils/adapters');

class SecondaryTagPageQuery {
  static #TILE_FIELDS = [
    'drupal_internal__nid',
    'title',
    'field_moj_description',
    'field_moj_thumbnail_image',
    'field_moj_secondary_tags',
  ];

  constructor(establishmentName, uuid) {
    this.establishmentName = establishmentName;
    this.uuid = uuid;
    this.query = new Query()
      .addFilter('field_moj_secondary_tags.id', uuid)
      .addFields('node--page', SecondaryTagPageQuery.#TILE_FIELDS)
      .addFields('node--moj_video_item', SecondaryTagPageQuery.#TILE_FIELDS)
      .addFields('node--moj_radio_item', SecondaryTagPageQuery.#TILE_FIELDS)
      .addFields('moj_pdf_item', SecondaryTagPageQuery.#TILE_FIELDS)
      .addFields('file--file', ['image_style_uri'])
      .addFields('taxonomy_term--tags', [
        'name',
        'description',
        'drupal_internal__tid',
        'field_featured_image',
      ])
      .addInclude([
        'field_moj_thumbnail_image',
        'field_moj_secondary_tags.field_featured_image',
      ])
      .addSort('created', 'DESC')
      .getQueryString();
  }

  path() {
    return `/jsonapi/prison/${this.establishmentName}/node?${this.query}`;
  }

  #getTag = fieldMojSecondaryTags => {
    const item = fieldMojSecondaryTags.find(({ id }) => id === this.uuid);

    return {
      id: item?.drupalInternal_Tid,
      contentType: 'tags',
      name: item?.name,
      description: item?.description?.processed,
      image: {
        url: item?.fieldFeaturedImage?.imageStyleUri[0]?.tile_large,
        alt: item?.fieldFeaturedImage?.resourceIdObjMeta?.alt,
      },
    };
  };

  #getContent = item => {
    const id = item?.drupalInternal_Nid;
    return {
      id,
      title: item?.title,
      contentType: typeFrom(item?.type),
      summary: item?.fieldMojDescription?.summary,
      contentUrl: `/content/${id}`,
      image: {
        url: item?.fieldMojThumbnailImage?.imageStyleUri[1].tile_small,
        alt: item?.fieldMojThumbnailImage?.resourceIdObjMeta?.alt,
      },
    };
  };

  transform(deserializedResponse) {
    if (deserializedResponse.length === 0) return null;
    return Object.assign(
      this.#getTag(deserializedResponse[0].fieldMojSecondaryTags),
      {
        relatedContent: {
          contentType: 'default',
          data: deserializedResponse.map(item => this.#getContent(item)),
        },
      },
    );
  }
}

module.exports = { SecondaryTagPageQuery };
