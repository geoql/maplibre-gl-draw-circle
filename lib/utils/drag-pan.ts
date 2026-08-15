import type { DrawCustomModeThis } from '@mapbox/mapbox-gl-draw';

/** Map context used at runtime by the draw plugin (may carry internals). */
type DrawContext = DrawCustomModeThis & {
  _ctx?: {
    store?: {
      getInitialConfigValue(key: string): boolean;
    };
  };
};

export default {
  enable(ctx: DrawContext) {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (
        !ctx.map ||
        !ctx.map.dragPan ||
        !ctx._ctx ||
        !ctx._ctx.store ||
        !ctx._ctx.store.getInitialConfigValue
      )
        return;
      // Now check initial state wasn't false (we leave it disabled if so)
      if (!ctx._ctx.store.getInitialConfigValue('dragPan')) return;
      ctx.map.dragPan.enable();
    }, 0);
  },
  disable(ctx: DrawContext) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.doubleClickZoom) return;
      // Always disable here, as it's necessary in some cases.
      ctx.map.dragPan.disable();
    }, 0);
  },
};
