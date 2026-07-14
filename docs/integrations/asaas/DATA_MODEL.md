# Modelo de dados proposto

> Data: 14/07/2026 (revisado na 2ª rodada). **Tudo aqui é [REC] — proposta.** Nenhuma migration foi escrita, nenhuma tabela criada.
> **[REPO]** O repositório **não possui banco modelado** (`CURRENT_STATE.md` §4). Todas as tabelas são novas; **não há dado legado a migrar**.

**Correções desta revisão:** representação monetária em TypeScript (§1) · estado `pending` de `profiles` (§3.1) · **`allowed_billing_types` removido** e condições de pagamento remodeladas (§3.5) · **contratos e aceite de proposta** (§3.6) · **`payment_intents` e tentativas** (§4.4) · **`outbox_events`** (§4.8) · **valores bruto/líquido/taxas** (§4.6) · **notificações** (§4.9).

---

## 1. Representação monetária — **[REC] revisada**

**[REPO] O padrão atual é inadequado:** `MovimentoFinanceiro.valor` é `number` somado com `reduce` em ponto flutuante (`src/app/(painel)/painel/financeiro/page.tsx:68-75`). É mock, mas **não pode ser herdado**.

**[REC] Recomendação — centavos, com tipos diferentes em cada camada:**

| Camada | Tipo | Motivo |
|---|---|---|
| **PostgreSQL** | **`bigint`** (coluna sufixada `_cents`) | Exato. Sem risco de overflow. |
| **TypeScript** | ⚠ **`number` inteiro, em centavos** — **não `BigInt`** | Ver abaixo. |
| **Fronteira do Asaas** | **`number` decimal em reais** (ex.: `20000.00`) | **[ASAAS]** A API usa reais decimais. Conversão **só no `AsaasClient`**. |

> **Correção da 1ª versão.** A v1 dizia "`bigint` em todo o domínio TypeScript". **Isso estava errado.** O `BigInt` do JavaScript **não é serializável em JSON** (`JSON.stringify(1n)` **lança `TypeError`**) — o que quebraria Server Actions, respostas de API e qualquer payload que atravessasse a fronteira servidor→cliente do Next.js. Além disso, `BigInt` não interopera com `number` em operações aritméticas sem conversão explícita, e o driver do Supabase devolve `bigint` do Postgres como **string** ou **number**, nunca como `BigInt` nativo.

**[REC] Regras concretas:**

1. **Em TypeScript, dinheiro é `number` inteiro representando centavos.** Nunca decimal, nunca `BigInt`.
2. ⚠ **Validar com `Number.isSafeInteger(valor)`** em toda entrada e em toda leitura do banco. `Number.MAX_SAFE_INTEGER` ≈ 9,007 × 10¹⁵ centavos ≈ **R$ 90 trilhões** — folga absurda para o negócio da ANTERO, mas a validação é barata e transforma um erro silencioso em erro explícito.
3. ⚠ **Conversão explícita na fronteira do banco.** O driver pode devolver `bigint` como **string**. A camada de dados **converte e valida**:
   ```
   lerCentavos(v: string | number): number
     → Number(v), rejeitando se !Number.isSafeInteger()
   ```
   **Nunca** confiar que o driver devolveu um `number`.
4. ⚠ **Nenhuma serialização direta de `BigInt`.** Se algum dia um `BigInt` entrar no domínio, ele **não sai** num JSON. Proibido.
5. **Conversão para reais decimais SOMENTE no `AsaasClient`** (`centavos / 100`, com arredondamento explícito). Nenhuma outra camada conhece "reais".
6. **Convenção de nome:** toda coluna e todo campo monetário termina em **`_cents`** / `Cents`. Torna o erro visível na leitura do código.

**Por que não `numeric(12,2)` no Postgres:** é exato **no banco**, mas o driver JS o devolve como *string* ou o converte para *float*, **reintroduzindo o problema na aplicação** — que é exatamente onde os cálculos de entrada, saldo e divisão de parcelas acontecem. Centavos elimina a conversão perigosa.

→ **DEC-006**, `pendente`. Testes em `TESTING.md` §1.1.

---

## 2. Convenções gerais

**[REC]**
- **PK:** `id uuid default gen_random_uuid()`.
- **Auditoria:** `created_at`, `updated_at` (`timestamptz`, via trigger); `created_by uuid references auth.users(id)` onde há ação humana.
- ⚠ **Exclusão:** **nenhuma tabela financeira admite `DELETE`.** `deleted_at` (soft delete) ou transição de estado. Histórico financeiro **não se apaga**.
- **Referências externas:** colunas prefixadas — `provider`, `provider_charge_id`, `provider_customer_id`, `provider_checkout_id`. Nunca um `external_id` ambíguo.
- **Estados:** `text` com `CHECK`, não `enum` do Postgres (adicionar valor a `enum` exige lock; esses estados **vão** evoluir).
- **Nomes:** inglês, `snake_case`. **[REPO]** Evita colisão com os tipos de apresentação já existentes (`Cliente`, `Projeto`, `MovimentoFinanceiro` em `src/features/painel/types.ts`).

---

## 3. F0 — Fundação

### 3.1 `profiles` — ⚠ com estado **pendente** (corrigido)

**Objetivo:** dar papel e organização ao usuário do Supabase Auth. **[REPO]** Hoje **não existe nenhum conceito de papel** (`CURRENT_STATE.md` §3.3).

> **Correção da 1ª versão — a v1 era contraditória.** Ela definia `role default 'cliente'` **e** um `CHECK` exigindo `organization_id NOT NULL` para clientes. Um usuário recém-criado pelo Supabase Auth **não tem organização** — logo o `INSERT` do perfil **violaria o `CHECK` e falharia**, quebrando o cadastro. E se relaxássemos o `CHECK`, teríamos um "cliente sem organização" cujo acesso dependeria de a RLS acertar — um estado ambíguo, que é o oposto de *fail closed*.

**[REC] Solução: um terceiro estado explícito.** Um usuário recém-criado é **`pending`** — não é cliente nem admin. **Ele não é nada até que um admin o vincule.**

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | = `auth.users.id` (FK, `on delete cascade`) |
| `full_name` | `text` | não | |
| `email` | `text` | sim | espelho, para exibição |
| **`role`** | `text` | sim | ⚠ **`CHECK IN ('pending','admin','cliente')`** · **`DEFAULT 'pending'`** |
| `organization_id` | `uuid` | **não** | FK → `organizations`. **Nulo enquanto `pending`** |
| `activated_at` | `timestamptz` | não | quando foi vinculado |
| `activated_by` | `uuid` | não | **qual admin** vinculou (auditoria) |
| `created_at`, `updated_at` | | | |

**Restrição de coerência:**
```sql
CHECK (
  (role = 'pending' AND organization_id IS NULL)          -- recém-criado: sem org, sem acesso
  OR (role = 'admin'   AND organization_id IS NULL)        -- equipe ANTERO: sem org
  OR (role = 'cliente' AND organization_id IS NOT NULL)    -- cliente: SEMPRE com org
)
```

**Índices:** `(organization_id)`, `(role)`.

⚠ **[REC] O comportamento *fail closed*, explicitamente:**
- O `DEFAULT 'pending'` significa que **todo** usuário novo nasce **sem acesso a nada**.
- ⚠ **A RLS de TODAS as tabelas exige `role IN ('admin','cliente')`.** Um `pending` **não lê uma única linha** — não por omissão, mas por regra explícita.
- **Promover alguém a `cliente` ou `admin` é ação administrativa**, auditada (`activated_by`, `activated_at`).
- ⚠ **A coluna `role` NÃO pode ser alterada pelo próprio usuário** — a política de `UPDATE` de `profiles` permite ao usuário editar `full_name`, **jamais** `role` nem `organization_id`. Sem isso, qualquer cliente se promoveria a admin com uma chamada à API do Supabase.

**⚠ Bootstrap do primeiro admin (o problema do ovo e da galinha):** se todo usuário nasce `pending` e só um `admin` pode promover, **o primeiro admin não pode ser criado pela aplicação**. **[REC]** Ele é criado por **migration/seed** ou manualmente no painel do Supabase, **uma única vez**, com o e-mail da equipe. **Isso deve ser um passo explícito e documentado da F0B**, não uma descoberta em produção.

### 3.2 `organizations`

A **empresa cliente**. É a fronteira de autorização.

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `legal_name` | `text` | sim | razão social |
| `trade_name` | `text` | não | nome fantasia |
| `person_type` | `text` | sim | `CHECK IN ('PF','PJ')` |
| **`tax_id`** | `text` | sim | **CPF/CNPJ, só dígitos. UNIQUE** |
| `email`, `phone`, `mobile_phone` | `text` | não | |
| `postal_code`, `address`, `address_number`, `complement`, `province`, `city`, `state` | `text` | não | |
| `created_at`, `updated_at`, `created_by` | | | |

**[ASAAS]** `tax_id` é obrigatório porque **`cpfCnpj` é obrigatório** na criação de cliente no Asaas. **Sem ele, não há como cobrar.**

### 3.3 `projects`

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `organization_id` | `uuid` | sim | FK → `organizations` |
| `name` | `text` | sim | |
| `status` | `text` | sim | `CHECK IN ('prospeccao','proposta','contratado','em_execucao','entregue','cancelado')` |
| `created_at`, `updated_at`, `created_by`, `deleted_at` | | | |

**[REPO]** Compare com o mock `Projeto`, onde `cliente` é uma **string**. Aqui é **FK real** — é o que permite autorizar.

### 3.4 `proposals` — ⚠ com **versão** e **aceite** (corrigido)

> **Correção:** a v1 não registrava **quem aceitou, quando, nem qual versão**. Uma proposta que muda de valor depois de aceita destruiria a rastreabilidade.

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `project_id` | `uuid` | sim | FK → `projects` |
| **`version`** | `int` | sim | **NOVO.** 1, 2, 3… |
| **`supersedes_id`** | `uuid` | não | **NOVO.** FK → `proposals` — a proposta que esta substitui |
| `total_cents` | `bigint` | sim | `CHECK > 0` |
| `status` | `text` | sim | `CHECK IN ('rascunho','enviada','aprovada','recusada','expirada','substituida')` |
| `valid_until` | `date` | não | |
| `created_at`, `updated_at`, `created_by` | | | |

**Índices:** `(project_id)`, `(status)`, `UNIQUE (project_id, version)`.

⚠ **[REC] Regra de imutabilidade:** **uma proposta `aprovada` é IMUTÁVEL.** Mudar as condições exige criar uma **nova versão** (`version + 1`, `supersedes_id` apontando para a anterior), que passa por novo aceite. A anterior vira `substituida`. **Editar uma proposta já aceita reescreveria o que o cliente concordou em pagar** — e é exatamente o tipo de coisa que se descobre em juízo.

### 3.5 ⚠ `payment_terms` — **remodelada** (correção central)

**Objetivo:** uma **condição de pagamento** que a ANTERO **autoriza** para uma proposta. Uma proposta oferece N; o cliente escolhe **uma**.

> ### ⚠ As duas correções desta tabela
>
> **(1) `allowed_billing_types text[]` foi REMOVIDO.**
> **[ASAAS]** Na cobrança tradicional, **`billingType` é um valor ÚNICO** (`REFERENCES.md` §3): ou um método **concreto**, ou **`UNDEFINED`** — que libera **tudo o que a conta tiver habilitado**, sem controle nosso. **Não existe "aceite Pix e cartão, mas não boleto".**
> Um array no banco que a integração **não consegue impor** é uma **promessa falsa**: a condição diria "Pix ou cartão" e o cliente veria, na tela do Asaas, **boleto também**. **Guardar no banco uma regra que não se pode aplicar é pior do que não guardá-la** — dá a ilusão de controle.
>
> **(2) Número de parcelas: TRÊS conceitos que a v1 misturava.**
> - **`installment_count`** — quantidade **fixa**, definida por **nós**.
> - **`max_installments`** — **teto**, quando **o cliente escolhe**.
> - **`installment_selection_mode`** — **quem decide**: `fixed` ou `customer_choice`.
> A v1 tinha só `max_installments` e falava em "validar o nº de parcelas" sem dizer **quem** o escolhia. São coisas diferentes, com implicações diferentes em cada estratégia.

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `proposal_id` | `uuid` | sim | FK → `proposals` |
| `label` | `text` | sim | ex.: "Cartão em até 10x" — **é o que o cliente lê** |
| `kind` | `text` | sim | `CHECK IN ('a_vista','parcelado','entrada_saldo','mensal','marcos','recorrente')` |
| ⚠ **`billing_type`** | `text` | sim | **UM método concreto**: `CHECK IN ('PIX','BOLETO','CREDIT_CARD','UNDEFINED')` |
| ⚠ **`billing_types`** | `text[]` | não | **Só é aplicável na Estratégia B (Checkout).** **[ASAAS]** lá `billingTypes` **é array** e **impõe o conjunto**. **Nulo em A/C.** |
| ⚠ **`installment_selection_mode`** | `text` | sim | **`CHECK IN ('fixed','customer_choice')`** |
| ⚠ **`installment_count`** | `int` | não | **Obrigatório quando `fixed`.** A quantidade exata. |
| ⚠ **`max_installments`** | `int` | não | **Obrigatório quando `customer_choice`.** O teto. `CHECK BETWEEN 1 AND 21` |
| `down_payment_cents` | `bigint` | não | entrada (quando `kind='entrada_saldo'`) |
| `down_payment_billing_type` | `text` | não | método **concreto** da entrada (ex.: `PIX`) |
| `interest_owner` | `text` | não | `CHECK IN ('antero','cliente')` — **[HIP]** DEC-009 |
| `is_active` | `boolean` | sim | `default true` |
| `created_at`, `updated_at` | | | |

**Restrições de coerência — é o `CHECK` que impede a condição incoerente:**
```sql
CHECK (
  (installment_selection_mode = 'fixed'
     AND installment_count IS NOT NULL AND max_installments IS NULL)
  OR
  (installment_selection_mode = 'customer_choice'
     AND max_installments IS NOT NULL AND installment_count IS NULL)
)
-- billing_types só faz sentido no Checkout:
CHECK (billing_types IS NULL OR array_length(billing_types, 1) >= 1)
```

### ⚠ Como cada campo é usado em cada estratégia — a tabela que impede o erro

| | **A — Cobrança tradicional (`invoiceUrl`)** | **B — Asaas Checkout** | **C — Link de pagamento** |
|---|---|---|---|
| **Métodos** | ⚠ Envia **`billing_type`** (**um só**). **[ASAAS]** `UNDEFINED` libera **tudo da conta** | ✅ Envia **`billing_types`** (**array**) → **[ASAAS]** impõe **exatamente** o conjunto | Envia `billingType` (**um só**) |
| **Nº de parcelas** | ⚠ **Só `fixed`.** Envia `installmentCount = installment_count`. **O cliente NÃO escolhe.** | ✅ **Ambos.** `fixed` → `installment.maxInstallmentCount = installment_count` (**[HIP]** confirmar que o Asaas não deixa escolher menos). `customer_choice` → `maxInstallmentCount = max_installments` e **o cliente escolhe na página** | ✅ `chargeType: INSTALLMENT` + `maxInstallmentCount` |
| **`installment_selection_mode`** | ⚠ **DEVE ser `fixed`.** `customer_choice` é **impossível** em A | ✅ Qualquer um | ✅ Qualquer um |
| **Quem valida** | O **servidor**, na criação | O **servidor** define o teto; **o Asaas aplica**; ⚠ **o valor final volta pelo webhook** (**[HIP]** H2) | Idem B |

⚠ **[REC] Regra que a documentação precisa impor — e este é o objetivo desta seção:**

> **Uma condição comercial NUNCA pode permitir um método diferente do que foi apresentado ao cliente.**

Como garantir, em cada caso:

| Cenário | Regra |
|---|---|
| **Estratégia A + método concreto** | ✅ **Seguro.** `billing_type='PIX'` → o cliente **só** pode pagar por Pix. **É esta a forma recomendada em A.** |
| ⚠ **Estratégia A + `UNDEFINED`** | 🔴 **PROIBIDO por padrão.** Libera **todos os métodos habilitados na conta** — que **não controlamos** e que **podem mudar sem que ninguém no time saiba**. O `label` diria "Pix ou cartão" e o cliente veria boleto. **Só usar `UNDEFINED` com aprovação explícita e ciência de que a condição aceita tudo.** |
| ⚠ **Quer oferecer "Pix OU cartão, sem boleto" na Estratégia A** | **Impossível numa única condição.** → **Criar CONDIÇÕES SEPARADAS**: uma `billing_type='PIX'` ("Pix à vista — 5% de desconto") e outra `billing_type='CREDIT_CARD'` ("Cartão em até 10x"). ✅ **O cliente escolhe a CONDIÇÃO; a condição determina o método.** Isso resolve o problema **e** melhora a UX — condições comerciais distintas costumam ter preços distintos. |
| **Estratégia B (Checkout)** | ✅ **`billing_types: ['PIX','CREDIT_CARD']`** — **[ASAAS]** o array **é imposto pelo Asaas**. **É a única forma de oferecer um subconjunto numa condição única.** |

**[REC] Consequência prática:** se a DEC-001 resolver por **A**, o modelo comercial da ANTERO passa a ser **"condições separadas por método"**. Isso **não é uma limitação técnica que se contorna** — é **a forma correta de modelar** quando o provedor não permite impor subconjuntos. E, como cada condição pode ter preço próprio, é **melhor comercialmente**.

**[ASAAS] Sobre o teto de 21:** o Asaas permite **até 21x em Visa/Mastercard** e **até 12x nas demais**. A bandeira **só é conhecida na tela de pagamento**. **[HIP]** O que acontece ao oferecer 15x a um cartão Elo **é desconhecido** → **[REC] postura conservadora: limitar a 12 até testar** (DEC-004).

### 3.6 ⚠ `contracts` — **NOVO** (registro do aceite)

> **Correção:** a v1 **não tinha entidade de contrato** e registrava o aceite como dois campos soltos em `proposals` (`approved_at`, `approved_by`). Isso é insuficiente: não guarda **qual versão** foi aceita, não distingue **aprovação interna** de **aceite do cliente**, e não sobrevive a uma proposta que muda.

**Objetivo:** o registro **imutável** de que **um cliente específico aceitou uma versão específica de uma proposta, numa data específica**. É o documento que sustenta a cobrança.

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `project_id` | `uuid` | sim | FK → `projects` |
| ⚠ **`proposal_id`** | `uuid` | sim | FK → `proposals` — **a VERSÃO exata aceita** |
| ⚠ **`proposal_version`** | `int` | sim | **snapshot** da versão (redundante de propósito — sobrevive a qualquer alteração futura) |
| ⚠ **`payment_term_id`** | `uuid` | sim | **a condição que o cliente escolheu** |
| **`total_cents`** | `bigint` | sim | **snapshot** do valor aceito |
| ⚠ **`accepted_by`** | `uuid` | sim | FK → `auth.users` — **QUEM aceitou** |
| ⚠ **`accepted_at`** | `timestamptz` | sim | **QUANDO** |
| **`accepted_ip`** | `text` | não | evidência do aceite |
| **`snapshot`** | `jsonb` | sim | ⚠ **cópia integral** da proposta e da condição no momento do aceite |
| `status` | `text` | sim | `CHECK IN ('ativo','cancelado','substituido')` |
| `created_at` | | | |

⚠ **Quem pode aceitar [REC]:** **apenas** um usuário com `role='cliente'` **da organização dona do projeto**. Um `admin` **não aceita pelo cliente** — se a ANTERO precisar registrar um aceite feito por fora (assinatura em papel, e-mail), isso é um **registro administrativo explícito**, com `accepted_by` = o usuário do cliente e uma nota de auditoria dizendo quem o registrou. **Um admin aceitando silenciosamente em nome do cliente é o caminho para uma cobrança contestada.**

**Índices:** `(project_id)`, `(proposal_id)`.
**[REC]** O `snapshot jsonb` existe porque **o contrato deve ser legível daqui a cinco anos**, mesmo que as tabelas de proposta tenham mudado de forma. É o mesmo princípio do `webhook_events.payload`: **o fato é imutável; o estado é derivado.**

---

## 4. F1 — Domínio de pagamentos

### 4.1 `payment_provider_customers`

Vincula uma `organization` a um `customer` do Asaas.

**[ASAAS] Por que tabela e não coluna:** a API **permite duplicatas** e **não deduplica** — prevenir é **nossa** responsabilidade. Uma tabela dedicada permite uma **restrição de unicidade real**, que torna a duplicata **impossível no banco**, não apenas improvável no código.

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `organization_id` | `uuid` | sim | FK |
| `provider` | `text` | sim | `default 'asaas'` |
| `provider_customer_id` | `text` | sim | id do customer no Asaas |
| `external_reference` | `text` | sim | o que enviamos — **o `organization_id`** |
| `synced_at`, `sync_error` | | não | |
| `created_at`, `updated_at` | | | |

⚠ **Restrições — as duas mais importantes:**
- **`UNIQUE (organization_id, provider)`** → **uma organização não pode ter dois clientes no Asaas.**
- **`UNIQUE (provider, provider_customer_id)`** → o mesmo customer não vincula a duas organizações.

### 4.2 `payment_plans`

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `project_id` | `uuid` | sim | FK |
| ⚠ **`contract_id`** | `uuid` | sim | **FK → `contracts`** — **um plano SEMPRE nasce de um contrato aceito** |
| `payment_term_id` | `uuid` | sim | FK |
| `kind` | `text` | sim | snapshot |
| `total_cents` | `bigint` | sim | **snapshot** |
| `down_payment_cents` | `bigint` | não | **snapshot** |
| ⚠ **`installments_count`** | `int` | não | ⚠ **o número FINAL de parcelas** — em `customer_choice`, **só é conhecido depois do pagamento** (ver §4.3) |
| `status` | `text` | sim | `CHECK IN ('rascunho','ativo','quitado','cancelado','inadimplente')` |
| `created_at`, `updated_at`, `created_by` | | | |

⚠ **Restrição — corrigida.** A v1 tinha `UNIQUE (project_id) WHERE status IN ('rascunho','ativo')`: **um projeto só poderia ter UM plano vivo, para sempre.**

> **Por que isso estava errado.** Um projeto real recebe **aditivos**: escopo extra, uma segunda fase, uma manutenção contratada depois. Cada um é **uma nova proposta, um novo contrato e um novo plano** — e todos convivem, ativos, no **mesmo projeto**. A restrição da v1 **tornaria o trabalho extra impossível de cobrar** sem cancelar o plano original.

**[REC] Restrição correta — a unicidade é por CONTRATO, não por projeto:**
```sql
UNIQUE (contract_id)   -- um contrato aceito gera EXATAMENTE UM plano de pagamento
```
✅ Um projeto pode ter **N contratos** (o original + aditivos) → **N planos ativos**, cada um rastreável à proposta e ao aceite que o originou. É isto que torna aditivo, proposta adicional e trabalho extra **representáveis**.

### 4.3 `installments` — as parcelas

O que o **cliente** entende ("parcela 3 de 10").

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `payment_plan_id` | `uuid` | sim | FK |
| `number` | `int` | sim | 1, 2, 3… |
| `kind` | `text` | sim | `CHECK IN ('entrada','parcela','mensalidade','marco')` |
| `amount_cents` | `bigint` | sim | `CHECK > 0` |
| `due_date` | `date` | sim | |
| `status` | `text` | sim | `CHECK IN ('pendente','paga','liquidada','vencida','parcialmente_estornada','estornada','cancelada')` |
| `milestone_label` | `text` | não | quando `kind='marco'` |
| `created_at`, `updated_at` | | | |

**`UNIQUE (payment_plan_id, number)`**.

⚠ **[REC] Quando as parcelas são materializadas — depende do modo (novo):**

| Modo | Quando as linhas de `installments` são criadas |
|---|---|
| **`fixed`** | ✅ **Na criação do plano.** Sabemos o número e os valores desde o início. |
| ⚠ **`customer_choice`** | ⚠ **SÓ APÓS O PAGAMENTO.** **Não sabemos** em quantas vezes o cliente vai parcelar até ele escolher, **na página do Asaas**. → O plano nasce **sem** parcelas; o **webhook** (`CHECKOUT_PAID` / `PAYMENT_CONFIRMED`) traz o número final, e **só então** as `installments` são criadas — via **comando de outbox**, idempotente. **[HIP]** Depende da lacuna **H2** (`REFERENCES.md` §4): **se o payload não trouxer o nº de parcelas, `customer_choice` é inviável** e todas as condições terão de ser `fixed`. **Testar em Sandbox antes de prometer esta funcionalidade ao cliente.** |

**[REC] Nota de nomenclatura:** nossa tabela `installments` **≠** o `installment` do Asaas (que é o agrupador de um parcelamento). Nossa tabela é o **modelo do negócio**; `charges` é o **espelho do provedor**. **[REC]** Considerar renomear para `plan_items` para eliminar a ambiguidade → parte de DEC-005.

### 4.4 ⚠ `payment_intents` e `charges` — **tentativas** (NOVO)

> **Correção da 1ª versão.** A v1 dizia: "nova tentativa gera uma chave com um contador de tentativa: `sha256(plan:num:kind:attempt)`" — mas **não modelava o `attempt` em lugar nenhum**. Não havia onde guardá-lo, nem como saber qual era a tentativa atual, nem como ligar as tentativas entre si. A regra era inconsistente com o modelo.

**[REC] Separar a INTENÇÃO da TENTATIVA.**

- **`payment_intent`** = *"esta parcela precisa ser paga"*. Estável. Nasce uma vez.
- **`charge`** = *"esta é a n-ésima tentativa de cobrar aquela intenção"*. Pode haver várias (cartão recusado, checkout expirado).

#### `payment_intents`

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `payment_plan_id` | `uuid` | sim | FK |
| `installment_id` | `uuid` | não | FK → `installments` |
| `organization_id` | `uuid` | sim | desnormalizado (RLS) |
| `kind` | `text` | sim | `CHECK IN ('entrada','parcela','parcelamento','mensalidade','marco')` |
| `amount_cents` | `bigint` | sim | `CHECK > 0` |
| **`status`** | `text` | sim | `CHECK IN ('aberta','satisfeita','abandonada')` |
| ⚠ **`current_attempt`** | `int` | sim | `default 0` — a tentativa em curso |
| `created_at`, `updated_at` | | | |

**`UNIQUE (installment_id) WHERE installment_id IS NOT NULL`** — uma parcela tem **uma** intenção.
⚠ **`status='satisfeita'`** quando **alguma** de suas charges chega a `paga`/`liquidada`. **É o que impede uma segunda cobrança de uma parcela já paga.**

#### `charges` (revisada)

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| ⚠ **`intent_id`** | `uuid` | sim | **FK → `payment_intents`** — **o vínculo com a intenção original** |
| ⚠ **`attempt_number`** | `int` | sim | **1, 2, 3…** |
| `payment_plan_id`, `installment_id`, `organization_id` | `uuid` | | (denormalizados p/ RLS e consulta) |
| `provider` | `text` | sim | `default 'asaas'` |
| `provider_charge_id` | `text` | não | **nulo até a criação ser confirmada** |
| `provider_installment_id` | `text` | não | agrupador de parcelamento do Asaas |
| ⚠ **`provider_checkout_id`** | `text` | não | **NOVO** — Estratégia B |
| `external_reference` | `text` | sim | **o que enviamos** — o `charges.id`. **[ASAAS]** máx. 200 chars no Checkout ✅ (uuid cabe) |
| ⚠ **`idempotency_key`** | `text` | sim | **UNIQUE.** Ver §4.5 |
| `billing_type` | `text` | sim | `CHECK IN ('PIX','BOLETO','CREDIT_CARD','UNDEFINED')` |
| ⚠ **`billing_types`** | `text[]` | não | Estratégia B |
| ⚠ **`installment_count`** | `int` | não | ⚠ **o nº FINAL** — em `customer_choice`, **preenchido pelo webhook** |
| `amount_cents` | `bigint` | sim | `CHECK > 0` |
| ⚠ **`net_amount_cents`** | `bigint` | não | **NOVO** — líquido após taxas (§4.6) |
| ⚠ **`fee_cents`** | `bigint` | não | **NOVO** — taxa do Asaas (§4.6) |
| `due_date` | `date` | sim | |
| ⚠ **`expires_at`** | `timestamptz` | não | **NOVO** — Estratégia B (**[ASAAS]** `minutesToExpire`) |
| `status` | `text` | sim | os 12 estados de `ARCHITECTURE.md` §3.1 |
| `invoice_url` | `text` | não | **[ASAAS]** página hospedada (A) |
| ⚠ **`checkout_url`** | `text` | não | **NOVO** — o `link` do Checkout (B) |
| `bank_slip_url`, `pix_payload` | `text` | não | segunda via / copia-e-cola |
| `confirmed_at`, `settled_at` | `timestamptz` | não | quando virou `paga` / `liquidada` |
| `last_provider_status` | `text` | não | ⚠ **status cru do Asaas — só para depuração. NENHUMA regra de negócio o lê.** |
| `created_at`, `updated_at`, `created_by` | | | |

⚠ **Restrições — as que impedem duplicidade:**
- **`UNIQUE (idempotency_key)`** — a defesa estrutural contra cobrança duplicada.
- ⚠ **`UNIQUE (intent_id, attempt_number)`** — **NOVO.** Duas linhas **não podem** ser a mesma tentativa da mesma intenção.
- **`UNIQUE (provider, provider_charge_id) WHERE provider_charge_id IS NOT NULL`** — o mesmo payment do Asaas não vira duas charges nossas.
- **`UNIQUE (provider, provider_checkout_id) WHERE provider_checkout_id IS NOT NULL`**.
- Índices: `(intent_id)`, `(payment_plan_id)`, `(organization_id)`, `(status)`, `(due_date)`, `(status, updated_at)` (reconciliação).

### 4.5 ⚠ A chave idempotente — consistente entre os cinco cenários

**[REC] Fórmula única:**
```
idempotency_key = sha256( intent_id + ':' + attempt_number )
```

⚠ **É determinística.** A mesma tentativa **sempre** produz a mesma chave. Uma tentativa nova produz uma chave nova. Nada mais.

| Cenário | `intent_id` | `attempt_number` | Chave | Resultado |
|---|---|---|---|---|
| **1ª tentativa** | I1 | 1 | K(I1,1) | Cria a charge. |
| ⚠ **Duplo clique** | I1 | 1 | **K(I1,1)** — **a mesma** | `UNIQUE` **colide** → relê a linha → devolve **a mesma URL**. ✅ **Uma cobrança.** |
| ⚠ **Retry após timeout** | I1 | 1 | **K(I1,1)** — **a mesma** | ⚠ **Não cria nada de novo.** Consulta o Asaas por `externalReference` e **vincula** (`PAYMENT_FLOWS.md` §6.3). ✅ |
| ⚠ **Nova tentativa após recusa** | I1 | **2** | **K(I1,2)** — **diferente** | ✅ Cria uma **nova** charge. **A anterior permanece com `status='falha'`** — histórico preservado. `payment_intents.current_attempt` → 2. |
| ⚠ **Reprocessamento administrativo** | I1 | (o existente) | **a mesma da tentativa alvo** | ✅ **Idempotente por construção** — reprocessar **não cria cobrança**; apenas reexecuta o processamento do que já existe. |

⚠ **A guarda que fecha o ciclo:** uma nova tentativa **só é permitida se `payment_intents.status = 'aberta'`**. Se a intenção já está **`satisfeita`** (alguma charge chegou a `paga`), **nenhuma nova tentativa é criada** — é isso que impede cobrar de novo uma parcela **já paga**, mesmo que alguém clique no botão antigo ou reprocesse um evento velho.

**Armazenamento:** a chave vive em `charges.idempotency_key`, **permanentemente**. **Não expira.** É parte da identidade da cobrança, não um cache — uma chave que expira é uma cobrança duplicada esperando acontecer.

### 4.6 ⚠ `transactions` — com bruto, líquido e taxas (corrigido)

> **Correção:** a v1 registrava **um único valor**. Mas **o que o cliente paga ≠ o que a ANTERO recebe** — o Asaas retém taxa. Sem separar, o "financeiro" da ANTERO estaria **sistematicamente errado**.

Append-only. **Nunca se atualiza, nunca se apaga.**

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `charge_id` | `uuid` | sim | FK |
| `kind` | `text` | sim | `CHECK IN ('pagamento','liquidacao','estorno','chargeback','taxa','antecipacao','ajuste_manual')` |
| ⚠ **`gross_amount_cents`** | `bigint` | sim | **valor BRUTO** — o que o cliente pagou. **Pode ser negativo** (estorno). |
| ⚠ **`fee_cents`** | `bigint` | não | **taxa retida pelo Asaas** |
| ⚠ **`net_amount_cents`** | `bigint` | não | **líquido = bruto − taxa** — **é este que o financeiro soma** |
| `occurred_at` | `timestamptz` | sim | quando o fato ocorreu **segundo o Asaas** |
| `provider_event_id` | `text` | não | evento que o gerou |
| `webhook_event_id` | `uuid` | não | FK → `webhook_events` — rastreabilidade completa |
| `notes` | `text` | não | **obrigatório** em `ajuste_manual` |
| `created_by` | `uuid` | não | se foi ação humana |
| `created_at` | `timestamptz` | sim | |

**`UNIQUE (provider_event_id) WHERE provider_event_id IS NOT NULL`** — o mesmo evento **não lança duas transações**.
**Sem `updated_at`, sem `deleted_at`** — de propósito. Erro se corrige com **`ajuste_manual` compensatório**, com motivo e responsável.

⚠ **[HIP] Taxas e antecipação:** **[ASAAS]** os valores de taxa **dependem do contrato comercial** com o Asaas e **não são regras de API** (`REFERENCES.md` §11). **Não presumir nenhum percentual.** **[REC]** Preencher `fee_cents`/`net_amount_cents` **a partir do que o payload do webhook informar** — e, **se ele não informar**, deixar **nulo** e registrar como **lacuna a resolver na reconciliação**. ⚠ **Nunca calcular a taxa por conta própria**: um percentual chutado no código produziria um financeiro que **parece** certo e está errado. **Antecipação de recebíveis está fora da 1ª versão.**

### 4.7 `refunds`

**[ASAAS]** Precisa ser tabela: **Pix admite múltiplos estornos parciais**, cuja soma não pode exceder o recebido.

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `charge_id` | `uuid` | sim | FK |
| `amount_cents` | `bigint` | sim | `CHECK > 0` |
| `status` | `text` | sim | `CHECK IN ('solicitado','em_processamento','concluido','negado')` |
| `reason` | `text` | **sim** | ⚠ **obrigatório** — auditoria |
| `provider_refund_id` | `text` | não | |
| `idempotency_key` | `text` | sim | **UNIQUE** — impede estorno duplicado |
| `requested_by` | `uuid` | **sim** | ⚠ **quem pediu** |
| `created_at`, `updated_at` | | | |

⚠ **[REC] O estado da cobrança deriva da SOMA**, não do último evento:
```
soma(refunds concluídos) = 0            → estado inalterado
0 < soma < charge.amount_cents          → charges.status = 'parcialmente_estornada'
soma = charge.amount_cents              → charges.status = 'estornada'
soma > charge.amount_cents              → ⚠ IMPOSSÍVEL. Rejeitar + ALERTA (bug ou fraude)
```

### 4.8 ⚠ `outbox_events` — **NOVO** (o padrão outbox)

**Objetivo:** garantir que **nenhuma chamada externa aconteça dentro de uma transação de banco**, sem perder o efeito. Ver `ARCHITECTURE.md` §4.

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| ⚠ **`command_type`** | `text` | sim | `CHECK IN ('criar_parcelamento_saldo','criar_cobranca_marco','materializar_parcelas','sincronizar_cliente_asaas','notificar_cliente','notificar_equipe','reprocessar_evento')` |
| ⚠ **`entity_type`** | `text` | sim | `'charge'` \| `'payment_plan'` \| `'organization'` \| `'webhook_event'` |
| ⚠ **`entity_id`** | `uuid` | sim | a entidade relacionada |
| ⚠ **`payload`** | `jsonb` | sim | **payload MÍNIMO** — só o necessário. ⚠ **Nunca dados sensíveis.** ⚠ **Nunca o valor** (o executor **relê do banco**, para não agir sobre dado velho) |
| ⚠ **`idempotency_key`** | `text` | sim | **UNIQUE.** Ex.: `criar_saldo:{payment_plan_id}` |
| **`status`** | `text` | sim | `CHECK IN ('pendente','em_execucao','concluido','falha','cancelado')` · `default 'pendente'` |
| ⚠ **`attempts`** | `int` | sim | `default 0` |
| ⚠ **`max_attempts`** | `int` | sim | `default 5` |
| ⚠ **`next_attempt_at`** | `timestamptz` | sim | `default now()` — **backoff exponencial** |
| **`last_error`** | `text` | não | |
| **`created_at`** | `timestamptz` | sim | |
| ⚠ **`started_at`** | `timestamptz` | não | **execução** |
| ⚠ **`completed_at`** | `timestamptz` | não | **conclusão** |

⚠ **A restrição que faz o mecanismo funcionar:**
- **`UNIQUE (idempotency_key)`** → **[ASAAS]** Pix pode disparar `CONFIRMED` **e** `RECEIVED` para a mesma entrada (ou só um deles). **Ambos tentam inserir `criar_saldo:{plan_id}`. O `UNIQUE` garante que o comando é criado UMA vez** → **o parcelamento do saldo não é duplicado**, independentemente de qual evento chegue, ou de os dois chegarem, ou de chegarem duas vezes. ✅ **Esta única linha resolve o problema de `ARCHITECTURE.md` §3.4.**

**Índices:** `(status, next_attempt_at)` — a consulta do dispatcher; `(entity_type, entity_id)`.

**[REC] Concorrência do dispatcher:** ao pegar comandos, usar `SELECT ... FOR UPDATE SKIP LOCKED` e marcar `em_execucao`. Impede que duas execuções simultâneas (dois cold starts na Vercel) processem o mesmo comando. **Sem isso, o parcelamento sai duplicado — e o `UNIQUE` do comando não protege contra isso, porque o comando é o mesmo; o que se duplicaria é a execução.**

**[REC] `status='falha'` após `max_attempts`** → ⚠ **ALERTA obrigatório**. Um comando `criar_parcelamento_saldo` que falhou em definitivo significa **um cliente que pagou a entrada e não recebeu as parcelas**. Não pode passar despercebido.

### 4.9 ⚠ `notifications` — política de comunicação (NOVO)

> **Lacuna identificada na revisão.** **[ASAAS]** O Asaas **envia notificações próprias ao pagador** (e-mail/SMS de cobrança criada, vencendo, vencida, paga). **[REPO]** A ANTERO tem **Resend** instalado e vai querer notificar também. **Sem política, o cliente recebe DUAS mensagens de cada evento** — uma do Asaas e uma da ANTERO. Isso é ruído, parece amadorismo e, em cobrança, gera desconfiança.

**[REC] Regra — uma responsabilidade por canal, decidida explicitamente:**

| Comunicação | Quem envia **[REC]** | Por quê |
|---|---|---|
| Cobrança criada / link de pagamento | ⚠ **ANTERO** (Resend), com o Asaas **silenciado** | A mensagem sai no contexto do projeto ("sua proposta foi aprovada, aqui está o pagamento"), não como cobrança avulsa de um gateway. |
| Lembrete de vencimento | ⚠ **Decidir: um dos dois, nunca ambos** | |
| Cobrança vencida | ⚠ **Decidir** | |
| Pagamento confirmado | **ANTERO** | Segue com o próximo passo do projeto. |
| Boleto / Pix (segunda via) | **Asaas** (é a página dele) | |

**[HIP] Como silenciar as notificações do Asaas não foi confirmado** — há um `notificationEnabled` nos links de pagamento, mas **o comportamento padrão por conta e o controle fino por cobrança não foram verificados** (`REFERENCES.md` §11). **Necessita verificação na conta real (F2/F3) e decisão de produto** → **DEC-013**.

**[REC]** Tabela `notifications` (append-only) registrando **o que a ANTERO enviou** (`kind`, `channel`, `recipient`, `sent_at`, `charge_id`), com **`UNIQUE (charge_id, kind)`** — para que um reprocessamento de webhook **não reenvie o mesmo e-mail** ao cliente. Envio é efeito externo → **vai pela outbox**.

### 4.10 `webhook_events` — a caixa-preta

| Campo | Tipo | Obrig. | Notas |
|---|---|---|---|
| `id` | `uuid` PK | sim | |
| `provider` | `text` | sim | `default 'asaas'` |
| ⚠ **`provider_event_id`** | `text` | sim | **[ASAAS]** o `id` do evento — **se repete no reenvio** |
| `event_type` | `text` | sim | ex.: `PAYMENT_CONFIRMED`, `CHECKOUT_PAID` |
| **`payload`** | `jsonb` | sim | ⚠ **o corpo BRUTO, íntegro, como chegou** |
| `status` | `text` | sim | `CHECK IN ('recebido','processado','ignorado','erro')` |
| `error_message` | `text` | não | |
| `attempts` | `int` | sim | `default 0` |
| `charge_id` | `uuid` | não | FK — quando conseguimos correlacionar |
| `received_at`, `processed_at` | `timestamptz` | | |

⚠ **`UNIQUE (provider, provider_event_id)`**
> **[ASAAS] É esta linha que implementa a idempotência do webhook.** A entrega é *at least once* e o `id` **se repete** no reenvio. Com o `UNIQUE`, o duplicado **colide no banco** — a idempotência é garantida pelo **Postgres**, não por um `if` que alguém pode esquecer.

**[REC] Retenção:** **[ASAAS]** o Asaas guarda 14 dias; **nós guardamos indefinidamente** (é a auditoria). ⚠ O `payload` contém **dados pessoais** → entra na análise de LGPD (`SECURITY.md`).

### 4.11 `audit_logs`

`actor_id` (**quem**) · `action` (**o quê**: `charge.cancel`, `refund.request`, `profile.activate`…) · `entity_type`/`entity_id` · `reason` (⚠ **obrigatório** em ação financeira) · `metadata jsonb` (⚠ **nunca dados sensíveis**) · `created_at`. Append-only.

---

## 5. Relacionamentos

```
auth.users ──1:1── profiles ──N:1── organizations ──1:1── payment_provider_customers ──► [customer Asaas]
                   (pending/                │
                    admin/cliente)          │ 1:N
                                            ▼
                                        projects ──1:N── proposals (versionadas)
                                            │                 │ 1:N
                                            │                 ▼
                                            │            payment_terms
                                            │                 │
                                            │    (o cliente aceita UMA)
                                            │                 ▼
                                            └──1:N───────► contracts ⚠ (aceite: quem, quando, versão, snapshot)
                                                              │ 1:1
                                                              ▼
                                                        payment_plans   ⚠ UNIQUE(contract_id)
                                                              │            → N contratos = N planos = aditivos ✅
                                          ┌───────────────────┴─────────┐
                                          │ 1:N                         │ 1:N
                                          ▼                             ▼
                                    installments ──1:1── payment_intents ──1:N── charges
                                    (visão do cliente)   ⚠ (a intenção)      ⚠ (as TENTATIVAS)
                                                                              │  UNIQUE(intent_id, attempt_number)
                                                          ┌───────────────────┼──────────┬──────────────┐
                                                          ▼                   ▼          ▼              ▼
                                                    transactions          refunds   webhook_events  notifications
                                                    (bruto/taxa/líquido)  (parciais) (caixa-preta)   (anti-duplicidade)

                                    outbox_events ⚠ ── efeitos externos, FORA da transação
```

---

## 6. RLS

**[REPO]** Hoje **não existe RLS** (não há banco). **[REC]** Tudo é proposta.

⚠ **Princípio: negar por padrão.** `ENABLE ROW LEVEL SECURITY` em **todas** as tabelas, **sem exceção**. Sem política que permita, ninguém lê nada.

**[REC]** Funções auxiliares (`STABLE`): `auth_role()` → `'pending'|'admin'|'cliente'`; `auth_org_id()`.

⚠ **A primeira regra de toda política:** `auth_role() IN ('admin','cliente')`. **Um `pending` não lê uma única linha de nenhuma tabela.** É assim que o *fail closed* de §3.1 se materializa.

| Tabela | `SELECT` | `INSERT` | `UPDATE` | `DELETE` |
|---|---|---|---|---|
| `profiles` | o próprio; admin vê todos | ninguém (trigger no signup) | ⚠ o próprio **só `full_name`**. **`role` e `organization_id`: SÓ admin** | ninguém |
| `organizations` | admin: todas · cliente: só a sua | admin | admin | ninguém |
| `projects`, `proposals`, `payment_terms`, `contracts` | admin · cliente: da sua org | admin (⚠ **exceto `contracts`: o aceite é do cliente**) | admin | ninguém |
| `payment_plans`, `installments`, `payment_intents` | admin · cliente: da sua org | ⚠ **só o servidor** | ⚠ **só o servidor** | ninguém |
| ⚠ **`charges`** | admin · **cliente: `organization_id = auth_org_id()`** | ⚠ **NINGUÉM pela API pública** | ⚠ **NINGUÉM** — só o servidor (webhook) | ninguém |
| `transactions`, `refunds` | admin · cliente: das suas cobranças (comprovantes) | só o servidor | ninguém | ninguém |
| ⚠ **`webhook_events`, `outbox_events`, `audit_logs`, `notifications`** | ⚠ **SÓ admin** | só o servidor | só o servidor | ninguém |

⚠ **[REC] O cliente NUNCA escreve em nada financeiro.** Ele **solicita** via Server Action; o servidor **valida, calcula e escreve**. O papel `authenticated` **não tem `INSERT` nem `UPDATE` em `charges`** — nem via RLS.

⚠ **O webhook chega SEM sessão** e precisa escrever. Isso exige acesso privilegiado — **a decisão mais séria de segurança do projeto** → **DEC-008** e `SECURITY.md` §2.3.

---

## 7. Como cada condição comercial é representada

| Condição | `kind` | `selection_mode` | `billing_type(s)` | `installments` | `charges` | Asaas |
|---|---|---|---|---|---|---|
| **À vista (Pix)** | `a_vista` | `fixed`, count=1 | `PIX` (concreto ✅) | 1 | 1 | **[ASAAS]** avulsa: só `value` |
| **À vista (boleto)** | `a_vista` | `fixed`, count=1 | `BOLETO` | 1 | 1 | avulsa |
| **Parcelado fixo (10x)** | `parcelado` | **`fixed`**, count=10 | `CREDIT_CARD` | **10, na criação** | 10 | `installmentCount` + `totalValue` |
| ⚠ **Parcelado — cliente escolhe (até 10x)** | `parcelado` | ⚠ **`customer_choice`**, max=10 | `CREDIT_CARD` | ⚠ **0 na criação; materializadas pelo WEBHOOK** | N | ⚠ **Só na Estratégia B** — `maxInstallmentCount`. **[HIP]** depende de H2 |
| **Entrada + saldo** | `entrada_saldo` | `fixed` ou `customer_choice` | entrada: `PIX` · saldo: `CREDIT_CARD` | 1 entrada + N parcelas | ⚠ **1 (entrada) + N (saldo)** | ⚠ **[ASAAS] DUAS operações** — não existe cobrança com dois `billingType`. **O saldo só é criado APÓS a entrada paga, via OUTBOX** (`ARCHITECTURE.md` §4) |
| **Mensal** | `mensal` | `fixed` | qualquer concreto | N mensalidades | ⚠ **N cobranças INDEPENDENTES** | **[ASAAS]** N avulsas — **NÃO é parcelamento, NÃO é assinatura** |
| **Marcos** | `marcos` | `fixed` | concreto | N marcos | ⚠ **criadas SOB DEMANDA** | avulsas, uma a uma |
| **Recorrência** | `recorrente` | — | — | — | — | **[REC] fora da 1ª versão** |

⚠ **As distinções que NÃO podem ser confundidas:**
- **Parcelamento ≠ cobrança mensal.** No parcelamento, **a venda é única**: o cliente paga tudo no cartão e o Asaas divide; **o risco de inadimplência é do banco emissor**. Na mensal, **cada mês é uma cobrança nova que pode não ser paga** — e **a ANTERO fica sem receber**. São **riscos financeiros opostos**.
- **Mensal ≠ recorrência.** A mensal tem **fim conhecido** (as 6 mensalidades da execução). A recorrência é **indefinida** e vive em `/v3/subscriptions`.
- **Marco ≠ parcela.** A parcela vence **por data**; o marco vence **por evento** ("quando o design for aprovado"). Por isso as cobranças de marco **não são criadas todas de uma vez**. **A data é consequência, não causa.**

---

## 8. Garantias estruturais contra duplicidade

⚠ **Todas estão NO BANCO, não no código.** Código erra; `UNIQUE` não.

| Duplicidade | O que a impede |
|---|---|
| Duas organizações com o mesmo CNPJ | `UNIQUE (organizations.tax_id)` |
| Dois clientes do Asaas para a mesma organização | `UNIQUE (payment_provider_customers.organization_id, provider)` |
| Duas cobranças para a mesma tentativa (**duplo clique, retry**) | **`UNIQUE (charges.idempotency_key)`** |
| Duas linhas para a mesma tentativa | ⚠ **`UNIQUE (charges.intent_id, attempt_number)`** |
| Cobrar de novo uma parcela **já paga** | ⚠ **`payment_intents.status = 'satisfeita'`** bloqueia nova tentativa |
| A mesma cobrança do Asaas espelhada 2× | `UNIQUE (charges.provider, provider_charge_id)` |
| O mesmo evento processado 2× | **`UNIQUE (webhook_events.provider, provider_event_id)`** |
| A mesma transação lançada 2× | `UNIQUE (transactions.provider_event_id)` |
| ⚠ **Parcelamento do saldo criado 2×** (Pix dispara `CONFIRMED` **e** `RECEIVED`) | ⚠ **`UNIQUE (outbox_events.idempotency_key)`** + `SKIP LOCKED` no dispatcher |
| O mesmo e-mail enviado 2× ao cliente | `UNIQUE (notifications.charge_id, kind)` |
| Dois estornos pelo mesmo pedido | `UNIQUE (refunds.idempotency_key)` |
| Dois planos para o mesmo contrato | ⚠ **`UNIQUE (payment_plans.contract_id)`** — ✅ **e N contratos por projeto continuam permitidos (aditivos)** |
