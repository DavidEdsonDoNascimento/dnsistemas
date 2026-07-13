# DEVELOPMENT_WORKFLOW.md — Processo de trabalho

> Como trabalhar com o Claude Code neste repositório. As regras de conduta estão em `CLAUDE.md`; aqui está o **processo operacional**.

---

## 1. O ciclo de trabalho

```
   1. CONTEXTO      → Claude lê a documentação relevante em docs/
          ↓
   2. PROPOSTA      → Claude apresenta o plano da tarefa (formato abaixo)
          ↓
   3. APROVAÇÃO     → Humano aprova, ajusta ou recusa.  ⛔ SEM ISSO, NADA É IMPLEMENTADO.
          ↓
   4. IMPLEMENTAÇÃO → Claude altera SOMENTE os arquivos listados na proposta
          ↓
   5. VALIDAÇÃO     → lint + build + verificação manual no navegador
          ↓
   6. RELATÓRIO     → Claude lista o que foi criado/modificado/removido de fato
```

Se durante a etapa 4 aparecer um problema fora do escopo: **parar e reportar**, não corrigir por conta própria. Isso vira uma nova tarefa, com nova aprovação.

---

## 2. Como propor uma tarefa

Toda proposta segue este formato:

```
Objetivo: <uma frase — o resultado esperado, não o meio>

Arquivos a criar:     <lista completa ou "nenhum">
Arquivos a modificar: <lista completa ou "nenhum">
Arquivos a remover:   <lista completa ou "nenhum">

Comandos a executar:  <lista ou "nenhum">

Fora de escopo:       <o que explicitamente NÃO será tocado>

Critérios de aceite:  <como saberemos, objetivamente, que funcionou>

Riscos:               <o que pode quebrar>
```

**Regra do tamanho:** uma tarefa por vez, e pequena. Se a proposta lista mais de ~5 arquivos ou mistura assuntos (ex.: "ajustar SEO e refatorar o header"), ela deve ser **quebrada em tarefas menores**.

---

## 3. Como aguardar aprovação

- O Claude **não** implementa antes de um "pode prosseguir" explícito.
- Aprovar uma tarefa **não** aprova as seguintes. Cada tarefa tem sua aprovação.
- Aprovar um plano **não** autoriza mudanças fora dele. Se o Claude perceber que o plano estava incompleto, ele volta e repropõe.
- Silêncio ou ambiguidade **não** contam como aprovação.

---

## 4. Comandos de verificação

Os únicos scripts existentes (`package.json`):

```bash
npm run dev      # servidor de desenvolvimento  → http://localhost:3000
npm run build    # build de produção — TAMBÉM faz a checagem de tipos TypeScript
npm run start    # roda o build de produção
npm run lint     # ESLint
```

### O que rodar depois de uma alteração

| Tipo de alteração | Verificação mínima |
|---|---|
| Qualquer código `.ts`/`.tsx` | `npm run lint` **e** `npm run build` |
| Conteúdo/layout da landing | build + **abrir `/` no navegador e conferir visualmente** |
| Estilos (CSS/tokens) | build + conferência visual em **desktop e mobile** |
| Rotas do painel | build + login real e navegação em `/painel/*` |
| `proxy.ts` (autenticação) | testar os 3 caminhos: (a) `/painel` deslogado → redireciona a `/login`; (b) login → chega em `/painel`; (c) `/login` já logado → redireciona a `/painel` |
| `api/contact` | envio real do formulário com as envs configuradas |
| SEO (`layout.tsx`, `robots.ts`, `sitemap.ts`) | conferir `/robots.txt` e `/sitemap.xml` no navegador; validar o JSON-LD |

⚠ **Não existe suíte de testes automatizados neste projeto** (nenhum Jest/Vitest/Playwright em `devDependencies`). Portanto **`npm run build` + verificação manual são a rede de segurança**. Não presuma que "lint passou" significa "funciona".

---

## 5. Setup local

1. Copiar `.env.example` para `.env.local` e preencher:
   - `RESEND_API_KEY`, `MAIL_FROM`, `MAIL_TO` — necessários para o formulário de contato;
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — necessários para o login do painel;
   - `NEXT_PUBLIC_SITE_URL` — URL canônica (SEO).
2. `npm install`
3. `npm run dev`

**Comportamento sem as envs do Supabase:** o `proxy.ts` tem um *fail-safe* — ele **não bloqueia** a navegação. Ou seja, o app sobe, mas a proteção do painel fica inativa. Não confunda "consegui abrir `/painel` em dev" com "a proteção está quebrada".

**Sem as envs do Resend:** `/api/contact` retorna HTTP 500 com a mensagem listando as variáveis faltantes.

⚠ **Nunca commitar `.env` ou `.env.local`.**

---

## 6. Git

- Branch de trabalho atual: **`develop`**. Branch principal: **`main`**.
- Commits só quando solicitados. Mensagens em português, no padrão do histórico existente (ex.: *"criado o processo de autenticação via supabase"*).

---

## 7. Armadilhas específicas deste repositório

Antes de mexer, leia — cada uma destas já custou tempo de alguém:

1. **Editar `src/assets/scss/` não faz nada.** O SCSS não é compilado (sem `sass` no projeto). O que vale é `src/assets/css/main.css` (já compilado) e os arquivos em `src/theme/`.
2. **Editar imagens em `src/assets/img/` não muda a landing.** Ela serve as imagens por URL, ou seja, de `public/assets/img/`. Os dois diretórios são duplicatas — ver `docs/ASSETS_AND_IMAGES.md`.
3. **Não apagar `src/assets/` nem `public/assets/`.** Ambos estão em uso, por caminhos diferentes (import vs. URL).
4. **O painel usa dados mock.** Alterar um mock não altera nada de real. Não relate "feature entregue" com base em telas alimentadas por `features/painel/mocks/`.
5. **React Compiler está ativado.** Não adicione `useMemo`/`useCallback` "por otimização" — a memoização é automática.
6. **`src/app/(site)/page.tsx` concentra o SEO.** Mudanças de texto ali afetam ranking orgânico. Mudanças estruturais afetam o JSON-LD e as âncoras. Tratar com cuidado.
7. **Fontes únicas de verdade** — editar apenas nelas:
   - WhatsApp → `src/lib/whatsapp-orcamento.ts`
   - menu do painel → `src/features/painel/config/navigation.ts`
   - tokens visuais da landing → `src/theme/landingTokens.ts`
8. **Existem dois lockfiles** (`package-lock.json` e `yarn.lock`). Confirmar com o time qual gerenciador usar antes de rodar instalações. *Necessita confirmação humana.*
9. **`src/components/Header/index.tsx` é código morto com um bug** (caminho de imagem com typo). Não "conserte de passagem" — é uma decisão pendente (corrigir ou remover).
