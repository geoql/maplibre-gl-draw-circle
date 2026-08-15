import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from 'vitest';
import DragCircleModeDefault from '../../lib/modes/drag-circle-mode';
import * as Constants from '../../vendor/mapbox-gl-draw/src/constants.js';
import doubleClickZoom from '../../vendor/mapbox-gl-draw/src/lib/double_click_zoom.js';
import dragPanDefault from '../../lib/utils/drag-pan';
import circleImport from '@turf/circle';
import distanceImport from '@turf/distance';

vi.mock('@turf/circle', () => ({
  default: vi.fn(),
}));

vi.mock('@turf/distance', () => ({
  default: vi.fn(),
}));

vi.mock('../../vendor/mapbox-gl-draw/src/lib/double_click_zoom.js', () => ({
  default: {
    enable: vi.fn(),
    disable: vi.fn(),
  },
}));

vi.mock('../../lib/utils/drag-pan', () => ({
  default: {
    enable: vi.fn(),
    disable: vi.fn(),
  },
}));

const circle = vi.mocked(circleImport);
const distance = vi.mocked(distanceImport);
const dragPan = vi.mocked(dragPanDefault);

interface DragCircleModeTest {
  onSetup(options?: Record<string, unknown>): Record<string, unknown>;
  onMouseDown(
    state: {
      polygon: {
        id?: string;
        properties: {
          center?: number[];
          radiusInKm?: number;
        };
        incomingCoords?: Mock;
      };
    },
    e: { lngLat: { lat: number; lng: number } },
  ): void;
  onTouchStart(
    state: {
      polygon: {
        id?: string;
        properties: {
          center?: number[];
          radiusInKm?: number;
        };
        incomingCoords?: Mock;
      };
    },
    e: { lngLat: { lat: number; lng: number } },
  ): void;
  onDrag(
    state: {
      polygon: {
        id?: string;
        properties: {
          center?: number[];
          radiusInKm?: number;
        };
        incomingCoords?: Mock;
      };
    },
    e: { lngLat: { lat: number; lng: number } },
  ): void;
  onMouseMove(
    state: {
      polygon: {
        id?: string;
        properties: {
          center?: number[];
          radiusInKm?: number;
        };
        incomingCoords?: Mock;
      };
    },
    e: { lngLat: { lat: number; lng: number } },
  ): void;
  onClick(
    state: { polygon: { properties: { center?: number[] } } },
    e: unknown,
  ): void;
  onTap(
    state: { polygon: { properties: { center?: number[] } } },
    e: unknown,
  ): void;
  onMouseUp(state: { polygon: { id?: string } }, e: unknown): void;
  onTouchEnd(state: { polygon: { id?: string } }, e: unknown): void;
  toDisplayFeatures(
    state: { polygon: { id?: string } },
    geojson: { properties: { id?: string; active?: string } },
    display: Mock,
  ): void;
  addFeature: Mock;
  newFeature: Mock;
  clearSelectedFeatures: Mock;
  updateUIClasses: Mock;
  activateUIButton: Mock;
  setActionableState: Mock;
  changeMode: Mock;
}

const DragCircleMode = DragCircleModeDefault as unknown as DragCircleModeTest;

const mockFeature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Polygon',
    coordinates: [],
  },
};

describe('DragCircleMode', function () {
  beforeEach(() => {
    Object.assign(DragCircleMode, {
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

  it('should setup state with a polygon', () => {
    DragCircleMode.newFeature.mockReturnValue(mockFeature);
    expect(DragCircleMode.onSetup({})).toEqual({
      polygon: mockFeature,
      currentVertexPosition: 0,
    });
    expect(DragCircleMode.addFeature).toHaveBeenCalledWith(mockFeature);
  });

  it('should clear selected features on setup', () => {
    DragCircleMode.onSetup({});
    expect(DragCircleMode.clearSelectedFeatures).toHaveBeenCalled();
  });

  it('should disable double click zoom on setup', () => {
    DragCircleMode.onSetup({});
    expect(doubleClickZoom.disable).toHaveBeenCalled();
  });

  it('should disable dragPan on setup', function () {
    DragCircleMode.onSetup({});
    expect(dragPan.disable).toHaveBeenCalled();
  });

  it('should update the center when onMouseDown is fired', function () {
    const state = {
      polygon: {
        properties: {
          center: [],
        },
      },
    };

    const e = {
      lngLat: {
        lat: 1,
        lng: 2,
      },
    };
    DragCircleMode.onMouseDown(state, e);
    expect(state).toEqual({
      polygon: {
        properties: {
          center: [2, 1],
        },
      },
    });
  });

  it('should update the center when onTouchStart is fired', function () {
    const state = {
      polygon: {
        properties: {
          center: [],
        },
      },
    };

    const e = {
      lngLat: {
        lat: 1,
        lng: 2,
      },
    };
    DragCircleMode.onTouchStart(state, e);
    expect(state).toEqual({
      polygon: {
        properties: {
          center: [2, 1],
        },
      },
    });
  });

  it('should discard the circle if its a click event', function () {
    const state = {
      polygon: {
        properties: {
          center: [2, 1],
        },
      },
    };
    DragCircleMode.onClick(state, {});
    expect(state).toEqual({
      polygon: {
        properties: {
          center: [],
        },
      },
    });
  });

  it('should discard the circle if its a tap event', function () {
    const state = {
      polygon: {
        properties: {
          center: [2, 1],
        },
      },
    };
    DragCircleMode.onTap(state, {});
    expect(state).toEqual({
      polygon: {
        properties: {
          center: [],
        },
      },
    });
  });

  it('should finish drawing if onMouseUp is fired', function () {
    const state = {
      polygon: {
        id: 'test-id',
      },
    };
    DragCircleMode.onMouseUp(state, {});
    expect(dragPan.enable).toHaveBeenCalled();
    expect(DragCircleMode.changeMode).toHaveBeenCalledWith(
      Constants.modes.SIMPLE_SELECT,
      { featureIds: ['test-id'] },
    );
  });

  it('should finish drawing if onTouchEnd is fired', function () {
    const state = {
      polygon: {
        id: 'test-id',
      },
    };
    DragCircleMode.onTouchEnd(state, {});
    expect(dragPan.enable).toHaveBeenCalled();
    expect(DragCircleMode.changeMode).toHaveBeenCalledWith(
      Constants.modes.SIMPLE_SELECT,
      { featureIds: ['test-id'] },
    );
  });

  it('should should set active state and display features', function () {
    const state = {
      polygon: {
        id: 'test-id',
      },
    };

    const geojson = {
      properties: {
        id: 'test-id',
        active: undefined as string | undefined,
      },
    };

    const display = vi.fn();

    DragCircleMode.toDisplayFeatures(state, geojson, display);
    expect(geojson.properties.active).toEqual(Constants.activeStates.ACTIVE);
    expect(display).toHaveBeenCalledWith(geojson);
  });

  it('should adjust the geometry when onDrag is fired', function () {
    distance.mockReturnValue(2);
    circle.mockReturnValue({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [12, 2],
      },
    } as unknown as Parameters<typeof circle.mockReturnValue>[0]);
    const state = {
      polygon: {
        properties: {
          center: [1, 2],
          radiusInKm: 1,
        },
        incomingCoords: vi.fn(),
      },
    };
    DragCircleMode.onDrag(state, { lngLat: { lat: 1, lng: 2 } });
    expect(state.polygon.incomingCoords).toHaveBeenCalledWith([12, 2]);
    expect(state.polygon.properties.radiusInKm).toEqual(2);
  });

  it('should adjust the geometry when onMouseMove is fired', function () {
    distance.mockReturnValue(2);
    circle.mockReturnValue({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [12, 2],
      },
    } as unknown as Parameters<typeof circle.mockReturnValue>[0]);
    const state = {
      polygon: {
        properties: {
          center: [1, 2],
          radiusInKm: 1,
        },
        incomingCoords: vi.fn(),
      },
    };
    DragCircleMode.onMouseMove(state, { lngLat: { lat: 1, lng: 2 } });
    expect(state.polygon.incomingCoords).toHaveBeenCalledWith([12, 2]);
    expect(state.polygon.properties.radiusInKm).toEqual(2);
  });
});
