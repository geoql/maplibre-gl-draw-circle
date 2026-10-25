/** Draw modes the demo toolbar exposes, keyed by their mapbox-gl-draw mode id. */
export type DrawModeId = 'draw_circle' | 'drag_circle' | 'simple_select';

export interface DrawModeOption {
  id: DrawModeId;
  label: string;
  hint: string;
}

export const DRAW_MODES: readonly DrawModeOption[] = [
  {
    id: 'draw_circle',
    label: 'Click',
    hint: 'Click the map to drop a circle at the set radius.',
  },
  {
    id: 'drag_circle',
    label: 'Drag',
    hint: 'Press, drag outwards, release. The drag length is the radius.',
  },
  {
    id: 'simple_select',
    label: 'Edit',
    hint: 'Select a circle, then drag it to move or drag a handle to resize.',
  },
] as const;

export const RADIUS_PRESETS_KM = [0.5, 1, 2, 5] as const;

/** Round a radius for display and analytics. */
export function roundKm(radiusKm: number): number {
  return Math.round(radiusKm * 100) / 100;
}
