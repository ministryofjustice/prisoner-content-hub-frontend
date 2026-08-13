export const PRISONS = [
  { id: 'bedford', name: 'Bedford', url: 'bedford.prisoner-content-hub.local', devUrl: 'https://bedford-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'berwyn', name: 'Berwyn', url: 'berwyn.prisoner-content-hub.local', devUrl: 'https://berwyn-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'bullingdon', name: 'Bullingdon', url: 'bullingdon.prisoner-content-hub.local', devUrl: 'https://bullingdon-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'cardiff', name: 'Cardiff', url: 'cardiff.prisoner-content-hub.local', devUrl: 'https://cardiff-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'chelmsford', name: 'Chelmsford', url: 'chelmsford.prisoner-content-hub.local', devUrl: 'https://chelmsford-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'cookhamwood', name: 'Cookham Wood', url: 'cookhamwood.prisoner-content-hub.local', devUrl: 'https://cookhamwood-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'erlestoke', name: 'Erlestoke', url: 'erlestoke.prisoner-content-hub.local', devUrl: 'https://erlestoke-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'felthama', name: 'Feltham A', url: 'felthama.prisoner-content-hub.local', devUrl: 'https://felthama-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'felthamb', name: 'Feltham B', url: 'felthamb.prisoner-content-hub.local', devUrl: 'https://felthamb-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'garth', name: 'Garth', url: 'garth.prisoner-content-hub.local', devUrl: 'https://garth-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'lindholme', name: 'Lindholme', url: 'lindholme.prisoner-content-hub.local', devUrl: 'https://lindholme-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'newhall', name: 'New Hall', url: 'newhall.prisoner-content-hub.local', devUrl: 'https://newhall-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'ranby', name: 'Ranby', url: 'ranby.prisoner-content-hub.local', devUrl: 'https://ranby-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'stokeheath', name: 'Stoke Heath', url: 'stokeheath.prisoner-content-hub.local', devUrl: 'https://stokeheath-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'styal', name: 'Styal', url: 'styal.prisoner-content-hub.local', devUrl: 'https://styal-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'swaleside', name: 'Swaleside', url: 'swaleside.prisoner-content-hub.local', devUrl: 'https://swaleside-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'themount', name: 'The Mount', url: 'themount.prisoner-content-hub.local', devUrl: 'https://themount-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'thestudio', name: 'The Studio', url: 'thestudio.prisoner-content-hub.local', devUrl: 'https://thestudio-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'wayland', name: 'Wayland', url: 'wayland.prisoner-content-hub.local', devUrl: 'https://wayland-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'werrington', name: 'Werrington', url: 'werrington.prisoner-content-hub.local', devUrl: 'https://werrington-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'wetherby', name: 'Wetherby', url: 'wetherby.prisoner-content-hub.local', devUrl: 'https://wetherby-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
  { id: 'woodhill', name: 'Woodhill', url: 'woodhill.prisoner-content-hub.local', devUrl: 'https://woodhill-prisoner-content-hub-development.apps.live.cloud-platform.service.justice.gov.uk' },
] as const;

export type PrisonId = typeof PRISONS[number]['id'];

export function getPrisonByIdName(id: string) {
  return PRISONS.find(prison => prison.id === id);
}

export function getBaseURL(prisonId: PrisonId, port?: number): string {
  const prison = PRISONS.find(p => p.id === prisonId);
  if (!prison) {
    throw new Error(`Prison with id '${prisonId}' not found`);
  }
  
  // Use dev environment if USE_DEV_ENV is set
  if (process.env.USE_DEV_ENV === 'true') {
    return prison.devUrl;
  }
  
  const isCI = !!process.env.CI;
  const domain = isCI ? prison.url.replace('prisoner-content-hub.local', 'content-hub.localhost') : prison.url;
  const portNumber = port ?? (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
  
  return `http://${domain}:${portNumber}`;
}
