# Registro de decisões

> Data: 14/07/2026 (revisado na 2ª rodada).
> ⚠ **TODAS as decisões estão `pendente`. NENHUMA foi aprovada.**
> Status: `pendente` · `aprovada` · `rejeitada` · `substituída`.
> Uma decisão só vira `aprovada` mediante **autorização humana explícita**, registrada aqui com a data.
>
> **Nesta revisão:** DEC-001, DEC-004, DEC-006 e DEC-008 foram **substancialmente alteradas**; DEC-013, DEC-014 e DEC-015 foram **adicionadas**.

---

## DEC-001 — Estratégia de checkout ⚠ **REVISADA**

- **Título:** Como o cliente efetivamente paga.
- **Contexto:** ⚠ **A análise anterior omitiu o produto oficial Asaas Checkout.** Com ele incluído, são **quatro** caminhos (`ARCHITECTURE.md` §1):
  - **A** — Cobrança tradicional + `invoiceUrl`
  - **B** — **Asaas Checkout** (`POST /v3/checkouts`)
  - **C** — Link de pagamento
  - **D** — Checkout transparente
- **Problema:** A escolha determina a exposição a dados de cartão, **o controle sobre os métodos aceitos**, **se o cliente pode escolher o nº de parcelas**, e o esforço de conformidade.
- **Descobertas que mudam a análise:**
  - **[ASAAS]** Na **cobrança tradicional (A)**, `billingType` é **um valor único**: ou um método **concreto**, ou **`UNDEFINED`** (que libera **tudo que a conta tem habilitado**). ⚠ **Não há como impor um subconjunto.** E **o cliente não escolhe o nº de parcelas** — ele é fixado por nós.
  - **[ASAAS]** No **Checkout (B)**, `billingTypes` é um **ARRAY** — ⚠ **impõe exatamente o conjunto** — e `maxInstallmentCount` permite que **o cliente escolha as parcelas** na página do Asaas. Tem ainda `minutesToExpire` (10–1440) e `callback` (`successUrl`/`cancelUrl`/`expiredUrl`).
  - ⚠ **[HIP] TRÊS LACUNAS BLOQUEANTES no Checkout** (`REFERENCES.md` §4):
    - **H1** — ⚠ **`BOLETO` é aceito em `billingTypes`? NÃO CONFIRMADO.** Todos os exemplos oficiais usam só `PIX` e `CREDIT_CARD`. ⚠ **O negócio da ANTERO EXIGE boleto.**
    - **H2** — ⚠ O payload de `CHECKOUT_PAID` traz o **`payment id`** e o **nº de parcelas escolhido**? **Não confirmado.** ⚠ **Sem isso, `customer_choice` é inviável.**
    - **H3** — O Checkout emite também os eventos `PAYMENT_*`? **Não confirmado.**
- **Alternativas:** ver `ARCHITECTURE.md` §1 (tabela completa).
- ⚠ **Recomendação — CONDICIONAL, a ser resolvida em Sandbox (F2/F4):**

  | Se, em Sandbox… | Então |
  |---|---|
  | **H1 = Checkout aceita `BOLETO`** e **H2 se resolve** | ✅ **Estratégia B.** É **estritamente superior** a A: mesmos métodos, **mais** controle (array), **mais** capacidade (cliente escolhe parcelas), **mais** UX (expiração, callbacks). |
  | **H1 = não aceita boleto**, ou **H2 não se resolve** | ✅ **Estratégia A**, com a ⚠ **restrição obrigatória de NUNCA usar `UNDEFINED`** — sempre um método **concreto** por condição, oferecendo **condições separadas** ("Pix à vista", "Boleto à vista", "Cartão em até 10x"). Ver `DATA_MODEL.md` §3.5. |

  **Em ambos os casos: D é descartada** (única em que a ANTERO vê cartão e CVV) e **C é descartada como fluxo principal** (**[ASAAS]** aceita CPF/CNPJ duplicado; quebra o vínculo cobrança↔projeto↔cliente), mantida como **ferramenta administrativa pontual**.
- **Justificativa:** ⚠ **Não é honesto recomendar B sem saber se ele faz boleto, para um negócio que exige boleto.** Nem recomendar A ignorando que ele não controla os métodos. **A decisão depende de um teste que ainda não foi feito** — e fazê-lo é entregável da **F2/F4**.
- **Riscos:** escolher B e descobrir depois que não há boleto obrigaria a manter **os dois** fluxos.
- **Impacto:** F4, F6, e toda a análise de segurança.
- ⚠ **Status:** **`pendente`** — ⚠ **e permanece pendente até H1, H2 e H3 serem respondidos em Sandbox.**
- **Data:** 14/07/2026 (revisada)

---

## DEC-002 — Criar o domínio persistido e aposentar os mocks

- **Contexto:** **[REPO]** O painel é **100% mock**. Não há banco, migrations, RLS nem tipos. O Supabase é usado **só** para autenticação.
- **Problema:** Uma cobrança precisa pertencer a um projeto, de uma empresa, com uma proposta **aceita**. ⚠ **Nada disso existe.**
- **Alternativas:** **A** — F0 completa antes de tocar no Asaas. **B** — pagamentos primeiro ⚠ (**inviável**: cobranças sem dono e sem autorização). **C** — domínio mínimo (⚠ remodelar tabela financeira **com dados dentro** é caro).
- **Recomendação:** **A.** ⚠ **A F0 foi DIVIDIDA em F0A/F0B/F0C/F0D** nesta revisão (`IMPLEMENTATION_PLAN.md`) — cada subfase com aprovação própria.
- **Justificativa:** não é preferência arquitetural; é **pré-condição lógica**.
- **Impacto:** ⚠ **bloqueia todas as demais fases.**
- **Status:** **`pendente`**
- **Data:** 14/07/2026

---

## DEC-003 — Papéis e o estado inicial do usuário ⚠ **REVISADA**

- **Contexto:** **[REPO]** **Não existe papel nem permissão.** Qualquer autenticado acessa todo o painel.
- ⚠ **Problema — a v1 desta decisão era CONTRADITÓRIA:** propunha `role DEFAULT 'cliente'` **com `organization_id` obrigatório para clientes**. Um usuário recém-criado **não tem organização** → o `INSERT` do perfil **violaria o `CHECK`** e **quebraria o cadastro**. Relaxar o `CHECK` criaria um "cliente sem organização" — estado ambíguo, ⚠ **o oposto de *fail closed***.
- **Alternativas:**
  - ⚠ **A — `role IN ('pending','admin','cliente')`, `DEFAULT 'pending'`, `organization_id` nulo enquanto `pending`.** A RLS de **todas** as tabelas exige `role IN ('admin','cliente')` → **um `pending` não lê uma única linha**.
  - **B — coluna `access_status` separada** (`pending`/`active`) além do `role`. Mais campos, mesmo efeito, mais chance de os dois divergirem.
  - **C — `organization_id` nulo com a RLS negando.** Equivale a A, mas **sem tornar o estado explícito** — o "não vinculado" fica implícito num `NULL`, e alguém acaba esquecendo.
- ⚠ **Recomendação: A.**
- **Justificativa:** ⚠ **`pending` é um estado de negócio real** ("convidado, ainda não liberado"), e torná-lo explícito faz o *fail closed* ser **legível no schema**, não uma consequência sutil de um `NULL`. ⚠ Um usuário novo **não é um cliente** — e chamá-lo de cliente é o que gerava a contradição.
- ⚠ **Duas guardas indispensáveis:**
  1. ⚠ **O usuário NÃO pode alterar o próprio `role` nem `organization_id`.** Sem isso, **qualquer cliente se promoveria a admin** pela API do Supabase — e a RLS inteira viraria decoração.
  2. ⚠ **Bootstrap do primeiro admin:** se todos nascem `pending` e só admin promove, **o primeiro admin não nasce pela aplicação**. Criado por **migration/seed**, **uma vez**. ⚠ **Passo explícito da F0B** — não uma descoberta em produção.
- **Riscos:** RLS mal escrita bloqueia a equipe ou libera demais. → Testes explícitos (`TESTING.md` §3).
- **Impacto:** **F0B.** Bloqueia tudo.
- **Status:** **`pendente`**
- **Data:** 14/07/2026 (revisada)

---

## DEC-004 — Modelagem do nº de parcelas ⚠ **REVISADA**

- ⚠ **Contexto — a v1 MISTURAVA TRÊS CONCEITOS** sob o nome `max_installments`: quantidade **fixa**, **teto**, e **quem escolhe**.
- **Problema:** São coisas diferentes, com implicações diferentes em cada estratégia. **[ASAAS]** Em A, **o cliente não escolhe** — o nº é fixado por nós. Em B, ele **pode** escolher, até `maxInstallmentCount`.
- ⚠ **Recomendação — três campos distintos** (`DATA_MODEL.md` §3.5):
  - **`installment_selection_mode`**: **`fixed`** | **`customer_choice`** — **quem decide**
  - **`installment_count`**: a quantidade **exata** (obrigatório se `fixed`)
  - **`max_installments`**: o **teto** (obrigatório se `customer_choice`), `CHECK BETWEEN 1 AND 21`
  - Com `CHECK` de coerência garantindo que **exatamente um** dos dois esteja preenchido.
- **Uso por estratégia:**
  | | A (`invoiceUrl`) | B (Checkout) | C (Link) |
  |---|---|---|---|
  | `fixed` | ✅ `installmentCount` | ✅ `maxInstallmentCount` | ✅ |
  | ⚠ `customer_choice` | ❌ **IMPOSSÍVEL** | ✅ `maxInstallmentCount` | ✅ |
- ⚠ **Regra do frontend (corrigida):** em `fixed`, o frontend envia **só** `payment_term_id`. Em `customer_choice` **na nossa UI**, ele **pode enviar** `installment_count` — ⚠ **e o servidor VALIDA contra `payment_term.max_installments`**, rejeitando fora do intervalo. ⚠ **O cliente escolhe DENTRO do autorizado; ele nunca altera O QUE foi autorizado.** (`PAYMENT_FLOWS.md` §4.1)
- **Limites do Asaas:** **[ASAAS]** **até 21x em Visa/Mastercard**, **até 12x nas demais**. ⚠ A bandeira **só é conhecida na tela de pagamento**. **[HIP]** O comportamento ao oferecer 15x a um cartão Elo **é desconhecido**.
- ⚠ **[REC] Postura conservadora:** **limitar a 12 por padrão** — seguro em **todas** as bandeiras — e só oferecer mais **depois de testado**. ⚠ **Prometer 15x e falhar no pagamento é pior do que prometer 12 e cumprir.**
- **Riscos:** ⚠ **[HIP] `customer_choice` depende da lacuna H2** (o nº escolhido precisa voltar pelo webhook). ⚠ **Não prometer essa funcionalidade antes de comprová-la.**
- **Impacto:** `DATA_MODEL.md` §3.5, F4, F6.
- **Status:** **`pendente`**
- **Data:** 14/07/2026 (revisada)

---

## DEC-005 — Destino de `/painel/financeiro` e nomenclatura

- **Contexto:** **[REPO]** `/painel/financeiro` mostra um **fluxo de caixa** mock — entradas **e saídas**, incluindo "Infraestrutura AWS". `status` é `{label, tone}` — **rótulo visual, não máquina de estados**.
- **Problema:** É a coisa mais parecida com "pagamento" no projeto — ⚠ **e é uma armadilha.** Fluxo de caixa (dinheiro que entra e sai da empresa) e cobrança (dívida de um cliente, vinculada a projeto, com provedor externo e webhook) **são conceitos diferentes, com donos diferentes**.
- **Recomendação:** ⚠ **NÃO evoluir `MovimentoFinanceiro` para virar a cobrança.** Criar o domínio novo e, **em tarefa separada**, decidir: **(a)** a tela vira o painel administrativo de **cobranças**; **(b)** continua sendo fluxo de caixa e as cobranças ganham tela própria; **(c)** é removida.
- **Também nesta decisão:** ⚠ renomear a nossa tabela `installments` para **`plan_items`**? **[ASAAS]** O Asaas tem o próprio conceito de `installment` (o agrupador de um parcelamento) — **o nome colide** e a confusão é fácil.
- **Riscos:** ⚠ a rota está na navegação (**[REPO]** `src/features/painel/config/navigation.ts:19`). **Apagar o mock sem substituir quebra a rota.**
- **Status:** **`pendente`** — ⚠ **decisão de produto, não técnica.**
- **Data:** 14/07/2026

---

## DEC-006 — Representação monetária ⚠ **REVISADA**

- **Contexto:** **[REPO]** Os mocks usam `number` (ponto flutuante) somado com `reduce`.
- ⚠ **Problema — a v1 desta decisão estava ERRADA num ponto:** dizia **"`bigint` em todo o domínio TypeScript"**. ⚠ **O `BigInt` do JavaScript NÃO É SERIALIZÁVEL EM JSON** — `JSON.stringify(1n)` **lança `TypeError`**. Isso **quebraria Server Actions, respostas de API e qualquer payload que atravessasse a fronteira servidor→cliente do Next.js**. Além disso, `BigInt` não interopera com `number` sem conversão explícita, e o driver do Supabase devolve `bigint` do Postgres como **string** ou **number** — **nunca** como `BigInt` nativo.
- ⚠ **Recomendação corrigida — tipos DIFERENTES por camada:**

  | Camada | Tipo | Regra |
  |---|---|---|
  | **PostgreSQL** | ✅ **`bigint`**, coluna sufixada **`_cents`** | Exato, sem overflow |
  | ⚠ **TypeScript** | ✅ **`number` INTEIRO em centavos** — ⚠ **NUNCA `BigInt`** | ⚠ **Validar com `Number.isSafeInteger()`** em toda entrada e leitura |
  | ⚠ **Fronteira do banco** | **Conversão explícita** | O driver pode devolver **string**. ⚠ **Converter e validar** — nunca confiar que veio `number` |
  | ⚠ **Serialização** | ⚠ **NENHUM `BigInt` em JSON** | Proibido. Se um `BigInt` entrar no domínio, **ele não sai num JSON** |
  | ⚠ **Fronteira do Asaas** | **reais decimais** | ⚠ **Conversão SOMENTE no `AsaasClient`.** **[ASAAS]** a API usa reais (`20000.00`) |

  `Number.MAX_SAFE_INTEGER` ≈ **R$ 90 trilhões** em centavos — folga absurda, mas a validação é barata e **transforma um erro silencioso em erro explícito**.
- **Por que não `numeric(12,2)`:** exato **no banco**, mas o driver o devolve como *string* ou *float*, ⚠ **reintroduzindo o problema NA APLICAÇÃO** — que é exatamente onde os cálculos de entrada, saldo e divisão de parcelas acontecem.
- **Riscos:** ⚠ esquecer uma conversão na fronteira → **valor 100× errado**. → Testes dedicados (`TESTING.md` §1.1) e a convenção `_cents`, que **torna o erro visível na leitura do código**.
- **Impacto:** todo o modelo de dados e todo o `AsaasClient`.
- **Status:** **`pendente`**
- **Data:** 14/07/2026 (revisada)

---

## DEC-007 — Biblioteca de validação

- **Contexto:** **[REPO]** Sem Zod/Yup/Valibot.
- **Problema:** A integração recebe payload de webhook (**de fora**), formulários administrativos e ⚠ **a escolha do cliente — incluindo o nº de parcelas** (DEC-004). **Validar isso com `if`s é como se introduz falha.**
- **Alternativas:** **A — Zod** (difundido, ótima inferência). **B — Valibot** (menor). **C — manual** ⚠ (rejeitada).
- **Recomendação:** **A (Zod)** — mas **é dependência nova**, e por isso exige aprovação.
- **Riscos:** ⚠ **[REPO] Resolver os dois lockfiles ANTES de instalar** (F0A).
- **Impacto:** F0A em diante.
- **Status:** **`pendente`**
- **Data:** 14/07/2026

---

## DEC-008 — Escrita no banco sem sessão ⚠ **REVISADA — a recomendação anterior estava errada**

- **Contexto:** **[REPO]** O projeto usa **apenas** a chave `anon`, sujeita à RLS. **Não usa `service_role`.**
- **Problema:** O **webhook** chega **sem usuário autenticado** e precisa **escrever** em `charges`, `transactions`, `webhook_events` e `outbox_events`. O **dispatcher da outbox** e a **reconciliação** têm o mesmo problema. A chave `anon`, sob RLS, **não pode**.
- ⚠ **Por que a recomendação da v1 estava ERRADA:**

  A v1 recomendava **funções `SECURITY DEFINER` chamadas com a chave `anon`**, alegando serem "mais seguras" que a `service_role`. ⚠ **Isso não se sustenta:**

  > ⚠ **A chave `anon` do Supabase é PÚBLICA.** Ela vai para o bundle do navegador — é o seu propósito (`NEXT_PUBLIC_SUPABASE_ANON_KEY`). **Qualquer pessoa que abra o site a possui.**
  >
  > ⚠ **Logo, uma função `SECURITY DEFINER` executável pelo papel `anon` é uma função que QUALQUER PESSOA NA INTERNET pode chamar** — direto pela API REST do Supabase, **sem passar pelo nosso servidor, sem token de webhook, sem nada**. Uma função que escreve em `charges` e é chamável por `anon` **não é uma barreira: é um endpoint público de escrita em dados financeiros.** ⚠ **Seria PIOR que a `service_role`, não melhor.**
  >
  > ⚠ **"`SECURITY DEFINER` é mais seguro que `service_role`" é falso como afirmação geral.** O que importa é **quem pode executar a função**.

- **Alternativas (corrigidas):**

  **Opção A — `SUPABASE_SERVICE_ROLE_KEY` exclusivamente no servidor:** módulo com **`import 'server-only'`** · cliente privilegiado **isolado** numa única função · **nunca** importado pelo frontend (garantido pelo compilador) · **nunca** em log · usada **apenas** por webhook, outbox e reconciliação.
  ⚠ **Risco:** ignora **toda** a RLS.

  **Opção B — Funções `SECURITY DEFINER` ENDURECIDAS:** ⚠ **`SET search_path = ''`** (ou fixo — ⚠ **sem isso há *search_path hijacking*, a falha clássica de `SECURITY DEFINER`**) · nomes de schema explícitos (`public.charges`) · ⚠ **`REVOKE EXECUTE FROM PUBLIC`** (⚠ o Postgres concede a `PUBLIC` **por padrão**) · ⚠ **`REVOKE FROM anon, authenticated`** · **não exposta a chamadas públicas** · validação interna contra abuso.

- ⚠ **A constatação decisiva:** **se revogamos `EXECUTE` de `anon` e `authenticated` — e precisamos revogar —, a função só pode ser chamada por um papel privilegiado.** ⚠ **Ou seja: a Opção B, feita corretamente, AINDA EXIGE uma chave privilegiada para invocá-la. B NÃO SUBSTITUI A. B é uma camada SOBRE A.**

- ⚠ **Recomendação corrigida: A como transporte + B como defesa em profundidade.**
  A chave privilegiada **existe** (é inevitável), **mas o que ela pode fazer fica limitado** a um conjunto de operações **nomeadas e auditáveis**. ⚠ **Se o código do servidor tiver um bug, ele não consegue apagar `charges` — não existe função para isso.**

- ⚠ **O que NÃO fazer, sob nenhuma hipótese:** expor uma função `SECURITY DEFINER` que escreve em dados financeiros **ao papel `anon`**. ⚠ **A chave para chamá-la está no bundle do site.**
- **Riscos:** **A** exige disciplina absoluta com `server-only`. **B** exige SQL cuidadoso (⚠ uma `SECURITY DEFINER` mal escrita **também** é um buraco).
- **Impacto:** F2, F5, F8.
- ⚠ **Status:** **`pendente`** — ⚠ **a decisão de maior peso em segurança de todo o planejamento.**
- **Data:** 14/07/2026 (revisada)

---

## DEC-009 — Juros, multa e quem os assume

- **Contexto:** **[HIP] Não confirmado.** **[ASAAS]** Há configuração, mas o comportamento **depende da conta e do contrato comercial**.
- **Problema:** Se a ANTERO absorve os juros, ⚠ **recebe menos** que o valor do projeto. Se o cliente assume, ⚠ **paga mais** que o combinado — e **precisa saber disso ANTES de escolher a condição**, ou vira reclamação.
- **Recomendação:** campo **`payment_terms.interest_owner`** (`antero`|`cliente`) — flexível por condição. ⚠ **Mas a política padrão é decisão COMERCIAL, não técnica.**
- **Riscos:** ⚠ **Precisa ser visível ao cliente na tela ANTES de ele escolher.** ⚠ **Surpresa de valor em cobrança é caminho direto para chargeback.**
- **Status:** **`pendente`** — ⚠ **exige decisão comercial e confirmação na conta real.**
- **Data:** 14/07/2026

---

## DEC-010 — *Fail-safe* do proxy

- **Contexto:** **[REPO]** `src/proxy.ts:21-24` — sem as envs, o proxy **libera `/painel/*` sem autenticação**.
- **Problema:** Razoável com dados falsos. ⚠ **Com dados financeiros, uma variável mal configurada num deploy expõe a área inteira à internet.** **Falha de configuração vira falha de segurança.**
- **Alternativas:** **A** — *fail closed* em produção, permissivo em dev. **B** — *fail closed* sempre. **C** — manter ⚠ (**rejeitada**).
- **Recomendação:** **A.**
- **Riscos:** baixo — alteração cirúrgica em **um** ponto. ⚠ **Mas mexe em autenticação** → testar os 3 caminhos (`docs/DEVELOPMENT_WORKFLOW.md` §4).
- **Impacto:** **F0B.**
- **Status:** **`pendente`**
- **Data:** 14/07/2026

---

## DEC-011 — Logs, observabilidade e alertas

- **Contexto:** **[REPO]** **Nenhum log estruturado, nenhuma observabilidade.** ⚠ Um webhook falhando hoje seria **invisível**.
- **Problema:** **[ASAAS]** 15 falhas **interrompem a fila**; eventos **descartados após 14 dias**. ⚠ **Sem alerta, a sincronização financeira pode parar e ninguém saber até os eventos terem expirado para sempre.**
- **Recomendação:** **e-mail via Resend** (**[REPO]** já instalado; custo zero) **+** o **painel de saúde** sobre `webhook_events` e `outbox_events` (✅ **o banco já é o log** — vantagem do desenho).
- **Riscos:** alerta demais vira ruído e é ignorado. → Alertar **apenas**: erro de webhook · evento desconhecido · ⚠ **falha de outbox** · chargeback · reembolso negado · ⚠ **falhas consecutivas ≥ 5** (margem antes do limite de 15).
- **Impacto:** F5, F7, F8.
- **Status:** **`pendente`**
- **Data:** 14/07/2026

---

## DEC-012 — Framework de testes

- **Contexto:** **[REPO]** **Zero testes. Nenhum framework.** A validação é `lint` + `build` + olhar a tela.
- **Problema:** ⚠ **Os defeitos deste sistema não aparecem na tela:** cobrar duas vezes, marcar como pago o que não foi, perder um evento, um cliente ver a cobrança de outro. **Ou existem testes, ou o sistema vai a produção sem verificação real.**
- **Recomendação:** **Vitest**, instalado na ⚠ **F0A** — não na F8.
- **Justificativa:** ⚠ **testes escritos no fim, "para fechar a fase", testam o que o código FAZ, não o que ele DEVERIA fazer.** Nos cálculos monetários e na idempotência, **essa diferença é o defeito**.
- **Riscos:** ⚠ **[REPO] Resolver os dois lockfiles ANTES de instalar.**
- **Impacto:** F0A em diante.
- **Status:** **`pendente`**
- **Data:** 14/07/2026

---

## DEC-013 — ⚠ Política de comunicação com o cliente **(NOVA)**

- **Contexto:** **[ASAAS]** O Asaas **envia notificações próprias ao pagador** (e-mail/SMS: cobrança criada, vencendo, vencida, paga). **[REPO]** A ANTERO tem **Resend** instalado e vai querer notificar também.
- ⚠ **Problema:** **Sem política, o cliente recebe DUAS mensagens de cada evento** — uma do Asaas, uma da ANTERO. ⚠ **Em cobrança, isso gera desconfiança**, além de parecer amadorismo.
- **Alternativas:**
  - **A** — ⚠ **Silenciar o Asaas; a ANTERO comunica tudo.** Mensagem no contexto do projeto ("sua proposta foi aprovada, aqui está o pagamento"), não como cobrança avulsa de um gateway. **Mais trabalho, melhor experiência.**
  - **B** — Deixar o Asaas comunicar; a ANTERO fica em silêncio. Menos trabalho, ⚠ **e a comunicação financeira da ANTERO passa a ter a cara de um gateway**.
  - **C** — Dividir por tipo de evento. ⚠ **Exige disciplina e é fácil de errar.**
- **Recomendação:** ⚠ **A**, com uma tabela **`notifications`** (append-only) e ⚠ **`UNIQUE (charge_id, kind)`** — para que **um reprocessamento de webhook não reenvie o mesmo e-mail**. Envio é efeito externo → ⚠ **vai pela OUTBOX**.
- **Riscos:** ⚠ **[HIP] Como silenciar as notificações do Asaas NÃO FOI CONFIRMADO** — há um `notificationEnabled` nos links, mas **o comportamento padrão por conta e o controle fino por cobrança não foram verificados** (`REFERENCES.md` §11). **Verificar na conta real (F2/F3).**
- **Impacto:** `DATA_MODEL.md` §4.9, F5, F6.
- **Status:** **`pendente`** — ⚠ **exige verificação na conta e decisão de produto.**
- **Data:** 14/07/2026

---

## DEC-014 — ⚠ Agendador do dispatcher da outbox e da reconciliação **(NOVA)**

- **Contexto:** ⚠ O padrão **outbox** (`ARCHITECTURE.md` §4) exige um processo que **execute os comandos fora da transação do webhook**. A **reconciliação** exige execução periódica. **[REPO]** A produção roda na **Vercel** — **serverless, sem worker persistente**.
- **Problema:** ⚠ **Sem um agendador, um comando de outbox que falhe no disparo imediato fica preso para sempre** — e um `criar_parcelamento_saldo` preso significa ⚠ **um cliente que pagou a entrada e nunca recebeu as parcelas**.
- **Alternativas:**
  - **A — Vercel Cron.** Nativo da plataforma, sem dependência nova. ⚠ **[HIP]** Limites do plano contratado **não confirmados**.
  - **B — `pg_cron` do Supabase.** Roda no banco, **independe da Vercel**. ⚠ Mas chamar HTTP de dentro do Postgres exige extensão (`pg_net`) e é mais desconfortável de depurar.
  - **C — Só disparo imediato**, sem cron. ⚠ **REJEITADA** — perde comandos quando a função morre logo após responder.
- **Recomendação:** ⚠ **A (Vercel Cron)** como rede de segurança **+ disparo imediato** (via `after()`) como otimização do caminho feliz. ⚠ **O cron é obrigatório; o disparo imediato é opcional.**
- ⚠ **Requisito técnico inegociável:** o dispatcher usa **`SELECT ... FOR UPDATE SKIP LOCKED`**. ⚠ **Sem isso, dois cold starts simultâneos processariam o MESMO comando e criariam o parcelamento DUAS VEZES** — e o `UNIQUE` do comando **não protege contra isso** (o comando é o mesmo; o que se duplica é a **execução**).
- **Riscos:** **[HIP]** limites de cron do plano da Vercel **não confirmados** → **verificar na F5**.
- **Impacto:** F5, F8.
- **Status:** **`pendente`**
- **Data:** 14/07/2026

---

## DEC-015 — ⚠ Ambiente de staging para o webhook de Sandbox **(NOVA)**

- **Contexto:** **[REPO]** Produção na **Vercel**, em **`https://anterosistemas.com.br`**. O webhook de produção será **`https://anterosistemas.com.br/api/webhooks/asaas`**.
- ⚠ **Problema:** o Sandbox precisa de uma **URL pública, HTTPS e ESTÁVEL** para cadastrar o webhook. ⚠ **URLs de preview da Vercel (`*-git-*.vercel.app`) MUDAM A CADA DEPLOY** — o webhook apontaria para um deploy morto, ⚠ **as entregas falhariam, e após 15 falhas a fila do Asaas seria INTERROMPIDA**.
- **Alternativas:**
  - **A** — ⚠ **Subdomínio de staging estável: `https://staging.anterosistemas.com.br/api/webhooks/asaas`**
  - **B** — Túnel (ngrok/cloudflared) ⚠ — **aceitável só para desenvolvimento local pontual**, **jamais** como configuração permanente.
  - **C** — URL de preview da Vercel ⚠ **REJEITADA** — muda a cada deploy.
- **Recomendação:** ⚠ **A.** Um subdomínio de staging apontando para um deploy estável, com **variáveis de Sandbox** e ⚠ **token de webhook próprio** (nunca o de produção).
- **Riscos:** ⚠ **Sem staging, a F5 não pode ser homologada corretamente.** É **pré-requisito**, não conveniência.
- ⚠ **Escopo:** **a criação do ambiente e do subdomínio está FORA desta tarefa de documentação.** Aqui apenas se registra a necessidade e a recomendação.
- **Impacto:** **F5** (bloqueante), F8, F9.
- **Status:** **`pendente`**
- **Data:** 14/07/2026

---

## Resumo

| ID | Título | Recomendação | Status |
|---|---|---|---|
| ⚠ **DEC-001** | **Estratégia de checkout** | ⚠ **CONDICIONAL** — B (Checkout) **se** H1/H2 se resolverem; senão A (`invoiceUrl`) **sem `UNDEFINED`**. D e C descartadas. | ⚠ **pendente** — **bloqueada por H1/H2/H3 em Sandbox** |
| DEC-002 | Domínio persistido / mocks | F0 (dividida em F0A–F0D) antes de tudo | **pendente** |
| ⚠ **DEC-003** | **Papéis + estado inicial** | ⚠ **`role IN ('pending','admin','cliente')`, DEFAULT `'pending'`** | **pendente** |
| ⚠ **DEC-004** | **Nº de parcelas** | ⚠ **3 campos**: `selection_mode` · `installment_count` · `max_installments`. **12 por padrão** | **pendente** |
| DEC-005 | `/painel/financeiro` + nomes | Não fundir com cobranças; avaliar `plan_items` | **pendente** (produto) |
| ⚠ **DEC-006** | **Dinheiro** | ⚠ PG `bigint` · **TS `number` inteiro** · ⚠ **NUNCA `BigInt` em JSON** · `isSafeInteger` | **pendente** |
| DEC-007 | Validação | Zod | **pendente** |
| ⚠ **DEC-008** | **Escrita sem sessão** | ⚠ **`service_role` (server-only) COMO TRANSPORTE + `SECURITY DEFINER` endurecida como camada.** ⚠ **NUNCA executável por `anon`** | ⚠ **pendente** |
| DEC-009 | Juros | Campo por condição; **política é comercial** | **pendente** (comercial) |
| DEC-010 | *Fail-safe* do proxy | *Fail closed* em produção | **pendente** |
| DEC-011 | Logs e alertas | `webhook_events`/`outbox_events` + e-mail (Resend) | **pendente** |
| DEC-012 | Testes | Vitest, desde a **F0A** | **pendente** |
| ⚠ **DEC-013** | **Notificações** (NOVA) | ANTERO comunica; Asaas silenciado; `UNIQUE(charge_id, kind)` | **pendente** (produto) |
| ⚠ **DEC-014** | **Agendador** (NOVA) | Vercel Cron + `SKIP LOCKED` | **pendente** |
| ⚠ **DEC-015** | **Staging** (NOVA) | `staging.anterosistemas.com.br` | **pendente** |

⚠ **Nenhuma decisão foi aprovada. Nenhuma implementação foi iniciada.**
