import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { entries: ['index.html'] },
  server: { port: 3000, host: '0.0.0.0' },
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
