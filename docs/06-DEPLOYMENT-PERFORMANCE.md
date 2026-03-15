# Deployment & Performance - Portfolio Juan Benjamin

**Objetivo:** Deploy otimizado com performance máxima

---

## 🚀 1. Deployment Platforms

### Vercel (Recomendado)

**Por quê?**
- Otimizado para Astro e Next.js
- Edge Functions
- Analytics integrado
- Preview deployments automáticos

#### Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "framework": "astro",
  "regions": ["iad1"],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

### Netlify (Alternativa)

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[plugins]]
  package = "@netlify/plugin-lighthouse"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## ⚡ 2. Performance Optimization

### Astro Config Optimization

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://juanbenjamin.dev',
  
  integrations: [
    tailwind(),
    sitemap(),
    compress({
      css: true,
      html: {
        removeAttributeQuotes: false,
      },
      img: false,
      js: true,
      svg: true,
    }),
  ],
  
  build: {
    inlineStylesheets: 'auto',
    format: 'file',
  },
  
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'three': ['three'],
            'gsap': ['gsap'],
            'barba': ['@barba/core'],
          },
        },
      },
    },
    ssr: {
      noExternal: ['three', 'gsap', '@barba/core'],
    },
  },
  
  experimental: {
    optimizeHoistedScript: true,
  },
});
```

---

### Image Optimization

#### Using Astro Assets

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/assets/images/hero.jpg';
---

<Image
  src={heroImage}
  alt="Juan Benjamin"
  width={800}
  height={600}
  format="avif"
  quality={85}
  loading="lazy"
  decoding="async"
/>
```

#### Sharp Config

```javascript
// package.json scripts
{
  "scripts": {
    "optimize:images": "node scripts/optimize-images.js"
  }
}
```

```javascript
// scripts/optimize-images.js
import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const inputDir = './public/images';
const outputDir = './public/optimized';

const optimizeImage = async (filePath, outputPath) => {
  const image = sharp(filePath);
  const metadata = await image.metadata();
  
  // Generate multiple formats
  await Promise.all([
    // WebP
    image
      .webp({ quality: 85 })
      .toFile(outputPath.replace(/\.\w+$/, '.webp')),
    
    // AVIF
    image
      .avif({ quality: 80 })
      .toFile(outputPath.replace(/\.\w+$/, '.avif')),
    
    // Optimized JPEG
    image
      .jpeg({ quality: 85, progressive: true })
      .toFile(outputPath),
  ]);
};

// Recursively process directory
const processDirectory = (dir) => {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (/\.(jpg|jpeg|png)$/i.test(file)) {
      optimizeImage(filePath, join(outputDir, file));
    }
  });
};

processDirectory(inputDir);
```

---

### Font Optimization

```astro
---
// src/layouts/BaseLayout.astro
---

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- Preconnect para Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Fonts com display=swap -->
  <link 
    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap" 
    rel="stylesheet"
  >
  
  <!-- Preload critical fonts -->
  <link
    rel="preload"
    href="/fonts/bebas-neue.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  >
</head>
</html>
```

---

### Critical CSS Inlining

```javascript
// scripts/extract-critical-css.js
import { PurgeCSS } from 'purgecss';
import { readFileSync, writeFileSync } from 'fs';

const purgecss = new PurgeCSS({
  content: ['dist/**/*.html'],
  css: ['dist/**/*.css'],
  safelist: [
    /^data-/,
    /^is-/,
    /^has-/,
  ],
});

const result = await purgecss.purge();

result.forEach(({ file, css }) => {
  writeFileSync(file, css);
});
```

---

## 📊 3. Performance Monitoring

### Web Vitals Integration

```typescript
// src/scripts/analytics/web-vitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric: any) => {
  // Send to your analytics endpoint
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    rating: metric.rating,
  });
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics', body);
  } else {
    fetch('/api/analytics', {
      body,
      method: 'POST',
      keepalive: true,
    });
  }
};

// Measure all Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

---

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            http://localhost:4321
            http://localhost:4321/projects
            http://localhost:4321/blog
          uploadArtifacts: true
          temporaryPublicStorage: true
```

---

## 🔒 4. Security Headers

### Security Headers Middleware

```typescript
// middleware/security-headers.ts
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.github.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim(),
};
```

---

## 📈 5. Bundle Analysis

### Webpack Bundle Analyzer

```bash
npm install --save-dev webpack-bundle-analyzer
```

```javascript
// astro.config.mjs
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  vite: {
    plugins: [
      visualizer({
        open: true,
        filename: './dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ],
  },
});
```

Run:
```bash
npm run build
# Open dist/stats.html
```

---

## 🎯 6. Performance Checklist

### Pre-Deploy

- [ ] Lighthouse score > 95 em todas as páginas
- [ ] Images otimizadas (WebP/AVIF)
- [ ] Fonts otimizadas (preload, display=swap)
- [ ] CSS crítico inline
- [ ] JavaScript minificado e tree-shaken
- [ ] Service Worker configurado
- [ ] Meta tags SEO completas
- [ ] Open Graph images otimizadas
- [ ] Sitemap.xml gerado
- [ ] Robots.txt configurado

### Metrics Targets

```javascript
const targets = {
  // Core Web Vitals
  LCP: 2.5,      // Largest Contentful Paint (seconds)
  FID: 100,      // First Input Delay (milliseconds)
  CLS: 0.1,      // Cumulative Layout Shift
  
  // Other metrics
  FCP: 1.8,      // First Contentful Paint (seconds)
  TTI: 3.8,      // Time to Interactive (seconds)
  TBT: 200,      // Total Blocking Time (milliseconds)
  SI: 3.4,       // Speed Index (seconds)
  
  // Size budgets
  'bundle.js': '300KB',
  'style.css': '50KB',
  'total-page-weight': '2MB',
};
```

---

## 🚦 7. CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type Check
        run: npm run type-check
      
      - name: Build
        run: npm run build
  
  deploy-preview:
    needs: test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
  
  deploy-production:
    needs: test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Vercel CLI
        run: npm install --global vercel@latest
      
      - name: Pull Vercel Environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Build Project
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🔍 8. SEO Optimization

### Meta Tags Component

```astro
---
// src/components/SEO.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: Date;
  author?: string;
}

const {
  title,
  description,
  image = '/og-image.jpg',
  type = 'website',
  publishedTime,
  author = 'Juan Benjamin Almeida Suzarte',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const imageURL = new URL(image, Astro.site);
---

<!-- Primary Meta Tags -->
<title>{title} | Juan Benjamin Portfolio</title>
<meta name="title" content={title} />
<meta name="description" content={description} />
<meta name="author" content={author} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={imageURL} />
{publishedTime && (
  <meta property="article:published_time" content={publishedTime.toISOString()} />
)}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={canonicalURL} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={imageURL} />

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

<!-- Sitemap -->
<link rel="sitemap" href="/sitemap-index.xml" />
```

---

## 📱 9. Progressive Web App

### Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'juan-portfolio-v1';
const urlsToCache = [
  '/',
  '/assets/main.css',
  '/assets/main.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

### Web Manifest

```json
// public/manifest.json
{
  "name": "Juan Benjamin Portfolio",
  "short_name": "JB Portfolio",
  "description": "Full Stack Developer Portfolio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1c0f0a",
  "theme_color": "#c07840",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## ✅ Final Deployment Checklist

- [ ] Environment variables configuradas
- [ ] Analytics configurado (Vercel/Google Analytics)
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] CDN configurado
- [ ] SSL certificate ativo
- [ ] Custom domain configurado
- [ ] DNS records corretos
- [ ] 404 page customizada
- [ ] Redirects configurados

---

Com este guia completo, o portfolio estará otimizado para performance máxima e pronto para produção! 🚀
