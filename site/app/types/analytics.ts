import type { DrawModeId } from '../data/modes';

/** Closed event map: event name → its properties. */
export interface AnalyticsEventMap {
  install_copied: {
    manager: 'pnpm' | 'npm';
  };
  outbound_click: {
    /** Absolute URL of the link target. */
    target: string;
    placement: 'header' | 'hero' | 'footer';
  };
  draw_mode_changed: {
    mode: DrawModeId;
  };
  circle_drawn: {
    mode: DrawModeId;
    /** Radius rounded to two decimals. */
    radius_km: number;
  };
  circle_resized: {
    radius_km: number;
  };
  circles_cleared: {
    count: number;
  };
  theme_changed: {
    preference: 'light' | 'dark' | 'system';
  };
}

export type AnalyticsEvent = keyof AnalyticsEventMap;

// Shape of the Plausible `pa-*.js` global: callable, plus the loader's
// bookkeeping — q (pre-load queue), o (init options the loader boots from), init.
export interface PlausibleFn {
  (...args: unknown[]): void;
  q?: unknown[];
  o?: Record<string, unknown>;
  init?: (options?: Record<string, unknown>) => void;
}

export interface GtagHandle {
  gtag: (...args: unknown[]) => void;
}

export interface PlausibleHandle {
  plausible: (...args: unknown[]) => void;
}

export interface OpenPanelHandle {
  track: (name: string, properties?: Record<string, unknown>) => void;
}

export interface AnalyticsHandles {
  ga?: GtagHandle;
  plausible?: PlausibleHandle;
  openpanel?: OpenPanelHandle;
}
