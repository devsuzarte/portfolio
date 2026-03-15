import gsap from 'gsap';

/**
 * Draws an SVG connection web between tech category nodes in Scene 1.
 * Called from heroScroll.ts after scene-1 tech items have animated in.
 */
export const initTechConnections = (wrapper: HTMLElement) => {
  const scene1 = wrapper.querySelector<HTMLElement>('.hero-scene--1');
  if (!scene1) return null;

  const svg = scene1.querySelector<SVGSVGElement>('[data-tech-web]');
  if (!svg) return null;

  return () => {
    const sceneRect = scene1.getBoundingClientRect();
    if (!sceneRect.width) return;

    svg.innerHTML = '';
    svg.setAttribute('viewBox', `0 0 ${sceneRect.width} ${sceneRect.height}`);

    const cats = Array.from(scene1.querySelectorAll<HTMLElement>('.tech-cat'));
    if (cats.length < 2) return;

    const centers = cats.map(cat => {
      const r = cat.getBoundingClientRect();
      return {
        x: r.left - sceneRect.left + r.width  / 2,
        y: r.top  - sceneRect.top  + r.height / 2,
      };
    });

    const drawnPairs = new Set<string>();

    // Each category connects to its 3 nearest neighbours
    centers.forEach((from, i) => {
      const nearest = centers
        .map((to, j) => ({ to, j, d: Math.hypot(to.x - from.x, to.y - from.y) }))
        .filter(({ j }) => j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);

      nearest.forEach(({ to, j }) => {
        const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
        if (drawnPairs.has(key)) return;
        drawnPairs.add(key);

        const dist = Math.hypot(to.x - from.x, to.y - from.y);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(from.x));
        line.setAttribute('y1', String(from.y));
        line.setAttribute('x2', String(to.x));
        line.setAttribute('y2', String(to.y));
        line.setAttribute('stroke', 'rgba(192,120,64,0.22)');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-dasharray', `${dist}`);
        line.setAttribute('stroke-dashoffset', `${dist}`);
        svg.appendChild(line);
      });
    });

    // Node circles at each centre
    centers.forEach(c => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(c.x));
      circle.setAttribute('cy', String(c.y));
      circle.setAttribute('r', '5');
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', 'rgba(192,120,64,0.55)');
      circle.setAttribute('stroke-width', '1.5');
      circle.style.opacity = '0';
      svg.appendChild(circle);
    });

    const lines  = Array.from(svg.querySelectorAll('line'));
    const nodes  = Array.from(svg.querySelectorAll('circle'));

    // Nodes pop in first
    nodes.forEach((n, i) => {
      gsap.to(n, { opacity: 1, duration: 0.35, delay: 0.15 + i * 0.1, ease: 'power2.out' });
    });

    // Lines draw in progressively (scroll-feel via stagger)
    lines.forEach((line, i) => {
      const offset = parseFloat(line.getAttribute('stroke-dashoffset') ?? '0');
      gsap.fromTo(line,
        { strokeDashoffset: offset },
        { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out', delay: 0.3 + i * 0.18 }
      );
    });
  };
};
