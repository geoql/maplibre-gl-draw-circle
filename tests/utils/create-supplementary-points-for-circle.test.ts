import { describe, expect, it, vi } from 'vitest';
import { createSupplementaryPointsForCircle as cspfc } from '../../lib/utils/create-supplementary-points-for-circle';
import createVertexImport from '../../vendor/mapbox-gl-draw/src/lib/create_vertex.js';

vi.mock('../../vendor/mapbox-gl-draw/src/lib/create_vertex.js', () => ({
  default: vi.fn(),
}));

const createVertex = vi.mocked(createVertexImport);

describe('CreateSupplementaryPointsForCircle tests', () => {
  it('should generate four supplementary points when the feature is a circle', () => {
    const mockGeoJSON = {
      type: 'Feature' as const,
      properties: {
        user_isCircle: true,
        id: 'abc',
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [
          [
            [0, 0],
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 4],
          ],
        ],
      },
    };
    createVertex.mockReturnValue({} as ReturnType<typeof createVertex>);
    expect(cspfc(mockGeoJSON)?.length).toEqual(4);
  });

  it('should return null if the feature is not a circle', () => {
    const mockGeoJSON = {
      type: 'Feature' as const,
      properties: {
        user_isCircle: false,
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [],
      },
    };
    expect(cspfc(mockGeoJSON)).toEqual(null);
  });
});
