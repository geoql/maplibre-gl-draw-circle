import { defineConfig } from 'vite-plus';

// vite-plus drives the unit tests only (`vp test`). Nuxt owns the app build
// and does not read this file. Lint and format run the oxlint and oxfmt
// binaries directly with their own config files.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
