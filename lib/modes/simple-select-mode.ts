import MapboxDraw from '@mapbox/mapbox-gl-draw';
import createSupplementaryPoints from '@mapbox/mapbox-gl-draw/src/lib/create_supplementary_points';
import moveFeatures from '@mapbox/mapbox-gl-draw/src/lib/move_features';
import Constants from '@mapbox/mapbox-gl-draw/src/constants';
import { createSupplementaryPointsForCircle } from '../utils/create-supplementary-points-for-circle';

const SimpleSelectMode = MapboxDraw.modes.simple_select;

SimpleSelectMode.dragMove = (state, e) => {
  // Dragging when drag move is enabled
  state.dragMoving = true;
  e.originalEvent.stopPropagation();

  const delta = {
    lng: e.lngLat.lng - state.dragMoveLocation.lng,
    lat: e.lngLat.lat - state.dragMoveLocation.lat,
  };

  moveFeatures(this.getSelected(), delta);

  this.getSelected()
    .filter((feature) => feature.properties.isCircle)
    .map((circle) => circle.properties.center)
    .forEach((center) => {
      center[0] += delta.lng;
      center[1] += delta.lat;
    });

  state.dragMoveLocation = e.lngLat;
};

SimpleSelectMode.toDisplayFeatures = function (state, geojson, display) {
  geojson.properties.active = this.isSelected(geojson.properties.id)
    ? Constants.activeStates.ACTIVE
    : Constants.activeStates.INACTIVE;
  display(geojson);
  this.fireActionable();
  if (
    geojson.properties.active !== Constants.activeStates.ACTIVE ||
    geojson.geometry.type === Constants.geojsonTypes.POINT
  )
    return;
  const supplementaryPoints = geojson.properties.user_isCircle
    ? createSupplementaryPointsForCircle(geojson)
    : createSupplementaryPoints(geojson);
  supplementaryPoints.forEach(display);
};

export default SimpleSelectMode;
export { SimpleSelectMode };
