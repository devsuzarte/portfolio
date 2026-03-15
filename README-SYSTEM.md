# 📚 Sistema Completo de Documentação e Agentes IA

**Portfolio Juan Benjamin Almeida Suzarte**

---

## 🗂️ Estrutura de Organização

Este sistema organiza o projeto em **3 camadas principais**:

```
portfolio-juan-benjamin/
├── .clauderules              # Regras globais para Claude
├── .github/agents/           # Agentes especializados IA
│   ├── COORDINATOR.md
│   ├── DESIGN_SYSTEM_AGENT.md
│   ├── ANIMATION_AGENT.md
│   ├── PERFORMANCE_AGENT.md
│   ├── THREEJS_AGENT.md
│   ├── BARBA_AGENT.md
│   ├── ASTRO_AGENT.md
│   └── CODE_QUALITY_AGENT.md
└── docs/                     # Documentação técnica
    ├── PROJECT_OVERVIEW.md
    ├── CONTRIBUTING.md
    ├── TROUBLESHOOTING.md
    ├── 01-DESIGN-SYSTEM.md
    ├── 02-ARCHITECTURE.md
    ├── 03-GSAP-ANIMATIONS.md
    ├── 04-THREEJS-GUIDE.md
    ├── 05-CONTENT-STRUCTURE.md
    ├── 06-DEPLOYMENT-PERFORMANCE.md
    └── 07-QUICK-START.md
```

---

## 📖 Como Usar Este Sistema

### 1️⃣ Para Claude/IA (Prompts Eficientes)

Quando fizer um prompt, Claude automaticamente:

1. **Lê `.clauderules`** - Contexto global do projeto
2. **Consulta agente apropriado** em `.github/agents/`
3. **Referencia docs** em `docs/` quando necessário
4. **Responde seguindo padrões** do projeto

**Exemplo de prompt:**
```
"Criar hero section com animação de entrada e partículas 3D"
```

**Claude irá:**
1. Consultar `COORDINATOR.md` → identifica que precisa de 3 agentes
2. Ler `DESIGN_SYSTEM_AGENT.md` → define tema coffee (dark/light/warm)
3. Ler `ANIMATION_AGENT.md` → padrão de entrance animation
4. Ler `THREEJS_AGENT.md` → particle system
5. Ler `03-GSAP-ANIMATIONS.md` → implementação GSAP
6. Ler `04-THREEJS-GUIDE.md` → implementação Three.js
7. **Responder com código completo, tipado, otimizado**

---

### 2️⃣ Para Desenvolvedores (Referência)

#### Início Rápido:
1. Ler `docs/07-QUICK-START.md` → Setup em 15min
2. Ler `docs/PROJECT_OVERVIEW.md` → Entender projeto
3. Ler `docs/CONTRIBUTING.md` → Como contribuir

#### Durante Desenvolvimento:
- **Design?** → `docs/01-DESIGN-SYSTEM.md`
- **Animações?** → `docs/03-GSAP-ANIMATIONS.md`
- **3D?** → `docs/04-THREEJS-GUIDE.md`
- **Performance?** → `docs/06-DEPLOYMENT-PERFORMANCE.md`
- **Problemas?** → `docs/TROUBLESHOOTING.md`

---

## 🤖 Sistema de Agentes IA

### COORDINATOR.md
**Papel:** Orquestrador principal
**Quando usar:** Sempre (ponto de entrada)
**Responsável por:**
- Analisar requisição
- Delegar para agentes especializados
- Validar qualidade final

### DESIGN_SYSTEM_AGENT.md
**Papel:** UI/UX e consistência visual
**Quando usar:** Componentes, cores, typography, layout
**Responsável por:**
- Paleta coffee (dark/light/warm)
- Typography scale
- Componentes UI
- Acessibilidade
- Responsive design

### ANIMATION_AGENT.md
**Papel:** Motion design e performance
**Quando usar:** Qualquer animação
**Responsável por:**
- Animações de entrada
- Scroll effects
- Page transitions
- 60fps guarantee
- Reduced motion

### PERFORMANCE_AGENT.md
**Papel:** Otimização e métricas
**Quando usar:** Deploy, otimização, debugging
**Responsável por:**
- Lighthouse > 95
- Bundle size < 300KB
- Image optimization
- Code splitting
- Web Vitals

### THREEJS_AGENT.md
**Papel:** Cenas 3D e WebGL
**Quando usar:** Elementos 3D, particles, shaders
**Responsável por:**
- Scene management
- Particle systems
- Shader materials
- Dispose/cleanup
- Mobile optimization

### BARBA_AGENT.md
**Papel:** Page transitions SPA
**Quando usar:** Navegação entre páginas
**Responsável por:**
- Barba.js setup
- Transition patterns
- Cleanup GSAP/Three.js
- Scroll reset

### ASTRO_AGENT.md
**Papel:** Framework Astro
**Quando usar:** Components, Content Collections, SSG
**Responsável por:**
- Astro components
- Content Collections
- SSG optimization
- Build config

### CODE_QUALITY_AGENT.md
**Papel:** Qualidade e padrões
**Quando usar:** Code review, refactoring
**Responsável por:**
- TypeScript strict
- Naming conventions
- Documentation
- ESLint/Prettier

---

## 📚 Documentação Técnica

### Core Guides (em `docs/`):

| Arquivo | Conteúdo | Quando Ler |
|---------|----------|------------|
| `01-DESIGN-SYSTEM.md` | 6 paletas, typography, componentes, efeitos visuais | Sempre antes de criar UI |
| `02-ARCHITECTURE.md` | Estrutura Astro + Barba + GSAP + Three.js | Entender arquitetura |
| `03-GSAP-ANIMATIONS.md` | Setup GSAP, ScrollTrigger, patterns, cleanup | Implementar animações |
| `04-THREEJS-GUIDE.md` | Scenes, particles, shaders, optimization | Adicionar 3D |
| `05-CONTENT-STRUCTURE.md` | Content Collections, schemas, queries | Gerenciar conteúdo |
| `06-DEPLOYMENT-PERFORMANCE.md` | Vercel, optimization, CI/CD, PWA | Deploy e otimização |
| `07-QUICK-START.md` | Setup 0 a deploy em 15min | Começar projeto |

### Guides de Projeto:

| Arquivo | Propósito |
|---------|-----------|
| `PROJECT_OVERVIEW.md` | Visão geral do projeto |
| `CONTRIBUTING.md` | Como contribuir |
| `TROUBLESHOOTING.md` | Resolver problemas comuns |

---

## 🎯 Fluxo de Trabalho Ideal

### Caso de Uso 1: "Criar novo componente"

```
1. Developer pensa: "Preciso criar um Card component"
2. Prompt para Claude: "Criar Card component com variantes dark e light"
3. Claude:
   ├─ Lê .clauderules (contexto global)
   ├─ Consulta COORDINATOR.md (identifica: Design System)
   ├─ Lê DESIGN_SYSTEM_AGENT.md (paletas, patterns)
   ├─ Referencia docs/01-DESIGN-SYSTEM.md (exemplos)
   └─ Responde com:
      ├─ Código TypeScript completo
      ├─ Props interface
      ├─ Variantes de tema
      ├─ Styles SCSS
      └─ Exemplo de uso
```

### Caso de Uso 2: "Otimizar performance"

```
1. Developer: "Site está lento, Lighthouse 78"
2. Prompt: "Analisar e otimizar performance"
3. Claude:
   ├─ Lê .clauderules
   ├─ Consulta COORDINATOR.md → PERFORMANCE_AGENT
   ├─ Lê PERFORMANCE_AGENT.md (targets, checklist)
   ├─ Referencia docs/06-DEPLOYMENT-PERFORMANCE.md
   └─ Responde com:
      ├─ Análise de problemas
      ├─ Image optimization script
      ├─ Code splitting config
      ├─ Bundle analysis
      └─ Lighthouse > 95 garantido
```

### Caso de Uso 3: "Hero com animação e 3D"

```
1. Developer: "Hero section com texto animado e partículas 3D"
2. Claude:
   ├─ Lê .clauderules
   ├─ Consulta COORDINATOR.md (complexo, 4 agentes)
   ├─ Lê DESIGN_SYSTEM (tema coffee/dark)
   ├─ Lê ANIMATION_AGENT (entrance pattern)
   ├─ Lê THREEJS_AGENT (particle system)
   ├─ Lê BARBA_AGENT (cleanup)
   ├─ Referencia docs/03-GSAP e docs/04-THREEJS
   └─ Responde com:
      ├─ Astro component completo
      ├─ GSAP timeline (SplitText)
      ├─ Three.js particle scene
      ├─ Cleanup em barba:leave
      ├─ Performance otimizada
      └─ Mobile adaptive
```

---

## 💡 Vantagens deste Sistema

### ✅ Para Claude/IA:
- **Contexto completo** sempre disponível
- **Decisões consistentes** baseadas em agentes
- **Qualidade garantida** via checklists
- **Zero ambiguidade** - padrões claros

### ✅ Para Desenvolvedores:
- **Onboarding rápido** - Quick Start 15min
- **Referência organizada** - Tudo em docs/
- **Troubleshooting eficiente** - Problemas comuns documentados
- **Contribuição fácil** - Guia de contribuição claro

### ✅ Para o Projeto:
- **Consistência** - Design system único
- **Performance** - Targets e otimizações definidos
- **Escalabilidade** - Arquitetura bem documentada
- **Manutenibilidade** - Código limpo e tipado

---

## 🚀 Começar Agora

### Setup Inicial (15min):

```bash
# 1. Clone o repositório
git clone https://github.com/devsuzarte/portfolio-juan-benjamin

# 2. Instalar dependências
cd portfolio-juan-benjamin
npm install

# 3. Iniciar dev server
npm run dev

# 4. Abrir no navegador
# http://localhost:4321
```

### Primeiro Prompt para Claude:

```
"Seguindo o sistema de agentes, criar a homepage com:
- Hero section tema dark (espresso/cream/caramel)
- Line reveal no título com SplitText
- Partículas 3D de fundo (coffee warm palette)
- Smooth scroll
- Performance > 95"
```

Claude irá orquestrar todos os agentes e entregar código production-ready!

---

## 📞 Suporte

- **Documentação:** `/docs`
- **Agentes:** `.github/agents/`
- **Issues:** GitHub Issues
- **Troubleshooting:** `docs/TROUBLESHOOTING.md`

---

**Este sistema garante que cada prompt gere código de alta qualidade, consistente e otimizado! 🎯**
