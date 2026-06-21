import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['projects/**/*.spec.ts'],
    setupFiles: ['projects/angular-ds/src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['projects/angular-ds/src/lib/**/*.ts'],
      exclude: ['**/*.types.ts', '**/*.stories.ts', '**/public-api.ts'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
      reporter: ['text', 'lcov', 'html'],
    },
  },
});
