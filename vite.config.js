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
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test/setup.js'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    workspace: {
      root: {
        environment: 'happy-dom',
        environmentOptions: {
          'happy-dom': {
            globals: {
              customElements: true,
              HTMLElement: true,
              CustomEvent: true
            }
          }
        }
      }
    },
    coverage: {
      provider: 'v8',
      exclude: [
        'public/**',
        'commitlint.config.js',
        'test/**',
        '**/*.test.js',
        '**/*.spec.js',
        'vite.config.js'
      ]
    }
  }
}); 