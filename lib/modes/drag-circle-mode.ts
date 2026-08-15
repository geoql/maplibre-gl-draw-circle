import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as Constants from '../../vendor/mapbox-gl-draw/src/constants.js';
import doubleClickZoom from '../../vendor/mapbox-gl-draw/src/lib/double_click_zoom.js';
import dragPan from '../utils/drag-pan';
import circle from '@turf/circle';
import distance from '@turf/distance';
import * as turfHelpers from '@turf/helpers';
import type { MapMouseEvent, MapTouchEvent } from '@mapbox/mapbox-gl-draw';
import type { DragCircleModeState } from '../types';
import type { Feature } from 'geojson';

const DragCircleMode = { ...MapboxDraw.modes.draw_polygon };

DragCircleMode.onSetup = function () {
  const polygon = this.newFeature({
    type: Constants.geojsonTypes.FEATURE,
    properties: {
      isCircle: true,
      center: [],
    },
    geometry: {
      type: Constants.geojsonTypes.POLYGON,
      coordinates: [[]],
    },
  });

  this.addFeature(polygon);

  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);
  dragPan.disable(this);
  this.updateUIClasses({ mouse: Constants.cursors.ADD });
  this.activateUIButton(Constants.types.POLYGON);
  this.setActionableState({
    trash: true,
    combineFeatures: false,
    uncombineFeatures: false,
  });

  return {
    polygon,
    currentVertexPosition: 0,
  };
};

DragCircleMode.onMouseDown = DragCircleMode.onTouchStart = function (
  state: DragCircleModeState,
  e: MapMouseEvent | MapTouchEvent,
) {
  const currentCenter = state.polygon.properties.center;
  if (currentCenter && currentCenter.length === 0) {
    state.polygon.properties.center = [e.lngLat.lng, e.lngLat.lat];
  }
};

DragCircleMode.onDrag = DragCircleMode.onMouseMove = function (
  state: DragCircleModeState,
  e,
) {
  const center = state.polygon.properties.center;
  if (center && center.length > 0) {
    const distanceInKm = distance(
      turfHelpers.point(center),
      turfHelpers.point([e.lngLat.lng, e.lngLat.lat]),
      { units: 'kilometers' },
    );
    const circleFeature = circle(center, distanceInKm);
    state.polygon.incomingCoords(circleFeature.geometry.coordinates);
    state.polygon.properties.radiusInKm = distanceInKm;
  }
};

DragCircleMode.onMouseUp = DragCircleMode.onTouchEnd = function (
  state: DragCircleModeState,
  _e: MapMouseEvent | MapTouchEvent,
) {
  dragPan.enable(this);
  return this.changeMode(Constants.modes.SIMPLE_SELECT, {
    featureIds: [state.polygon.id],
  });
};

DragCircleMode.onClick = DragCircleMode.onTap = function (
  state: DragCircleModeState,
  _e: MapMouseEvent | MapTouchEvent,
) {
  // don't draw the circle if its a tap or click event
  state.polygon.properties.center = [];
};

DragCircleMode.toDisplayFeatures = function (
  state: DragCircleModeState,
  geojson,
  display,
) {
  const feature = geojson as Feature & { properties: Record<string, unknown> };
  const isActivePolygon = feature.properties.id === state.polygon.id;
  feature.properties.active = isActivePolygon
    ? Constants.activeStates.ACTIVE
    : Constants.activeStates.INACTIVE;
  return display(feature as Feature);
};

export default DragCircleMode;
export { DragCircleMode };
