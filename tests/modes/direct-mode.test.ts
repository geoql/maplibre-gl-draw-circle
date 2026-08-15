import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import DirectModeDefault from '../../lib/modes/direct-mode';
import createSupplementaryPointsDefault from '../../vendor/mapbox-gl-draw/src/lib/create_supplementary_points.js';
import moveFeaturesDefault from '../../vendor/mapbox-gl-draw/src/lib/move_features.js';
import { createSupplementaryPointsForCircle as cspfcDefault } from '../../lib/utils/create-supplementary-points-for-circle';
import distanceImport from '@turf/distance';
import circleImport from '@turf/circle';

vi.mock('@turf/distance', () => ({ default: vi.fn() }));
vi.mock('@turf/circle', () => ({ default: vi.fn() }));
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

const distance = vi.mocked(distanceImport);
const circle = vi.mocked(circleImport);
const createSupplementaryPoints = vi.mocked(createSupplementaryPointsDefault);
const moveFeatures = vi.mocked(moveFeaturesDefault);
const createSupplementaryPointsForCircle = vi.mocked(cspfcDefault);

interface DirectModeTest {
  dragFeature(
    state: {
      dragMoveLocation?: { lng: number; lat: number };
      featureId?: number;
      feature?: {
        properties: {
          isCircle?: boolean;
          center?: number[];
          radiusInKm?: number;
        };
        incomingCoords?: Mock;
        getCoordinate?: Mock;
        updateCoordinate?: Mock;
      };
      selectedCoordPaths?: string[];
    },
    e: { lngLat: { lat: number; lng: number } },
    delta: { lat: number; lng: number },
  ): void;
  dragVertex(
    state: {
      feature?: {
        properties: {
          isCircle?: boolean;
          center?: number[];
          radiusInKm?: number;
        };
        incomingCoords?: Mock;
        getCoordinate?: Mock;
        updateCoordinate?: Mock;
      };
      selectedCoordPaths?: string[];
    },
    e: { lngLat: { lat: number; lng: number } },
    delta: { lat: number; lng: number },
  ): void;
  toDisplayFeatures(
    state: {
      featureId?: number;
      feature?: unknown;
      selectedCoordPaths?: string[];
    },
    geojson: {
      properties?: { id?: number; user_isCircle?: boolean; active?: string };
      geometry?: { type: string };
    },
    display: Mock,
  ): void;
  getSelected: Mock;
  fireActionable: Mock;
}

const DirectMode = DirectModeDefault as unknown as DirectModeTest;

describe('DirectMode tests', () => {
  let mockState: Parameters<DirectModeTest['dragFeature']>[0] = {};
  let mockEvent: { lngLat: { lat: number; lng: number } };
  let mockDelta: { lat: number; lng: number };
  let mockFeatures: Array<{
    properties: { isCircle?: boolean; center?: number[] };
    geometry: { coordinates: unknown[] };
  }>;

  beforeEach(() => {
    Object.assign(DirectMode, {
      getSelected: vi.fn(),
      fireActionable: vi.fn(),
    });

    mockEvent = {
      lngLat: { lat: 0, lng: 0 },
    };

    mockDelta = {
      lat: 1,
      lng: 1,
    };
    mockFeatures = [
      {
        properties: {
          isCircle: true,
          center: [0, 0],
        },
        geometry: {
          coordinates: [],
        },
      },
    ];
    mockState = {
      featureId: 1,
      feature: {
        ...mockFeatures[0],
        incomingCoords: vi.fn(),
      } as NonNullable<NonNullable<typeof mockState>['feature']>,
    };
    DirectMode.getSelected.mockReturnValue(mockFeatures);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should move selected features when dragFeature is invoked', () => {
    DirectMode.dragFeature(mockState, mockEvent, mockDelta);
    expect(moveFeatures).toHaveBeenCalledWith(mockFeatures, mockDelta);
  });

  it('should update the center of the selected feature if its a circle', () => {
    DirectMode.dragFeature(mockState, mockEvent, mockDelta);
    expect(mockFeatures[0].properties.center).toEqual([1, 1]);
  });

  it('should set dragMoveLocation to the event lngLat', () => {
    DirectMode.dragFeature(mockState, mockEvent, mockDelta);
    expect(mockState.dragMoveLocation).toEqual(mockEvent.lngLat);
  });

  it('should update the radius when dragVertex is invoked and the feature is a circle', () => {
    distance.mockReturnValue(1);
    circle.mockReturnValue(
      mockFeatures[0] as unknown as Parameters<
        typeof circle.mockReturnValue
      >[0],
    );
    DirectMode.dragVertex(mockState, mockEvent, mockDelta);
    expect(mockState.feature!.incomingCoords).toHaveBeenCalledWith(
      mockFeatures[0].geometry.coordinates,
    );
    expect(mockState.feature!.properties.radiusInKm).toEqual(1);
  });

  it(`should display points generated using 
        createSupplementaryPointsForCircle when the feature is a circle`, () => {
    const mockDisplayFn = vi.fn();
    const mockGeoJSON = {
      properties: {
        id: 1,
        user_isCircle: true,
      },
    };
    createSupplementaryPointsForCircle.mockReturnValue([]);
    DirectMode.toDisplayFeatures(mockState, mockGeoJSON, mockDisplayFn);
    expect(mockDisplayFn).toHaveBeenCalledWith(mockGeoJSON);
    expect(createSupplementaryPointsForCircle).toHaveBeenCalledWith(
      mockGeoJSON,
    );
    expect(DirectMode.fireActionable).toHaveBeenCalled();
  });

  it(`should display points generated using createSupplementaryPoints
        when the feature is not a circle`, () => {
    createSupplementaryPoints.mockReturnValue([]);
    const mockDisplayFn = vi.fn();
    const mockGeoJSON = {
      properties: {
        id: 1,
        user_isCircle: false,
      },
    };
    DirectMode.toDisplayFeatures(mockState, mockGeoJSON, mockDisplayFn);
    expect(mockDisplayFn).toHaveBeenCalledWith(mockGeoJSON);
    expect(createSupplementaryPoints).toHaveBeenCalledWith(mockGeoJSON, {
      map: undefined,
      midpoints: true,
      selectedPaths: undefined,
    });
    expect(DirectMode.fireActionable).toHaveBeenCalled();
  });

  it('should not create supplementary vertices if the feature is not selected', () => {
    const mockDisplayFn = vi.fn();
    const mockGeoJSON = {
      properties: {
        id: 2,
        user_isCircle: false,
      },
    };
    DirectMode.toDisplayFeatures(mockState, mockGeoJSON, mockDisplayFn);
    expect(mockDisplayFn).toHaveBeenCalledWith(mockGeoJSON);
    expect(DirectMode.fireActionable).toHaveBeenCalled();
    expect(createSupplementaryPoints).not.toHaveBeenCalled();
  });
});
