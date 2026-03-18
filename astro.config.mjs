import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  site: 'https://devsuzarte.com',
  integrations: [
    tailwind(),
    icon({
      include: { 'simple-icons': ['*'] },
    }),
    sitemap(),
  ],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    ssr: {
      noExternal: ['three', 'gsap', '@barba/core'],
    },
    optimizeDeps: {
      exclude: ['astro-icon'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Silencia o aviso do legacy SASS JS API
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
