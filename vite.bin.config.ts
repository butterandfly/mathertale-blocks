/// <reference types="vitest/config" />
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node18',
    minify: false,
    lib: {
      entry: resolve(__dirname, 'bin/cli.ts'),
      formats: ['es'],
      fileName: () => 'cli.js',
    },
    outDir: 'dist/bin',
    rollupOptions: {
      external: [
        // Node.js built-in modules
        'fs',
        'path',
        'url',
        'util',
        'events',
        'stream',
        'buffer',
        'crypto',
        'os',
        'child_process',
        // External dependencies that should not be bundled
        'chalk',
        'commander',
        'ora',
        'fs-extra',
        'marked',
      ],
      output: {
        // Don't add banner since the source file already has shebang
        preserveModules: false,
        format: 'es',
      },
    },
    emptyOutDir: false, // Don't empty the entire dist directory
  },
  resolve: {
    alias: {
      // Ensure that internal imports resolve correctly
      '../lib/core/core': resolve(__dirname, 'lib/core/core.ts'),
      '../lib/core/convert-quest-markdown': resolve(__dirname, 'lib/core/convert-quest-markdown.ts'),
      '../lib/core/extract-content': resolve(__dirname, 'lib/core/extract-content.ts'),
      '../lib/core/schemas': resolve(__dirname, 'lib/core/schemas.ts'),
    },
  },
}); 