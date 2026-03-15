---
title: "Guia Definitivo de Animações com GSAP e ScrollTrigger"
description: "Aprenda a criar animações web de alto impacto com GSAP e ScrollTrigger, do básico ao avançado."
image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=630&fit=crop"
imageAlt: "Código de animações na tela"
category: "tutorial"
tags: ["GSAP", "JavaScript", "Animations", "Frontend"]
pubDate: 2024-11-20
featured: true
readingTime: 12
theme: "dark"
---

## Introdução

GSAP é a biblioteca de animações mais performática para a web. Neste guia, você aprende do básico ao avançado.

## Setup

```bash
npm install gsap
```

## ScrollTrigger

O plugin ScrollTrigger sincroniza animações com o scroll:

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.to('.box', {
  x: 500,
  scrollTrigger: {
    trigger: '.box',
    start: 'top center',
    scrub: true,
  },
});
```

## Dicas Pro

Sempre faça cleanup das animações para evitar memory leaks.
