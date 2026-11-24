import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // During development the API runs separately on port 3000.
    proxy: { '/api': 'http://localhost:3000' },
  },
});
