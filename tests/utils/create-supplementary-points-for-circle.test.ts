import { describe, expect, it, vi } from 'vitest';
import { createSupplementaryPointsForCircle } from '../../lib/utils/create-supplementary-points-for-circle';
import createVertex from '@mapbox/mapbox-gl-draw/src/lib/create_vertex';

vi.mock('@mapbox/mapbox-gl-draw/src/lib/create_vertex');

describe('CreateSupplementaryPointsForCircle tests', () => {
  it('should generate four supplementary points when the feature is a circle', () => {
    const mockGeoJSON = {
      properties: {
        user_isCircle: true,
      },
      geometry: {
        coordinates: [[{}, {}, {}, {}, {}]], // 64 vertices will be present for the circle
      },
    };
    createVertex.mockReturnValue({});
    expect(createSupplementaryPointsForCircle(mockGeoJSON).length).toEqual(4);
  });

  it('should return null if the feature is not a circle', () => {
    const mockGeoJSON = {
      properties: {
        user_isCircle: false,
      },
    };
    expect(createSupplementaryPointsForCircle(mockGeoJSON)).toEqual(null);
  });
});
