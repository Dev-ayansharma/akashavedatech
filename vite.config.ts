import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    // three.js (~600 kB with the meshopt decoder) is only pulled in by the dynamically imported scene modules.
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: { manualChunks: (id) => (id.includes('node_modules/three/') ? 'three' : undefined) },
    },
  },
});
