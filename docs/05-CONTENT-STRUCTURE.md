# Content Structure - Portfolio Juan Benjamin

**Sistema:** Astro Content Collections + Markdown

---

## 📂 Content Collections Schema

### Config File

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

// Projects Collection
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    longDescription: z.string().optional(),
    
    // Images
    thumbnail: z.string(),
    images: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    
    // Tech stack
    tags: z.array(z.string()),
    tech: z.array(z.string()),
    
    // Links
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    case_study: z.string().url().optional(),
    
    // Metadata
    featured: z.boolean().default(false),
    status: z.enum(['completed', 'in-progress', 'archived']).default('completed'),
    category: z.enum(['web', 'mobile', 'fullstack', 'backend', 'frontend']),
    
    // Dates
    startDate: z.date(),
    endDate: z.date().optional(),
    pubDate: z.date(),
    
    // Theme for project page
    theme: z.enum(['dark', 'light', 'warm']).default('dark'),
    
    // Statistics
    stars: z.number().optional(),
    forks: z.number().optional(),
  }),
});

// Blog Collection
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    
    // Author
    author: z.string().default('Juan Benjamin Almeida Suzarte'),
    authorImage: z.string().default('/images/author.jpg'),
    
    // Images
    image: z.string(),
    imageAlt: z.string().optional(),
    
    // Categories & Tags
    category: z.enum(['tutorial', 'opinion', 'news', 'project-log', 'tech']),
    tags: z.array(z.string()),
    
    // Metadata
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    
    // Reading time (auto-calculated)
    readingTime: z.number().optional(),
    
    // Theme
    theme: z.enum(['dark', 'light', 'warm']).default('dark'),
  }),
});

// Experience Collection
const experience = defineCollection({
  type: 'data',
  schema: z.object({
    company: z.string(),
    position: z.string(),
    location: z.string(),
    type: z.enum(['full-time', 'part-time', 'contract', 'freelance']),
    
    // Dates
    startDate: z.date(),
    endDate: z.date().optional(),
    current: z.boolean().default(false),
    
    // Description
    description: z.string(),
    achievements: z.array(z.string()),
    
    // Tech used
    technologies: z.array(z.string()),
    
    // Links
    companyUrl: z.string().url().optional(),
    companyLogo: z.string().optional(),
  }),
});

// Skills Collection
const skills = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    category: z.enum(['frontend', 'backend', 'database', 'devops', 'tools', 'soft-skills']),
    proficiency: z.number().min(0).max(100),
    icon: z.string().optional(),
    color: z.string().optional(),
    yearsOfExperience: z.number().optional(),
  }),
});

export const collections = {
  projects,
  blog,
  experience,
  skills,
};
```

---

## 📝 Example Content Files

### Project Example

```markdown
---
# src/content/projects/e-commerce-platform.md
title: "E-Commerce Platform Full Stack"
description: "Plataforma completa de e-commerce com Next.js, Node.js e PostgreSQL"
longDescription: "Sistema completo de e-commerce incluindo carrinho, pagamentos Stripe, painel admin, e muito mais."

thumbnail: "/projects/ecommerce/thumb.jpg"
images:
  - "/projects/ecommerce/screenshot-1.jpg"
  - "/projects/ecommerce/screenshot-2.jpg"
  - "/projects/ecommerce/screenshot-3.jpg"
coverImage: "/projects/ecommerce/cover.jpg"

tags: ["E-commerce", "Full Stack", "React", "Node.js"]
tech: 
  - "Next.js 14"
  - "Node.js"
  - "PostgreSQL"
  - "Prisma"
  - "Stripe"
  - "TailwindCSS"
  - "TypeScript"

github: "https://github.com/devsuzarte/ecommerce-platform"
demo: "https://ecommerce-demo.juanbenjamin.dev"

featured: true
status: "completed"
category: "fullstack"

startDate: 2024-01-15
endDate: 2024-06-20
pubDate: 2024-06-20

theme: "dark"

stars: 45
forks: 12
---

## 🎯 Visão Geral

Este projeto foi desenvolvido para demonstrar habilidades full stack modernas, incluindo:

- **Frontend** com Next.js 14 (App Router)
- **Backend** com Node.js + Express
- **Banco de Dados** PostgreSQL com Prisma ORM
- **Pagamentos** integrados com Stripe
- **Autenticação** com NextAuth.js
- **Deploy** em Vercel (frontend) e Railway (backend)

## ✨ Features Principais

### 1. Carrinho de Compras
- Adicionar/remover produtos
- Atualizar quantidades
- Persistência em localStorage
- Sincronização com conta do usuário

### 2. Sistema de Pagamentos
```typescript
// Integração Stripe
const checkout = async (items: CartItem[]) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${domain}/success`,
    cancel_url: `${domain}/cart`,
  });
  
  return session;
};
```

### 3. Painel Admin
- Gerenciamento de produtos
- Visualização de pedidos
- Estatísticas de vendas
- Gráficos com Chart.js

## 🚀 Performance

- **Lighthouse Score:** 98/100
- **First Contentful Paint:** 0.9s
- **Time to Interactive:** 1.8s
- **Bundle Size:** 180KB (gzipped)

## 🎨 Design System

Utilizei um design system próprio com:
- Paleta de cores coffee (espresso/caramel/cream)
- Typography scale consistente
- Componentes reutilizáveis
- Dark mode completo

## 📸 Screenshots

![Homepage](/projects/ecommerce/screenshot-1.jpg)
*Homepage com produtos em destaque*

![Product Detail](/projects/ecommerce/screenshot-2.jpg)
*Página de detalhes do produto com animações*

![Admin Panel](/projects/ecommerce/screenshot-3.jpg)
*Painel administrativo com estatísticas*

## 🧪 Testes

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

Cobertura de testes: **87%**

## 💡 Aprendizados

1. **Stripe Integration** - Aprendi a lidar com webhooks e eventos assíncronos
2. **Database Optimization** - Implementei indexes e queries otimizadas
3. **State Management** - Utilizei Zustand para gerenciamento global
4. **Real-time Updates** - Socket.io para notificações em tempo real

## 🔮 Próximos Passos

- [ ] Adicionar suporte a múltiplas moedas
- [ ] Implementar sistema de reviews
- [ ] Adicionar recomendações por AI
- [ ] Mobile app com React Native

```

---

### Blog Post Example

```markdown
---
# src/content/blog/gsap-animations-guide.md
title: "Guia Definitivo de Animações com GSAP e ScrollTrigger"
description: "Aprenda a criar animações web incríveis usando GSAP e ScrollTrigger do zero"

author: "Juan Benjamin Almeida Suzarte"
authorImage: "/images/juan-avatar.jpg"

image: "/blog/gsap-guide/cover.jpg"
imageAlt: "GSAP logo com exemplos de animações"

category: "tutorial"
tags: ["GSAP", "JavaScript", "Animations", "Frontend", "ScrollTrigger"]

pubDate: 2024-11-20
updatedDate: 2024-11-25

featured: true
draft: false

readingTime: 15

theme: "dark"
---

## 🎬 Introdução

GSAP (GreenSock Animation Platform) é a biblioteca de animações mais poderosa e performática para a web. Neste guia completo, você vai aprender desde o básico até técnicas avançadas.

## 📦 Setup Inicial

```bash
npm install gsap
```

## 🚀 Primeira Animação

```javascript
import { gsap } from 'gsap';

// Fade in simples
gsap.to('.element', {
  opacity: 1,
  duration: 1,
  ease: 'power2.out',
});
```

## 🎯 ScrollTrigger Básico

ScrollTrigger é um plugin que sincroniza animações com o scroll:

```javascript
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

gsap.to('.box', {
  x: 500,
  scrollTrigger: {
    trigger: '.box',
    start: 'top center',
    end: 'bottom center',
    scrub: true,
  },
});
```

## 💡 Dicas Pro

### 1. Sempre use `force3D`
```javascript
gsap.config({ force3D: true });
```

### 2. Cleanup é essencial
```javascript
// Em React/Astro
useEffect(() => {
  const tl = gsap.timeline();
  
  return () => {
    tl.kill();
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
}, []);
```

### 3. Performance com `will-change`
```css
.animated-element {
  will-change: transform, opacity;
}
```

## 🎨 Exemplos Práticos

### Hero Animation
[CodePen embed aqui]

### Card Hover Effect
[CodePen embed aqui]

### Scroll Parallax
[CodePen embed aqui]

## 📚 Recursos

- [Documentação Oficial GSAP](https://greensock.com/docs/)
- [Forum GSAP](https://greensock.com/forums/)
- [Meu repositório de exemplos](https://github.com/devsuzarte/gsap-examples)

## 🎯 Conclusão

GSAP é uma ferramenta essencial para qualquer desenvolvedor frontend que queira criar experiências visuais de alta qualidade.

**Happy Animating! 🚀**

---

*Gostou do artigo? Compartilhe nas redes sociais!*
```

---

### Experience Example

```yaml
# src/content/experience/tech-company.yaml
company: "Tech Innovators Inc"
position: "Senior Full Stack Developer"
location: "Remote"
type: "full-time"

startDate: 2023-01-15
endDate: null
current: true

description: "Liderando o desenvolvimento de aplicações web modernas com foco em performance e UX."

achievements:
  - "Reduzi o tempo de carregamento da aplicação principal em 40% através de otimizações"
  - "Implementei sistema de CI/CD que reduziu bugs em produção em 60%"
  - "Mentoria de 3 desenvolvedores juniores"
  - "Migrei a stack de JavaScript para TypeScript, melhorando a manutenibilidade"

technologies:
  - "React"
  - "Next.js"
  - "Node.js"
  - "PostgreSQL"
  - "Docker"
  - "AWS"
  - "TypeScript"

companyUrl: "https://techinnovators.com"
companyLogo: "/companies/tech-innovators.svg"
```

---

### Skills Example

```yaml
# src/content/skills/react.yaml
name: "React"
category: "frontend"
proficiency: 95
icon: "react"
color: "#61DAFB"
yearsOfExperience: 5
```

---

## 🔍 Querying Content

### Get All Projects

```astro
---
// src/pages/projects/index.astro
import { getCollection } from 'astro:content';

const allProjects = await getCollection('projects');
const featuredProjects = allProjects.filter(p => p.data.featured);
const sortedProjects = allProjects.sort(
  (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
);
---
```

### Get Single Project

```astro
---
// src/pages/projects/[slug].astro
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  
  return projects.map(project => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await project.render();
---

<article data-theme={project.data.theme}>
  <h1>{project.data.title}</h1>
  <Content />
</article>
```

### Filter by Category

```typescript
const webProjects = await getCollection('projects', ({ data }) => {
  return data.category === 'web' && !data.draft;
});
```

---

## 📊 Dynamic Data Generation

### GitHub Integration

```typescript
// src/utils/github.ts
export async function getGitHubStats(username: string) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
  );
  
  const repos = await response.json();
  
  return {
    totalRepos: repos.length,
    totalStars: repos.reduce((acc, repo) => acc + repo.stargazers_count, 0),
    totalForks: repos.reduce((acc, repo) => acc + repo.forks_count, 0),
    languages: [...new Set(repos.map(r => r.language).filter(Boolean))],
  };
}
```

Usage:
```astro
---
import { getGitHubStats } from '@/utils/github';

const githubStats = await getGitHubStats('devsuzarte');
---

<div class="stats">
  <stat>
    <span class="value">{githubStats.totalStars}</span>
    <span class="label">GitHub Stars</span>
  </stat>
</div>
```

---

## 🎨 Theme-based Rendering

```astro
---
const themes = {
  dark: {
    bg: 'bg-espresso',
    text: 'text-cream',
    accent: 'text-caramel',
  },
  light: {
    bg: 'bg-fog',
    text: 'text-ink',
    accent: 'text-caramel',
  },
  warm: {
    bg: 'bg-dark-roast',
    text: 'text-oat',
    accent: 'text-amber',
  },
};

const theme = themes[project.data.theme] || themes.dark;
---

<div class={`project ${theme.bg} ${theme.text}`}>
  <h2 class={theme.accent}>{project.data.title}</h2>
</div>
```

---

## 🔖 RSS Feed Generation

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog');
  
  return rss({
    title: 'Juan Benjamin Blog',
    description: 'Thoughts on web development and tech',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  });
}
```

---

## 📱 Content Preview Component

```astro
---
// src/components/ProjectCard.astro
interface Props {
  project: any;
}

const { project } = Astro.props;
const { title, description, thumbnail, tags, theme } = project.data;
---

<article 
  class="project-card"
  data-theme={theme}
  data-scroll-reveal
>
  <div class="project-card__image">
    <img src={thumbnail} alt={title} loading="lazy" />
  </div>
  
  <div class="project-card__content">
    <h3>{title}</h3>
    <p>{description}</p>
    
    <div class="tags">
      {tags.map(tag => (
        <span class="tag">{tag}</span>
      ))}
    </div>
    
    <a href={`/projects/${project.slug}`} class="btn-primary">
      Ver Projeto →
    </a>
  </div>
</article>

<style lang="scss">
  .project-card {
    position: relative;
    overflow: hidden;
    
    &[data-theme="dark"] {
      border: 1px solid rgba(var(--caramel), 0.2);
    }
  }
</style>
```

---

Este sistema de conteúdo permite gerenciar todo o portfolio de forma organizada e escalável!
