# PROJECT_CONTEXT.md — Contexto do projeto

> Documento baseado **exclusivamente** no que existe no repositório em 13/07/2026.
> Cada bloco separa **fatos verificados**, **inferências** e **pendências de confirmação humana**.

---

## 1. Visão geral (fatos verificados)

O repositório se chama **`dnsis`** (nome em `package.json`), mas todo o conteúdo do produto identifica a marca **ANTERO Sistemas**:

- `src/app/layout.tsx` define `SITE_NAME = 'ANTERO Sistemas'`.
- `NEXT_PUBLIC_SITE_URL` tem como padrão `https://anterosistemas.com.br` (fallback no código e valor em `.env.example`).
- O painel interno usa a marca `ANTERO` (`src/features/painel/config/navigation.ts` → `PAINEL_BRAND`).
- Os e-mails do formulário de contato saem com assunto `[ANTERO Site] ...` (`src/app/api/contact/route.ts`).

O projeto entrega **duas coisas em um mesmo app Next.js**:

1. **Site público (landing page única)** — rota `/`, voltada à captação de clientes.
2. **Painel interno autenticado** — rotas `/painel/*`, protegidas por login Supabase.

---

## 2. Objetivo aparente do site (fato verificado, via metadados e conteúdo)

O `metadata` em `src/app/layout.tsx` descreve o negócio de forma explícita:

- **Título padrão:** "Desenvolvimento de software personalizado para empresas em Santa Catarina | ANTERO Sistemas"
- **Descrição padrão:** "Empresa de desenvolvimento de software sob medida em Santa Catarina. Criamos sistemas empresariais, automação de processos e aplicativos personalizados para empresas em todo o Brasil. Solicite um orçamento."
- **Keywords** incluem: software sob medida, sistemas empresariais, automação de processos, ERP sob medida, integração de sistemas, desenvolvimento de aplicativos personalizados.

O site é, portanto, uma **landing page de captação de leads para uma empresa de desenvolvimento de software sob medida**, com forte trabalho de SEO já aplicado (metadata completo, Open Graph, Twitter Card, JSON-LD de `Organization`, `robots.ts` e `sitemap.ts` dinâmicos).

**Canais de conversão identificados no código:**

- **Formulário de contato** → `POST /api/contact` → envio via **Resend** para `MAIL_TO` (`src/components/contact-form.tsx`, `src/app/api/contact/route.ts`).
- **WhatsApp** → botão flutuante e CTAs, com número e mensagem centralizados em `src/lib/whatsapp-orcamento.ts`:
  - número: `5547997011323` (DDD 47 — litoral norte de SC, coerente com o posicionamento "Santa Catarina");
  - mensagem pré-preenchida: *"Oi, vim pelo site da Antero sistemas e gostaria de solicitar um orçamento."*

---

## 3. Informações verificadas sobre a ANTERO Sistemas

Tudo o que o repositório afirma sobre a empresa:

| Informação | Fonte no repositório |
|---|---|
| Nome: ANTERO Sistemas | `src/app/layout.tsx` |
| Atuação: desenvolvimento de software sob medida, sistemas empresariais, automação, apps | `metadata` em `src/app/layout.tsx` |
| Região declarada: Santa Catarina, atendendo todo o Brasil | `metadata` em `src/app/layout.tsx` |
| Domínio de produção previsto: `anterosistemas.com.br` | `.env.example`, fallback em `layout.tsx`, `robots.ts`, `sitemap.ts` |
| WhatsApp comercial: +55 47 99701-1323 | `src/lib/whatsapp-orcamento.ts` |
| Idioma/locale: `pt-BR` | `<html lang="pt-BR">`, `openGraph.locale` |
| Categoria: Tecnologia | `metadata.category` |

**Não identificado no repositório:** CNPJ, endereço físico, e-mail institucional real (o valor em `.env.example` é placeholder: `contato@suaorganizacao.com.br`), telefone fixo, redes sociais, sócios/equipe, ano de fundação.

---

## 4. Páginas e seções identificadas (fatos verificados)

**Rotas públicas**
- `/` — landing page única (`src/app/(site)/page.tsx`).
- `/robots.txt` e `/sitemap.xml` — gerados dinamicamente.
- `POST /api/contact` — endpoint do formulário.

**Rotas de autenticação**
- `/login` (`src/app/(auth)/login/page.tsx`).
- `/auth/callback` — route handler do fluxo OAuth.

**Rotas do painel interno** (protegidas)
- `/painel` — dashboard
- `/painel/projetos`
- `/painel/financeiro`
- `/painel/clientes`

**Seções da landing** (na ordem em que aparecem, pelos `id`s de `page.tsx`):
`hero` → `about` → `services` → `como-funciona` → `para-quem` → `beneficios` → `investimento` → *(CTA "Próximos passos", sem id)* → `faq` → `contact` → `footer`.

Detalhe de SEO: o `sitemap.ts` inclui **apenas a URL raiz**, sem âncoras — decisão deliberada, documentada em comentário no próprio arquivo (âncoras seriam tratadas como duplicatas pelo Google).

---

## 5. Estado do painel interno (fato verificado)

O painel **não tem backend de dados**. Todas as telas leem de arquivos mock:

- `src/features/painel/mocks/dashboard.ts`
- `src/features/painel/mocks/projetos.ts`
- `src/features/painel/mocks/financeiro.ts`
- `src/features/painel/mocks/clientes.ts`

O que **é** real: a autenticação. `src/proxy.ts` valida a sessão Supabase e redireciona não-autenticados de `/painel/*` para `/login?next=...`, e o layout do painel busca o usuário via `getCurrentUser()`.

O histórico de commits confirma a sequência: primeiro a estrutura do painel com mocks, depois a autenticação Supabase.

---

## 6. Pontos que necessitam de confirmação humana

1. **Relação entre `dnsis` e ANTERO Sistemas.** O `package.json` diz `dnsis`; o produto diz ANTERO. É rebranding, nome interno do repo, ou duas entidades? *Necessita confirmação humana.*
2. **O domínio `anterosistemas.com.br` está de fato em produção?** Não há configuração de deploy no repositório (sem `vercel.json`, sem CI). *Necessita confirmação humana.*
3. **Destino do painel interno:** é protótipo de validação visual, ou haverá integração real com Supabase (tabelas, RLS)? Não há schema/migrations no repo. *Necessita confirmação humana.*
4. **E-mail institucional real** para `MAIL_FROM` / `MAIL_TO` — hoje só há placeholder. *Necessita confirmação humana.*
5. **Dados institucionais para SEO local** (endereço, CNPJ, horário) — o JSON-LD atual é de `Organization`; um `LocalBusiness` exigiria dados reais. *Necessita confirmação humana.*
6. **Verificação do Google Search Console:** o campo `verification.google` está comentado em `src/app/layout.tsx`, aguardando token. *Necessita confirmação humana.*

---

## 7. Inferências (não são fatos — sinalizadas como tal)

- **Inferência:** o site nasceu de um **template HTML/Bootstrap pronto** (padrão de nomes `portfolio-N.webp`, `person-m-N.webp`, `about-square-N.webp`, presença de `php-email-form/`, `glightbox`, `isotope`, `purecounter`, `aos`), e foi migrado para Next.js/MUI mantendo o CSS e os assets originais. Ver `docs/ASSETS_AND_IMAGES.md`.
- **Inferência:** as imagens em `public/images/sistema/`, `public/images/app/` e `public/images/site/` são **capturas de tela de produtos/entregas reais da ANTERO** (nomes como `mapeamento-detalhes.png`, `pendentes-aprovacao.png`, `lista-testes.PNG`), mas **não localizei referência a elas no código atual** — ou seja, parecem preparadas para uso futuro (portfólio/cases). *Necessita confirmação humana.*
