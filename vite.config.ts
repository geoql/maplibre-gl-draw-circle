import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${pkg.description}
 * (c) ${new Date().getFullYear()} ${pkg.author.name}<${pkg.author.email}>
 * Released under the ${pkg.license} License
 */
`;

export default defineConfig({
  build: {
    target: 'esnext',
    sourcemap: true,
    reportCompressedSize: true,
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'MaplibreGlDrawCircle',
      formats: ['es', 'cjs', 'umd'],
      fileName: 'maplibre-gl-draw-circle',
    },
    commonjsOptions: {
      extensions: ['.js', '.ts'],
      strictRequires: true,
      exclude: 'lib/**',
      include: 'node_modules/**',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['@mapbox/mapbox-gl-draw'],
      output: {
        banner,
        exports: 'named',
        strict: true,
        sourcemap: true,
        extend: true,
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          '@mapbox/mapbox-gl-draw': 'mapboxGlDraw',
        },
      },
    },
  },
  plugins: [
    dts({
      outputDir: ['dist'],
      insertTypesEntry: true,
    }),
  ],
});
