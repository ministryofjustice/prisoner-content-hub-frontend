const { differenceInDays, format } = require('date-fns');

const getPagination = (page, size = 40) =>
  `page[offset]=${Math.max(page - 1, 0) * size}&page[limit]=${size}`;

const getImage = (data, type) => {
  if (!data) return null;
  return {
    url: data?.imageStyleUri?.find(img => Boolean(img?.[type]))[type] || '',
    alt: data?.resourceIdObjMeta?.alt || '',
  };
};

const getLargeImage = data => getImage(data, 'tile_large');

const isNew = fromDate => differenceInDays(new Date(), new Date(fromDate)) <= 2;

const cropTextWithEllipsis = (item, maxNumberOfChars = 30) => {
  if (!item || JSON.stringify(item) === '{}') {
    throw new Error('An item object with the expected structure is required');
  }

  const title =
    item.title.length > maxNumberOfChars
      ? `${item.title
          .substr(0, maxNumberOfChars - 2) // - 2: identifies a space after the last charactor
          .match(/^.*[\w\d]+(?=[^\w\d]+[\w\d]*)/g)[0] // matches all characters ending with a whole word, that come before incomplete words or none alphanumeric characters
          .substr(0, maxNumberOfChars - 3)}...` // - 3: accomodates the ... ellipse
      : item.title;

  return { ...item, title };
};

const getTile = (item, imageSize) => {
  const { contentType, externalContent } = typeFrom(item);
  return {
    id: item?.drupalInternal_Nid || item?.drupalInternal_Tid,
    contentType,
    externalContent,
    title: item?.title || item?.name,
    summary: item?.fieldMojDescription?.summary || item?.description?.processed,
    contentUrl: item?.path?.alias,
    displayUrl: item?.fieldDisplayUrl,
    image: getImage(item?.fieldMojThumbnailImage, imageSize),
    isNew: isNew(item?.publishedAt),
  };
};

const getSmallTile = item => getTile(item, 'tile_small');
const getLargeTile = item => getTile(item, 'tile_large');

const getPublishedAtSmallTile = item =>
  cropTextWithEllipsis(
    {
      ...getTile(item, 'tile_small'),
      publishedAt: item?.publishedAt
        ? format(new Date(item?.publishedAt), 'EEEE d MMMM')
        : '',
    },
    70,
  );

const getCategoryId = categories => {
  if (!categories || (Array.isArray(categories) && categories.length === 0))
    return '';
  const category = Array.isArray(categories) ? categories[0] : categories;
  const {
    resourceIdObjMeta: { drupal_internal__target_id: id },
    id: uuid,
    name,
  } = category;
  return {
    id,
    uuid,
    name,
  };
};

const isUnpublished = ({ unpublishOn = null }) =>
  !unpublishOn || unpublishOn >= new Date().getTime();

const buildFieldTopics = (arr = []) =>
  arr.map(({ drupalInternal_Tid: id, name, id: uuid }) => ({
    id,
    uuid,
    name,
  }));

const HUB_CONTENT_TYPES = {
  moj_radio_item: () => ({
    contentType: 'radio',
    externalContent: false,
  }),
  moj_video_item: () => ({
    contentType: 'video',
    externalContent: false,
  }),
  moj_pdf_item: () => ({
    contentType: 'pdf',
    externalContent: true,
  }),
  link: item =>
    item?.fieldShowInterstitialPage === true
      ? {
          contentType: 'external_link',
          externalContent: true,
        }
      : {
          contentType: 'internal_link',
          externalContent: false,
        },
  page: () => ({
    contentType: 'page',
    externalContent: false,
  }),
  series: () => ({
    contentType: 'series',
    externalContent: false,
  }),
  moj_categories: item =>
    isBottomCategory(item?.childTermCount)
      ? {
          contentType: 'category_bottom',
          externalContent: false,
        }
      : {
          contentType: 'category',
          externalContent: false,
        },
  topics: () => ({
    contentType: 'topic',
    externalContent: false,
  }),
};

const typeFrom = item => {
  const matches = item?.type.match(/(?<=--)(.*)/g);
  return HUB_CONTENT_TYPES[matches ? matches[0] : item?.type](item);
};

const isBottomCategory = ({
  sub_categories_count: subCategoriesCount = 0,
  sub_series_count: subSeriesCount = 0,
} = {}) => subCategoriesCount === 0 && subSeriesCount === 0;

const mapBreadcrumbs = (rawBreadcrumbs = [], self = '') => {
  const breadcrumbs = self
    ? [...rawBreadcrumbs, { title: self }]
    : rawBreadcrumbs;

  return breadcrumbs.map(({ uri: href = '', title: text }) => ({
    href,
    text,
  }));
};

module.exports = {
  getPagination,
  getSmallTile,
  getLargeTile,
  getLargeImage,
  getPublishedAtSmallTile,
  getCategoryId,
  isUnpublished,
  buildFieldTopics,
  typeFrom,
  isBottomCategory,
  mapBreadcrumbs,
  isNew,
  cropTextWithEllipsis,
};
