# DESIGN_SYSTEM_AGENT - Especialista em UI/UX

## 🎯 Papel
Garantir consistência visual, acessibilidade e experiência do usuário em todos os componentes, seguindo o design system elegante e editorial do portfólio.

---

## ☕ Design Tokens (Source of Truth)

### Paleta — Coffee Scale:

```scss
// Escuros
$espresso:     #1c0f0a;
$dark-roast:   #2e1a12;
$medium-roast: #5c3317;
$sienna:       #8b4513;

// Quentes (acentos)
$caramel:      #c07840;
$amber:        #d4922a;
$latte:        #d4a878;

// Claros
$oat:          #e8d5ba;
$cream:        #f5ede0;
$fog:          #f9f6f1;

// Texto
$ink:          #1a1410;
$charcoal:     #3d2b1f;
$muted:        #8a6d5c;

// Acento complementar
$sage:         #6b7c72;
$slate:        #5a6470;
```

### Tipografia:

```scss
$fonts: (
  display: ('Cormorant Garamond', Georgia, serif),
  sans:    ('DM Sans', system-ui, sans-serif),
  body:    ('Inter', system-ui, sans-serif),
  code:    ('JetBrains Mono', monospace),
);
```

### Escala Tipográfica:

```scss
$type-scale: (
  'xs':   0.75rem,
  'sm':   0.875rem,
  'base': 1rem,
  'lg':   1.125rem,
  '2xl':  1.5rem,
  '4xl':  2.5rem,
  '6xl':  5rem,
  '7xl':  7rem,  // Hero display
);
```

---

## 🧩 Component Library

### Botões:

```scss
// Primário — fundo caramel
.btn-primary {
  background: $caramel;
  color: $cream;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.875rem 2rem;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);

  &:hover {
    background: $amber;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba($caramel, 0.18);
  }
}

// Outline
.btn-outline {
  background: transparent;
  color: $caramel;
  border: 1px solid $caramel;

  &:hover {
    background: rgba($caramel, 0.08);
    transform: translateY(-2px);
  }
}
```

### Card Component:

```astro
---
// components/ui/Card.astro
interface Props {
  title: string;
  description: string;
  theme?: 'dark' | 'light';
  image?: string;
}

const { title, description, theme = 'light', image } = Astro.props;
---

<article class={`card card--${theme}`} data-scroll-reveal>
  {image && (
    <div class="card__image" data-image-reveal>
      <img src={image} alt={title} loading="lazy" />
    </div>
  )}

  <div class="card__content">
    <h3 class="card__title">{title}</h3>
    <p class="card__description">{description}</p>
    <slot />
  </div>
</article>

<style lang="scss">
  @import '@/styles/tokens.scss';

  .card {
    border-radius: 4px;
    overflow: hidden;
    transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
                box-shadow 0.4s ease;

    &:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 40px rgba($espresso, 0.16);
    }

    &--dark {
      background: $dark-roast;
      border: 1px solid rgba($oat, 0.1);
      .card__title { color: $cream; }
    }

    &--light {
      background: $fog;
      border: 1px solid rgba($sienna, 0.15);
      .card__title { color: $ink; }
    }

    &__image {
      aspect-ratio: 16 / 9;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
      }
    }

    &:hover &__image img { transform: scale(1.04); }

    &__content { padding: 1.5rem; }

    &__title {
      font-family: 'Cormorant Garamond', serif;
      font-weight: 600;
      font-size: 1.375rem;
      line-height: 1.2;
      margin-bottom: 0.5rem;
    }
  }
</style>
```

---

## 🎭 Efeitos Visuais

### Shadow System:

```scss
@mixin shadow-sm   { box-shadow: 0 1px 4px rgba($espresso, 0.08); }
@mixin shadow-md   { box-shadow: 0 4px 16px rgba($espresso, 0.12); }
@mixin shadow-lg   { box-shadow: 0 8px 40px rgba($espresso, 0.16); }
@mixin shadow-warm { box-shadow: 0 8px 32px rgba($caramel, 0.18); }
```

### Underline Animado:

```scss
.underline-accent {
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 1px;
    background: $caramel;
    transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }

  &:hover::after { width: 100%; }
}
```

### Grain Overlay (textura sutil):

```scss
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); // SVG noise filter
  pointer-events: none;
  opacity: 0.35;
  mix-blend-mode: overlay;
}
```

---

## ♿ Acessibilidade

### Checklist Obrigatório:

```typescript
interface A11yChecklist {
  semanticHTML:     boolean; // <nav>, <main>, <article>
  ariaLabels:       boolean; // aria-label, aria-labelledby
  keyboardNav:      boolean; // Tab, Enter, Esc
  focusStates:      boolean; // :focus-visible
  colorContrast:    boolean; // WCAG AA (4.5:1)
  reducedMotion:    boolean; // prefers-reduced-motion
  altText:          boolean; // img alt attributes
  headingHierarchy: boolean; // h1 → h2 → h3
}
```

### Contrastes Aprovados:

```typescript
// ✅ Combinações com contraste WCAG AA
checkContrast($cream, $espresso);     // ~15:1 — excelente
checkContrast($caramel, $espresso);   // ~7:1  — excelente
checkContrast($latte, $dark-roast);   // ~6:1  — bom
checkContrast($ink, $fog);            // ~14:1 — excelente
```

---

## 📱 Responsive Design

### Breakpoints:

```scss
$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px,
  '2xl': 1536px,
);

@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

---

## 🎯 Quando Consultar Este Agente

✅ Criar/modificar componentes UI
✅ Definir cores / typography
✅ Verificar acessibilidade
✅ Design responsivo
✅ Efeitos visuais (grain, underline, clip-path, shadow)
✅ Validar contraste de cores
✅ Criar variantes de componentes

---

## 📋 Template de Componente

```astro
---
// components/ui/ComponentName.astro
interface Props {
  title: string;
  theme?: 'dark' | 'light' | 'warm';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const { title, theme = 'dark', size = 'md', className = '' } = Astro.props;
---

<div
  class={`component component--${theme} component--${size} ${className}`}
  data-component="ComponentName"
>
  <h3>{title}</h3>
  <slot />
</div>

<style lang="scss">
  @import '@/styles/tokens.scss';

  .component {
    // Base styles

    &--dark  { /* background: $dark-roast; color: $cream;  */ }
    &--light { /* background: $fog;        color: $ink;    */ }
    &--warm  { /* background: $dark-roast; color: $oat;    */ }

    &--sm { /* padding: 0.75rem; */ }
    &--md { /* padding: 1.5rem;  */ }
    &--lg { /* padding: 2.5rem;  */ }
  }
</style>
```

Este agente garante **consistência visual** e **acessibilidade** em todo o portfolio!
