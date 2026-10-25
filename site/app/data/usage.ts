export const USAGE_SNIPPET = `import { Map } from 'maplibre-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode,
} from '@geoql/maplibre-gl-draw-circle';

const map = new Map({ container: 'map', style });

const draw = new MapboxDraw({
  userProperties: true,
  modes: {
    ...MapboxDraw.modes,
    draw_circle: CircleMode,
    drag_circle: DragCircleMode,
    direct_select: DirectMode,
    simple_select: SimpleSelectMode,
  },
});
map.addControl(draw);

draw.changeMode('draw_circle', { initialRadiusInKm: 2 });
map.on('draw.create', ({ features }) => {
  const { center, radiusInKm } = features[0].properties;
});`;
