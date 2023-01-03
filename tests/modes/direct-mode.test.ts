import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@mapbox/mapbox-gl-draw/src/lib/create_supplementary_points');
vi.mock('@mapbox/mapbox-gl-draw/src/lib/move_features');
vi.mock('@mapbox/mapbox-gl-draw/src/lib/constrain_feature_movement');
vi.mock('@turf/distance', () => ({ default: vi.fn() }));
vi.mock('@turf/helpers');
vi.mock('@turf/circle', () => ({ default: vi.fn() }));
vi.mock('../../lib/utils/create-supplementary-points-for-circle');

const createSupplementaryPoints = import(
  '@mapbox/mapbox-gl-draw/src/lib/create_supplementary_points'
);
const moveFeatures = import('@mapbox/mapbox-gl-draw/src/lib/move_features');
const distance = import('@turf/distance').default;
const circle = import('@turf/circle').default;
const createSupplementaryPointsForCircle = import(
  '../../lib/utils/create-supplementary-points-for-circle'
);

let DirectMode = import('../../lib/modes/direct-mode');

describe('DirectMode tests', () => {
  let mockState = {};
  let mockEvent = {};
  let mockDelta = {};
  let mockFeatures;

  beforeEach(() => {
    DirectMode = {
      ...DirectMode,
      getSelected: vi.fn(),
      fireActionable: vi.fn(),
    };

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
      },
    };
    DirectMode.getSelected.mockReturnValue(mockFeatures);
  });

  afterEach(() => {
    createSupplementaryPoints.mockClear();
    createSupplementaryPointsForCircle.mockClear();
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
    circle.mockReturnValue(mockFeatures[0]);
    DirectMode.dragVertex(mockState, mockEvent, mockDelta);
    expect(mockState.feature.incomingCoords).toHaveBeenCalledWith(
      mockFeatures[0].geometry.coordinates,
    );
    expect(mockState.feature.properties.radiusInKm).toEqual(1);
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
