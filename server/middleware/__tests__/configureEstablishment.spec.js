const configureEstablishment = require('../configureEstablishment');

const config = {
  sites: {
    berwyn: {
      enabled: true,
      features: [
        'adjudications',
        'approvedVisitors',
        'incentives',
        'money',
        'timetable',
        'visits',
      ],
    },
  },
  analytics: {
    endpoint: 'https://www.google-analytics.com/collect',
    siteId: 'G-0RBPFCWD3X',
    gtmSiteId: 'GTM-M62TTBK',
  },
};

jest.mock('../../config', () => config);

describe('configureEstablishment', () => {
  const next = jest.fn();
  let res;

  beforeEach(() => {
    res = { locals: {} };
    next.mockClear();
  });

  it('should use session data to set the local data', () => {
    const req = {
      session: {
        id: 1,
        establishmentName: 'berwyn',
        establishmentId: 792,
        establishmentPersonalisationEnabled: true,
      },
    };

    configureEstablishment(req, res, next);

    expect(res.locals.establishmentName).toBe('berwyn');
    expect(res.locals.establishmentEnabled).toBe(true);
    expect(res.locals.establishmentDisplayName).toBe('HMP Berwyn');
    expect(next).toHaveBeenCalled();
  });
});
