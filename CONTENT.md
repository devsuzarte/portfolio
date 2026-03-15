# Guia de Conteúdo — Portfolio

Preencha este arquivo com suas informações reais e siga as instruções para atualizar cada parte do site.

---

## 1. Identidade & Links Globais

Esses dados aparecem no **Hero**, **Header**, **Footer** e **Contact**.

| Campo | Valor atual (placeholder) | Onde alterar |
|---|---|---|
| Primeiro nome | `Benjamin` | `src/components/sections/Hero.astro` linha ~113 |
| Sobrenome | `Suzarte` | `src/components/sections/Hero.astro` linha ~114 |
| Título/cargo | `Full Stack Developer` | `src/components/sections/Hero.astro` linha ~110 |
| Email | `devsuzarte@gmail.com` | `src/components/sections/Hero.astro` + `src/components/sections/Contact.astro` |
| GitHub URL | `https://github.com/devsuzarte` | `src/components/sections/Hero.astro` + `src/components/navigation/Header.astro` + `src/components/navigation/Footer.astro` + `src/components/sections/Contact.astro` |
| GitHub username (exibido) | `devsuzarte` | `src/components/sections/Hero.astro` linha ~122 |
| LinkedIn URL | `https://linkedin.com/in/benjamin-suzarte` | mesmos arquivos acima |
| LinkedIn nome exibido | `Benjamin Suzarte` | `src/components/sections/Hero.astro` linha ~128 |

**Preencha aqui:**
```
Primeiro nome: Juan Benjamin
Sobrenome: Almeida Suzarte
Cargo/título: Dev FullStack + DevOps
Email: devsuzarte@gmail.com
GitHub URL:      https://github.com/devsuzarte
GitHub username:
LinkedIn URL:    https://linkedin.com/in/benjamin-suzarte
LinkedIn nome: Juan Benjamin Almeida Suzarte
```

---

## 2. Hero — Terminal (Scene 0)

O terminal animado no hero exibe um objeto TypeScript. Altere em `src/components/sections/Hero.astro` (linhas ~155-162):

```typescript
const dev = {
  name:   'Benjamin Suzarte',   // ← seu nome completo
  alias:  'devsuzarte',         // ← seu username/handle
  role:   'Full Stack Developer', // ← seu cargo
  stack:  [
    'React', 'TypeScript', 'Nest.js', "Langchain"    // ← suas principais tecnologias (máx. 4)
  ],
  status: 'disponível'          // ← 'disponível' | 'ocupado' | 'aberto para freelas'
}
```

**Preencha aqui:**
```
name: Benjamin Suzarte
alias: devsuzarte
english: true
role: Fullstack Developer
stack:  [ React, NestJS,  Google Cloud Platform, LangChain ]
status: disponível
```

---

## 3. Hero — Subtítulo (Scene 0)

Frase de impacto abaixo do nome. Altere em `src/components/sections/Hero.astro` (linhas ~116-119):

> Atual: "Construo interfaces performáticas e APIs robustas. Código limpo, animações sofisticadas, entrega real."

**Sua versão:**
Aqui pode dar uma melhorada no texto, mas capture esta essencia
```
Desenvolvo do design ao deploy sempre priorizando as preferências do cliente, com eficiência de Inteligências Artificiais e foco no resultado e prazos.
```

---

## 4. Sobre Mim

Arquivo: `src/components/sections/About.astro`

### Título da seção
> Atual: "Desenvolvedor apaixonado por código limpo e UX refinada."

```
Seu título:
```

### Bio (2 parágrafos)
> Atual: "Sou Benjamin Suzarte, desenvolvedor full stack com mais de 5 anos..."

Melhore esses parágrafos 
```
Parágrafo 1: +4 Anos no mercado, sólido desenvolvedor Pleno que atua no setor de desenvolvimento e educação como professor particular e busco evoluir com no conhecimento



Parágrafo 2: Sou basntante apegado a progagmação, levo como trabalho e como hobbie também, além de tocar violão, cantar e andar de bicileta


```

### Números de destaque
| Stat | Atual | Seu valor |
|---|---|---|
| Anos de experiência | `5+` | |
| Projetos entregues | `30+` | |
| Terceiro stat (label) | `Comprometimento` | |
| Terceiro stat (número) | `100%` | |

### Foto
- Adicione sua foto em `public/assets/images/` (ex: `foto.jpg`)
- Em `About.astro`, substitua o bloco `.about__photo-placeholder` por:
```html
<img src="/assets/images/foto.jpg" alt="Sua descrição" class="about__photo" />
```

---

## 5. Experiência Profissional

Arquivos em `src/content/experience/` — formato YAML.

Cada experiência é um arquivo `.yaml`. Renomeie ou crie novos conforme necessário.

### Estrutura de cada arquivo:
```yaml
company:     "EcoX Consultoria"
position:    "Desenvolvedor FullStack"
location:    "Feira de Santana, Bahia" # ou "Remoto"
type:        "freelance"      # full-time | part-time | contract | freelance
startDate:   "2023-01"        # formato YYYY-MM
endDate:     ""        # omita se current: true
current:     true            # true = emprego atual
description: "Trabalhei atuando como desenvoldor, Wordpress criando a landing page do site, agora após algum tempo reformulei o site para uma nova cara e adicionei sistemas integrados para o cliente de análise de métricas e intergração com IA."
achievements:
  - "Resultado concreto 1 — use números sempre que possível"
  - "Resultado concreto 2"
  - "Resultado concreto 3"
technologies: ["React", "Node.js", "TypeScript"]
companyUrl: "https://empresa.com"  # opcional
```

### Suas experiências (preencha e crie os arquivos):

Faça as memas coisas, saiba que eu trabalhei na Horizon, Salvador - Bahia. Onde tive meu primeiro estágio e me desenvolvi bastante como profissional nas softskills e fui iniciado no mundo de IA. Desenvolvimento com Maker, Banco de Dados, SQLServer e gerenciamento de sistema de saúde (produto principal da empresa é o Health+) em 2025.03 até 2025.05

Também trabalho atualmente na Ford iniciei em 2025.05 e estou até.
Aqui é onde estou mais me desenvolvendo e utilizando o máximo de tecnologias
GCP
Cloud Run
Cloud Storage
Cloud Scheduler
Terraform
Tekton
Github Actions
n8n
Inteligencia Artificial
React
Claude Sonnet
HuggingFace
LangChain
LangGraph
TimeScale
Segurança de Alto Nível
Apigee
Azure Entra ID
Azure Portal
Desenvolvi mais de 4 projetos em menos de 1 ano dentro da Ford, gerenciamento de equipe, estrutura de projetos em larga escala e usuabilidade.
---
**Experiência 1 (mais recente / atual)** — arquivo: `src/content/experience/exp-1.yaml`
```
company:
position:
location:
type:
startDate:
endDate:
current:
description:
achievements:
  -
  -
  -
technologies: []
companyUrl:
```

---
**Experiência 2** — arquivo: `src/content/experience/exp-2.yaml`
```
company:
position:
location:
type:
startDate:
endDate:
current:     false
description:
achievements:
  -
  -
  -
technologies: []
```

*(adicione mais arquivos para mais experiências)*

---

## 6. Projetos

ecoxconsultoria.com


Arquivos em `src/content/projects/` — formato Markdown com frontmatter.

Cada projeto é um arquivo `.md`. O `slug` é o nome do arquivo.

> **Importante:** Como os projetos agora são links externos (sem página de detalhe), preencha `demo` com a URL do projeto ao vivo, ou `github` com o repositório. O botão "Ver Projeto" vai redirecionar para esse link.

### Estrutura:
```markdown
---
title:       "Nome do Projeto"
description: "Descrição curta — aparece no card (máx. 2 linhas)"
thumbnail:   "/assets/images/projects/projeto.jpg"  # imagem local ou URL externa
tags:        ["Tag 1", "Tag 2", "Tag 3"]
tech:        ["React", "Node.js", "TypeScript"]     # stack usada
github:      "https://github.com/seu-user/repo"     # opcional
demo:        "https://projeto-ao-vivo.com"          # URL de redirect do botão principal
featured:    true           # true = aparece em destaque (grande), false = grid menor
status:      "completed"    # completed | in-progress | archived
category:    "fullstack"    # web | mobile | fullstack | backend | frontend
startDate:   2024-01-01
pubDate:     2024-06-01
theme:       "dark"         # dark | light | warm
---

(conteúdo markdown aqui — não é exibido na homepage, pode deixar em branco)
```

### Seus projetos:

---
**Projeto 1 (featured)** — arquivo: `src/content/projects/projeto-1.md`
```
title:
description:
thumbnail:
tags:        []
tech:        []
github:
demo:
featured:    true
status:      completed
category:    fullstack
startDate:
pubDate:
```

---
**Projeto 2 (featured)** — arquivo: `src/content/projects/projeto-2.md`
```
title:
description:
thumbnail:
tags:        []
tech:        []
github:
demo:
featured:    true
status:      completed
category:
startDate:
pubDate:
```

---
**Projeto 3 (grid)** — arquivo: `src/content/projects/projeto-3.md`
```
title:
description:
thumbnail:
tags:        []
tech:        []
github:
demo:
featured:    false
status:      completed
category:
startDate:
pubDate:
```

*(adicione mais arquivos `.md` para mais projetos)*

### Imagens dos projetos
- Coloque as imagens em `public/assets/images/projects/`
- Use `thumbnail: "/assets/images/projects/nome.jpg"` no frontmatter
- Tamanho recomendado: **800×450px** (proporção 16:9)

---

## 7. Skills

Arquivos em `src/content/skills/` — formato YAML.

Cada skill é um arquivo `.yaml`. Renomeie/crie conforme necessário.

### Estrutura:
```yaml
name:              "React"
category:          "frontend"   # frontend | backend | database | devops | tools | soft-skills
proficiency:       95           # 0–100 (exibido como barra de progresso)
yearsOfExperience: 5            # anos (exibido ao lado da barra)
```

### Categorias disponíveis:
- `frontend` — React, Vue, Angular, CSS, etc.
- `backend` — Node.js, Python, Java, etc.
- `database` — PostgreSQL, MongoDB, Redis, etc.
- `devops` — Docker, AWS, CI/CD, etc.
- `tools` — Git, Figma, VS Code, etc.
- `soft-skills` — Comunicação, Liderança, etc. *(não exibido por padrão na seção Skills)*

Pegue minhas skills de acordo com o que escrevi nos textos
### Suas skills (edite/adicione arquivos em `src/content/skills/`):
```
# Exemplo: src/content/skills/react.yaml
name:              "React"
category:          "frontend"
proficiency:
yearsOfExperience:

# src/content/skills/nodejs.yaml
name:              "Node.js"
category:          "backend"
proficiency:
yearsOfExperience:
```

---

## 8. Contato

Arquivo: `src/components/sections/Contact.astro` (linhas 2-7)

```javascript
const email = 'devsuzarte@gmail.com';       // ← seu email
const socialLinks = [
  { label: 'GitHub',   href: 'https://github.com/devsuzarte',     icon: '↗' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/benjamin-suzarte', icon: '↗' },
];
```

---

## 9. Meta / SEO

Arquivo: `src/pages/index.astro` (linhas ~9-11)

```astro
title="Benjamin Suzarte — Full Stack Developer"
description="Portfolio de Benjamin Suzarte, desenvolvedor full stack..."
```

---

## 10. Imagens — Checklist

| Item | Caminho | Status |
|---|---|---|
| Foto pessoal (About) | `public/assets/images/foto.jpg` | ⬜ |
| Projeto 1 thumbnail | `public/assets/images/projects/projeto-1.jpg` | ⬜ |
| Projeto 2 thumbnail | `public/assets/images/projects/projeto-2.jpg` | ⬜ |
| Projeto 3 thumbnail | `public/assets/images/projects/projeto-3.jpg` | ⬜ |
| Favicon | `public/favicon.svg` | ⬜ |

---

## 11. Checklist Final

- [ ] Links sociais atualizados (GitHub, LinkedIn, email) em todos os arquivos
- [ ] Nome e cargo no Hero
- [ ] Subtítulo/bio do Hero
- [ ] Seção About atualizada (bio + foto + stats)
- [ ] Experiências preenchidas em `src/content/experience/`
- [ ] Projetos preenchidos em `src/content/projects/` com `demo` ou `github`
- [ ] Skills atualizadas em `src/content/skills/`
- [ ] Imagens adicionadas em `public/assets/images/`
- [ ] Meta title e description em `src/pages/index.astro`
- [ ] Rodapé com nome correto em `src/components/navigation/Footer.astro`
- [ ] Testar build: `npm run build`
- [ ] Testar local: `npm run dev`
