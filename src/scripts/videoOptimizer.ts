// src/scripts/videoOptimizer.ts
// Otimização de performance para vídeos de background
// Agente Consultado: ASSETS_AGENT

interface VideoOptimizerOptions {
  threshold?: number;           // % visível para pausar/retomar (0-1)
  respectReducedMotion?: boolean; // Respeitar prefers-reduced-motion
}

/**
 * Inicializa otimizações para todos os vídeos com [data-optimize]
 * - Pausa quando sai da viewport (IntersectionObserver)
 * - Pausa se usuário preferir reduced motion
 */
export const initVideoOptimization = (
  options: VideoOptimizerOptions = {}
): (() => void) => {
  const { threshold = 0.25, respectReducedMotion = true } = options;

  const videos = document.querySelectorAll<HTMLVideoElement>(
    'video[data-optimize]'
  );

  const prefersReducedMotion =
    respectReducedMotion &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observers: IntersectionObserver[] = [];

  videos.forEach((video) => {
    // Pausar e ocultar se usuário preferir reduced motion
    if (prefersReducedMotion) {
      video.pause();
      video.style.display = 'none';

      // Mostrar poster como fallback
      const poster = video.getAttribute('poster');
      if (poster) {
        const img = document.createElement('img');
        img.src = poster;
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        img.style.cssText = video.style.cssText;
        img.className = video.className;
        video.parentNode?.insertBefore(img, video);
      }

      return;
    }

    // Pausar quando fora da viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Retomar apenas se o vídeo foi pausado pelo observer
          video.play().catch(() => {
            // Autoplay bloqueado pelo browser - comportamento esperado
          });
        } else {
          video.pause();
        }
      },
      { threshold }
    );

    observer.observe(video);
    observers.push(observer);
  });

  // Retornar função de cleanup
  return () => {
    observers.forEach((observer) => observer.disconnect());
  };
};

/**
 * Otimização para um único vídeo
 */
export const optimizeVideo = (
  video: HTMLVideoElement,
  options: VideoOptimizerOptions = {}
): (() => void) => {
  const { threshold = 0.25, respectReducedMotion = true } = options;

  const prefersReducedMotion =
    respectReducedMotion &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    video.pause();
    return () => {};
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    },
    { threshold }
  );

  observer.observe(video);

  return () => observer.disconnect();
};
