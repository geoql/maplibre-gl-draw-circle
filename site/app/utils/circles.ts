import circle from '@turf/circle';
import type { Feature, Polygon } from 'geojson';

/** What the page shows about one circle drawn by the plugin. */
export interface CircleSummary {
  id: string;
  center: [number, number];
  radiusKm: number;
}

function isLngLat(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((n) => typeof n === 'number' && Number.isFinite(n))
  );
}

/**
 * Pick the finished circles out of mapbox-gl-draw features. A circle that is
 * still being dragged out has an empty `center` and no radius yet; skip it.
 */
export function summarizeCircles(features: Feature[]): CircleSummary[] {
  const out: CircleSummary[] = [];
  for (const feature of features) {
    const props = feature.properties ?? {};
    const { center, radiusInKm } = props;
    if (
      props.isCircle === true &&
      isLngLat(center) &&
      typeof radiusInKm === 'number' &&
      radiusInKm > 0 &&
      feature.id !== undefined
    ) {
      out.push({ id: String(feature.id), center, radiusKm: radiusInKm });
    }
  }
  return out;
}

/** A circle feature in the exact shape the plugin's modes create and edit. */
export function seedCircle(
  center: [number, number],
  radiusKm: number,
): Feature<Polygon> {
  const polygon = circle(center, radiusKm);
  return {
    type: 'Feature',
    properties: { isCircle: true, center, radiusInKm: radiusKm },
    geometry: polygon.geometry,
  };
}
