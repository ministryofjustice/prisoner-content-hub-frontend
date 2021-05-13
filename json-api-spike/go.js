/* eslint-disable no-console */
require('dotenv').config();

const { DrupalJsonApiParams: QueryParams } = require('drupal-jsonapi-params');
const { diff } = require('deep-diff');

const { JsonApiClient } = require('../server/clients/jsonApiClient');
const { linkUpIncludes } = require('./processResponse');
const { createFeaturedContentResponse } = require('./featuredContent');

const hostname = process.env.HUB_API_ENDPOINT;

const query = new QueryParams()
  .addFields('node--featured_articles', [
    'title',
    'drupal_internal__nid',
    'field_moj_featured_tile_large',
    'field_moj_featured_tile_small',
  ])
  .addFields('node--page', [
    'drupal_internal__nid',
    'field_moj_thumbnail_image',
    'field_image',
    'title',
    'field_moj_description',
  ])
  .addFields('file--file', ['drupal_internal__fid', 'id', 'uri'])
  .addFields('node--landing_page', [
    'drupal_internal__nid',
    'field_moj_thumbnail_image',
    'field_image',
    'title',
    'field_moj_description',
  ])
  .addInclude([
    'field_moj_featured_tile_large.field_moj_thumbnail_image',
    'field_moj_featured_tile_large.field_image',
    'field_moj_featured_tile_small.field_moj_thumbnail_image',
    'field_moj_featured_tile_small.field_image',
  ]);

const run = async () => {
  const jsonApiClient = new JsonApiClient(hostname);

  const original = await jsonApiClient.get(
    '/v2/api/content/featured?_prison=959',
  );

  const response = await jsonApiClient.get(
    `/jsonapi/prison/cookhamwood/node/featured_articles?${query.getQueryString()}`,
  );

  const featuredContent = createFeaturedContentResponse(
    linkUpIncludes(response),
  );

  // Raw response
  // console.log(JSON.stringify(response, null, 2));

  // transformed payload
  // console.log(JSON.stringify(featuredContent, null, 2));

  const diffs = diff(featuredContent, original[0]);
  diffs.forEach(d => console.log(JSON.stringify(d)));
  console.log(` changes: ${diffs.length}`);
};

run().catch(e => console.error(e));
