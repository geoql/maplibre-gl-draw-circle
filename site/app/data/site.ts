export const SITE = {
  name: 'maplibre-gl-draw-circle',
  title: 'maplibre-gl-draw-circle — draw and edit circles on a MapLibre map',
  description:
    'Custom mapbox-gl-draw modes that draw, drag, move and resize true geodesic circles on MapLibre GL. Try it live.',
  url: 'https://maplibre-gl-draw-circle.geoql.in',
  github: 'https://github.com/geoql/maplibre-gl-draw-circle',
  npm: 'https://www.npmjs.com/package/@geoql/maplibre-gl-draw-circle',
  jsr: 'https://jsr.io/@geoql/maplibre-gl-draw-circle',
  geoql: 'https://geoql.in',
  mapStyle: 'https://tiles.openfreemap.org/styles/liberty',
  mapStyleDark: 'https://tiles.openfreemap.org/styles/dark',
} as const;

export const INSTALL_COMMANDS = {
  pnpm: 'pnpm add @geoql/maplibre-gl-draw-circle @mapbox/mapbox-gl-draw maplibre-gl',
  npm: 'npm install @geoql/maplibre-gl-draw-circle @mapbox/mapbox-gl-draw maplibre-gl',
} as const;

export type PackageManager = keyof typeof INSTALL_COMMANDS;
