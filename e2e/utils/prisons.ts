export const PRISONS = [
  { id: 'berwyn', name: 'Berwyn', url: 'berwyn.prisoner-content-hub.local' },
  { id: 'bullingdon', name: 'Bullingdon', url: 'bullingdon.prisoner-content-hub.local' },
  { id: 'cardiff', name: 'Cardiff', url: 'cardiff.prisoner-content-hub.local' },
  { id: 'chelmsford', name: 'Chelmsford', url: 'chelmsford.prisoner-content-hub.local' },
  { id: 'cookhamwood', name: 'Cookham Wood', url: 'cookhamwood.prisoner-content-hub.local' },
  { id: 'erlestoke', name: 'Erlestoke', url: 'erlestoke.prisoner-content-hub.local' },
  { id: 'felthama', name: 'Feltham A', url: 'felthama.prisoner-content-hub.local' },
  { id: 'felthamb', name: 'Feltham B', url: 'felthamb.prisoner-content-hub.local' },
  { id: 'garth', name: 'Garth', url: 'garth.prisoner-content-hub.local' },
  { id: 'lindholme', name: 'Lindholme', url: 'lindholme.prisoner-content-hub.local' },
  { id: 'newhall', name: 'New Hall', url: 'newhall.prisoner-content-hub.local' },
  { id: 'ranby', name: 'Ranby', url: 'ranby.prisoner-content-hub.local' },
  { id: 'stokeheath', name: 'Stoke Heath', url: 'stokeheath.prisoner-content-hub.local' },
  { id: 'styal', name: 'Styal', url: 'styal.prisoner-content-hub.local' },
  { id: 'swaleside', name: 'Swaleside', url: 'swaleside.prisoner-content-hub.local' },
  { id: 'themount', name: 'The Mount', url: 'themount.prisoner-content-hub.local' },
  { id: 'thestudio', name: 'The Studio', url: 'thestudio.prisoner-content-hub.local' },
  { id: 'wayland', name: 'Wayland', url: 'wayland.prisoner-content-hub.local' },
  { id: 'werrington', name: 'Werrington', url: 'werrington.prisoner-content-hub.local' },
  { id: 'wetherby', name: 'Wetherby', url: 'wetherby.prisoner-content-hub.local' },
  { id: 'woodhill', name: 'Woodhill', url: 'woodhill.prisoner-content-hub.local' },
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
  
  const isCI = !!process.env.CI;
  const domain = isCI ? prison.url.replace('prisoner-content-hub.local', 'content-hub.localhost') : prison.url;
  const portNumber = port ?? (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
  
  return `http://${domain}:${portNumber}`;
}
