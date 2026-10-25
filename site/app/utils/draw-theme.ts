/**
 * mapbox-gl-draw layer theme, written with modern expressions.
 *
 * mapbox-gl-draw's built-in theme still uses legacy filter syntax
 * (`['==', '$type', 'Polygon']`), which the MapLibre 6 style spec rejects
 * with an error. Draw derives the `.cold` / `.hot` layer pairs from these.
 *
 * MapLibre paint values need a colour it can parse, so the CSS tokens are
 * mirrored here as hex: accent = --accent (light), ink = --ink (light).
 */
const ACCENT = '#d4652a';
const ACCENT_ACTIVE = '#b8501b';
const HALO = '#fbf8f2';

const isActive = ['==', ['get', 'active'], 'true'];
const isPolygon = ['==', ['geometry-type'], 'Polygon'];
const isLine = ['==', ['geometry-type'], 'LineString'];
const isPoint = ['==', ['geometry-type'], 'Point'];

export const DRAW_STYLES = [
  {
    id: 'gl-draw-polygon-fill',
    type: 'fill',
    filter: isPolygon,
    paint: {
      'fill-color': ['case', isActive, ACCENT_ACTIVE, ACCENT],
      'fill-opacity': ['case', isActive, 0.22, 0.14],
    },
  },
  {
    id: 'gl-draw-polygon-stroke',
    type: 'line',
    filter: isPolygon,
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color': ['case', isActive, ACCENT_ACTIVE, ACCENT],
      'line-width': ['case', isActive, 2.5, 1.75],
    },
  },
  {
    id: 'gl-draw-line',
    type: 'line',
    filter: isLine,
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': ACCENT, 'line-width': 2 },
  },
  {
    id: 'gl-draw-vertex-halo',
    type: 'circle',
    filter: ['all', isPoint, ['==', ['get', 'meta'], 'vertex']],
    paint: { 'circle-radius': 7, 'circle-color': HALO },
  },
  {
    id: 'gl-draw-vertex',
    type: 'circle',
    filter: ['all', isPoint, ['==', ['get', 'meta'], 'vertex']],
    paint: {
      'circle-radius': ['case', isActive, 5.5, 4.5],
      'circle-color': ACCENT_ACTIVE,
    },
  },
];
