import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import CircleModeDefault from '../../lib/modes/circle-mode';
import * as Constants from '../../vendor/mapbox-gl-draw/src/constants.js';
import doubleClickZoom from '../../vendor/mapbox-gl-draw/src/lib/double_click_zoom.js';
import circleImport from '@turf/circle';

vi.mock('@turf/circle', () => ({
  default: vi.fn(),
}));

const circle = vi.mocked(circleImport);

vi.mock('../../vendor/mapbox-gl-draw/src/lib/double_click_zoom.js', () => ({
  default: {
    enable: vi.fn(),
    disable: vi.fn(),
  },
}));

/**
 * The mode is a plain object at runtime; its methods take `this` from the
 * draw context and its custom hooks are assigned after the draw_polygon
 * spread. Tests exercise those methods directly with mocked context
 * methods, so the test surface re-types the module accordingly.
 */
interface CircleModeTest {
  onSetup(options?: { initialRadiusInKm?: number }): Record<string, unknown>;
  clickAnywhere(
    state: {
      currentVertexPosition: number;
      initialRadiusInKm?: number;
      polygon?: {
        id?: string;
        incomingCoords?: Mock;
        properties?: Record<string, unknown>;
      };
    },
    e: { lngLat: { lat: number; lng: number } },
  ): void;
  addFeature: Mock;
  newFeature: Mock;
  clearSelectedFeatures: Mock;
  updateUIClasses: Mock;
  activateUIButton: Mock;
  setActionableState: Mock;
  changeMode: Mock;
}

const CircleMode = CircleModeDefault as unknown as CircleModeTest;

const mockFeature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [],
  },
};

describe('CircleMode tests', () => {
  beforeEach(() => {
    Object.assign(CircleMode, {
      addFeature: vi.fn(),
      newFeature: vi.fn(),
      clearSelectedFeatures: vi.fn(),
      updateUIClasses: vi.fn(),
      activateUIButton: vi.fn(),
      setActionableState: vi.fn(),
      changeMode: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should setup state with a polygon and initialRadius', () => {
    CircleMode.newFeature.mockReturnValue(mockFeature);
    expect(CircleMode.onSetup({})).toEqual({
      initialRadiusInKm: 2,
      polygon: mockFeature,
      currentVertexPosition: 0,
    });
    expect(CircleMode.newFeature).toHaveBeenCalled();
  });

  it('should setup state with initialRadius as given in options', () => {
    CircleMode.newFeature.mockReturnValue(mockFeature);
    expect(CircleMode.onSetup({ initialRadiusInKm: 1 })).toEqual({
      initialRadiusInKm: 1,
      polygon: mockFeature,
      currentVertexPosition: 0,
    });
    expect(CircleMode.newFeature).toHaveBeenCalled();
  });

  it('should add feature onSetup', () => {
    CircleMode.newFeature.mockReturnValue(mockFeature);
    CircleMode.onSetup({});
    expect(CircleMode.addFeature).toHaveBeenCalledWith(mockFeature);
  });

  it('should clear selected features on setup', () => {
    CircleMode.onSetup({});
    expect(CircleMode.clearSelectedFeatures).toHaveBeenCalled();
  });

  it('should disable double click zoom on setup', () => {
    CircleMode.onSetup({});
    expect(doubleClickZoom.disable).toHaveBeenCalled();
  });

  it('should set the cursor to "add" button', () => {
    CircleMode.onSetup({});
    expect(CircleMode.updateUIClasses).toHaveBeenCalledWith({
      mouse: Constants.cursors.ADD,
    });
  });

  it('should activate the polygon button on ui', () => {
    CircleMode.onSetup({});
    expect(CircleMode.activateUIButton).toHaveBeenCalledWith(
      Constants.types.POLYGON,
    );
  });

  it('should set actionable state by enabling trash', () => {
    CircleMode.onSetup({});
    expect(CircleMode.setActionableState).toHaveBeenCalledWith({
      trash: true,
      combineFeatures: false,
      uncombineFeatures: false,
    });
  });

  it('should generate a circle feature and change mode to simple select when clickAnywhere is invoked', () => {
    circle.mockReturnValue({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [],
      },
    });
    const mockState = {
      currentVertexPosition: 0,
      initialRadiusInKm: 1,
      polygon: {
        id: 'random_id',
        incomingCoords: vi.fn(),
        properties: {},
      },
    };
    const mockEvent = {
      lngLat: { lat: 0, lng: 0 },
    };

    CircleMode.clickAnywhere(mockState, mockEvent);
    expect(mockState.currentVertexPosition).toBe(1);
    expect(circle).toHaveBeenCalledWith([0, 0], 1);
    expect(CircleMode.changeMode).toHaveBeenCalledWith(
      Constants.modes.SIMPLE_SELECT,
      { featureIds: [mockState.polygon?.id] },
    );
  });

  it('should change mode to simple_select without adding a polygon to state if currentVertexPosition is not 0', () => {
    const mockState = {
      currentVertexPosition: 1,
      polygon: {
        id: 'random_id',
      },
    };
    const mockEvent = {
      lngLat: { lat: 0, lng: 0 },
    };

    CircleMode.clickAnywhere(mockState, mockEvent);
    expect(mockState.currentVertexPosition).toBe(1);
    expect(CircleMode.changeMode).toHaveBeenCalledWith(
      Constants.modes.SIMPLE_SELECT,
      { featureIds: [mockState.polygon?.id] },
    );
  });
});
