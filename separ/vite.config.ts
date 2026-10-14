import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { mockApi } from './mock-api';

export default defineConfig({
  plugins: [react(), mockApi()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
});
