// src/config/assets.ts
// Registry centralizado de assets do portfolio
// Agente Consultado: ASSETS_AGENT

export const ASSETS = {
  images: {
    hero: {
      background: '/assets/images/hero/background.webp',
      backgroundMobile: '/assets/images/hero/background-mobile.webp',
      profile: '/assets/images/hero/profile.webp',
    },
    about: {
      patternGrain: '/assets/patterns/grain-noise.svg',
    },
    projects: {
      project1Thumb: '/assets/images/projects/project-1-thumb.webp',
      project1Full: '/assets/images/projects/project-1-full.webp',
      project2Thumb: '/assets/images/projects/project-2-thumb.webp',
      project2Full: '/assets/images/projects/project-2-full.webp',
      project3Thumb: '/assets/images/projects/project-3-thumb.webp',
      project3Full: '/assets/images/projects/project-3-full.webp',
    },
  },

  videos: {
    heroParticles: '/assets/videos/hero-particles.mp4',
    heroParticlesWebm: '/assets/videos/hero-particles.webm',
  },

  frames: {
    scrollAnimation1: {
      folder: 'scroll-animation-1',
      prefix: 'frame',
      count: 30,
      extension: 'webp' as const,
    },
    scrollAnimation2: {
      folder: 'scroll-animation-2',
      prefix: 'frame',
      count: 30,
      extension: 'webp' as const,
    },
  },

  models: {
    laptop: '/assets/models/laptop.glb',
    particlesSphere: '/assets/models/particles-sphere.glb',
    logo3d: '/assets/models/logo-3d.gltf',
  },

  icons: {
    tech: {
      react: '/assets/icons/tech/react.svg',
      nodejs: '/assets/icons/tech/nodejs.svg',
      typescript: '/assets/icons/tech/typescript.svg',
      astro: '/assets/icons/tech/astro.svg',
      threejs: '/assets/icons/tech/threejs.svg',
      gsap: '/assets/icons/tech/gsap.svg',
      tailwind: '/assets/icons/tech/tailwind.svg',
    },
    ui: {
      arrow: '/assets/icons/ui/arrow.svg',
      close: '/assets/icons/ui/close.svg',
      menu: '/assets/icons/ui/menu.svg',
    },
  },

  patterns: {
    grainNoise: '/assets/patterns/grain-noise.svg',
    subtleDots: '/assets/patterns/subtle-dots.svg',
    lineTexture: '/assets/patterns/line-texture.svg',
  },
} as const;

export type Assets = typeof ASSETS;
export type AssetPath = string;

/**
 * Helper para gerar URL de frame da sequência de animação
 * @param folder - Nome da pasta da sequência
 * @param prefix - Prefixo do arquivo (ex: 'frame')
 * @param index - Índice do frame (começa em 1)
 * @param extension - Extensão do arquivo
 */
export const getFrameUrl = (
  folder: string,
  prefix: string,
  index: number,
  extension: string = 'webp'
): string => {
  const frameNum = String(index).padStart(4, '0');
  return `/assets/frames/${folder}/${prefix}_${frameNum}.${extension}`;
};
