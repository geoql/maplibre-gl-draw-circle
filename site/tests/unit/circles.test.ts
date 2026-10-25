import { describe, expect, it } from 'vitest';
import type { Feature } from 'geojson';
import { seedCircle, summarizeCircles } from '../../app/utils/circles';
import { roundKm } from '../../app/data/modes';

describe('seedCircle', () => {
  it('builds the feature shape the plugin modes create', () => {
    const feature = seedCircle([72.8777, 19.076], 2);
    expect(feature.properties).toEqual({
      isCircle: true,
      center: [72.8777, 19.076],
      radiusInKm: 2,
    });
    expect(feature.geometry.type).toBe('Polygon');
    // turf/circle default: 64 steps plus the closing vertex.
    expect(feature.geometry.coordinates[0]).toHaveLength(65);
  });
});

describe('summarizeCircles', () => {
  it('keeps finished circles and skips one still being dragged out', () => {
    const done: Feature = {
      ...seedCircle([2.35, 48.85], 1.5),
      id: 'a',
    };
    const dragging: Feature = {
      type: 'Feature',
      id: 'b',
      properties: { isCircle: true, center: [] },
      geometry: { type: 'Polygon', coordinates: [[]] },
    };
    const polygon: Feature = {
      type: 'Feature',
      id: 'c',
      properties: {},
      geometry: { type: 'Polygon', coordinates: [[]] },
    };

    expect(summarizeCircles([done, dragging, polygon])).toEqual([
      { id: 'a', center: [2.35, 48.85], radiusKm: 1.5 },
    ]);
  });
});

describe('roundKm', () => {
  it('rounds to two decimals', () => {
    expect(roundKm(1.23456)).toBe(1.23);
    expect(roundKm(2)).toBe(2);
  });
});
