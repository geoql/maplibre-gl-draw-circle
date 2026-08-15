/**
 * Module-context augmentation for mapbox-gl-draw's DrawCustomMode.
 * @types/mapbox__mapbox-gl-draw uses `export = MapboxDraw` — the namespace's
 * interfaces ARE the module-level exports, so augmentation merges at module
 * level (NOT wrapped in `namespace MapboxDraw`). This adds the custom-mode
 * hooks this library implements on top of the stock DrawCustomMode.
 */
import type { MapMouseEvent, MapTouchEvent } from '@mapbox/mapbox-gl-draw';

declare module '@mapbox/mapbox-gl-draw' {
  interface DrawCustomMode<CustomModeState = any, CustomModeOptions = any> {
    clickAnywhere?(
      this: import('@mapbox/mapbox-gl-draw').DrawCustomModeThis & this,
      state: CustomModeState,
      e: MapMouseEvent,
    ): void;
    dragFeature?(
      this: import('@mapbox/mapbox-gl-draw').DrawCustomModeThis & this,
      state: CustomModeState,
      e: MapMouseEvent,
      delta: { lng: number; lat: number },
    ): void;
    dragVertex?(
      this: import('@mapbox/mapbox-gl-draw').DrawCustomModeThis & this,
      state: CustomModeState,
      e: MapMouseEvent,
      delta: { lng: number; lat: number },
    ): void;
    dragMove?(
      this: import('@mapbox/mapbox-gl-draw').DrawCustomModeThis & this,
      state: CustomModeState,
      e: MapMouseEvent,
    ): void;
    fireActionable?(
      this: import('@mapbox/mapbox-gl-draw').DrawCustomModeThis & this,
      state?: CustomModeState,
    ): void;
  }
}
