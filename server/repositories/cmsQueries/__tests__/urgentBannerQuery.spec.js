const { UrgentBannerQuery } = require('../urgentBannerQuery');

describe('Urgent banner query', () => {
  const query = new UrgentBannerQuery('wayland');
  describe('path', () => {
    it('should create correct path', async () => {
      expect(query.path()).toStrictEqual(
        '/jsonapi/prison/wayland/node/urgent_banner?include=field_more_info_page&fields%5Bnode--urgent_banner%5D=drupal_internal__nid%2Ctitle%2Ccreated%2Cchanged%2Cfield_more_info_page',
      );
    });
  });

  describe('transformEach', () => {
    it('should create correct structure', async () => {
      const banner = {
        title: 'banner',
        fieldMoreInfoPage: {
          path: {
            alias: '/more/info',
          },
        },
      };
      expect(query.transformEach(banner)).toStrictEqual({
        title: 'banner',
        more_info_link: '/more/info',
      });
    });
  });
});
