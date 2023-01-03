import { modes } from '@mapbox/mapbox-gl-draw';
import { geojsonTypes, cursors, types, modes as _modes } from '@mapbox/mapbox-gl-draw/src/constants';
import { disable } from '@mapbox/mapbox-gl-draw/src/lib/double_click_zoom';
import circle from '@turf/circle';

const CircleMode = {...modes.draw_polygon};
const DEFAULT_RADIUS_IN_KM = 2;

CircleMode.onSetup = function(opts) {
  const polygon = this.newFeature({
    type: geojsonTypes.FEATURE,
    properties: {
      isCircle: true,
      center: []
    },
    geometry: {
      type: geojsonTypes.POLYGON,
      coordinates: [[]]
    }
  });

  this.addFeature(polygon);

  this.clearSelectedFeatures();
  disable(this);
  this.updateUIClasses({ mouse: cursors.ADD });
  this.activateUIButton(types.POLYGON);
  this.setActionableState({
    trash: true
  });

  return {
    initialRadiusInKm: opts.initialRadiusInKm || DEFAULT_RADIUS_IN_KM,
    polygon,
    currentVertexPosition: 0
  };
};

CircleMode.clickAnywhere = function(state, e) {
  if (state.currentVertexPosition === 0) {
    state.currentVertexPosition++;
    const center = [e.lngLat.lng, e.lngLat.lat];
    const circleFeature = circle(center, state.initialRadiusInKm);
    state.polygon.incomingCoords(circleFeature.geometry.coordinates);
    state.polygon.properties.center = center;
    state.polygon.properties.radiusInKm = state.initialRadiusInKm;
  }
  return this.changeMode(_modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
};

export default CircleMode;