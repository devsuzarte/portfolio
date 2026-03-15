# PERFORMANCE_AGENT - Especialista em Otimização

## 🎯 Targets

- Lighthouse: > 95
- FCP: < 1.2s
- LCP: < 2.5s
- CLS: < 0.1
- TTI: < 2.5s
- Bundle: < 300KB gzipped

## ⚡ Otimizações Obrigatórias

### 1. Images
```astro
<Image 
  src={image}
  format="avif"
  quality={85}
  loading="lazy"
  decoding="async"
/>
```

### 2. Fonts
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" href="/fonts/cormorant-garamond.woff2" as="font" crossorigin>
<link rel="preload" href="/fonts/dm-sans.woff2" as="font" crossorigin>
```

### 3. Code Splitting
```typescript
// Lazy load Three.js scenes
const Scene = dynamic(() => import('@/three/Scene'), {
  ssr: false,
  loading: () => <Skeleton />,
});
```

### 4. Debounce Scroll
```typescript
const handleScroll = debounce(() => {
  // expensive operation
}, 16); // ~60fps
```

## 📊 Monitoring
Use Web Vitals library para track métricas em produção.
