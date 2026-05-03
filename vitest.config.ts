import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts', '**/*.test.tsx'],
    exclude: ['node_modules', '.next', 'dist'],
    globals: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['lib/**', 'components/**', 'app/api/**'],
      exclude: ['**/*.test.*', '**/*.d.ts'],
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, '.') },
  },
});
