# Plano de implementação por fases

> Data: 14/07/2026 (revisado). ⚠ **NADA foi implementado. Todos os itens estão desmarcados** e assim permanecem até que a fase seja aprovada, executada e validada.
> ⚠ **Nenhuma fase — nem subfase — pode ser iniciada sem autorização explícita.** Aprovar uma **não** aprova a seguinte.
> **Revisão:** a F0 foi **dividida em F0A/F0B/F0C/F0D** · a F2 ganhou **resolver as lacunas H1/H2/H3** · a F5 ganhou a **outbox**.

---

## Visão geral

```
⚠ F0A  Higiene e ferramentas          ← lockfile, testes, validação, schema atual
   ↓
⚠ F0B  Identidade, papéis, autorização ← profiles(pending/admin/cliente), RLS, proxy, 1º admin
   ↓
⚠ F0C  Domínio comercial               ← organizações, projetos, propostas, condições, CONTRATOS
   ↓
⚠ F0D  Migração do painel              ← substituir mocks, uma tela por vez
   ↓
 F1   Domínio de pagamentos           ← tabelas, estados, outbox, testes
   ↓
 F2   Sandbox                          ← ⚠ E RESPONDER H1/H2/H3 → destrava a DEC-001
   ↓
 F3   Clientes no Asaas
   ↓
 F4   Criação de cobranças
   ↓
 F5   Webhooks + outbox                ⚠ NÃO vai a produção sem a F8
   ↓
 F6   Dashboard do cliente
   ↓
 F7   Área administrativa
   ↓
 F8   Testes, reconciliação, homologação
   ↓
 F9   Produção
   ↓
 F10  Remoção do Stripe                ← ⚠ VAZIA. Não há Stripe no projeto.
```

⚠ **A ordem não é negociável nos primeiros passos.** A tentação de "começar pelo Asaas, que é a parte interessante" produziria uma cobrança que **não sabe a que projeto pertence nem quem pode pagá-la**. **F0 e F1 não são burocracia — são o objeto ao qual a cobrança se prende.**

---

# ⚠ FASE 0 — dividida em quatro subfases

> **Correção da v1.** A F0 anterior era ampla demais: mexia em lockfile, testes, autenticação, papéis, RLS, domínio comercial **e** migração do painel — tudo numa aprovação só. ⚠ **Isso viola a regra do projeto ("uma tarefa pequena por vez", `CLAUDE.md`)** e concentra risco: um erro em qualquer ponto derrubaria o painel inteiro. Dividida em quatro, **cada uma com aprovação e critério de conclusão próprios**.

## F0A — Higiene e ferramentas

**Objetivo:** deixar o repositório em condições de receber código financeiro. ⚠ **Nenhuma mudança de comportamento do app.**

**Pré-requisitos:** DEC-007, DEC-012 aprovadas.
**Arquivos:** `package.json`, um dos lockfiles (**removido**), config de testes, config do validador.
⚠ **Não toca em:** nenhum componente, nenhuma página, nenhuma rota, nenhuma lógica.

**Itens:**
- [ ] ⚠ **Escolher o gerenciador de pacotes** (npm × yarn) — **[REPO]** hoje há **dois lockfiles** (`docs/TECHNICAL_OVERVIEW.md` §7). ⚠ **Necessita confirmação humana.**
- [ ] ⚠ **Remover o lockfile perdedor.** ⚠ **ANTES de instalar qualquer dependência** — instalar com dois lockfiles é como se produz uma árvore divergente entre dev e produção.
- [ ] Instalar e configurar **Vitest** (DEC-012)
- [ ] Instalar e configurar **Zod** (DEC-007)
- [ ] Adicionar script `test` ao `package.json`
- [ ] ⚠ **CONFIRMAR o schema atual do Supabase.** **[HIP]** Pode haver tabelas criadas **à mão pelo dashboard**, fora do controle de versão (`CURRENT_STATE.md` §4). ⚠ **Se houver, trazê-las para migrations ANTES de tudo** — um schema não versionado é uma bomba-relógio.

**Riscos:** 🟡 **Baixo.** É a fase mais segura — não altera comportamento.
**Critério de conclusão:** ⚠ **um único lockfile**; `npm test` roda (mesmo sem testes); `npm run build` e `npm run lint` continuam passando; ⚠ **o schema real do Supabase é conhecido e documentado**.
**Aprovação:** obrigatória.

---

## F0B — Identidade, papéis e autorização

**Objetivo:** ⚠ **corrigir o problema S1** — hoje **não existe autorização, apenas autenticação** (`SECURITY.md` §1.2).

**Pré-requisitos:** F0A. **DEC-003** e **DEC-010** aprovadas.
**Arquivos:** `supabase/migrations/*.sql` (novos); **`src/proxy.ts`** (⚠ **um** ponto — o *fail-safe*); `src/features/auth/types.ts`.
**Banco:** `profiles`, `organizations` + **RLS**.

**Itens:**
- [ ] `organizations` (com **`UNIQUE(tax_id)`**)
- [ ] ⚠ `profiles` com **`role CHECK IN ('pending','admin','cliente')`, `DEFAULT 'pending'`**
- [ ] ⚠ `CHECK` de coerência: `pending`/`admin` → `organization_id NULL`; `cliente` → `NOT NULL`
- [ ] ⚠ **RLS em ambas, exigindo `role IN ('admin','cliente')`** → **um `pending` não lê NADA**
- [ ] ⚠ **Política de `UPDATE` de `profiles` que IMPEDE o usuário de alterar o próprio `role`/`organization_id`** — ⚠ **sem isso, qualquer cliente se promove a admin e a RLS vira decoração**
- [ ] ⚠ **Bootstrap do primeiro admin** (migration/seed) — ⚠ **passo explícito e documentado**
- [ ] ⚠ **Proxy *fail closed* em produção** (DEC-010)
- [ ] Tela administrativa mínima para **promover um `pending` a `cliente`** + `audit_logs`

**Riscos:**
- 🔴 **ALTO — é a fase que mexe na autenticação.** ⚠ **Quebrar aqui derruba o painel inteiro.**
  → **Mitigação:** ⚠ **NÃO alterar a mecânica de auth** (login, OAuth, callback, `getUser()`). Apenas **acrescentar** papéis. `src/proxy.ts` muda em **um único ponto**. ⚠ **Testar os 3 caminhos** de `docs/DEVELOPMENT_WORKFLOW.md` §4.
- 🔴 ⚠ **Esquecer o bootstrap do primeiro admin** = ninguém consegue administrar nada. **Descoberto só em produção.**

**Testes:**
- [ ] ⚠ **Um `pending` não lê uma única linha de nenhuma tabela**
- [ ] ⚠ **Um cliente não consegue alterar o próprio `role`** (tentativa direta pela API do Supabase → negada)
- [ ] Cliente da empresa A não lê dados da empresa B
- [ ] Os 3 caminhos de autenticação, manualmente

**Critério de conclusão:** ⚠ existe distinção real entre admin, cliente e pendente — **provada por teste**, não por inspeção visual. **O painel continua funcionando.**
**Aprovação:** obrigatória.

---

## F0C — Domínio comercial

**Objetivo:** as entidades a que uma cobrança se prende.

**Pré-requisitos:** F0B. **DEC-004** aprovada.
**Banco:** `projects`, `proposals` (⚠ **versionadas**), `payment_terms` (⚠ **remodelada**), ⚠ **`contracts`** + RLS.
⚠ **Fora de escopo:** **qualquer coisa do Asaas.** Nenhuma tabela de cobrança, nenhuma chamada externa.

**Itens:**
- [ ] `projects`
- [ ] ⚠ `proposals` **com `version` e `supersedes_id`** — ⚠ **uma proposta aprovada é IMUTÁVEL**; mudar exige **nova versão**
- [ ] ⚠ `payment_terms` **com os TRÊS campos de parcelas** (`installment_selection_mode`, `installment_count`, `max_installments`) e ⚠ **`billing_type` concreto** — ⚠ **SEM o `allowed_billing_types` da v1** (`DATA_MODEL.md` §3.5)
- [ ] ⚠ **`CHECK` de coerência** de `payment_terms` (exatamente um entre `installment_count` e `max_installments`)
- [ ] ⚠ **`contracts`** — o **registro imutável do aceite**: **quem** aceitou, **quando**, ⚠ **qual VERSÃO**, qual condição, com **`snapshot jsonb`**
- [ ] Telas administrativas de criação (empresa, projeto, proposta, condições)
- [ ] Fluxo de **aceite da proposta pelo cliente** (⚠ **só `role='cliente'` da organização dona**)

**Riscos:**
- 🟠 ⚠ **Modelagem errada aqui é cara depois** (haverá dados). → Revisar `DATA_MODEL.md` **antes**; conferir que **todas** as restrições `UNIQUE` de §8 estão nas migrations.
- 🟠 ⚠ **Cadastrar uma condição incoerente** (o `label` diz "Pix ou cartão", o `billing_type` é `UNDEFINED`) → ⚠ **o `CHECK` do banco + validação de formulário** (`PAYMENT_FLOWS.md` §2.1).

**Critério de conclusão:** a equipe cadastra empresa → projeto → proposta → condições; o cliente **aceita**; o aceite fica registrado com **quem, quando e qual versão**.
**Aprovação:** obrigatória.

---

## F0D — Migração do painel

**Objetivo:** substituir os mocks por dados reais, ⚠ **sem regressão visual**.

**Pré-requisitos:** F0C. **DEC-005** (destino de `/painel/financeiro`).
**Arquivos:** as 4 páginas de `src/app/(painel)/painel/**`; `src/features/painel/data/*` (novo); ⚠ `src/features/painel/mocks/*` (removidos **por último**).

**Itens:**
- [ ] ⚠ **Uma tela por vez** — nunca as quatro juntas
- [ ] `/painel/clientes` → lê `organizations`
- [ ] `/painel/projetos` → lê `projects`
- [ ] `/painel` (dashboard) → dados reais
- [ ] ⚠ `/painel/financeiro` → **DEPENDE DE DEC-005** (não fundir fluxo de caixa com cobrança)
- [ ] ⚠ **Preservar o layout** — **[REPO]** MUI/Emotion; reaproveitar `DataTable`, `StatCard`, `StatusBadge`, `SectionCard`, `PageHeader`
- [ ] ⚠ **Testar acesso cruzado em CADA tela** (a empresa A não vê a B)
- [ ] ⚠ **Remover cada mock SOMENTE depois** de a tela correspondente estar lendo do banco

**Riscos:**
- 🟠 ⚠ **Regressão visual.** → uma tela por vez, conferindo no navegador.
- 🔴 ⚠ **Remover um mock antes da substituição QUEBRA A ROTA** — ela está na navegação (**[REPO]** `navigation.ts:19`).

**Critério de conclusão:** ⚠ **nenhum arquivo em `src/features/painel/mocks/`**; as 4 telas leem do banco; **nenhum usuário vê o que não é dele** (testado).
**Aprovação:** obrigatória.

---

## Fase 1 — Domínio de pagamentos

**Objetivo:** tabelas, estados e **outbox**. ⚠ **Ainda SEM tocar no Asaas.**

**Pré-requisitos:** F0D. **DEC-006** aprovada.
**Banco:** `payment_provider_customers`, `payment_plans`, `installments`, ⚠ **`payment_intents`**, `charges`, `transactions`, `refunds`, ⚠ **`outbox_events`**, ⚠ **`notifications`**, `webhook_events`, `audit_logs` + RLS + ⚠ **todas** as restrições de `DATA_MODEL.md` §8.
⚠ **Fora de escopo:** **nenhuma chamada ao Asaas.**

**Itens:**
- [ ] Todas as tabelas de `DATA_MODEL.md` §4, com RLS
- [ ] ⚠ **TODAS as restrições `UNIQUE` de §8** — ⚠ **são elas que impedem duplicidade; baratas agora, caríssimas depois**
- [ ] ⚠ **`payment_plans` com `UNIQUE(contract_id)`** — ✅ **e N contratos por projeto permitidos (aditivos)**
- [ ] ⚠ **`charges` com `UNIQUE(intent_id, attempt_number)`**
- [ ] ⚠ **`outbox_events` com `UNIQUE(idempotency_key)`**
- [ ] ⚠ **Mapeador de estados com a TABELA DE TRANSIÇÕES** (`ARCHITECTURE.md` §3.2) — ⚠ **não uma ordenação de pesos**
- [ ] Utilitário monetário (`money.ts`) com ⚠ **`Number.isSafeInteger`** e conversão de fronteira

**Riscos:** 🟠 modelagem errada é cara depois. 🟠 ⚠ **esquecer uma restrição `UNIQUE`** = duplicidade em produção.

**Testes:**
- [ ] ⚠ **`soma(parcelas) === total`**, exaustivamente
- [ ] ⚠ **`CONFIRMED` e `RECEIVED` produzem estados DIFERENTES**
- [ ] ⚠ **`vencida → paga` é PERMITIDA** (pagamento com atraso)
- [ ] ⚠ **`liquidada → contestada` é PERMITIDA** (chargeback após liquidação)
- [ ] ⚠ **`paga → aguardando_pagamento` é PROIBIDA**
- [ ] ⚠ **Estorno parcial → `parcialmente_estornada`**; ao completar o total → `estornada`
- [ ] **Evento desconhecido não lança exceção**
- [ ] ⚠ **Nenhum `BigInt` atravessa uma fronteira de serialização**

**Critério de conclusão:** o domínio existe e é testado, ⚠ **sem uma única linha de código do Asaas**.
**Aprovação:** obrigatória.

---

## Fase 2 — Sandbox ⚠ **e resolver as lacunas que bloqueiam a DEC-001**

**Objetivo:** conectar ao Sandbox **com segurança** e ⚠ **responder às três perguntas que travam a decisão de arquitetura**.

**Pré-requisitos:** F1. ⚠ **Conta Sandbox criada PELA EQUIPE DA ANTERO** (⚠ a tarefa proíbe o Claude de criar conta). **DEC-008** aprovada.
**Arquivos:** `src/features/pagamentos/lib/env.ts` (⚠ **com `import 'server-only'`**), `asaas-client.ts`; `.env.example` (⚠ **só os nomes**).

**Itens:**
- [ ] `AsaasClient` com: URL por ambiente (**[ASAAS]** `https://api-sandbox.asaas.com/v3` | `https://api.asaas.com/v3`), header **`access_token`**, **`Content-Type: application/json`**, ⚠ **`User-Agent: AnteroSistemas/1.0 (Next.js; sandbox|production)`**, timeout, tratamento de erro
- [ ] ⚠ **Conversão centavos ↔ reais decimais — SÓ AQUI** (DEC-006)
- [ ] ⚠ **Guarda: `ASAAS_ENVIRONMENT='production'` + `NODE_ENV!=='production'` → FALHAR O BOOT**

⚠ **Entregável obrigatório — responder às lacunas (`REFERENCES.md` §4):**
- [ ] ⚠ **H1 — O Checkout aceita `billingTypes: ["BOLETO"]`?** ⚠ **BLOQUEIA A DEC-001.** O negócio **exige** boleto.
- [ ] ⚠ **H2 — O payload de `CHECKOUT_PAID` traz o `payment id` e o nº de parcelas escolhido?** ⚠ **Sem isso, `customer_choice` é inviável.**
- [ ] ⚠ **H3 — O Checkout emite também os eventos `PAYMENT_*`?**
- [ ] **Registrar as três respostas em `REFERENCES.md`**, convertendo **[HIP]** em **[ASAAS]**
- [ ] Investigar se existe **header oficial de idempotência** (**[HIP]** não localizado) — registrar o resultado
- [ ] Verificar **quais métodos a conta tem habilitados** e ⚠ **como silenciar as notificações do Asaas** (DEC-013)

**Riscos:**
- 🔴 ⚠ **Vazar a API Key no bundle.** → `import 'server-only'` (⚠ **quebra o build** se importada do cliente) + ⚠ **verificação explícita em `.next/static/`**.
- 🔴 ⚠ **Usar credencial de produção por engano** → a guarda de boot.

**Critério de conclusão:** ⚠ **a DEC-001 pode finalmente ser decidida**, com base em fato e não em hipótese. A chave **não aparece** no bundle.
**Aprovação:** obrigatória. ⚠ **A DEC-001 deve ser decidida ao final desta fase, antes da F4.**

---

## Fase 3 — Clientes no Asaas

**Objetivo:** criar/localizar o cliente de forma **idempotente**.
**Pré-requisitos:** F2.
**Arquivos:** `services/cliente-asaas.ts` (`garantirClienteAsaas`).

**Riscos:** 🔴 ⚠ **Cliente duplicado.** **[ASAAS]** A API **permite** duplicatas e **não deduplica**. → `UNIQUE (organization_id, provider)` **no banco** + ⚠ **busca por `externalReference` ANTES de criar**.

**Critérios de aceite:**
- [ ] ⚠ **Idempotente:** chamar 2× (**inclusive em paralelo**) → **um** cliente
- [ ] `externalReference` = `organization_id`
- [ ] ⚠ **Organização sem CNPJ → erro de negócio claro, ANTES da chamada de rede**
- [ ] Falha de sync grava `sync_error` ⚠ **sem travar a operação da equipe**
- [ ] ⚠ **[HIP]** Testado: `provider_customer_id` que não existe mais no Asaas → **resultado registrado**

**Aprovação:** obrigatória.

---

## Fase 4 — Criação de cobranças

**Objetivo:** criar cobranças (Pix, boleto, cartão, parcelamento) com idempotência e validação **no servidor**.
**Pré-requisitos:** F3. ⚠ **DEC-001 DECIDIDA** (com base na F2). DEC-004, DEC-009.
**Arquivos:** `services/cobranca.ts`; Server Action `criarCobranca`.
⚠ **Fora de escopo:** webhooks. ⚠ **Nesta fase o sistema fica CEGO ao pagamento** — esperado, e por isso a F5 vem logo depois.

**Riscos:**
- 🔴 ⚠ **Cobrança duplicada** → `UNIQUE(idempotency_key)` + linha criada **ANTES** da rede.
- 🔴 ⚠ **Timeout com resposta ambígua** — **[ASAAS]** a doc menciona timeout de 60s *"para evitar duplicidade"*. → ⚠ **Consultar por `externalReference` ANTES de retentar** (`PAYMENT_FLOWS.md` §6.3). ⚠ **É o risco mais caro do projeto inteiro.**
- 🟠 ⚠ **[HIP]** Parcelas acima do limite da bandeira → **testar** (DEC-004).

**Critérios de aceite:**
- [ ] ⚠ Em `fixed`, o frontend envia **só** `payment_term_id`
- [ ] ⚠ Em `customer_choice`, ele envia `installment_count` — ⚠ **e o servidor VALIDA contra `max_installments`** (fora do intervalo → rejeita)
- [ ] ⚠ **Preço, método e teto vêm SEMPRE do banco** — nunca do input
- [ ] ⚠ **Sem contrato aceito → 409.** Sem aceite, não se cobra
- [ ] ⚠ **`payment_intents.status='satisfeita'` bloqueia nova cobrança** de parcela já paga
- [ ] ⚠ **Duplo clique → UMA cobrança**
- [ ] ⚠ **Timeout com cobrança já criada no Asaas → NÃO cria a segunda**
- [ ] ⚠ **Valores das parcelas batem CENTAVO A CENTAVO com os do Asaas** (**[ASAAS]** o resto vai para a última — ⚠ **lemos do Asaas, não recalculamos**)
- [ ] ⚠ **Entrada + saldo:** o saldo **NÃO** é criado junto (só após a entrada paga, na F5)
- [ ] ⚠ Mensagem ambígua ao cliente é **"estamos confirmando"**, **nunca "falhou"**

**Aprovação:** obrigatória.

---

## Fase 5 — Webhooks **e outbox**

**Objetivo:** receber eventos e executar efeitos externos **fora da transação**.
**Pré-requisitos:** F4. ⚠ **DEC-014** (agendador) e ⚠ **DEC-015** (staging) aprovadas. ⚠ **URL pública estável — `staging.anterosistemas.com.br` — é BLOQUEANTE.**
**Arquivos:** `src/app/api/webhooks/asaas/route.ts`; `services/webhook-processor.ts`; ⚠ `services/outbox-dispatcher.ts`; config de cron.

**Itens:**
- [ ] Endpoint com token em ⚠ **tempo constante**
- [ ] ⚠ **Persistir ANTES de processar** (`UNIQUE(provider_event_id)`)
- [ ] ⚠ **NENHUMA chamada HTTP dentro da transação** (`ARCHITECTURE.md` §4)
- [ ] ⚠ **`OutboxDispatcher` com `SELECT ... FOR UPDATE SKIP LOCKED`** e **backoff**
- [ ] ⚠ **Cron** como rede de segurança (DEC-014)
- [ ] Eventos `PAYMENT_*` **e** (se DEC-001 = B) ⚠ **`CHECKOUT_*`**

**Riscos:**
- 🔴 ⚠ **Derrubar a fila do Asaas.** **[ASAAS]** 15 falhas **interrompem**; reativação **manual**; eventos **descartados após 14 dias**. → ⚠ **Responder 200 mesmo em erro de processamento**, persistindo o evento. ⚠ **Esta mitigação SÓ é segura porque a F8 (reconciliação) existe.**
- 🔴 ⚠ **Chamada HTTP dentro da transação** → ⚠ **cobranças-fantasma** (criadas no Asaas, inexistentes no nosso banco). → **outbox**.
- 🔴 ⚠ **Parcelamento do saldo duplicado** (Pix dispara `RECEIVED`; cartão dispara `CONFIRMED`; podem vir os dois) → ⚠ **`UNIQUE(outbox.idempotency_key)` + `SKIP LOCKED`**.
- 🔴 ⚠ **Webhook forjado** → token em tempo constante.
- 🔴 ⚠ **Evento de sandbox processado em produção** → ⚠ **transação financeira falsa**. Tokens distintos + verificação de ambiente.

**Critérios de aceite:**
- [ ] Sem token → 401
- [ ] ⚠ **Evento duplicado → processado UMA vez**
- [ ] ⚠ **Evento desconhecido → 200 + `ignorado` + alerta. Fila VIVA**
- [ ] ⚠ **Erro de processamento → 200 + `erro` + alerta. Fila VIVA**
- [ ] ⚠ **Falha do BANCO → 500** (o único caso)
- [ ] ⚠ **Transições seguem a TABELA** (`vencida → paga` ✅; `paga → aguardando` ❌)
- [ ] ⚠ **Efeito "entrada paga" disparado por `CONFIRMED` OU `RECEIVED`, SEM duplicar o saldo**
- [ ] Payload bruto **sempre** persistido

⚠ **Critério de conclusão especial: NÃO ir a produção com a F5 sem a F8.** ⚠ **O desenho "responde 200 em erro" DEPENDE da reconciliação para não perder eventos. São inseparáveis.**
**Aprovação:** obrigatória.

---

## Fase 6 — Dashboard do cliente

**Pré-requisitos:** F5.
**Arquivos:** rotas em `src/app/(painel)/painel/...`; componentes; ⚠ **`src/features/painel/config/navigation.ts`** (**[REPO]** fonte única — ⚠ **editar SÓ ali**).

**[REC] Reaproveitar** (**[REPO]** `CURRENT_STATE.md` §12): `DataTable`, `StatCard`, `SectionCard`, `PageHeader` e sobretudo **`StatusBadge`** — seus `tone` (`success|warning|error|info|neutral`) mapeiam naturalmente os estados de cobrança. ⚠ **Não introduzir novo padrão visual** — o painel é **MUI/Emotion**; ⚠ **não misturar com o Bootstrap da landing**.

**Mostra:** empresa · projeto · proposta · **contrato** · valor · entrada · saldo · condição · método · ⚠ **nº de parcelas (e a escolha, se `customer_choice`)** · vencimentos · pagas/pendentes/vencidas · status · botão pagar · link · segunda via · Pix copia-e-cola · comprovantes · histórico · cancelamentos · reembolsos · erro · tentar novamente · contato.

**Estados visuais:** carregando · sem cobrança · aguardando · em análise · **pago** · vencido · ⚠ **expirado** (B) · cancelado · ⚠ **parcialmente reembolsado** · reembolsado · contestado · erro temporário · **integração indisponível**.

**Riscos:**
- 🔴 ⚠ **Mostrar "pago" com base no retorno do navegador** → ⚠ **o estado vem SEMPRE do banco**.
- 🟠 ⚠ **Confundir `paga` com `liquidada`** → ⚠ **o cliente vê `paga`**. **[ASAAS]** em cartão há **~32 dias** entre as duas: mostrar `liquidada` faria o cliente ver "pendente" **por um mês depois de ter pago**.

**Critérios de aceite:**
- [ ] Cliente vê **apenas** os seus dados (testado)
- [ ] ⚠ Estado **sempre** lido do banco
- [ ] ⚠ `paga` é o que o cliente vê como "Pago"
- [ ] Todos os estados visuais, ⚠ **inclusive "integração indisponível"**
- [ ] Responsivo e acessível, no padrão do painel

**Aprovação:** obrigatória.

---

## Fase 7 — Área administrativa

**Pré-requisitos:** F6.
**[REPO] Situação:** existe a **casca** (4 rotas, sidebar, componentes) — ⚠ **mas somente leitura, sobre mocks, sem permissões e sem nenhum formulário**. **Existe a casca, não existe a área administrativa.**

**A equipe deve poder:** cadastrar empresa/cliente/projeto · criar proposta (⚠ **versionada**) · ⚠ **registrar contrato/aceite** · definir valor, entrada, saldo, ⚠ **métodos (por condição)**, ⚠ **modo e nº/teto de parcelas**, vencimentos, ⚠ **quem assume juros** · gerar plano e cobrança · acompanhar cobranças e parcelas · identificar inadimplência · reenviar link · segunda via · cancelar · estornar (⚠ **inclusive parcial**) · registrar pagamento manual · consultar eventos e erros · ⚠ **consultar e reprocessar a OUTBOX** · executar conciliação · ver auditoria.

⚠ **Toda ação financeira sensível exige:** autenticação · `role='admin'` · **confirmação explícita** · `audit_logs` com ⚠ **responsável, data e MOTIVO obrigatório**.

**Riscos:**
- 🔴 ⚠ **Ação destrutiva sem confirmação** (estornar por engano) → confirmação + motivo + auditoria.
- 🔴 ⚠ **Cliente acessando rota administrativa** → verificação de papel ⚠ **na Server Action**, não só na UI.
- 🟠 ⚠ **"Registrar pagamento manual" é poderoso** — permite marcar como pago algo que não foi. → só admin, motivo obrigatório, auditoria, e ⚠ **`transactions.kind='ajuste_manual'`** — **nunca se disfarçando de pagamento real**.

**Critérios de aceite:**
- [ ] ⚠ Cliente recebe **403 em TODA ação administrativa** (testado ⚠ **na action**, não só na UI)
- [ ] ⚠ **Toda** ação financeira gera `audit_logs` com ator, data e **motivo**
- [ ] Estorno e cancelamento exigem confirmação e motivo
- [ ] ⚠ **Painel de saúde:** webhooks (hoje, erros, último) ⚠ **+ outbox (pendentes, falhos)**
- [ ] Reprocessamento manual funciona e é **idempotente**

**Decisões pendentes:** DEC-005.
**Aprovação:** obrigatória.

---

## Fase 8 — Testes, reconciliação e homologação

**Objetivo:** provar que o sistema é correto **e resiliente**. ⚠ **Inclui a reconciliação, sem a qual a F5 é insegura.**
**Pré-requisitos:** F7.
**Arquivos:** `services/reconciliacao.ts`; suíte de testes; logs; alertas.

**Riscos:** 🔴 ⚠ **Uma reconciliação que "corrige" errado é PIOR que não ter reconciliação.** → ⚠ **Só aplica transições da tabela; nunca regride; nunca ajusta valor sozinha.** Divergência de valor ou regressão → ⚠ **humano**.

**Critérios de aceite:**
- [ ] ⚠ **TODA** a suíte de `TESTING.md` (§1–§4) passando
- [ ] Reconciliação: webhook perdido · **cura do timeout** · reprocessa erro · ⚠ **destrava outbox**
- [ ] ⚠ **Reconciliação NÃO regride estado nem corrige valor sozinha** (testado)
- [ ] Executável **manualmente** pela área administrativa
- [ ] Logs ⚠ **sem segredos e sem dados pessoais completos**
- [ ] Alertas configurados **e testados** (⚠ **inclusive falha de outbox**)
- [ ] ⚠ **Roteiro de Sandbox (`TESTING.md` §5) executado INTEGRALMENTE** — ⚠ **inclusive a reativação manual da fila**
- [ ] ⚠ **Runbook escrito**

**Aprovação:** obrigatória.

---

## Fase 9 — Produção

**Pré-requisitos:** F8 **integralmente** concluída. **Todos** os critérios de `TESTING.md` §6.
**Riscos:** 🔴 ⚠ **Cobrança real errada = dinheiro real de um cliente real.**

**Critérios de aceite:**
- [ ] Credenciais de produção **só** na infra de produção
- [ ] ⚠ Webhook de produção em **`https://anterosistemas.com.br/api/webhooks/asaas`**, com token **próprio** (⚠ **nunca o do sandbox**)
- [ ] Monitoramento e alertas **ativos**
- [ ] ⚠ **Primeira cobrança real: valor baixo, cliente conhecido, acompanhada em tempo real**
- [ ] ⚠ **Dinheiro confirmado na conta do Asaas** antes de liberar para todos
- [ ] ⚠ **Não liberar numa sexta-feira** — ⚠ **[ASAAS]** se a fila for interrompida no sábado, os eventos começam a expirar (14 dias) e a recuperação é **manual**, com ninguém olhando.

**Aprovação:** ⚠ **obrigatória e explícita. É dinheiro real.**

---

## Fase 10 — Remoção do Stripe

⚠ **Status: VAZIA — nada a fazer.**

**[REPO]** A busca exaustiva **não encontrou nenhuma implementação, dependência, variável, tabela, tipo, teste ou código morto** de Stripe (`STRIPE_MIGRATION.md`). ⚠ **A integração é greenfield.**

Não há: dependência a desinstalar, variável a aposentar, código a apagar, tabela a preservar, migration intocável, risco de quebrar dashboard ou autenticação, nem ordem de transição.

⚠ **Fase registrada apenas para documentar que a hipótese foi investigada e encerrada.** Nenhum item. Nenhuma ação.

---

## Resumo das aprovações

| Fase | Objetivo | Decisões bloqueantes | Aprovada? |
|---|---|---|---|
| ⚠ **F0A** | Higiene e ferramentas | DEC-007, DEC-012 | ❌ **pendente** |
| ⚠ **F0B** | Identidade, papéis, RLS | **DEC-003**, DEC-010 | ❌ pendente |
| ⚠ **F0C** | Domínio comercial | DEC-004, DEC-006 | ❌ pendente |
| ⚠ **F0D** | Migração do painel | DEC-005 | ❌ pendente |
| F1 | Domínio de pagamentos | DEC-006 | ❌ pendente |
| ⚠ **F2** | Sandbox ⚠ **+ resolver H1/H2/H3** | DEC-008 | ❌ pendente |
| F3 | Clientes no Asaas | — | ❌ pendente |
| F4 | Cobranças | ⚠ **DEC-001** (decidida na F2), DEC-004, DEC-009 | ❌ pendente |
| F5 | Webhooks + outbox | **DEC-014**, **DEC-015**, DEC-011, DEC-013 | ❌ pendente |
| F6 | Dashboard do cliente | — | ❌ pendente |
| F7 | Área administrativa | DEC-005 | ❌ pendente |
| F8 | Testes e reconciliação | — | ❌ pendente |
| F9 | Produção | — | ❌ pendente |
| F10 | Stripe | — | **vazia** |

⚠ **Nenhuma fase foi iniciada. Nenhum item deste plano foi executado.**
