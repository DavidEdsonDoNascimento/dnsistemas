---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "src/**/*.css"
  - "public/**"
---

# Invariantes de frontend, conteúdo e assets

O que não pode quebrar quando se mexe em código de interface neste repositório.
Complementa `CLAUDE.md` (processo) e `.claude/rules/visual-identity.md`
(direção visual).

---

## 1. Qualidade — preservar sempre

- **Responsividade** nos principais tamanhos de tela. Conferir desktop **e**
  mobile, não só um.
- **Acessibilidade.** As seções da landing já têm `id` + `aria-labelledby`
  aplicados deliberadamente — não remover.
- **Estados de foco visíveis.** `:focus-visible` está em uso em
  `landing.module.css`, `FloatingWhatsAppButton.module.css` e
  `ScrollToTopButton.module.css`. Nunca zerar `outline` sem repor indicador
  equivalente.
- **Navegação por teclado** — ordem de tabulação e alcance de todos os controles.
- **Contraste** em conformidade com **WCAG AA**, inclusive nos estados hover,
  foco, desabilitado e sobre gradiente.
- **`prefers-reduced-motion`.** Já respeitado em `ScrollToTopButton` e no
  `HeroCinematic` (desativado). Toda animação nova precisa ter versão reduzida.
- **Performance.** Nada de efeito custoso em scroll ou animação contínua de
  propriedade que force layout.
- **Consistência entre componentes.** Mesma função visual → mesmo tratamento.

## 2. Restrições técnicas

- **Não instalar dependência para produzir efeito visual.** Nem para animação,
  nem para gradiente, nem para partícula.
- **Não introduzir** canvas, sistema de partículas, biblioteca de animação ou
  novo sistema de estilo sem tarefa específica aprovada.
- **Não unificar MUI/Emotion e Bootstrap.** Convivem por decisão; migrar é
  tarefa própria e grande (`docs/TECHNICAL_OVERVIEW.md` §7.3).
- **React Compiler está ativado.** Não adicionar `useMemo`/`useCallback` "por
  otimização" — a memoização é automática.
- **Editar `src/assets/scss/` não produz efeito nenhum.** Não há `sass` no
  projeto; vale o CSS já compilado e os arquivos de `src/theme/`.
- **`src/assets/css/main.css` tem 4.243 linhas e é global.** Prefira CSS Modules
  ou tokens em `src/theme/` a editar esse arquivo.

## 3. Conteúdo e SEO — em tarefa exclusivamente visual

Tarefa visual mexe em aparência. Não mexe em conteúdo. Nesses casos, **não**:

- alterar textos;
- alterar headings ou sua hierarquia;
- alterar metadata (`src/app/layout.tsx`);
- alterar o JSON-LD de `Organization`;
- alterar URLs, âncoras ou `id` de seção;
- remover conteúdo indexável;
- transformar texto relevante em imagem;
- alterar estrutura sem analisar o impacto em SEO;
- modificar chamadas institucionais.

`src/app/(site)/page.tsx` concentra SEO, JSON-LD e todas as seções — mudança ali
afeta busca orgânica diretamente. Se um refinamento visual **exigir** mudança de
conteúdo, isso é **outra tarefa**: parar e reportar.

## 4. Assets institucionais

- **Não substituir, recriar ou alterar** logo, favicon ou imagem de
  compartilhamento sem que seja o objeto da tarefa aprovada.
- **Imagem de compartilhamento** (`public/antero-encaminhamento.png`): antes de
  qualquer mudança, ler `docs/SOCIAL_SHARING.md` e seguir o checklist de §5.
- **Não apagar** `src/assets/` nem `public/assets/`. São duplicatas **ambas em
  uso**, por caminhos diferentes — import vs. URL (`docs/ASSETS_AND_IMAGES.md` §5).
  Editar imagem em `src/assets/img/` **não muda** o que a landing exibe.
- **Apenas cinco imagens estão de fato em uso** na aplicação. O restante é
  template não utilizado ou material preparado para o futuro. Não presumir que
  uma imagem presente está publicada.
- **Extensões `.PNG` maiúsculas** em `public/images/`: em produção Linux o
  caminho é case-sensitive. Se forem referenciadas, a extensão precisa bater.

## 5. Validação

**Não existe suíte de testes automatizados neste projeto** — nenhum Jest,
Vitest ou Playwright. A rede de segurança é:

```
npm run lint      # ESLint
npm run build     # build de produção — também faz a checagem de tipos
```

E, para qualquer mudança visual, **conferência manual em desktop e mobile**.
"Lint passou" não significa "funciona". Ver `docs/DEVELOPMENT_WORKFLOW.md` §4
para o que rodar em cada tipo de alteração.
