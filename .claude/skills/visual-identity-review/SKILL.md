---
name: visual-identity-review
description: >-
  Procedimento de auditoria e aplicação da identidade visual institucional da
  ANTERO. Use em tarefas de revisão de paleta, mudança de identidade visual,
  auditoria de componentes, refinamento visual, remoção da estética neon/azul,
  análise de consistência visual entre páginas e aplicação da identidade
  institucional. Traz o mapeamento dos pontos de cor do repositório, a
  classificação por função semântica e o roteiro em fases com aprovação.
---

# Revisão de identidade visual — ANTERO

Roteiro para auditar e aplicar a identidade visual do site institucional.

**Leia antes:** `.claude/rules/visual-identity.md` (direção e decisões tomadas),
`.claude/rules/institutional-positioning.md` (posicionamento),
`.claude/rules/frontend-guardrails.md` (invariantes).

---

## Regra central

**Cor não se substitui por tabela de-para. Classifica-se primeiro.**

O azul sai da identidade institucional (decisão registrada em
`visual-identity.md` §1). Mas cada ocorrência de azul cumpre uma função
diferente, e cada função pede uma solução diferente entre **ouro fosco, cinza,
branco ou preto**:

| Função do uso atual | Direção provável | Cuidado |
|---|---|---|
| Fundo de CTA primário | ouro fosco | texto branco sobre ouro tende a reprovar AA → avaliar texto escuro |
| Cor de link em corpo de texto | ouro fosco **ou** branco com sublinhado | link precisa se distinguir do texto por mais que cor |
| Anel/outline de foco | o que garantir contraste — ouro **ou** cinza claro | não pode perder visibilidade; é acessibilidade, não estética |
| Borda/hover sutil | cinza | ouro aqui gasta o "orçamento" de 5% do accent |
| Estado informativo (badge) | cinza neutro | semântica de informação ≠ cor de marca |
| Glow/gradiente decorativo | remover ou neutro | `visual-identity.md` veta glow forte |
| Default de vendor (MUI/Bootstrap) | adaptar à nova identidade | não manter azul por ser "padrão da biblioteca" |
| Uso exclusivo do painel interno | **decidir escopo antes** | pode estar fora do escopo do site institucional |

Se o ouro ficar tecnicamente inadequado em algum estado, **a alternativa é
cinza — nunca manter o azul**.

---

## Processo

### Fase 0 — Decisões humanas pendentes

Antes de auditar, obter resposta para:

1. **Escopo do painel.** `/painel/*` e `/login` entram na nova identidade?
   São `noindex`, rodam sobre mocks e não são vitrine da marca — mas contêm
   azul. `necessita confirmação humana`.
2. **Destino do `starAccent`** (`landingTokens.ts:43`, `#FBBF24`). Analisar
   onde `--dn-star` é de fato consumido e determinar: resquício decorativo
   (→ propor remoção) ou semântica própria como avaliação/classificação
   (→ manter separado do accent, com nome que reflita a semântica).

### Fase 1 — Auditoria, sem editar nenhum arquivo

1. Ler o contexto institucional e visual (as três regras acima).
2. Identificar os sistemas de estilo em uso e como convivem.
3. Localizar a cadeia de tokens e variáveis.
4. Mapear as cores hardcoded.
5. Levantar **todas** as ocorrências da cor a ser substituída.
6. Classificar cada ocorrência por **função semântica** (tabela acima).
7. Medir contraste do estado atual e do estado proposto (WCAG AA).

O §"Mapeamento de referência" abaixo já cobre 3–5 — **reconfira antes de usar**.

### Fase 2 — Proposta de paleta, ainda sem editar

8. Propor os valores da paleta, função por função, com contraste verificado.
   Incluir a decisão sobre cor de texto dos CTAs.
9. Listar todos os arquivos afetados.
10. Apresentar o plano **em fases**, no formato de proposta do `CLAUDE.md`.
11. Aguardar aprovação.

### Fase 3 — Implementação

12. Implementar **somente a fase aprovada**. Uma fase por vez, com relatório e
    nova aprovação entre elas.

Ordem sugerida de implementação:

- **3.1 — Núcleo de tokens.** `src/theme/landingTokens.ts` **e**
  `src/theme/landing-root.css` (o fallback de SSR precisa espelhar os mesmos
  valores, senão a página muda de cor ao hidratar). Alterar aqui propaga para
  todos os consumidores de `--accent-color` de uma vez.
- **3.2 — Erradicar os hardcodes** listados no mapeamento.
- **3.3 — Proporção 95/5.** Reduzir a superfície do accent. É redesign de
  tratamento visual (provavelmente dos CTAs sólidos), não troca de cor.
- **3.4 — Painel e login**, apenas se a Fase 0 tiver incluído no escopo.

### Fase 4 — Validação e registro

13. Conferir visualmente em **desktop e mobile**.
14. Rodar os scripts que de fato existem: `npm run lint` e `npm run build`
    (o build faz a checagem de tipos). **Não há script de teste nem de
    typecheck dedicado neste projeto.**
15. Documentar cores antigas e novas, com a função semântica de cada uma.
16. Relatar limitações e o que ficou dependendo de análise humana.

---

## Mapeamento de referência

> **Levantamento de 18/07/2026.** Números e linhas envelhecem — **reconferir
> com os comandos do fim desta seção antes de usar como base de plano.**

### Cadeia de tokens

```
src/theme/landingTokens.ts     ← fonte única (accent: '#2563EB', linha 8)
  → src/theme/landingCssVars.ts  (gera --dn-*; accent vira --dn-secondary)
  → src/theme/ThemeRegistry.tsx  (injeta em :root e mapeia --accent-color legado)
  → src/theme/landing-root.css   (fallback SSR; espelha os valores)
src/theme/index.ts               (tema MUI: palette.primary.main = accent)
```

### Alcance do accent

- `var(--dn-secondary)` — **18 ocorrências** em `src/`.
- `--accent-color` (var legada do template, alimentada pelo `--dn-secondary`) —
  **~173 ocorrências** em `src/assets/css/main.css` (4.243 linhas).
- Bootstrap: `--bs-primary`, `--bs-primary-rgb`, `--bs-link-color`,
  `--bs-link-hover-color` em `landing-root.css:76-80`.

**Consequência:** trocar o token propaga a cor nova para os mesmos ~173 pontos.
Isso muda a cor, **não** a proporção 95/5 — daí a fase 3.3 existir separada.

### Hardcodes fora do sistema de tokens

Site institucional — `src/theme/landing.module.css`:

| Linha | Valor | Função |
|---|---|---|
| 171 | `linear-gradient(135deg, #2563eb, #1e40af)` | CTA do header |
| 270 | idem | CTA primário do hero |
| 541 | idem | botão do ribbon/CTA intermediário |
| 661 | idem | submit do formulário de contato |
| 278, 549, 669 | `rgba(30, 64, 175, …)` | sombras dos CTAs acima |

Painel e autenticação — **escopo a definir na Fase 0**:

`(painel)/painel/page.tsx:42` · `projetos/page.tsx:55,80` ·
`clientes/page.tsx:61` (`bgcolor: '#2563EB'`) ·
`features/auth/components/LoginForm.tsx:123,127,149` (botão, disabled, borda de
foco) · `UserMenu.tsx:68,72` · `LoginCard.tsx:28` (glow radial) ·
`features/painel/components/StatusBadge.tsx:9` (estado `info`) ·
`features/painel/layout/Sidebar.tsx:96,98,105` (item ativo).

### Pontos sensíveis de acessibilidade

- `landing.module.css:76` e `:809` — `outline: 2px solid var(--dn-secondary)`.
  São **anéis de foco**. Perder contraste aqui é falha de acessibilidade, não
  questão estética.
- Os quatro CTAs usam texto branco (`--dn-nav-icon`) sobre o accent.

### Fora do build, mas com azul guardado

`src/components/hero/HeroCinematic.tsx` + `hero-cinematic.module.css:76`
(`rgba(37, 99, 235, 0.16)`). Desativado e excluído via `tsconfig.json`. Não
quebra nada hoje; **reaparece na reativação** — tratar lá, não agora.

### Achado incidental

`src/app/page.module.css` referencia `var(--dn-secondary)` mas **não é
importado por nenhum arquivo**, e não existe `src/app/page.tsx` (a landing é
`(site)/page.tsx`). *Inferência:* resíduo do `create-next-app`. Não listado
entre os resíduos de `docs/TECHNICAL_OVERVIEW.md` §7.
`necessita confirmação humana` — não remover por iniciativa própria.

### Como regenerar este mapeamento

```bash
grep -rniE "2563eb|1e40af|37, ?99, ?235|30, ?64, ?175" src --exclude-dir=assets
grep -rn "var(--dn-secondary)" src --exclude-dir=assets
grep -c "accent-color" src/assets/css/main.css
grep -rn "var(--dn-star)" src --exclude-dir=assets
```

---

## Limites desta skill

- **Não altera arquivo nas fases 0 a 2.** Auditoria e proposta são leitura.
- **Não decide sozinha** o escopo do painel nem o destino do `starAccent`.
- **Não amplia escopo:** encontrar um problema adjacente durante a execução
  gera relatório e nova tarefa, não correção de passagem (`CLAUDE.md` §Regras 2).
- **Não toca em conteúdo, heading, metadata ou JSON-LD** — tarefa visual é
  visual (`frontend-guardrails.md` §3).
