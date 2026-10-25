import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * @mapbox/mapbox-gl-draw's ESM entry has only a default export. A named
 * value import such as `import { modes } from '@mapbox/mapbox-gl-draw'`
 * passes these unit tests (Node's CJS interop fills it in) but fails every
 * strict ESM bundler (Rolldown: MISSING_EXPORT). Type-only imports are fine.
 */
const LIB = join(import.meta.dirname, '..', 'lib');

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sources(full);
    return entry.name.endsWith('.ts') ? [full] : [];
  });
}

describe('imports from @mapbox/mapbox-gl-draw', () => {
  it('use only the default export for values', () => {
    const offenders = sources(LIB).filter((file) =>
      /^import\s+(?!type\b)[^;]*\{[^}]*\}\s*from\s*'@mapbox\/mapbox-gl-draw'/m.test(
        readFileSync(file, 'utf8'),
      ),
    );
    expect(offenders).toEqual([]);
  });
});
