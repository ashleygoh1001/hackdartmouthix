/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import autoprefixer from 'autoprefixer';
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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    eslint(),
  ],
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
      ],
    },
  },
});
