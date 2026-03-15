# CODE_QUALITY_AGENT - Especialista em Qualidade

## 🎯 Papel
Garantir código TypeScript limpo, tipado e manutenível.

## 📏 TypeScript Strict

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
  }
}
```

## 🎨 Naming Conventions

```typescript
// Components: PascalCase
const MyComponent: FC = () => {};

// Functions: camelCase
const handleClick = () => {};

// Constants: UPPER_SNAKE_CASE
const API_ENDPOINT = 'https://api.example.com';

// Types: PascalCase
interface UserProfile {}
type ButtonVariant = 'primary' | 'secondary';
```

## 📝 Documentation

```typescript
/**
 * Initializes hero animation with entrance effects
 * @param container - Hero section DOM element
 * @returns GSAP timeline instance
 */
export const initHeroAnimation = (
  container: HTMLElement
): gsap.core.Timeline => {
  // Implementation
};
```

## ✅ Code Review Checklist

- [ ] TypeScript tipos explícitos (no `any`)
- [ ] ESLint sem warnings
- [ ] Prettier formatado
- [ ] Variáveis/funções com nomes descritivos
- [ ] Comentários em lógica complexa
- [ ] No console.log em produção
- [ ] Error handling implementado
- [ ] Funções < 50 linhas
- [ ] DRY (Don't Repeat Yourself)
- [ ] Imports organizados (absolute paths)
