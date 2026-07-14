# Estado atual do repositório — evidências

> Data da análise: **14/07/2026**. Branch `main`, commit `d29f678`.
> Rótulos: **[REPO]** fato verificado no repositório · **[REC]** recomendação · **[HIP]** hipótese não confirmada.
> Este documento registra **apenas o que foi comprovado pela leitura dos arquivos**.

---

## 1. Stack identificada

**[REPO]** Fonte: `package.json` (36 linhas, lido integralmente).

| Item | Valor confirmado | Evidência |
|---|---|---|
| Framework | Next.js **16.1.6**, App Router | `package.json:21` |
| Linguagem | TypeScript `^5` | `package.json:34` |
| UI | React / React DOM **19.2.3** | `package.json:22-23` |
| Design system | MUI `^7.3.8` + Emotion `^11.x` + `@mui/material-nextjs` `^9.0.0` | `package.json:12-18` |
| Auth / BaaS | Supabase — `@supabase/ssr` `^0.10.3`, `@supabase/supabase-js` `^2.105.4` | `package.json:19-20` |
| E-mail | Resend `^6.12.2` | `package.json:24` |
| Compilador | React Compiler ativado (`reactCompiler: true`) | `next.config.ts` |
| Gerenciador de pacotes | **Ambíguo** — existem `package-lock.json` **e** `yarn.lock` | raiz do repositório |

**[REPO] Não existem no `package.json`:** `stripe`, `@stripe/*`, `asaas`, nenhum SDK de pagamento, nenhum framework de testes (Jest/Vitest/Playwright), nenhum validador de schema (Zod/Yup/Valibot), nenhum ORM (Prisma/Drizzle), nenhuma biblioteca de logging ou observabilidade.

**Impacto na integração com o Asaas:**
- **[REC]** Não há biblioteca de validação instalada. A integração exige validação rigorosa de entrada (webhook, criação de cobrança). Introduzir uma (ex.: Zod) será necessário e é uma **decisão de dependência** — ver `DECISIONS.md` DEC-007.
- **[REC]** A ausência de ORM significa que o acesso a dados será via `@supabase/supabase-js`, o padrão já usado no projeto. Não introduzir ORM só por causa dos pagamentos.
- **[REPO]** Os dois lockfiles são um risco real de instalação divergente e precisam ser resolvidos **antes** de instalar qualquer dependência nova.

## 2. Estrutura de rotas e renderização

**[REPO]** Route groups do App Router (os parênteses não aparecem na URL):

| URL | Arquivo | Natureza |
|---|---|---|
| `/` | `src/app/(site)/page.tsx` | Landing pública (Server Component) |
| `/robots.txt` | `src/app/robots.ts` | Gerada |
| `/sitemap.xml` | `src/app/sitemap.ts` | Gerada |
| `POST /api/contact` | `src/app/api/contact/route.ts` | **Único Route Handler de API existente** |
| `/login` | `src/app/(auth)/login/page.tsx` | Pública |
| `GET /auth/callback` | `src/app/auth/callback/route.ts` | Route Handler do OAuth |
| `/painel` | `src/app/(painel)/painel/page.tsx` | Protegida — **dados mock** |
| `/painel/projetos` | `src/app/(painel)/painel/projetos/page.tsx` | Protegida — **dados mock** |
| `/painel/financeiro` | `src/app/(painel)/painel/financeiro/page.tsx` | Protegida — **dados mock** |
| `/painel/clientes` | `src/app/(painel)/painel/clientes/page.tsx` | Protegida — **dados mock** |

**[REPO]** Organização: **feature-first** em `src/features/<domínio>/` (hoje: `auth` e `painel`), cada um com `components/`, `lib/`, `types.ts` e, no caso de `auth`, `actions/` e `session/`. Componentes compartilhados ficam em `src/components/`.

**Impacto:** **[REC]** um domínio de pagamentos deve seguir a mesma convenção — `src/features/pagamentos/` (ou `src/features/faturamento/`) —, não uma pasta nova no topo. A rota de webhook, por ser um Route Handler, ficaria em `src/app/api/webhooks/asaas/route.ts`, seguindo o único precedente existente (`src/app/api/contact/route.ts`).

## 3. Autenticação — o que existe e funciona

**[REPO]** Arquivos: `src/proxy.ts` (70 linhas), `src/features/auth/**` (9 arquivos).

### 3.1 Fluxo atual confirmado

```
/login
  ├─ LoginForm → Server Action signInWithPasswordAction   (email + senha)
  └─ botão Google → Server Action signInWithGoogleAction
                       ↓ supabase.auth.signInWithOAuth({provider:'google',
                         redirectTo: `${origin}/auth/callback?next=...`})
                       ↓ Google
                    GET /auth/callback  (src/app/auth/callback/route.ts)
                       ↓ supabase.auth.exchangeCodeForSession(code)   [PKCE]
                       ↓ sessão gravada em cookies
              redirect → /painel  (ou `next`, validado contra /^\/painel(?:\/.*)?$/)
                       ↓
           src/proxy.ts  (matcher: ['/painel/:path*', '/login'])
              ├─ supabase.auth.getUser()  → valida o JWT no servidor Supabase
              ├─ sem user + rota /painel/* → redirect /login?next=...
              └─ com user + rota /login    → redirect /painel
                       ↓
        src/app/(painel)/layout.tsx  → getCurrentUser() (defesa em camadas)
                       ↓
                  PainelShell(user) → Sidebar + Topbar + página
                       ↓
        Página lê de src/features/painel/mocks/*.ts   ← ⚠ DADOS FALSOS
                       ↓
                 ⚠ NENHUMA aplicação de permissões
```

### 3.2 Evidências pontuais

- **[REPO]** `src/proxy.ts:15-65` — o proxy é a única barreira de rota. Usa `createServerClient` do `@supabase/ssr` e `supabase.auth.getUser()` (validação real do token, não apenas leitura de cookie).
- **[REPO]** `src/proxy.ts:21-24` — **fail-safe**: se `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY` estiverem ausentes, o proxy **não bloqueia nada** e libera a navegação. Comentário no código: *"Fail-safe: sem envs, não bloqueia a navegação (evita brick em dev sem setup)"*.
- **[REPO]** `src/features/auth/session/get-user.ts:12-18` — `getCurrentUser()` também usa `getUser()` e não `getSession()`, com comentário explicando que é a recomendação oficial para checagens sensíveis em SSR. **Isso está correto.**
- **[REPO]** `src/app/auth/callback/route.ts:4,15-16` — o parâmetro `next` é validado contra `/^\/painel(?:\/.*)?$/` antes do redirect. **Proteção contra open redirect presente e correta.** O mesmo padrão está em `src/features/auth/actions/sign-in-google.ts:7,29-30`.
- **[REPO]** `src/features/auth/lib/env.ts:10-29` — leitura *lazy* e tipada das envs, lançando erro com mensagem clara se ausentes.

### 3.3 O que **não** existe na autenticação

- **[REPO]** **Não existe nenhum conceito de papel, permissão, role ou claim.** Busca por `role`, `admin`, `permission` nos arquivos de `features/auth` e `features/painel`: nenhuma ocorrência funcional. `src/features/auth/types.ts` reexporta apenas o `User` do Supabase (`export type AuthUser = User`).
- **[REPO]** **Não existe tabela de perfis** (`profiles`), nem de organizações, nem de clientes. Não há nenhum arquivo de schema no repositório.
- **[REPO]** Consequência direta: **qualquer pessoa que consiga se autenticar no projeto Supabase entra no painel com acesso total a todas as telas.** Não há diferença entre "administrador da ANTERO" e "cliente". Hoje isso não vaza dado real (os dados são mock), mas **passa a ser uma vulnerabilidade grave no minuto em que houver dados financeiros reais**.

**[HIP]** O acesso pode estar restrito hoje por configuração do painel do Supabase (ex.: signup desabilitado, provedor Google limitado a um domínio). Isso **não é verificável pelo repositório** e **necessita confirmação humana**.

## 4. Banco de dados — inexistente no repositório

**[REPO]** Verificações executadas:

- Não existe diretório `supabase/`.
- Não existem migrations (nenhum `.sql` no repositório fora de `node_modules`).
- Não existe schema, seed, nem definição de RLS.
- Não existe geração de tipos do Supabase (nenhum `database.types.ts`).
- Nenhum arquivo do projeto executa `.from(...)`, `.select(...)` ou qualquer consulta ao Postgres. O cliente Supabase é usado **exclusivamente** para `auth.*`.

**Conclusão [REPO]:** o Supabase é usado hoje **apenas como provedor de autenticação**. O banco de dados do projeto — no que diz respeito ao domínio da ANTERO — **não existe**.

**Impacto na integração:** este é **o maior bloqueio**. Todo o modelo de `DATA_MODEL.md` é construção nova. Não há tabela a alterar, o que é uma boa notícia (nenhuma migração de dado legado), mas significa que a Fase 0 e a Fase 1 são obrigatórias e não triviais.

**[HIP]** É possível que exista um schema criado manualmente pelo dashboard do Supabase, fora do controle de versão. **Necessita confirmação humana.** Se existir, é um risco por si só (schema sem versionamento) e deve ser trazido para migrations antes de qualquer coisa.

## 5. O painel é 100% mock

**[REPO]** Os quatro arquivos de mock e o que cada tela consome:

| Arquivo | Exporta | Consumido por |
|---|---|---|
| `src/features/painel/mocks/dashboard.ts` | `STAT_CARDS`, atividades | `(painel)/painel/page.tsx` |
| `src/features/painel/mocks/projetos.ts` | `PROJETOS_MOCK` | `(painel)/painel/projetos/page.tsx` |
| `src/features/painel/mocks/financeiro.ts` | `FINANCEIRO_MOCK` | `(painel)/painel/financeiro/page.tsx` |
| `src/features/painel/mocks/clientes.ts` | `CLIENTES_MOCK` | `(painel)/painel/clientes/page.tsx` |

**[REPO]** `src/features/painel/types.ts` define os tipos das telas: `Projeto`, `MovimentoFinanceiro`, `Cliente`, `StatCardData`, `AtividadeRecente`, `StatusItem`. **São tipos de apresentação, não de domínio.** Evidências:

- `Projeto.cliente` é uma `string` (nome), não uma chave estrangeira (`types.ts:21-29`).
- `Projeto.prazo` é uma `string` já formatada, não uma data.
- `MovimentoFinanceiro.valor` é `number` (`types.ts:36`) — **ponto flutuante**, com valores como `28500` em `mocks/financeiro.ts:9`. Não há indicação de centavos.
- `MovimentoFinanceiro.data` é `'12/05/2026'` — string em formato brasileiro, não `Date`/`timestamptz` (`mocks/financeiro.ts:8`).
- `MovimentoFinanceiro.status` é `{ label: 'Recebido', tone: 'success' }` — **um rótulo visual, não uma máquina de estados**. Os rótulos usados nos mocks são: `Recebido`, `Pago`, `Pendente`, `Atrasado`.
- `src/app/(painel)/painel/financeiro/page.tsx:68-75` soma `m.valor` diretamente com `reduce` em `number` — aritmética de ponto flutuante sobre dinheiro.

**Impacto — importante:** a tela `/painel/financeiro` **parece** o embrião de um módulo de cobranças, mas **não é**. É uma lista de movimentações de caixa (entradas *e saídas*, incluindo "Infraestrutura AWS" e "Licença ferramentas") com status meramente decorativo. **[REC]** Não tentar "evoluir" `MovimentoFinanceiro` para virar a entidade de cobrança — os conceitos são diferentes (fluxo de caixa ≠ cobrança de cliente). O correto é criar o domínio de cobranças novo e, depois, decidir o que fazer com essa tela (ver DEC-005).

## 6. Validação, erros, logs, observabilidade

- **[REPO]** **Validação:** existe apenas validação manual e pontual. `src/app/api/contact/route.ts` verifica presença de envs e possui uma função `escapeHtml()` para sanitizar antes de interpolar no HTML do e-mail. **Não há schema de validação em lugar nenhum.**
- **[REPO]** **Tratamento de erros:** ad-hoc. Server Actions de auth retornam `{ error: string | null }` (`src/features/auth/types.ts:7-9`) e o callback OAuth redireciona para `/login?error=callback`.
- **[REPO]** **Logs:** nenhuma biblioteca. **Observabilidade:** nenhuma (sem Sentry, sem OpenTelemetry, sem tracing).
- **[REPO]** **Testes:** **nenhum**. Sem framework, sem arquivo de teste, sem script `test` no `package.json`.

**Impacto:** **[REC]** Uma integração financeira sem logs estruturados e sem testes é inaceitável. `TESTING.md` e `SECURITY.md` tratam disso; a Fase 8 do plano é dedicada a isso. Um webhook que falha silenciosamente e não é observável leva a **fila interrompida no Asaas após 15 falhas consecutivas** — **[ASAAS]**, ver `REFERENCES.md`.

## 7. Infraestrutura e deploy — **CONFIRMADA** (atualizado na 2ª rodada)

> **Atualização.** A 1ª análise registrou a hospedagem como **[HIP]** (não havia nada no repositório que a comprovasse). **A informação foi confirmada pela equipe** e passa a ser tratada como fato:

| Item | Valor **confirmado** |
|---|---|
| **Hospedagem de produção** | **Vercel** |
| **URL de produção** | **`https://anterosistemas.com.br`** |
| **Webhook de produção** | **`https://anterosistemas.com.br/api/webhooks/asaas`** |
| **Ambiente de Sandbox** | **[REC]** **`https://staging.anterosistemas.com.br/api/webhooks/asaas`** — ⚠ **subdomínio de staging estável, ainda NÃO existente** → **DEC-015** |

- **[REPO]** Continua **não existindo `vercel.json`**, nem workflows de CI, nem Dockerfile, nem configuração de deploy **versionada no repositório**. O deploy é gerido **fora** do controle de versão (configuração no painel da Vercel).

**Impacto — três consequências concretas:**

1. ⚠ **A URL de webhook do Sandbox NÃO pode ser uma URL de preview da Vercel.** URLs de preview (`*-git-branch-*.vercel.app`) **mudam a cada deploy** — o webhook cadastrado no Asaas apontaria para um deploy morto, **as entregas falhariam, e [ASAAS] após 15 falhas consecutivas a fila seria INTERROMPIDA**. É preciso um **subdomínio de staging estável**. ⚠ **A criação desse ambiente é pré-requisito da Fase 5** e está **fora do escopo da tarefa de documentação** → **DEC-015**.

2. ⚠ **Vercel é serverless: NÃO existe worker de background persistente.** Um processo que precise executar chamadas externas **fora** do ciclo de requisição — que é exatamente o que o **padrão outbox** exige (`ARCHITECTURE.md` §4) — depende de: (a) execução após a resposta (`after()` do Next.js) e (b) ⚠ **um agendador (cron), obrigatório como rede de segurança**. → **DEC-014**.

3. **Funções serverless têm timeout de execução.** Reforça o desenho do webhook: **responder rápido, processar o mínimo dentro da requisição, e empurrar todo efeito externo para a outbox** (`WEBHOOKS.md` §8).

**[HIP]** Os **limites do plano contratado da Vercel** (nº de cron jobs, duração máxima de função) **não foram confirmados** — **verificar na F5**.

## 8. Variáveis de ambiente existentes

**[REPO]** De `.env.example` (nomes apenas; **nenhum valor foi lido ou registrado**):

| Variável | Escopo | Uso |
|---|---|---|
| `RESEND_API_KEY` | servidor | e-mail do formulário |
| `MAIL_FROM` | servidor | remetente |
| `MAIL_TO` | servidor | destinatário |
| `NEXT_PUBLIC_SITE_URL` | público | URL canônica (SEO) |
| `NEXT_PUBLIC_SUPABASE_URL` | público | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | público | Supabase (chave anônima) |

**[REPO]** Convenção observada: segredos **sem** prefixo `NEXT_PUBLIC_`; valores expostos ao navegador **com** o prefixo. Leitura de envs de auth é centralizada e *lazy* em `src/features/auth/lib/env.ts`.

**Impacto:** **[REC]** as variáveis do Asaas devem seguir a mesma convenção — **nenhuma delas pode ter o prefixo `NEXT_PUBLIC_`**, pois todas são segredos de servidor. Ver `SECURITY.md` §variáveis.

**[REPO] Nota crítica:** hoje o projeto **não usa a `service_role` key do Supabase**. Um webhook do Asaas chega **sem sessão de usuário** e precisará escrever no banco — o que exige uma chave privilegiada (`SUPABASE_SERVICE_ROLE_KEY`) ou uma função `SECURITY DEFINER`. Essa é uma variável nova e **de altíssimo risco**, tratada em `SECURITY.md` e em DEC-008.

## 9. Inventário de Stripe — resultado da busca

**[REPO]** Busca executada em todo o repositório (excluindo `node_modules/` e `.git/`) pelos termos: `stripe`, `Stripe`, `STRIPE`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `checkout`, `payment`, `payments`, `billing`, `subscription`, `invoice`, `webhook`, `customer`, `price`, `product`, `installment`, `charge`, `transaction`, `pagamento`, `pagamentos`, `cobrança`, `cobranca`, `parcela`, `parcelamento`, `assinatura`, `fatura`, `cliente`, `transação`, `transacao`.

### Resultado: **nenhuma implementação de pagamento existe no projeto.**

Todas as ocorrências encontradas são falsos positivos ou texto de UI. Classificação completa em [`STRIPE_MIGRATION.md`](./STRIPE_MIGRATION.md). Resumo:

| Ocorrência | Arquivo | O que é de fato | Classificação |
|---|---|---|---|
| `"stripe": 63559` | `src/assets/vendor/bootstrap-icons/bootstrap-icons.json:1821` (e `.scss:1855`) | Nome de um **glifo** do Bootstrap Icons | Falso positivo. Não tocar. |
| `.table-striped`, `progress-bar-stripes` | `src/assets/vendor/bootstrap/css/*` | Classes de CSS do Bootstrap | Falso positivo. Não tocar. |
| `smtp_transaction_id` | `src/assets/vendor/php-email-form/php-email-form.php` | Código PHP morto (PHPMailer) herdado do template | Falso positivo. Resíduo de template já sinalizado em `docs/TECHNICAL_OVERVIEW.md` §7. |
| `'Fatura recebida'` | `src/features/painel/mocks/dashboard.ts:49` | Texto de uma atividade **mock** | Falso positivo. Dado falso. |
| `"...status de cobrança."` | `src/app/(painel)/painel/financeiro/page.tsx:81` | Texto descritivo da tela | Falso positivo. |
| `Assinatura compatível com...` | `src/features/auth/actions/sign-in-password.ts:16` | Comentário sobre **assinatura de função** TypeScript | Falso positivo. |

**Não existem:** dependência Stripe, variável `STRIPE_*` (nem em `.env.example`), serviço, adaptador, Server Action, Route Handler, webhook, componente, hook, schema, tipo, migration, tabela, teste ou mock relacionado a pagamento de qualquer provedor.

**Consequência:** **não há nada de Stripe para remover, adaptar ou migrar.** A "Fase 10 — Remoção segura do Stripe" do plano de tarefas é, na prática, **vazia**. A integração com o Asaas é **greenfield**. Ver `STRIPE_MIGRATION.md`.

## 10. Domínio atual — o que existe versus o que a integração exige

**[REPO]** Conceitos que o projeto **possui hoje**:

| Conceito | Onde | Natureza |
|---|---|---|
| Usuário | `src/features/auth/types.ts` → `User` do Supabase Auth | **Real** (autenticação Supabase) |
| "Cliente" | `src/features/painel/types.ts:41-49` + `mocks/clientes.ts` | **Mock**, tipo de apresentação (`nome`, `segmento`, `contato`, `cidade`, `projetosAtivos`, `status`) |
| "Projeto" | `src/features/painel/types.ts:21-29` + `mocks/projetos.ts` | **Mock**, tipo de apresentação (`cliente` é string, `prazo` é string) |
| "Movimento financeiro" | `src/features/painel/types.ts:31-39` + `mocks/financeiro.ts` | **Mock**, fluxo de caixa (entrada/saída) — **não é cobrança** |

**[REPO]** Conceitos que **não existem em nenhuma forma**: perfil (`profile`), organização, empresa, proposta, orçamento, contrato, condição de pagamento, plano de pagamento, parcela, cobrança, transação, assinatura, plano, produto, serviço, reembolso, evento de webhook, log de auditoria, papel, permissão.

**Risco de nomenclatura [REC]:** os nomes `Cliente`, `Projeto` e `MovimentoFinanceiro` **já estão ocupados** por tipos de apresentação do painel em `src/features/painel/types.ts`. Se o domínio real reusar os mesmos nomes sem cuidado, haverá colisão e confusão entre "o `Cliente` que a tabela do painel desenha" e "o `Cliente` que é a entidade persistida". `DATA_MODEL.md` trata disso explicitamente.

**Conflito conceitual com o Asaas [REC]:** o Asaas também tem uma entidade `customer`. **A entidade `customer` do Asaas não é o usuário do Supabase, nem o cliente do domínio da ANTERO** — é uma projeção do cliente da ANTERO dentro do Asaas. Confundir os três é a fonte mais comum de bug nesse tipo de integração. Por isso o modelo proposto isola o vínculo numa tabela dedicada (`payment_provider_customers`), em vez de gravar um `asaas_customer_id` solto na tabela de clientes.

## 11. Lacunas — o que precisa existir antes da integração

| # | Lacuna | Gravidade | Onde é tratada |
|---|---|---|---|
| L1 | Não existe banco de dados modelado, nem migrations, nem RLS | **Bloqueante** | Fase 0 / `DATA_MODEL.md` |
| L2 | Não existe distinção entre administrador e cliente; sem papéis, sem autorização | **Bloqueante** (vira falha de segurança com dados reais) | Fase 0 / `SECURITY.md` |
| L3 | Não existem as entidades de domínio (empresa, projeto, proposta) a que uma cobrança se vincula | **Bloqueante** | Fase 0 / Fase 1 |
| L4 | Painel inteiramente sobre mocks | **Bloqueante** para o dashboard do cliente | Fase 0 / Fase 6 |
| L5 | Nenhuma biblioteca de validação de entrada | Alta | DEC-007 |
| L6 | Nenhum teste automatizado | Alta | `TESTING.md` / Fase 8 |
| L7 | Nenhum log estruturado nem observabilidade (webhook falho seria invisível) | Alta | `WEBHOOKS.md` / Fase 8 |
| L8 | ⚠ **Não existe ambiente de STAGING com URL estável** para o webhook de Sandbox. A infra foi confirmada (Vercel, `anterosistemas.com.br` — §7), mas ⚠ **uma URL de preview da Vercel NÃO serve** (muda a cada deploy → **[ASAAS]** 15 falhas **interrompem a fila**) | **Alta — bloqueante da F5** | **DEC-015** |
| L8b | ⚠ **Vercel é serverless: não há worker persistente.** O padrão **outbox** exige um agendador (cron) como rede de segurança | Alta | **DEC-014** / `ARCHITECTURE.md` §4 |
| L9 | Dois lockfiles (`package-lock.json` + `yarn.lock`) | Média — vira alta ao instalar dependência | Fase 0 |
| L10 | Fail-safe do proxy libera `/painel/*` quando faltam envs do Supabase | Média hoje, **crítica** com dados financeiros | `SECURITY.md` |
| L11 | Valores monetários como `number` (ponto flutuante) nos mocks | Média — não repetir no domínio real | DEC-006 |
| L12 | Não há `service_role` key nem estratégia para escrita sem sessão (necessária para o webhook) | Alta | DEC-008 / `SECURITY.md` |

## 12. O que pode ser reaproveitado

**[REPO]** Apesar das lacunas, há bastante coisa aproveitável:

- **Autenticação inteira.** Login por senha e Google, PKCE, proxy, validação de `next` contra open redirect, `getUser()` no servidor. **Está correta e não precisa ser refeita** — precisa ser *estendida* com papéis.
- **Padrão de Route Handler.** `src/app/api/contact/route.ts` é o modelo a seguir para `POST /api/webhooks/asaas` (mesma estrutura, mesma checagem de env, mesma disciplina de sanitização).
- **Padrão de Server Actions.** `src/features/auth/actions/*` é o modelo para a ação "criar cobrança" (validação no servidor, retorno tipado de erro).
- **Leitura *lazy* e tipada de env.** `src/features/auth/lib/env.ts` é exatamente o padrão a replicar em `features/pagamentos/lib/env.ts`.
- **Componentes de UI do painel.** `DataTable`, `StatCard`, `StatusBadge`, `SectionCard`, `PageHeader` (`src/features/painel/components/`) atendem bem às telas de cobranças e parcelas. **`StatusBadge` com `tone: success|warning|error|info|neutral` mapeia naturalmente os estados de cobrança.**
- **Fonte única de navegação.** `src/features/painel/config/navigation.ts` — novas rotas do painel entram **apenas ali**.
- **Formatação BRL.** O helper `brl()` em `(painel)/painel/financeiro/page.tsx:12-13` já existe (embora deva ser movido para um utilitário compartilhado e passar a receber centavos).
