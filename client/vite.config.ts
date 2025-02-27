import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),

    }
  },
  build: {
    rollupOptions: {
      input: 'public/index.html'  // 确保 index.html 作为入口
    }
  }
});
