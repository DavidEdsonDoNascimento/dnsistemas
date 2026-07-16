# SITE_STRUCTURE.md — Estrutura do site

> Baseado no repositório em 13/07/2026. Ordem e títulos extraídos diretamente de `src/app/(site)/page.tsx`.

---

## 1. Mapa de rotas (fatos verificados)

O projeto usa **route groups** do App Router. Os parênteses **não aparecem na URL** — servem para dar layouts diferentes a cada área.

### Site público — grupo `(site)`

| URL | Arquivo | Observação |
|---|---|---|
| `/` | `src/app/(site)/page.tsx` | Landing page única (833 linhas) |
| `/robots.txt` | `src/app/robots.ts` | Bloqueia `/api/`, `/_next/`, `/private/` |
| `/sitemap.xml` | `src/app/sitemap.ts` | Contém **apenas** a URL raiz, sem âncoras (decisão de SEO documentada no arquivo) |
| `POST /api/contact` | `src/app/api/contact/route.ts` | Recebe o formulário e envia via Resend |

O `(site)/layout.tsx` acrescenta o `FloatingButtons` (WhatsApp + voltar ao topo) — restrito ao site, não aparece no painel.

### Autenticação — grupo `(auth)`

| URL | Arquivo |
|---|---|
| `/login` | `src/app/(auth)/login/page.tsx` |
| `/auth/callback` | `src/app/auth/callback/route.ts` (route handler do OAuth) |

### Painel interno — grupo `(painel)` — **protegido**

| URL | Arquivo | Dados |
|---|---|---|
| `/painel` | `src/app/(painel)/painel/page.tsx` | mock (`features/painel/mocks/dashboard.ts`) |
| `/painel/projetos` | `.../painel/projetos/page.tsx` | mock (`mocks/projetos.ts`) |
| `/painel/financeiro` | `.../painel/financeiro/page.tsx` | mock (`mocks/financeiro.ts`) |
| `/painel/clientes` | `.../painel/clientes/page.tsx` | mock (`mocks/clientes.ts`) |

Proteção: `src/proxy.ts` (matcher `['/painel/:path*', '/login']`) redireciona não-autenticados para `/login?next=...` e usuários já logados de `/login` para `/painel`. O `(painel)/layout.tsx` marca a área como `robots: { index: false, follow: false }`.

---

## 2. Seções da landing page (na ordem real de renderização)

Todas dentro de `src/app/(site)/page.tsx`. Cada seção tem `id` e `aria-labelledby` — a acessibilidade foi tratada deliberadamente.

| # | `id` | Título (H1/H2 real) | Linha aprox. |
|---|---|---|---|
| — | — | `<SiteHeader />` — cabeçalho fixo | 134 |
| 1 | `hero` | **H1:** "Desenvolvimento de software personalizado para empresas em Santa Catarina e…" + 2 CTAs (orçamento / serviços) + ilustração | 137 |
| 2 | `about` | "Fábrica de software com time sênior e escopo transparente." | 242 |
| 3 | `services` | "Serviços de desenvolvimento de sistemas sob medida para empresas" | 310 |
| 4 | `como-funciona` | "Como funciona o desenvolvimento de software personalizado na ANTERO" | 380 |
| 5 | `para-quem` | "Quais empresas precisam de automação de processos e sistemas sob medida" | 446 |
| 6 | `beneficios` | "Benefícios de um sistema personalizado para a sua empresa" | 540 |
| 7 | `investimento` | "Quanto custa um sistema sob medida para empresa" | 618 |
| 8 | *(sem id)* | CTA intermediário — `aria-label="Próximos passos"` | 679 |
| 9 | `faq` | "Perguntas frequentes sobre desenvolvimento de software sob medida" | 703 |
| 10 | `contact` | "Solicite um orçamento de software personalizado" + formulário + CTA de WhatsApp | 740 |
| 11 | `footer` | Rodapé | 806 |

**No final da página** (linhas 822-830):
- `<Script id="ld-json-organization">` — JSON-LD de `Organization` para o Google.
- `<Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />`
- `<Script src="/assets/js/main.js" strategy="afterInteractive" />` — JS do template original.

---

## 3. Fluxo visual do site

```
                      ┌──────────────────────────────┐
                      │  SiteHeader (fixo no topo)   │
                      └──────────────────────────────┘
                                    │
     HERO  ───────────►  "O que fazemos, para quem, e dois botões"
       │                        ├── CTA primário  → orçamento (WhatsApp)
       │                        └── CTA secundário → âncora #services
       ▼
     ABOUT ───────────►  credibilidade (time sênior, escopo transparente)
       ▼
     SERVICES ────────►  o que é oferecido
       ▼
     COMO-FUNCIONA ───►  o processo, para reduzir a percepção de risco
       ▼
     PARA-QUEM ───────►  o visitante se reconhece
       ▼
     BENEFICIOS ──────►  valor percebido
       ▼
     INVESTIMENTO ────►  quebra da objeção "quanto custa"
       ▼
     CTA intermediário ► "próximos passos"
       ▼
     FAQ ─────────────►  objeções residuais
       ▼
     CONTACT ─────────►  conversão: formulário (Resend) + WhatsApp
       ▼
     FOOTER

   Sempre visíveis (via FloatingButtons):  [WhatsApp]  [▲ topo]
```

É um funil clássico de landing: atenção → credibilidade → oferta → processo → identificação → valor → preço → objeções → conversão. Há **dois caminhos de conversão** concorrentes o tempo todo: WhatsApp (imediato) e formulário (assíncrono).

---

## 4. Componentes principais

### Site
| Componente | Arquivo | Papel |
|---|---|---|
| `SiteHeader` | `src/components/SiteHeader.tsx` | Cabeçalho **em uso** na landing |
| `contact-form` | `src/components/contact-form.tsx` | Formulário → `POST /api/contact` |
| `FloatingButtons` | `src/components/FloatingButtons.tsx` | Agrupa os dois botões flutuantes |
| `FloatingWhatsAppButton` | `src/components/FloatingWhatsAppButton.tsx` (+ `.module.css`) | CTA de WhatsApp |
| `ScrollToTopButton` | `src/components/ScrollToTopButton.tsx` (+ `.module.css`) | Voltar ao topo |
| ⚠ `Header` | `src/components/Header/index.tsx` | **ÓRFÃO** — não é importado por ninguém e aponta para uma imagem inexistente (`antero_logo_header_croppezd.png`, com typo). Ver `docs/TECHNICAL_OVERVIEW.md` §7 |
| ⚠ `HeroCinematic` | `src/components/hero/HeroCinematic.tsx` (+ `hero-cinematic.module.css`) | **DESATIVADO** — o Hero Cinemático foi temporariamente desativado por ainda não fazer parte da versão atual do site. A implementação foi preservada para futura reativação. Não é importado por ninguém e está excluído do build via `exclude` no `tsconfig.json` (depende de `framer-motion`, não instalada). Instruções de reativação no cabeçalho do próprio arquivo |

### Autenticação (`src/features/auth/`)
`LoginCard`, `LoginForm`, `UserMenu` · server actions `sign-in-google`, `sign-in-password`, `sign-out` · clients `supabase-browser` / `supabase-server` · `session/get-user.ts`.

### Painel (`src/features/painel/`)
- **Layout:** `PainelShell` (casca), `Sidebar` (navegação), `Topbar` (usuário/logout).
- **UI reutilizável:** `DataTable`, `PageHeader`, `SectionCard`, `StatCard`, `StatusBadge`.
- **Navegação:** `config/navigation.ts` — **fonte única** dos itens da Sidebar e da marca (`PAINEL_BRAND`).

---

## 5. Arquivos mais relevantes para manutenção

Ordem prática de "onde mexer para mudar o quê":

| Quero mudar… | Arquivo |
|---|---|
| Texto, seções ou estrutura da landing | `src/app/(site)/page.tsx` |
| Título/descrição/SEO global, Open Graph, ícones | `src/app/layout.tsx` |
| Menu do topo do site | `src/components/SiteHeader.tsx` |
| Número ou mensagem do WhatsApp | `src/lib/whatsapp-orcamento.ts` *(e só ele)* |
| Destinatário/remetente do formulário | `.env` (`MAIL_FROM`, `MAIL_TO`) — lógica em `src/app/api/contact/route.ts` |
| Cores, tipografia, tokens visuais da landing | `src/theme/landingTokens.ts`, `src/theme/landing.module.css`, `src/theme/landing-root.css` |
| Tema do MUI (painel) | `src/theme/index.ts` |
| Itens do menu do painel | `src/features/painel/config/navigation.ts` *(e só ele)* |
| Dados exibidos no painel | `src/features/painel/mocks/*.ts` — **são mocks, não banco** |
| Regras de acesso ao painel | `src/proxy.ts` |
| URLs indexáveis | `src/app/sitemap.ts` |
| Regras de crawler | `src/app/robots.ts` |

**Cuidado com `src/assets/css/main.css`** (4.243 linhas, herdado do template): é carregado globalmente pelo root layout e afeta todas as páginas. Preferir CSS Modules / tokens em `src/theme/` a editar esse arquivo.
