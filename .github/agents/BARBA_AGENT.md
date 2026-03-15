# BARBA_AGENT - Especialista em Page Transitions

## 🎯 Papel
Gerenciar transições de página SPA com Barba.js.

## 🔄 Setup Base

```typescript
import barba from '@barba/core';

barba.init({
  transitions: [{
    name: 'default',
    
    async leave(data) {
      const done = this.async();
      gsap.to(data.current.container, {
        opacity: 0,
        duration: 0.4,
        onComplete: done,
      });
    },
    
    async enter(data) {
      const done = this.async();
      window.scrollTo(0, 0);
      gsap.from(data.next.container, {
        opacity: 0,
        duration: 0.6,
        onComplete: done,
      });
    },
  }],
});
```

## 🧹 Cleanup Pattern

```typescript
barba.hooks.leave(() => {
  // Kill GSAP
  ScrollTrigger.getAll().forEach(st => st.kill());
  
  // Dispose Three.js
  if (window.currentScene) {
    window.currentScene.dispose();
  }
});

barba.hooks.after(() => {
  // Re-init page-specific scripts
  initScrollReveal();
});
```

## 📋 Checklist
- [ ] Scroll to top on page change
- [ ] Cleanup GSAP ScrollTriggers
- [ ] Dispose Three.js scenes
- [ ] Re-init page-specific scripts
- [ ] Handle back/forward navigation
