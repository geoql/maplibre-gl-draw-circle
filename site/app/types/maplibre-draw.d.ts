/**
 * mapbox-gl-draw on MapLibre GL 6.
 *
 * mapbox-gl-draw's types name mapbox-gl's `Map`, and MapLibre 6 types
 * `Map#on` with its own event map only. At runtime mapbox-gl-draw uses only
 * the part of the map API MapLibre implements, and it announces changes
 * with `map.fire('draw.*', data)`. These overloads say exactly that, so the
 * demo needs no casts.
 */
import type MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { Feature } from 'geojson';
import type { ControlPosition, Subscription } from 'maplibre-gl';

interface DrawFeaturesEvent {
  type: string;
  features: Feature[];
}

interface DrawUpdateEvent extends DrawFeaturesEvent {
  action: 'move' | 'change_coordinates' | 'change_properties';
}

interface DrawModeChangeEvent {
  type: 'draw.modechange';
  mode: string;
}

declare module 'maplibre-gl' {
  interface Map {
    addControl(control: MapboxDraw, position?: ControlPosition): this;
    on(
      type: 'draw.create' | 'draw.delete',
      listener: (event: DrawFeaturesEvent) => void,
    ): Subscription;
    on(
      type: 'draw.update',
      listener: (event: DrawUpdateEvent) => void,
    ): Subscription;
    on(
      type: 'draw.modechange',
      listener: (event: DrawModeChangeEvent) => void,
    ): Subscription;
    on(type: 'draw.render', listener: () => void): Subscription;
  }
}
