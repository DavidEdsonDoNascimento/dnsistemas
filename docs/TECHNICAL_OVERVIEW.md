# TECHNICAL_OVERVIEW.md — Visão técnica

> Baseado no repositório em 13/07/2026. Versões copiadas literalmente de `package.json`.

---

## 1. Stack identificada (fatos verificados)

| Camada | Tecnologia | Versão (package.json) |
|---|---|---|
| Framework | **Next.js (App Router)** | `16.1.6` |
| Runtime UI | **React** / React DOM | `19.2.3` |
| Linguagem | **TypeScript** | `^5` |
| Design system | **MUI** + `@mui/icons-material` + `@mui/material-nextjs` | `^7.3.8` / `^9.0.0` |
| CSS-in-JS | **Emotion** (react, styled, cache, server) | `^11.x` |
| CSS legado | **Bootstrap 5 + Bootstrap Icons** (arquivos estáticos, não via npm) | — |
| Autenticação | **Supabase** (`@supabase/ssr`, `@supabase/supabase-js`) | `^0.10.3` / `^2.105.4` |
| E-mail transacional | **Resend** | `^6.12.2` |
| Carrossel | **Swiper** | `^12.1.2` |
| Lint | **ESLint 9** + `eslint-config-next` (flat config) | `^9` / `16.1.6` |
| Compilador | **React Compiler** (`babel-plugin-react-compiler`) | `1.0.0` |

**Configuração relevante — `next.config.ts`:**

```ts
const nextConfig: NextConfig = {
  reactCompiler: true,
}
```

O React Compiler está **ativado**. Consequência prática: memoização é automática; não adicionar `useMemo`/`useCallback` "por precaução".

**Observação:** existem tanto `package-lock.json` quanto `yarn.lock` no repositório. Qual gerenciador é o oficial **necessita confirmação humana** (a presença dos dois é uma inconsistência a resolver).

---

## 2. Scripts disponíveis (fatos verificados)

```json
"dev":   "next dev"
"build": "next build"
"start": "next start"
"lint":  "eslint"
```

**Não existe script de teste.** Não existe script de typecheck dedicado (o `next build` faz a checagem de tipos). Não há framework de testes instalado — nenhum Jest, Vitest, Playwright ou similar em `devDependencies`. Portanto, **a validação disponível hoje é: `npm run lint`, `npm run build` e verificação manual no navegador** (ver `docs/DEVELOPMENT_WORKFLOW.md`).

---

## 3. Estrutura técnica

```
src/
├── app/                       # App Router
│   ├── layout.tsx             # Root layout: metadata/SEO global + ThemeRegistry + imports de CSS
│   ├── (site)/                # Route group — site público
│   │   ├── layout.tsx         #   adiciona FloatingButtons (WhatsApp + scroll-to-top)
│   │   └── page.tsx           #   landing page inteira (833 linhas)
│   ├── (auth)/                # Route group — autenticação
│   │   ├── layout.tsx
│   │   └── login/page.tsx
│   ├── (painel)/              # Route group — área interna
│   │   ├── layout.tsx         #   busca o usuário e renderiza PainelShell
│   │   └── painel/
│   │       ├── page.tsx       #   dashboard
│   │       ├── projetos/page.tsx
│   │       ├── financeiro/page.tsx
│   │       └── clientes/page.tsx
│   ├── api/contact/route.ts   # POST — envio de e-mail via Resend
│   ├── auth/callback/route.ts # Route handler do OAuth (Supabase)
│   ├── robots.ts              # /robots.txt dinâmico
│   └── sitemap.ts             # /sitemap.xml dinâmico
│
├── proxy.ts                   # Proxy de autenticação (Next 16; substitui middleware)
│
├── components/                # Componentes compartilhados do site
│   ├── SiteHeader.tsx         #   header EM USO na landing
│   ├── Header/index.tsx       #   ⚠ ÓRFÃO — ver "Pontos de atenção"
│   ├── contact-form.tsx
│   ├── FloatingButtons.tsx
│   ├── FloatingWhatsAppButton.tsx (+ .module.css)
│   └── ScrollToTopButton.tsx (+ .module.css)
│
├── features/                  # Organização por domínio
│   ├── auth/
│   │   ├── actions/           #   server actions: sign-in-google, sign-in-password, sign-out
│   │   ├── components/        #   LoginCard, LoginForm, UserMenu
│   │   ├── lib/               #   env, supabase-browser, supabase-server
│   │   ├── session/get-user.ts
│   │   └── types.ts
│   └── painel/
│       ├── components/        #   DataTable, PageHeader, SectionCard, StatCard, StatusBadge
│       ├── config/navigation.ts  # fonte única dos itens da Sidebar
│       ├── layout/            #   PainelShell, Sidebar, Topbar
│       ├── mocks/             #   dashboard, projetos, financeiro, clientes (DADOS FALSOS)
│       └── types.ts
│
├── lib/whatsapp-orcamento.ts  # número + mensagem do WhatsApp (fonte única)
│
├── theme/                     # MUI + tokens da landing
│   ├── index.ts, ThemeRegistry.tsx, theme.d.ts
│   ├── landingTokens.ts, landingCssVars.ts
│   ├── landing.module.css, landing-root.css
│
└── assets/                    # ⚠ CSS/JS/imagens herdados de template (duplicados em public/)
    ├── css/main.css           #   4243 linhas
    ├── scss/                  #   fontes SCSS do template (não compiladas pelo build atual)
    ├── js/main.js
    ├── img/
    └── vendor/                #   bootstrap, bootstrap-icons, aos, glightbox, swiper, isotope...
```

---

## 4. Dependências principais — para que servem aqui

- **`@supabase/ssr`** — cria clientes Supabase compatíveis com Server Components e com o proxy, sincronizando a sessão via cookies. Usado em `src/features/auth/lib/supabase-server.ts`, `supabase-browser.ts` e `src/proxy.ts`.
- **`@mui/material-nextjs`** — integração do cache do Emotion com o App Router (evita flash de estilo não estilizado no SSR). Usado no `ThemeRegistry`.
- **`resend`** — envio do e-mail do formulário de contato.
- **`swiper`** — instalado via npm **e** presente como arquivo de vendor em `assets/vendor/swiper/`. Qual dos dois está efetivamente em uso **necessita confirmação humana**.
- **`babel-plugin-react-compiler`** — requisito do `reactCompiler: true`.

---

## 5. Padrões técnicos observados (fatos verificados)

1. **Route groups como fronteira de contexto.** `(site)`, `(auth)` e `(painel)` isolam layouts sem afetar as URLs. É assim que o `FloatingButtons` fica restrito ao site e não "vaza" para o painel — comportamento explicitado em comentário no próprio `src/app/(site)/layout.tsx`.

2. **Feature-first em `src/features/`.** Cada domínio carrega seus próprios componentes, actions, tipos e libs. Componentes genuinamente compartilhados ficam em `src/components/`.

3. **Fonte única de configuração.** Padrão recorrente e deliberado:
   - itens de navegação do painel → `features/painel/config/navigation.ts`
   - número/mensagem do WhatsApp → `lib/whatsapp-orcamento.ts`
   - tokens visuais da landing → `theme/landingTokens.ts`
   Ao adicionar rota de painel ou mudar o WhatsApp, **editar apenas esses arquivos**.

4. **Autenticação em camadas.** O `proxy.ts` barra o acesso a `/painel/*`; o `(painel)/layout.tsx` refaz a busca do usuário no servidor ("defesa em camadas", conforme comentário no código). O proxy tem um *fail-safe*: sem as envs do Supabase, ele não bloqueia a navegação (evita travar o ambiente de dev sem setup).

5. **Matcher restrito no proxy.** `matcher: ['/painel/:path*', '/login']` — a landing pública e os route handlers não passam pelo proxy, por decisão de performance/segurança documentada no arquivo.

6. **SEO tratado como código de primeira classe.** `metadata` completo, Open Graph, Twitter Card, JSON-LD de `Organization` injetado via `<Script>`, `robots.ts` e `sitemap.ts` dinâmicos, e o painel explicitamente marcado como `robots: { index: false, follow: false }`.

7. **Server Actions para auth.** Login/logout são server actions (`features/auth/actions/`), não rotas de API.

8. **Sanitização manual no endpoint de contato.** `escapeHtml()` em `api/contact/route.ts` antes de interpolar dados do usuário no HTML do e-mail. Preservar esse cuidado em qualquer alteração ali.

9. **Dois sistemas de estilo coexistindo** (ver Pontos de atenção).

---

## 6. Variáveis de ambiente (de `.env.example`)

| Variável | Uso |
|---|---|
| `RESEND_API_KEY` | envio de e-mail (obrigatória para `/api/contact`) |
| `MAIL_FROM` | remetente verificado no Resend |
| `MAIL_TO` | caixa que recebe o formulário |
| `NEXT_PUBLIC_SITE_URL` | URL canônica; usada por metadata, OG, robots.txt e sitemap.xml |
| `NEXT_PUBLIC_SUPABASE_URL` | projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave anônima Supabase |

`/api/contact` valida a presença das três primeiras e retorna 500 com mensagem explícita se faltarem.

---

## 7. Pontos de atenção e riscos

1. **⚠ `src/components/Header/index.tsx` é um componente órfão com referência quebrada.**
   Ele aponta para `/antero_logo_header_croppezd.png`, mas o arquivo real é `public/antero_logo_header_cropped.png` (note o `zd`). **Nenhum arquivo importa esse componente** — o header em uso na landing é `SiteHeader.tsx`. Logo, o bug não afeta o site hoje, mas o componente é código morto com defeito. *Requer decisão humana: corrigir ou remover.*

2. **⚠ Duplicação completa de assets entre `src/assets/` e `public/assets/`.** O mesmo conjunto de vendor libs e imagens existe nos dois lugares. A landing referencia os assets por URL (`/assets/...`), ou seja, serve de `public/`; já o `layout.tsx` importa CSS de `src/assets/`. Ambos são necessários hoje por caminhos diferentes — **não apagar nada sem análise dedicada**. Detalhes em `docs/ASSETS_AND_IMAGES.md`.

3. **⚠ Dois sistemas de estilo.** MUI/Emotion (painel, componentes novos) + Bootstrap/CSS de template (landing). Convivem intencionalmente, mas aumentam o peso do CSS e o risco de conflito de classes. Unificar seria uma tarefa grande e própria — nunca fazer "de passagem".

4. **⚠ SCSS não integrado ao build.** `src/assets/scss/` existe, mas não há dependência `sass` no `package.json` e o layout importa o **CSS já compilado** (`src/assets/css/main.css`). Editar o SCSS **não** produz efeito. Para mudar estilo da landing, mexer no CSS/módulos, não no SCSS. *Necessita confirmação humana sobre manter ou remover o SCSS.*

5. **⚠ Resquícios de template inertes:** `assets/vendor/php-email-form/php-email-form.php` (PHP em projeto Next.js), `public/next.svg`, `public/vercel.svg`, `public/file.svg`, `public/globe.svg`, `public/window.svg` (padrão do `create-next-app`).

6. **⚠ Ausência total de testes automatizados.** Qualquer mudança depende de lint + build + verificação manual.

7. **⚠ Painel sobre mocks.** As telas parecem funcionais, mas nenhum dado é real. Não confundir "tela pronta" com "feature pronta".

8. **⚠ Dois lockfiles** (`package-lock.json` e `yarn.lock`) — risco de instalações divergentes.
