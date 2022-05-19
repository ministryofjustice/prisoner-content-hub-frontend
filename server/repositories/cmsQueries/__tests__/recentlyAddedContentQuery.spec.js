const { getPagination } = require('../../../utils/jsonApi');
const { RecentlyAddedContentQuery } = require('../recentlyAddedContentQuery');

describe('Recently Added Content page query', () => {
  let ESTABLISHMENTNAME;
  let timeStamp;
  let query;

  beforeEach(() => {
    ESTABLISHMENTNAME = 'Wayland';
    timeStamp = 1651737416;
    query = new RecentlyAddedContentQuery(ESTABLISHMENTNAME, 1, 40, timeStamp);
  });

  describe('path', () => {
    it('should return correct path', () => {
      expect(query.path()).toStrictEqual(
        `/jsonapi/prison/${ESTABLISHMENTNAME}/node?filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bpath%5D=type.meta.drupal_internal__target_id&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B0%5D=page&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B1%5D=moj_video_item&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B2%5D=moj_radio_item&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Bvalue%5D%5B3%5D=moj_pdf_item&filter%5Btype.meta.drupal_internal__target_id%5D%5Bcondition%5D%5Boperator%5D=IN&filter%5Bcreated%5D%5Bvalue%5D=${timeStamp}&filter%5Bcreated%5D%5Boperator%5D=%3E%3D&include=field_moj_thumbnail_image&sort=-published_at%2Ccreated&fields%5Bnode--page%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id&fields%5Bnode--moj_video_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id&fields%5Bnode--moj_radio_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id&fields%5Bnode--moj_pdf_item%5D=drupal_internal__nid%2Ctitle%2Cfield_moj_thumbnail_image%2Cfield_thumbnail_image%2Cfield_moj_description%2Cfield_moj_series%2Cpath%2Ctype.meta.drupal_internal__target_id&fields%5Bfile--file%5D=drupal_internal__fid%2Cid%2Cimage_style_uri&${getPagination(
          1,
          40,
        )}`,
      );
    });
  });
});
