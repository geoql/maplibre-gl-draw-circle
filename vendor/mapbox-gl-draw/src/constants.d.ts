/**
 * Type companion for the vendored constants.js (mapbox-gl-draw v1.4.1).
 * Literal types so `geojsonTypes.FEATURE` narrows to `'Feature'` etc.,
 * matching how the original CJS module-export shape was consumed.
 */
export const classes: Record<string, string>;
export const sources: Record<string, unknown>;
export const cursors: {
  HAND: string;
  ADD: string;
  MOVE: string;
  NONE: string;
};
export const types: {
  POLYGON: 'polygon';
  LINE_STRING: 'line_string';
  POINT: 'point';
};
export const geojsonTypes: {
  FEATURE: 'Feature';
  POLYGON: 'Polygon';
  LINE_STRING: 'LineString';
  POINT: 'Point';
};
export const modes: {
  DRAW_LINE_STRING: 'draw_line_string';
  DRAW_POLYGON: 'draw_polygon';
  DRAW_POINT: 'draw_point';
  SIMPLE_SELECT: 'simple_select';
  DIRECT_SELECT: 'direct_select';
};
export const events: Record<string, string>;
export const updateActions: Record<string, string>;
export const meta: Record<string, string>;
export const activeStates: {
  ACTIVE: 'true';
  INACTIVE: 'false';
};
export const interactions: string[];
export const LAT_MIN: number;
export const LAT_RENDERED_MIN: number;
export const LAT_MAX: number;
export const LAT_RENDERED_MAX: number;
export const LNG_MIN: number;
export const LNG_MAX: number;
