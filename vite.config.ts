
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Sets the base path for GitHub Pages deployment.
  // This MUST match your repository name (e.g., /Job-Cost-Calculator/).
  base: '/Job-Cost-Calculator/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
