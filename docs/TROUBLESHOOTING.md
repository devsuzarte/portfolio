# Troubleshooting Guide

## 🐛 Problemas Comuns

### 1. GSAP não funciona
**Sintoma:** Animações não executam
**Solução:**
```typescript
// Verificar se plugins estão registrados
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

### 2. Three.js cena preta
**Sintoma:** Canvas renderiza vazio
**Solução:**
```typescript
// Verificar posição da camera
this.camera.position.z = 5;

// Verificar se objetos foram adicionados à scene
this.scene.add(mesh);
```

### 3. Barba não detecta páginas
**Sintoma:** Page transition não funciona
**Solução:**
```astro
<!-- Verificar data-barba="container" -->
<div data-barba="wrapper">
  <div data-barba="container">
    <!-- content -->
  </div>
</div>
```

### 4. Performance ruim
**Sintoma:** Animações travando, FPS baixo
**Solução:**
```typescript
// Verificar se está animando propriedades corretas
// ✅ transform, opacity
// ❌ width, height, top, left

// Verificar se está fazendo cleanup
window.addEventListener('barba:leave', () => {
  ScrollTrigger.getAll().forEach(st => st.kill());
});
```

### 5. TypeScript errors
**Sintoma:** Build falha com type errors
**Solução:**
```bash
# Limpar cache
rm -rf node_modules .astro
npm install

# Verificar tsconfig.json
npx tsc --noEmit
```

### 6. Build falha
**Sintoma:** npm run build retorna erro
**Solução:**
```bash
# 1. Limpar tudo
rm -rf node_modules package-lock.json dist .astro

# 2. Reinstalar
npm install

# 3. Type check
npm run type-check

# 4. Build
npm run build
```

### 7. Barba + GSAP conflito
**Sintoma:** Animações duplicadas ou não limpam
**Solução:**
```typescript
barba.hooks.leave(() => {
  // Sempre fazer cleanup
  ScrollTrigger.getAll().forEach(st => st.kill());
  gsap.globalTimeline.clear();
});

barba.hooks.after(() => {
  // Re-init animações
  initScrollReveal();
});
```

### 8. Three.js memory leak
**Sintoma:** Uso de memória aumenta a cada page change
**Solução:**
```typescript
class Scene {
  dispose() {
    // Dispose geometries
    // Dispose materials  
    // Dispose textures
    this.renderer.dispose();
  }
}

// Call on page leave
window.addEventListener('barba:leave', () => {
  scene.dispose();
});
```

## 📞 Suporte
- GitHub Issues: https://github.com/devsuzarte/portfolio/issues
- Consultar agentes em `.github/agents/`
- Documentação em `/docs`
