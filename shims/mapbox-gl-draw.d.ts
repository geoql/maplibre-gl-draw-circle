/**
 * Typed declarations for the mapbox-gl-draw internals that this library
 * extends at runtime. The published `@mapbox/mapbox-gl-draw` npm package
 * ships only `dist/` (no `src/`), so these modules are vendored under
 * `vendor/mapbox-gl-draw/src` and aliased at build/runtime — this file is
 * the type surface for both the vendored modules and the custom-mode hooks
 * this library adds on top of mapbox-gl-draw's own `DrawCustomMode`.
 */
declare module '@mapbox/mapbox-gl-draw/src/constants' {
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
}

declare module '@mapbox/mapbox-gl-draw/src/lib/double_click_zoom' {
  interface DoubleClickZoom {
    enable(ctx: unknown): void;
    disable(ctx: unknown): void;
  }
  const doubleClickZoom: DoubleClickZoom;
  export default doubleClickZoom;
}

declare module '@mapbox/mapbox-gl-draw/src/lib/create_vertex' {
  import type { Feature, Point } from 'geojson';
  export default function createVertex(
    parentId: string,
    coordinates: number[],
    path: string,
    selected: boolean,
  ): Feature<Point>;
}

declare module '@mapbox/mapbox-gl-draw/src/lib/create_midpoint' {
  import type { Feature, Point } from 'geojson';
  export default function createMidpoint(
    parent: unknown,
    startVertex: unknown,
    endVertex: unknown,
  ): Feature<Point>;
}

declare module '@mapbox/mapbox-gl-draw/src/lib/create_supplementary_points' {
  import type { Feature, Point } from 'geojson';
  export default function createSupplementaryPoints(
    geojson: Feature,
    options?: Record<string, unknown>,
  ): Feature<Point>[];
}

declare module '@mapbox/mapbox-gl-draw/src/lib/move_features' {
  import type { Feature } from 'geojson';
  export default function moveFeatures(
    features: Feature[],
    delta: { lng: number; lat: number },
  ): void;
}

declare module '@mapbox/mapbox-gl-draw/src/lib/constrain_feature_movement' {
  import type { Feature } from 'geojson';
  export default function constrainFeatureMovement(
    geojsonFeatures: Feature[],
    delta: { lng: number; lat: number },
  ): { lng: number; lat: number };
}

declare module '@mapbox/geojson-extent' {
  import type { BBox, Feature, Geometry } from 'geojson';
  export default function extent(
    data: Feature<Geometry> | Feature<Geometry>[],
  ): BBox;
}
