import { describe, expect, it } from 'vitest';
import { DRAW_STYLES } from '../../app/utils/draw-theme';

describe('DRAW_STYLES', () => {
  it('uses no legacy filter syntax (MapLibre 6 rejects it)', () => {
    const json = JSON.stringify(DRAW_STYLES);
    expect(json).not.toContain('"$type"');
    expect(json).not.toMatch(/\["==","(active|meta)"/);
  });

  it('gives every layer a unique id for the .cold/.hot pairs', () => {
    const ids = DRAW_STYLES.map((layer) => layer.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
