import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // The demo site runs its own tests (`pnpm --filter site test`).
    include: ['tests/**/*.test.ts'],
  },
});
