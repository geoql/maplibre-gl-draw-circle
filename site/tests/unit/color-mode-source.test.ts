import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guard: @nuxtjs/color-mode (auto-imported, cookie-backed `useColorMode()`)
 * is the ONLY color-mode source. VueUse's `useDark()` / `useColorMode()` keep
 * a second state in localStorage whose media query resolves `false` during
 * hydration, flipping <html> dark → light → dark after load (the maps.guru
 * theme flash, Jul 2026).
 */
const APP_DIR = join(import.meta.dirname, '..', '..', 'app');
const SOURCE_EXTENSIONS = new Set(['.vue', '.ts']);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (SOURCE_EXTENSIONS.has(full.slice(full.lastIndexOf('.')))) {
      out.push(full);
    }
  }
  return out;
}

describe('color-mode single source of truth', () => {
  const files = walk(APP_DIR);

  it('scans the app sources', () => {
    expect(files.length).toBeGreaterThan(5);
  });

  it('bans VueUse useDark() everywhere in app/', () => {
    const offenders = files.filter((f) =>
      /\buseDark\s*\(/.test(readFileSync(f, 'utf8')),
    );
    expect(
      offenders,
      `useDark() creates a second color-mode state. Use useColorMode() from @nuxtjs/color-mode: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('bans importing useColorMode/useDark from @vueuse/core in app/', () => {
    const offenders = files.filter((f) =>
      /import\s*\{[^}]*\b(?:useColorMode|useDark)\b[^}]*\}\s*from\s*['"]@vueuse\/core['"]/.test(
        readFileSync(f, 'utf8'),
      ),
    );
    expect(
      offenders,
      `@vueuse/core color-mode imports shadow the @nuxtjs/color-mode auto-import: ${offenders.join(', ')}`,
    ).toEqual([]);
  });
});
