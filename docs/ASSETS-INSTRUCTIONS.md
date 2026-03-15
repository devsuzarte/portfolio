# 📦 Guia Completo: Assets do Portfolio

**Objetivo:** Obter, organizar e integrar todos os assets (imagens, vídeos, 3D, SVGs) no portfolio de forma gratuita e profissional.

---

## 📋 Índice

1. [Obter Assets Gratuitos](#1-obter-assets-gratuitos)
2. [Organizar Estrutura de Pastas](#2-organizar-estrutura-de-pastas)
3. [Converter Vídeo em Frames](#3-converter-vídeo-em-frames)
4. [Otimizar Assets](#4-otimizar-assets)
5. [Escanear e Gerar Registry](#5-escanear-e-gerar-registry)
6. [Visualizar Assets](#6-visualizar-assets)
7. [Usar no Código](#7-usar-no-código)

---

## 1. 📸 Obter Assets Gratuitos

### Passo a Passo:

#### A) Imagens (Hero, Backgrounds, Fotos)

1. **Acesse:** https://unsplash.com
2. **Busque por:**
   - `developer working minimal warm` (hero dark)
   - `dark texture abstract coffee` (backgrounds)
   - `minimal clean geometric` (about section)
3. **Download:** Tamanho Large (1920px)
4. **Salvar em:** `public/assets/images/hero/`

**Alternativas:**
- Pexels: https://pexels.com
- Pixabay: https://pixabay.com

---

#### B) Vídeos (Backgrounds, Animações)

1. **Acesse:** https://pexels.com/videos
2. **Busque por:**
   - `particles motion purple` (hero background)
   - `code typing` (tech vibe)
   - `abstract animation` (transitions)
3. **Download:** Full HD (1920x1080)
4. **Salvar em:** `public/assets/videos/`

---

#### C) SVG Icons

1. **Tech Stack Icons:**
   - **Simple Icons:** https://simpleicons.org
   - Buscar: React, Node, TypeScript, etc
   - Download SVG
   - Salvar em: `public/assets/icons/tech/`

2. **UI Icons:**
   - **Heroicons:** https://heroicons.com
   - **Tabler Icons:** https://tabler-icons.io
   - Salvar em: `public/assets/icons/ui/`

---

#### D) Modelos 3D (.GLB)

1. **Acesse:** https://sketchfab.com
2. **Filtrar:** Download > CC0 ou CC-BY
3. **Busque por:**
   - `laptop low poly`
   - `abstract geometric`
4. **Download:** GLB format (< 500KB)
5. **Salvar em:** `public/assets/models/`

---

#### E) Gerar com IA (GRÁTIS)

**Leonardo.AI** (150 créditos/dia):
1. Acesse: https://leonardo.ai
2. Prompt exemplo:
   ```
   minimal developer workspace, warm coffee tones,
   dark wood, soft ambient light, particles floating, 4k editorial
   ```
3. Download imagem
4. Salvar em pasta apropriada

---

## 2. 📂 Organizar Estrutura de Pastas

### Estrutura Recomendada:

```bash
# Criar estrutura
mkdir -p public/assets/{images/{hero,about,projects,blog},videos,frames,models,icons/{tech,ui},patterns}
```

### Resultado:

```
public/assets/
├── images/
│   ├── hero/
│   │   ├── background.webp
│   │   ├── background-mobile.webp
│   │   └── profile.webp
│   ├── about/
│   ├── projects/
│   └── blog/
├── videos/
│   └── hero-particles.mp4
├── frames/
│   └── scroll-sequence-1/
│       ├── frame_0001.webp
│       └── ...
├── models/
│   └── laptop.glb
├── icons/
│   ├── tech/
│   │   ├── react.svg
│   │   └── nodejs.svg
│   └── ui/
└── patterns/
    └── halftone-dots.svg
```

---

## 3. 🎬 Converter Vídeo em Frames

### Opção A: FFmpeg (Recomendado)

#### Instalar FFmpeg:

**Windows:**
```bash
# Download: https://ffmpeg.org/download.html
# Adicionar ao PATH
```

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

#### Converter:

```bash
# Navegue até a pasta do vídeo
cd public/assets/videos

# Criar pasta para frames
mkdir -p ../frames/scroll-sequence-1

# Extrair frames (15 FPS, otimizado)
ffmpeg -i hero-particles.mp4 \
  -vf "fps=15,scale=1920:-1" \
  ../frames/scroll-sequence-1/frame_%04d.jpg

# OU para WebP (menor tamanho):
ffmpeg -i hero-particles.mp4 \
  -vf "fps=15,scale=1920:-1" \
  -c:v libwebp \
  -quality 85 \
  ../frames/scroll-sequence-1/frame_%04d.webp
```

**Resultado:** 
- `frame_0001.webp`
- `frame_0002.webp`
- ... até frame_00XX.webp

---

### Opção B: EZGIF (Online, Sem Instalar)

1. **Acesse:** https://ezgif.com/video-to-jpg
2. **Upload:** Seu vídeo MP4 (max 100MB)
3. **FPS:** Escolher 15
4. **Convert:** Clicar em "Convert to JPG"
5. **Download:** ZIP com todos os frames
6. **Extrair:** Para `public/assets/frames/scroll-sequence-1/`

---

## 4. ⚡ Otimizar Assets

### A) Imagens (Converter para WebP)

#### Online (Squoosh):
1. **Acesse:** https://squoosh.app
2. **Arrastar** imagem JPG/PNG
3. **Escolher:** WebP (quality 85)
4. **Download**

#### Command Line (cwebp):
```bash
# Instalar
# Mac: brew install webp
# Linux: sudo apt install webp

# Converter
cwebp -q 85 background.jpg -o background.webp

# Batch (todas JPG em uma pasta)
for file in *.jpg; do
  cwebp -q 85 "$file" -o "${file%.jpg}.webp"
done
```

---

### B) Comprimir Imagens (TinyPNG)

1. **Acesse:** https://tinypng.com
2. **Upload:** Até 20 imagens (max 5MB cada)
3. **Download:** Versões comprimidas
4. **Substituir** originais

---

### C) Otimizar SVG (SVGOMG)

1. **Acesse:** https://jakearchibald.github.io/svgomg
2. **Upload:** SVG
3. **Otimizar:** Remover metadados, decimais
4. **Download:** SVG otimizado

---

## 5. 🔍 Escanear e Gerar Registry

Após organizar todos os assets, execute o script automático:

### Passo a Passo:

```bash
# 1. Copiar scan-assets.js para raiz do projeto
cp scan-assets.js portfolio-juan-benjamin/

# 2. Navegar até o projeto
cd portfolio-juan-benjamin

# 3. Executar scanner
node scan-assets.js
```

### O Que o Script Faz:

1. ✅ Escaneia `public/assets/` recursivamente
2. ✅ Categoriza por tipo (imagens, vídeos, modelos, etc)
3. ✅ Gera `src/config/assets.ts` (TypeScript registry)
4. ✅ Gera `docs/ASSETS-INVENTORY.md` (documentação)

### Resultado (`src/config/assets.ts`):

```typescript
export const ASSETS = {
  images: {
    hero: {
      background: '/assets/images/hero/background.webp',
      profile: '/assets/images/hero/profile.webp',
    },
  },
  videos: {
    hero_particles: '/assets/videos/hero-particles.mp4',
  },
  models: {
    laptop: '/assets/models/laptop.glb',
  },
  // ...
} as const;
```

---

## 6. 🎨 Visualizar Assets

### Abrir Página HTML:

1. **Copiar** `assets-library.html` para raiz do projeto
2. **Editar** o objeto `assets` no script (linha ~200) com seus assets reais
3. **Abrir** no navegador: `file:///caminho/assets-library.html`

### Features da Página:

- ✅ Preview visual de todos os assets
- ✅ Copiar path com 1 clique
- ✅ Download direto
- ✅ Organizado por categoria
- ✅ Frame sequences em grid

---

## 7. 💻 Usar no Código

### A) Importar Assets Registry:

```typescript
import { ASSETS } from '@/config/assets';
```

### B) Usar em Componente Astro:

```astro
---
import { Image } from 'astro:assets';
import { ASSETS } from '@/config/assets';
---

<Image 
  src={ASSETS.images.hero.background}
  alt="Hero background"
  format="webp"
  quality={85}
/>
```

### C) Scroll Frame Animation:

```typescript
import { FrameSequence } from '@/scripts/frameAnimation';

const sequence = new FrameSequence(canvas, {
  frameCount: 30,
  folder: 'scroll-sequence-1',
  prefix: 'frame',
  extension: 'webp',
});
```

### D) Carregar Modelo 3D:

```typescript
import { ModelLoader } from '@/scripts/three/ModelLoader';
import { ASSETS } from '@/config/assets';

const loader = new ModelLoader();
const model = await loader.load(ASSETS.models.laptop);
```

---

## 📋 Checklist Completo

### Fase 1: Obter Assets
- [ ] Baixar imagens do Unsplash/Pexels
- [ ] Baixar vídeos do Pexels Videos
- [ ] Baixar SVG icons (Simple Icons, Heroicons)
- [ ] Baixar modelos 3D do Sketchfab
- [ ] OU gerar com IA (Leonardo.AI)

### Fase 2: Organizar
- [ ] Criar estrutura de pastas em `public/assets/`
- [ ] Mover assets para pastas apropriadas
- [ ] Renomear arquivos com nomes descritivos

### Fase 3: Converter & Otimizar
- [ ] Converter vídeo em frames (FFmpeg ou EZGIF)
- [ ] Converter imagens para WebP (Squoosh)
- [ ] Comprimir imagens (TinyPNG)
- [ ] Otimizar SVGs (SVGOMG)

### Fase 4: Automatizar
- [ ] Executar `node scan-assets.js`
- [ ] Verificar `src/config/assets.ts` gerado
- [ ] Verificar `docs/ASSETS-INVENTORY.md` gerado

### Fase 5: Visualizar
- [ ] Editar `assets-library.html` com assets reais
- [ ] Abrir no navegador
- [ ] Testar copiar paths

### Fase 6: Integrar no Código
- [ ] Importar `ASSETS` em componentes
- [ ] Substituir paths hardcoded
- [ ] Testar preview no dev server

---

## 🎯 Resultado Final

Você terá:

1. ✅ **Assets organizados** em `public/assets/`
2. ✅ **Registry TypeScript** em `src/config/assets.ts`
3. ✅ **Documentação** em `docs/ASSETS-INVENTORY.md`
4. ✅ **Página visual** em `assets-library.html`
5. ✅ **Assets otimizados** (WebP, comprimidos)
6. ✅ **Frame sequences** para scroll animations
7. ✅ **Código pronto** para usar nos componentes

---

## 📚 Arquivos Relacionados

- **ASSETS-GUIDE.md** - Onde obter assets gratuitos
- **ASSETS_AGENT.md** - Como agente de código usa assets
- **scan-assets.js** - Script automático de scanning
- **assets-library.html** - Página visual de referência

---

**Agora você tem um sistema completo de assets! 🎨✨**
