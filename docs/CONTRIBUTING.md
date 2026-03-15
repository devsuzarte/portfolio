# Contributing Guide - Portfolio Juan Benjamin

## 🚀 Como Contribuir

### 1. Setup do Projeto
```bash
git clone https://github.com/devsuzarte/portfolio-juan-benjamin
cd portfolio-juan-benjamin
npm install
npm run dev
```

### 2. Commit Convention
```
feat(animations): add hero entrance animation
fix(three): dispose scene on unmount
docs(readme): update installation steps
perf(images): optimize hero background
```

### 3. Checklist PR
- [ ] TypeScript strict (sem `any`)
- [ ] Performance mantida (Lighthouse > 95)
- [ ] Animações 60fps
- [ ] Cleanup implementado
- [ ] Acessibilidade (ARIA)
- [ ] Responsivo

## 📚 Consultar Agentes
Antes de implementar, leia o agente apropriado em `.github/agents/`:
- Design → DESIGN_SYSTEM_AGENT.md
- Animações → ANIMATION_AGENT.md
- Three.js → THREEJS_AGENT.md
- Performance → PERFORMANCE_AGENT.md
