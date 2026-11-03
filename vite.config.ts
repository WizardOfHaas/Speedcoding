import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';

export default defineConfig({
  base: './',
  build: {
    sourcemap: true,
    outDir: 'dist',
  },
  plugins: [
    injectHTML()
  ],
  server: {
    watch: {
      usePolling: true
    }
  }
});