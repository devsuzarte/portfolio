# Design System - Portfolio Juan Benjamin

**Estilo Visual:** Clean, Elegante, Editorial — Tons de Café

---

## 🎨 Filosofia de Design

O portfólio segue uma linguagem visual **coesa e refinada**, inspirada em cafeterias de design independente, editoriais tipográficos e portfolios de top-tier devs. O objetivo é transmitir:

- **Competência técnica** — organização, clareza, precisão
- **Sofisticação** — tipografia elegante, espaços negativos bem explorados
- **Autenticidade** — cores quentes e orgânicas, sem exagero visual

Uma paleta única conecta todas as seções. A diferenciação entre seções é feita por **variação de luz** (dark/light) — não por troca radical de paleta.

---

## ☕ Paleta de Cores

### Base — Coffee Scale

```scss
// Escuros (fundos, textos primários)
$espresso:    #1c0f0a;   // Fundo dark principal
$dark-roast:  #2e1a12;   // Fundo de seções escuras
$medium-roast:#5c3317;   // Elementos mid-tone
$sienna:      #8b4513;   // Bordas e divisores sutis

// Quentes (acentos, CTAs, destaques)
$caramel:     #c07840;   // Acento principal — links, hover, destaque
$amber:       #d4922a;   // Acento secundário — dourado
$latte:       #d4a878;   // Highlight suave

// Claros (fundos light, textos em dark)
$oat:         #e8d5ba;   // Superfícies claras
$cream:       #f5ede0;   // Background de seções claras
$fog:         #f9f6f1;   // Background quase-branco

// Texto
$ink:         #1a1410;   // Texto principal em fundos claros
$charcoal:    #3d2b1f;   // Texto secundário
$muted:       #8a6d5c;   // Placeholders, labels, meta
```

### Acento Complementar

```scss
// Para contraste sutil — não usar excessivamente
$sage:        #6b7c72;   // Verde-cinza frio (tecnologia, código)
$slate:       #5a6470;   // Azul-cinza neutro (links, badges)
```

### Gradientes

```scss
// Hero — escuro com profundidade
.gradient-hero {
  background: linear-gradient(160deg, $espresso 0%, $dark-roast 60%, $medium-roast 100%);
}

// Section clara com warmth
.gradient-warm-light {
  background: linear-gradient(180deg, $fog 0%, $cream 100%);
}

// Acento — para botões primários, CTAs
.gradient-accent {
  background: linear-gradient(135deg, $caramel 0%, $amber 100%);
}
```

---

## 🖋 Sistema Tipográfico

### Fontes

```scss
// Headlines — editorial, elegante
// Cormorant Garamond: contraste alto entre traços, sofisticada
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

// Display alternativo — sans moderno para títulos menores
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

// Body — clean, highly legível
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

// Code — monospace preciso
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

$font-display:  'Cormorant Garamond', Georgia, serif;
$font-sans:     'DM Sans', system-ui, sans-serif;
$font-body:     'Inter', system-ui, sans-serif;
$font-code:     'JetBrains Mono', 'Fira Code', monospace;
```

### Escala Tipográfica

```scss
$type-scale: (
  'xs':   0.75rem,    // 12px — labels, meta
  'sm':   0.875rem,   // 14px — caption, tags
  'base': 1rem,       // 16px — body
  'lg':   1.125rem,   // 18px — lead text
  'xl':   1.25rem,    // 20px — subtítulos
  '2xl':  1.5rem,     // 24px — seção h3
  '3xl':  1.875rem,   // 30px — h2 pequeno
  '4xl':  2.5rem,     // 40px — h2 principal
  '5xl':  3.5rem,     // 56px — h1 seção
  '6xl':  5rem,       // 80px — hero subtitle
  '7xl':  7rem,       // 112px — hero title display
);
```

### Padrões Tipográficos

```scss
// Hero title — display serif, leveza do italic
.type-hero {
  font-family: $font-display;
  font-weight: 300;
  font-style: italic;
  font-size: 7rem;
  line-height: 0.95;
  letter-spacing: -0.02em;
  color: $cream;
}

// Hero subtitle — sans limpo
.type-hero-sub {
  font-family: $font-sans;
  font-weight: 300;
  font-size: 1.125rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: $latte;
}

// Section heading — serif bold
.type-heading {
  font-family: $font-display;
  font-weight: 600;
  font-size: 3.5rem;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

// Body text
.type-body {
  font-family: $font-body;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.7;
  color: $charcoal;
}

// Code inline
.type-code {
  font-family: $font-code;
  font-size: 0.875rem;
  background: rgba($sienna, 0.1);
  color: $caramel;
  padding: 0.1em 0.4em;
  border-radius: 3px;
}
```

---

## 📐 Sistema de Espaçamento

```scss
// Grid base: 8px
$spacing: (
  1:  0.25rem,   // 4px
  2:  0.5rem,    // 8px
  3:  0.75rem,   // 12px
  4:  1rem,      // 16px
  5:  1.25rem,   // 20px
  6:  1.5rem,    // 24px
  8:  2rem,      // 32px
  10: 2.5rem,    // 40px
  12: 3rem,      // 48px
  16: 4rem,      // 64px
  20: 5rem,      // 80px
  24: 6rem,      // 96px
  32: 8rem,      // 128px
  40: 10rem,     // 160px
);
```

---

## ✨ Efeitos Visuais

### 1. Sombra Elegante (substitui neon glow)

```scss
// Elevation system — warm-tinted shadows
@mixin shadow-sm {
  box-shadow: 0 1px 4px rgba($espresso, 0.08), 0 1px 2px rgba($espresso, 0.06);
}

@mixin shadow-md {
  box-shadow: 0 4px 16px rgba($espresso, 0.12), 0 2px 6px rgba($espresso, 0.08);
}

@mixin shadow-lg {
  box-shadow: 0 8px 40px rgba($espresso, 0.16), 0 4px 12px rgba($espresso, 0.10);
}

@mixin shadow-warm {
  box-shadow: 0 8px 32px rgba($caramel, 0.18), 0 2px 8px rgba($caramel, 0.10);
}
```

### 2. Borda Sutil Aquecida

```scss
@mixin border-warm($opacity: 0.25) {
  border: 1px solid rgba($caramel, $opacity);
}

@mixin border-dark($opacity: 0.15) {
  border: 1px solid rgba($oat, $opacity);
}

// Linha divisória horizontal
.divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba($caramel, 0.4) 30%,
    rgba($caramel, 0.4) 70%,
    transparent
  );
  margin: 3rem 0;
}
```

### 3. Textura de Grão (Grain Overlay)

```scss
// Aplicar em seções hero ou elementos principais
.grain-overlay {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.35;
    mix-blend-mode: overlay;
  }
}
```

### 4. Underline Animado (substitui glitch)

```scss
// Link e heading com underline elegante
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

  &:hover::after,
  &.active::after {
    width: 100%;
  }
}

// Versão para headings — linha estática decorativa
.heading-underline {
  &::after {
    content: '';
    display: block;
    width: 3rem;
    height: 1px;
    background: $caramel;
    margin-top: 1rem;
  }
}
```

### 5. Highlight Quente (substitui halftone/comic)

```scss
// Destaque de texto elegante
.highlight-warm {
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba($amber, 0.15) 10%,
    rgba($amber, 0.15) 90%,
    transparent 100%
  );
  padding: 0.1em 0.5em;
  border-radius: 2px;
}

// Tag/badge limpa
.badge {
  font-family: $font-code;
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.3em 0.8em;
  border-radius: 2px;
  background: rgba($caramel, 0.1);
  color: $caramel;
  border: 1px solid rgba($caramel, 0.2);
}
```

---

## 🔲 Componentes Base

### Botões

```scss
.btn {
  font-family: $font-sans;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.875rem 2rem;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  // Primário — acento quente
  &.btn-primary {
    background: $caramel;
    color: $cream;

    &:hover {
      background: $amber;
      transform: translateY(-2px);
      @include shadow-warm;
    }

    &:active {
      transform: translateY(0);
    }
  }

  // Secundário — outline elegante
  &.btn-outline {
    background: transparent;
    color: $caramel;
    border: 1px solid $caramel;

    &:hover {
      background: rgba($caramel, 0.08);
      transform: translateY(-2px);
    }
  }

  // Ghost — apenas texto + underline
  &.btn-ghost {
    background: transparent;
    color: $cream;
    padding-left: 0;
    padding-right: 0;
    @extend .underline-accent;

    &:hover {
      color: $latte;
    }
  }
}
```

### Cards

```scss
.card {
  border-radius: 4px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1),
              box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-6px);
    @include shadow-lg;
  }

  // Variante dark (sobre fundos escuros)
  &--dark {
    background: $dark-roast;
    @include border-dark(0.12);

    .card__title { color: $cream; }
    .card__meta  { color: $muted; }
  }

  // Variante light (sobre fundos claros)
  &--light {
    background: $fog;
    @include border-warm(0.2);
    @include shadow-sm;

    .card__title { color: $ink; }
    .card__meta  { color: $muted; }
  }

  &__image {
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }
  }

  &:hover &__image img {
    transform: scale(1.04);
  }

  &__content {
    padding: 1.5rem;
  }

  &__title {
    font-family: $font-display;
    font-weight: 600;
    font-size: 1.375rem;
    margin-bottom: 0.5rem;
    line-height: 1.2;
  }

  &__meta {
    font-family: $font-code;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
}
```

---

## 📱 Breakpoints

```scss
$breakpoints: (
  'xs': 480px,
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

## 🌓 Sistema de Temas (Dark / Light)

Cada seção usa variação de luz, não de paleta:

```html
<!-- Seção escura -->
<section data-theme="dark"><!-- ... --></section>

<!-- Seção clara -->
<section data-theme="light"><!-- ... --></section>

<!-- Seção de acento (hero de sub-seção) -->
<section data-theme="warm"><!-- ... --></section>
```

```scss
[data-theme="dark"] {
  --bg-primary:    #{$espresso};
  --bg-secondary:  #{$dark-roast};
  --text-primary:  #{$cream};
  --text-secondary:#{$latte};
  --text-muted:    #{$muted};
  --accent:        #{$caramel};
  --accent-alt:    #{$amber};
  --border:        rgba(#{$oat}, 0.1);
}

[data-theme="light"] {
  --bg-primary:    #{$fog};
  --bg-secondary:  #{$cream};
  --text-primary:  #{$ink};
  --text-secondary:#{$charcoal};
  --text-muted:    #{$muted};
  --accent:        #{$caramel};
  --accent-alt:    #{$medium-roast};
  --border:        rgba(#{$sienna}, 0.15);
}

[data-theme="warm"] {
  --bg-primary:    #{$dark-roast};
  --bg-secondary:  #{$medium-roast};
  --text-primary:  #{$oat};
  --text-secondary:#{$latte};
  --text-muted:    #{$muted};
  --accent:        #{$amber};
  --accent-alt:    #{$caramel};
  --border:        rgba(#{$caramel}, 0.2);
}
```

---

## ✨ Mapa de Seções e Emoções Visuais

| Seção      | Tema  | Emoção                  | Destaque        |
|------------|-------|-------------------------|-----------------|
| Hero       | dark  | Profundo, focado        | Serif italic    |
| About      | light | Próximo, humano         | Cream + ink     |
| Skills     | dark  | Técnico, preciso        | Code font       |
| Experience | warm  | Sólido, confiável       | Timeline amber  |
| Projects   | light | Criativo, organizado    | Cards + sombra  |
| Blog       | light | Aberto, reflexivo       | Tipografia lead |
| Contact    | dark  | Direto, sofisticado     | CTA caramel     |

---

## 🎯 Princípios de Design

1. **Espaço negativo** — deixar o conteúdo respirar; margens generosas
2. **Hierarquia tipográfica** — tamanhos bem distintos comunicam clareza
3. **Uma paleta** — coesão visual em todas as seções; variação só em luminosidade
4. **Animações sutis** — movimento serve a conteúdo, não concorre com ele
5. **Performance first** — nenhum efeito visual justifica queda abaixo de 60fps
6. **Contraste WCAG AA** — acessibilidade inegociável

---

## 📦 Design Tokens Export

```javascript
// src/config/design-tokens.ts
export const tokens = {
  colors: {
    espresso:    '#1c0f0a',
    darkRoast:   '#2e1a12',
    mediumRoast: '#5c3317',
    sienna:      '#8b4513',
    caramel:     '#c07840',
    amber:       '#d4922a',
    latte:       '#d4a878',
    oat:         '#e8d5ba',
    cream:       '#f5ede0',
    fog:         '#f9f6f1',
    ink:         '#1a1410',
    charcoal:    '#3d2b1f',
    muted:       '#8a6d5c',
    sage:        '#6b7c72',
    slate:       '#5a6470',
  },
  fonts: {
    display: "'Cormorant Garamond', Georgia, serif",
    sans:    "'DM Sans', system-ui, sans-serif",
    body:    "'Inter', system-ui, sans-serif",
    code:    "'JetBrains Mono', monospace",
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem',
    '2xl': '8rem',
  },
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    full: '9999px',
  },
  transition: {
    fast:   '0.15s ease',
    base:   '0.3s cubic-bezier(0.25, 1, 0.5, 1)',
    slow:   '0.6s cubic-bezier(0.25, 1, 0.5, 1)',
    spring: '0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};
```

Este design system garante um portfólio que comunica **excelência técnica com elegância visual** — o padrão esperado de um desenvolvedor fullstack sênior.
