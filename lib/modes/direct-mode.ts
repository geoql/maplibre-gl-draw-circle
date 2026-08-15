import MapboxDraw from '@mapbox/mapbox-gl-draw';
import createSupplementaryPoints from '../../vendor/mapbox-gl-draw/src/lib/create_supplementary_points.js';
import moveFeatures from '../../vendor/mapbox-gl-draw/src/lib/move_features.js';
import * as Constants from '../../vendor/mapbox-gl-draw/src/constants.js';
import constrainFeatureMovement from '../../vendor/mapbox-gl-draw/src/lib/constrain_feature_movement.js';
import distance from '@turf/distance';
import * as turfHelpers from '@turf/helpers';
import circle from '@turf/circle';
import { createSupplementaryPointsForCircle } from '../utils/create-supplementary-points-for-circle';
import type { CircleDrawFeature, DirectModeState } from '../types';
import type { Feature } from 'geojson';

const DirectMode = MapboxDraw.modes.direct_select;

DirectMode.dragFeature = function (state: DirectModeState, e, delta) {
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

DirectMode.dragVertex = function (state: DirectModeState, e, delta) {
  if (state.feature.properties.isCircle) {
    const center = state.feature.properties.center ?? [];
    const movedVertex = [e.lngLat.lng, e.lngLat.lat];
    const radius = distance(
      turfHelpers.point(center),
      turfHelpers.point(movedVertex),
      { units: 'kilometers' },
    );
    const circleFeature = circle(center, radius);
    state.feature.incomingCoords(circleFeature.geometry.coordinates);
    state.feature.properties.radiusInKm = radius;
  } else {
    const selectedCoords = state.selectedCoordPaths.map((coord_path) =>
      state.feature.getCoordinate(coord_path),
    );
    const selectedCoordPoints = selectedCoords.map((coords) => ({
      type: Constants.geojsonTypes.FEATURE,
      properties: {},
      geometry: {
        type: Constants.geojsonTypes.POINT,
        coordinates: coords,
      },
    }));

    const constrainedDelta = constrainFeatureMovement(
      selectedCoordPoints,
      delta,
    );
    for (let i = 0; i < selectedCoords.length; i++) {
      const coord = selectedCoords[i];
      state.feature.updateCoordinate(
        state.selectedCoordPaths[i],
        coord[0] + constrainedDelta.lng,
        coord[1] + constrainedDelta.lat,
      );
    }
  }
};

DirectMode.toDisplayFeatures = function (
  state: DirectModeState,
  geojson,
  push,
) {
  const feature = geojson as Feature & { properties: Record<string, unknown> };
  if (state.featureId === feature.properties.id) {
    feature.properties.active = Constants.activeStates.ACTIVE;
    push(feature as Feature);
    const supplementaryPoints = feature.properties.user_isCircle
      ? createSupplementaryPointsForCircle(
          feature as Parameters<typeof createSupplementaryPointsForCircle>[0],
        )
      : createSupplementaryPoints(feature as Feature, {
          map: this.map,
          midpoints: true,
          selectedPaths: state.selectedCoordPaths,
        });
    supplementaryPoints?.forEach((p) => push(p));
  } else {
    feature.properties.active = Constants.activeStates.INACTIVE;
    push(feature as Feature);
  }
  this.fireActionable?.(state);
};

export default DirectMode;
export { DirectMode };
