/**
 * Typed declarations for the @turf v6 functions this library uses.
 * The @turf v6 packages ship no bundled types, so these are declared here
 * against the shapes the library actually consumes.
 */
declare module '@turf/circle' {
  import type { Feature, Polygon } from 'geojson';
  interface CircleOptions {
    units?: 'kilometers' | 'miles' | 'meters' | 'degrees' | 'radians';
    steps?: number;
    properties?: Record<string, unknown>;
  }
  export default function circle(
    center: number[] | Feature<import('geojson').Point>,
    radius: number,
    options?: CircleOptions,
  ): Feature<Polygon>;
}

declare module '@turf/distance' {
  import type { Feature, Point } from 'geojson';
  interface DistanceOptions {
    units?: 'kilometers' | 'miles' | 'meters' | 'degrees' | 'radians';
  }
  export default function distance(
    from: Feature<Point> | number[],
    to: Feature<Point> | number[],
    options?: DistanceOptions,
  ): number;
}

declare module '@turf/helpers' {
  import type { Feature, Point, Properties } from 'geojson';
  export function point(
    coordinates: number[],
    properties?: Properties,
  ): Feature<Point>;
}
