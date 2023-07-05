import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import tsConfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [react(), tsConfigPaths(), eslint()],
  server: {
    host: true,
    port: 3000,
  },
});
