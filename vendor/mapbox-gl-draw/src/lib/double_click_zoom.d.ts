/**
 * Type companion for the vendored double_click_zoom.js. The members are
 * function-typed properties: they never read `this`, so callers (and test
 * spies) may pass them around unbound.
 */
declare const doubleClickZoom: {
  enable: (ctx: unknown) => void;
  disable: (ctx: unknown) => void;
};
export default doubleClickZoom;
