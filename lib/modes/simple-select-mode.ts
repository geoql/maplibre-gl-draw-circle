import MapboxDraw from '@mapbox/mapbox-gl-draw';
import createSupplementaryPoints from '../../vendor/mapbox-gl-draw/src/lib/create_supplementary_points.js';
import moveFeatures from '../../vendor/mapbox-gl-draw/src/lib/move_features.js';
import * as Constants from '../../vendor/mapbox-gl-draw/src/constants.js';
import { createSupplementaryPointsForCircle } from '../utils/create-supplementary-points-for-circle';
import type { CircleDrawFeature, SimpleSelectModeState } from '../types';
import type { Feature } from 'geojson';

const SimpleSelectMode = MapboxDraw.modes.simple_select;

SimpleSelectMode.dragMove = function (state: SimpleSelectModeState, e) {
  // Dragging when drag move is enabled
  state.dragMoving = true;
  e.originalEvent.stopPropagation();

  const delta = {
    lng: e.lngLat.lng - state.dragMoveLocation.lng,
    lat: e.lngLat.lat - state.dragMoveLocation.lat,
  };

  moveFeatures(this.getSelected(), delta);

  const selected = this.getSelected() as CircleDrawFeature[];
  selected
    .filter((feature) => feature.properties.isCircle)
    .map((circle) => circle.properties.center)
    .forEach((center) => {
      if (center) {
        center[0] += delta.lng;
        center[1] += delta.lat;
      }
    });

  state.dragMoveLocation = e.lngLat;
};

SimpleSelectMode.toDisplayFeatures = function (
  state: SimpleSelectModeState,
  geojson,
  display,
) {
  const feature = geojson as Feature & { properties: Record<string, unknown> };
  feature.properties.active = this.isSelected(feature.properties.id)
    ? Constants.activeStates.ACTIVE
    : Constants.activeStates.INACTIVE;
  display(feature as Feature);
  this.fireActionable?.();
  if (
    feature.properties.active !== Constants.activeStates.ACTIVE ||
    feature.geometry.type === Constants.geojsonTypes.POINT
  )
    return;
  const supplementaryPoints = feature.properties.user_isCircle
    ? createSupplementaryPointsForCircle(
        feature as Parameters<typeof createSupplementaryPointsForCircle>[0],
      )
    : createSupplementaryPoints(feature as Feature);
  supplementaryPoints?.forEach(display);
};

export default SimpleSelectMode;
export { SimpleSelectMode };
