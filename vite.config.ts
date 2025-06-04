/// <reference types="vitest/config" />
import { join, resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { peerDependencies } from './package.json';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    dts({ rollupTypes: true }), // Output .d.ts files
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib'),
    },
  },
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: [
        resolve(__dirname, join('lib', 'core', 'core.ts')),
        resolve(__dirname, join('lib', 'components', 'components.ts')),
      ],
      cssFileName: 'style',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Exclude peer dependencies from the bundle to reduce bundle size
      external: ['react/jsx-runtime', ...Object.keys(peerDependencies)],
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './lib/test/setup.ts',
    coverage: {
      all: false,
      enabled: true,
    },
    alias: {
      '@': resolve(__dirname, 'lib'),
    },
  },
});
