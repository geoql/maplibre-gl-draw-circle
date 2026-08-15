import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import type { Position } from 'geojson';
import SimpleSelectModeDefault from '../../lib/modes/simple-select-mode';
import createSupplementaryPointsDefault from '../../vendor/mapbox-gl-draw/src/lib/create_supplementary_points.js';
import moveFeaturesDefault from '../../vendor/mapbox-gl-draw/src/lib/move_features.js';
import { createSupplementaryPointsForCircle as cspfcDefault } from '../../lib/utils/create-supplementary-points-for-circle';

vi.mock(
  '../../vendor/mapbox-gl-draw/src/lib/create_supplementary_points.js',
  () => ({
    default: vi.fn(),
  }),
);
vi.mock('../../vendor/mapbox-gl-draw/src/lib/move_features.js', () => ({
  default: vi.fn(),
}));
vi.mock('../../lib/utils/create-supplementary-points-for-circle', () => ({
  createSupplementaryPointsForCircle: vi.fn(),
}));

const createSupplementaryPoints = vi.mocked(createSupplementaryPointsDefault);
const moveFeatures = vi.mocked(moveFeaturesDefault);
const createSupplementaryPointsForCircle = vi.mocked(cspfcDefault);

interface SimpleSelectModeTest {
  dragMove(
    state: {
      dragMoving?: boolean;
      dragMoveLocation?: { lng: number; lat: number };
    },
    e: {
      originalEvent: { stopPropagation: Mock };
      lngLat: { lng: number; lat: number };
    },
  ): void;
  toDisplayFeatures(
    state: { dragMoveLocation?: { lng: number; lat: number } },
    geojson: {
      geometry?: { type: string };
      properties?: { user_isCircle?: boolean; active?: string };
    },
    display: Mock,
  ): void;
  getSelected: Mock;
  isSelected: Mock;
  fireActionable: Mock;
}

const SimpleSelectMode =
  SimpleSelectModeDefault as unknown as SimpleSelectModeTest;

describe('SimpleSelectMode tests', () => {
  let mockState: Parameters<SimpleSelectModeTest['dragMove']>[0] = {};
  let mockEvent: Parameters<SimpleSelectModeTest['dragMove']>[1] = {
    originalEvent: { stopPropagation: vi.fn() },
    lngLat: { lng: 2, lat: 2 },
  };
  let mockFeatures: Array<{
    properties: { isCircle?: boolean; center?: number[] };
  }>;

  beforeEach(() => {
    Object.assign(SimpleSelectMode, {
      getSelected: vi.fn(),
      isSelected: vi.fn(),
      fireActionable: vi.fn(),
    });

    mockState = {
      dragMoving: false,
      dragMoveLocation: {
        lat: 1,
        lng: 1,
      },
    };

    mockEvent = {
      originalEvent: {
        stopPropagation: vi.fn(),
      },
      lngLat: {
        lng: 2,
        lat: 2,
      },
    };

    mockFeatures = [
      {
        properties: {
          isCircle: true,
          center: [0, 0],
        },
      },
    ];

    SimpleSelectMode.getSelected.mockReturnValue(mockFeatures);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should move selected features when dragMove is invoked', () => {
    SimpleSelectMode.dragMove(mockState, mockEvent);
    expect(mockState.dragMoving).toEqual(true);
    expect(mockEvent.originalEvent.stopPropagation).toHaveBeenCalled();
    expect(moveFeatures).toHaveBeenCalledWith(mockFeatures, { lng: 1, lat: 1 });
  });

  it('should update center of the circle feature when dragMove is invoked', () => {
    SimpleSelectMode.dragMove(mockState, mockEvent);
    expect(mockFeatures[0].properties.center).toEqual([1, 1]);
  });

  it('should display points generated using createSupplementaryPointsForCircle', () => {
    SimpleSelectMode.isSelected.mockReturnValue(true);
    const mockSupplementary = {
      type: 'Feature' as const,
      properties: {
        user_isCircle: true,
      },
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[[0, 0]]] as Position[][],
      },
    };
    createSupplementaryPointsForCircle.mockReturnValue([mockSupplementary]);
    const mockGeoJSON = {
      geometry: {
        type: 'Polygon',
      },
      properties: {
        user_isCircle: true,
      },
    };
    const mockDisplay = vi.fn();
    SimpleSelectMode.toDisplayFeatures(mockState, mockGeoJSON, mockDisplay);
    expect(SimpleSelectMode.fireActionable).toHaveBeenCalled();
    expect(mockDisplay.mock.calls).toEqual([
      [mockGeoJSON],
      [mockSupplementary, 0, [mockSupplementary]], // second and third elements are passed by Array.forEach
    ]);
  });

  it('should not generate supplementary vertices if the feature is not active', () => {
    SimpleSelectMode.isSelected.mockReturnValue(false);
    const mockGeoJSON = {
      geometry: {
        type: 'Polygon',
      },
      properties: {
        user_isCircle: true,
      },
    };
    const mockDisplay = vi.fn();
    SimpleSelectMode.toDisplayFeatures(mockState, mockGeoJSON, mockDisplay);
    expect(SimpleSelectMode.fireActionable).toHaveBeenCalled();
    expect(mockDisplay).toHaveBeenCalledWith(mockGeoJSON);
    expect(createSupplementaryPointsForCircle).not.toHaveBeenCalled();
  });

  it('should generate supplementary vertices using createSupplementaryVertices if the feature is not a circle', () => {
    SimpleSelectMode.isSelected.mockReturnValue(true);
    createSupplementaryPoints.mockReturnValue([{}]);
    const mockGeoJSON = {
      geometry: {
        type: 'Polygon',
      },
      properties: {
        user_isCircle: false,
      },
    };
    const mockDisplay = vi.fn();
    SimpleSelectMode.toDisplayFeatures(mockState, mockGeoJSON, mockDisplay);
    expect(SimpleSelectMode.fireActionable).toHaveBeenCalled();
    expect(createSupplementaryPoints).toHaveBeenCalledWith(mockGeoJSON);
    expect(mockDisplay.mock.calls).toEqual([
      [mockGeoJSON],
      [{}, 0, [{}]], // second and third elements are passed by Array.forEach
    ]);
  });
});
