/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import autoprefixer from 'autoprefixer';
<<<<<<< HEAD
import react from '@vitejs/plugin-react';
// import vitePluginFaviconsInject from 'vite-plugin-favicons-inject';

export default defineConfig({
  plugins: [
    eslint(),
    react(),
    // vitePluginFaviconsInject('src/imgs/bird-favicon.png'),
  ],
  server: {
    proxy: {
      '/generate-content': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        secure: false,
      },
    },
  },
=======

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint(),
  ],
>>>>>>> 94a133286ffd93c13fd4f2a4ced18e6915901787
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
});
