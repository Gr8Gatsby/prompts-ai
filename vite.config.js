import { defineConfig } from 'vite';
import { resolve } from 'path';

// Get the repository name from package.json
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'prompts-ai';

export default defineConfig({
  root: './',
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    target: 'esnext',
    minify: 'terser',
  },
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
}); 