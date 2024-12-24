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
      languages: ['en'],
    },
    cardiff: {
      enabled: true,
      features: [],
      languages: ['en', 'cy'],
    },
  },
  analytics: {
    endpoint: 'https://www.google-analytics.com/collect',
    siteId: 'G-0RBPFCWD3X',
    gtmSiteId: 'GTM-M62TTBK',
  },
  defaultLanguage: 'en',
  languages: [
    { lang: 'en', text: 'English' },
    { lang: 'cy', text: 'Cymraeg' },
  ],
};

jest.mock('../../config', () => config);

const configureEstablishment = require('../configureEstablishment');

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
    expect(res.locals.currentLng).toBe('en');
    expect(res.locals.multilingual).toEqual(false);
    expect(next).toHaveBeenCalled();
  });

  it('should detect multilingual sites', () => {
    const req = {
      session: {
        id: 1,
        establishmentName: 'cardiff',
        establishmentId: 2095,
        establishmentPersonalisationEnabled: true,
      },
      protocol: 'http',
      originalUrl: '/',
    };
    req.get = () => 'localhost';

    configureEstablishment(req, res, next);

    expect(res.locals.multilingual).toEqual(true);
    expect(next).toHaveBeenCalled();
  });
});
