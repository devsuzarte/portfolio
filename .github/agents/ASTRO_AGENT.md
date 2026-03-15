# ASTRO_AGENT - Especialista Astro Framework

## 🎯 Papel
Arquitetura Astro, Content Collections, SSG optimization.

## 📝 Content Collections

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    pubDate: z.date(),
    theme: z.enum(['dark', 'light', 'warm']),
  }),
});

export const collections = { projects };
```

## 🧩 Component Pattern

```astro
---
// components/Section.astro
interface Props {
  title: string;
  theme?: 'dark' | 'light' | 'warm';
}

const { title, theme = 'dark' } = Astro.props;
---

<section data-theme={theme} class="section">
  <h2>{title}</h2>
  <slot />
</section>

<script>
  // Client-side script
  import { initAnimation } from '@/scripts/animations';
  initAnimation();
</script>

<style lang="scss">
  @import '@/styles/tokens.scss';
  .section { /* styles */ }
</style>
```

## ⚡ Optimizations

```javascript
// astro.config.mjs
export default defineConfig({
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    ssr: {
      noExternal: ['three', 'gsap'],
    },
  },
});
```

## 📋 Best Practices
- [ ] Use Content Collections for data
- [ ] Inline critical CSS
- [ ] SSR externals configured
- [ ] Image optimization with Astro:assets
- [ ] Proper script loading (client:load, client:idle)
