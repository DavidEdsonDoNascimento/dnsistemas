# Estratégia de testes e homologação

> Data: 14/07/2026 (revisado). ⚠ **Nenhum teste foi escrito. Todos os checklists estão DESMARCADOS.**
> **[REPO] Ponto de partida:** o projeto **não tem nenhum teste automatizado** nem framework instalado (`CURRENT_STATE.md` §6).
> **Novos nesta revisão:** serialização monetária (§1.1) · transições explícitas (§1.2) · **`pending`** (§1.5, §3) · **outbox** (§1.6, §4) · **`CONFIRMED` OU `RECEIVED`** (§1.6) · **`customer_choice`** (§1.5, §2) · **`SECURITY DEFINER`/`anon`** (§3).

---

## 0. O problema de partida

**[REPO]** Hoje a rede de segurança é: *"o build passou e a tela abriu"*. Defensável para uma landing page. ⚠ **Para código que cria cobranças de R$ 20.000 e processa webhooks financeiros, não é.**

⚠ **Os defeitos deste sistema não aparecem na tela:** cobrar duas vezes, marcar como pago o que não foi, perder um evento, um cliente ver a cobrança de outro, o parcelamento do saldo nunca ser criado. **Nenhum é detectável abrindo o navegador.**

**[REC]** Instalar o framework é **pré-requisito da F0A**, não adorno da F8. **Sugestão: Vitest** (DEC-012).
⚠ **[REPO] Resolver os dois lockfiles ANTES de instalar** (`SECURITY.md` S5).

---

## 1. Testes unitários — o núcleo do risco

### 1.1 ⚠ Cálculo e serialização monetária — **prioridade máxima**

- [ ] Entrada: 30% de R$ 20.000 = 600.000 centavos
- [ ] Entrada com percentual **não exato**: 33% de R$ 10.000,01
- [ ] Saldo: total − entrada, ⚠ **sempre fechando na soma exata**
- [ ] Divisão: R$ 20.000 ÷ 10 = 10 × R$ 2.000
- [ ] ⚠ **Divisão com resto: R$ 20.000,01 ÷ 3.** **[ASAAS]** a diferença vai para a **ÚLTIMA parcela**. ⚠ **Nosso cálculo precisa reproduzir isso — senão a nossa tela diverge da fatura do Asaas e o cliente vê números diferentes nos dois lugares.**
- [ ] ⚠ **Invariante universal: `soma(parcelas) === total`** — para **qualquer** valor e **qualquer** nº de parcelas. Testar exaustivamente.
- [ ] Conversão **centavos → reais**: `2000000 → 20000.00`, e o inverso, **sem perda**
- [ ] ⚠ **A conversão para reais acontece SOMENTE no `AsaasClient`** (nenhuma outra camada conhece "reais")

⚠ **Serialização (NOVOS — DEC-006 revisada):**
- [ ] ⚠ **`Number.isSafeInteger()` rejeita valor fora do intervalo seguro**
- [ ] ⚠ **A leitura do banco converte `bigint` (que pode vir como STRING) para `number` e VALIDA**
- [ ] ⚠ **NENHUM `BigInt` atravessa uma fronteira de serialização.** ⚠ **`JSON.stringify` de um payload monetário NÃO lança `TypeError`** — o teste que prova que a correção da DEC-006 foi aplicada
- [ ] ⚠ Um valor monetário **sobrevive à ida e volta** Server Action → cliente, **sem perda e sem erro**
- [ ] Nenhum cálculo usa `float`

### 1.2 ⚠ Máquina de estados — **transições explícitas** (corrigido)

⚠ **A v1 usava pesos lineares. Estes testes provam que as transições legítimas que ela bloqueava agora funcionam:**

- [ ] `criada → aguardando_pagamento → paga → liquidada` (avanço normal)
- [ ] ⚠ **`vencida → paga` é PERMITIDA** (boleto pago **com atraso** — corriqueiro)
- [ ] ⚠ **`vencida → liquidada` é PERMITIDA** (Pix pago com atraso)
- [ ] ⚠ **`liquidada → contestada` é PERMITIDA** (chargeback **sempre** ocorre **depois** de o dinheiro cair)
- [ ] ⚠ **`paga → parcialmente_estornada` é PERMITIDA**
- [ ] ⚠ **`liquidada → parcialmente_estornada` é PERMITIDA**
- [ ] ⚠ **`parcialmente_estornada → parcialmente_estornada`** (**[ASAAS]** Pix admite **múltiplos** parciais)
- [ ] ⚠ **`parcialmente_estornada → estornada`** quando a soma **atinge o total**
- [ ] ⚠ **`contestada → liquidada`** (chargeback resolvido **a favor da ANTERO**)
- [ ] ⚠ **`contestada → estornada`** (resolvido a favor do cliente)
- [ ] ⚠ **`paga → aguardando_pagamento` é PROIBIDA** (regressão)
- [ ] ⚠ **`liquidada → paga` é PROIBIDA**
- [ ] ⚠ **Transição não permitida = NO-OP, marcada `processado`, SEM lançar erro** (evento fora de ordem **não é erro**)
- [ ] ⚠ **`liquidada` + `CONFIRMED` atrasado → permanece `liquidada`**
- [ ] ⚠ **`paga` + `CREATED` fora de ordem → permanece `paga`**

### 1.3 ⚠ Estorno — o estado deriva da SOMA

- [ ] Estorno parcial (R$ 5.000 de R$ 20.000) → **`parcialmente_estornada`**
- [ ] Segundo parcial (R$ 15.000) → **soma = total** → **`estornada`**
- [ ] ⚠ **Estorno que faria a soma EXCEDER o total → REJEITADO + ALERTA** (**[ASAAS]** a soma não pode exceder o recebido)
- [ ] `transactions` do estorno tem `gross_amount_cents` **NEGATIVO**
- [ ] ⚠ **O estorno NÃO apaga a transação de pagamento** — **acrescenta** uma negativa

### 1.4 Mapeamento de eventos

- [ ] `PAYMENT_CONFIRMED → 'paga'` · `PAYMENT_RECEIVED → 'liquidada'`
- [ ] ⚠ **Os dois produzem estados DIFERENTES** — o teste que impede a fusão dos conceitos
- [ ] `CHECKOUT_PAID`, `CHECKOUT_EXPIRED`, `CHECKOUT_CANCELED` (se DEC-001 = B)
- [ ] Todos os eventos de `WEBHOOKS.md` §5
- [ ] ⚠ **Evento desconhecido (`PAYMENT_ALGO_NOVO`) → `'ignorado'`, SEM lançar exceção** — **[ASAAS]** o Asaas adiciona eventos **sem aviso**

### 1.5 ⚠ Idempotência, tentativas e autorização

- [ ] ⚠ **A mesma tentativa (`intent_id` + `attempt_number`) gera SEMPRE a mesma chave**
- [ ] ⚠ **Tentativa nova (attempt 2) gera chave DIFERENTE**
- [ ] ⚠ **A charge da tentativa 1 PERMANECE `falha`** — histórico preservado
- [ ] ⚠ **`payment_intents.status='satisfeita'` BLOQUEIA nova tentativa** — ⚠ **o teste que impede cobrar de novo uma parcela já paga**
- [ ] Cliente de outra organização → **negado**
- [ ] ⚠ **`role='pending'` → negado** (**NOVO**)
- [ ] Proposta não aprovada → negado
- [ ] ⚠ **Sem contrato aceito → negado** (**NOVO**)
- [ ] ⚠ **`customer_choice`: `installment_count` > `max_installments` → REJEITADO** (**NOVO**)
- [ ] ⚠ **`customer_choice`: `installment_count` = 0 ou negativo → REJEITADO**
- [ ] ⚠ **`fixed`: um `installment_count` enviado pelo frontend é IGNORADO** — usa-se o do banco (**NOVO**)
- [ ] ⚠ **O método vem SEMPRE do `payment_term`, nunca do input** (**NOVO**)
- [ ] CPF/CNPJ inválido → negado **antes** de qualquer chamada ao Asaas

### 1.6 ⚠ Outbox e o efeito "entrada paga" (**NOVOS**)

⚠ **Estes testes provam a correção do bug mais sutil da revisão:**

- [ ] ⚠ **`PAYMENT_CONFIRMED` sozinho → 1 comando `criar_parcelamento_saldo`**
- [ ] ⚠ **`PAYMENT_RECEIVED` sozinho (Pix pula o CONFIRMED) → 1 comando** — ⚠ **o teste que prova que a entrada via Pix NÃO fica sem saldo**
- [ ] ⚠ **Os DOIS eventos chegando → AINDA 1 comando** (`UNIQUE(idempotency_key)`)
- [ ] ⚠ **O mesmo evento 2× → ainda 1 comando**
- [ ] ⚠ **Os dois FORA DE ORDEM → ainda 1 comando**
- [ ] ⚠ **Resultado em todos os casos: o parcelamento do saldo é criado UMA ÚNICA VEZ**
- [ ] ⚠ **Nenhuma chamada HTTP acontece dentro da transação do webhook** (verificável por mock: o cliente HTTP **não é invocado** durante o handler)
- [ ] ⚠ **Dois dispatchers simultâneos → o comando é executado UMA vez** (`SKIP LOCKED`)
- [ ] Comando falho → `attempts++`, `next_attempt_at` com backoff
- [ ] ⚠ **Após `max_attempts` → `status='falha'` + ALERTA**

---

## 2. Testes de integração (⚠ **Sandbox**, nunca produção)

- [ ] Criar cliente no Asaas
- [ ] ⚠ **Criar o MESMO cliente 2× → UM único `payment_provider_customers`** — **[ASAAS]** a API **permite** duplicatas; este teste prova que **a NOSSA prevenção funciona**
- [ ] Atualizar cliente
- [ ] Cobrança avulsa: **Pix** · **boleto** · **cartão**
- [ ] Parcelamento (10x) → **[ASAAS]** a resposta traz **só a 1ª**; buscar as demais via `GET /v3/installments/{id}/payments`
- [ ] ⚠ **Os valores das nossas `installments` batem CENTAVO A CENTAVO com os do Asaas** (o teste de arredondamento, contra a API real)
- [ ] Entrada (Pix) + saldo parcelado → **[ASAAS]** confirmar que **são DUAS operações**
- [ ] Consultar, cancelar, estornar
- [ ] ⚠ **[ASAAS]** Estorno **parcial** de Pix; depois um **segundo** parcial que completa o total
- [ ] `invoiceUrl` (ou `checkout link`) **abre**

⚠ **Resolver as lacunas que bloqueiam a DEC-001** (`REFERENCES.md` §4 · F2):
- [ ] ⚠ **H1 — `billingTypes: ["BOLETO"]` é aceito no Checkout?** ⚠ **BLOQUEIA A DEC-001**
- [ ] ⚠ **H2 — o payload de `CHECKOUT_PAID` traz o `payment id` e o nº de parcelas escolhido?** ⚠ **Sem isso, `customer_choice` é inviável**
- [ ] ⚠ **H3 — o Checkout emite também os `PAYMENT_*`?**
- [ ] ⚠ **[HIP] `maxInstallmentCount` acima do limite da bandeira** (ex.: 15x com Elo, limite 12): o Asaas recusa na criação? oferece menos? falha no pagamento? → **responde DEC-004**
- [ ] ⚠ **[HIP] Como silenciar as notificações do Asaas** (DEC-013)
- [ ] **Registrar TODAS as respostas em `REFERENCES.md`**, convertendo **[HIP]** em **[ASAAS]**

---

## 3. ⚠ Testes de segurança — obrigatórios, sem exceção

⚠ **Nenhum destes pode ser dispensado.**

- [ ] ⚠ **Usuário da empresa A tenta acessar projeto/cobrança da empresa B → 403.** Testar nas **três** camadas: Server Action, **RLS** e API
- [ ] ⚠ **`role='pending'` não lê UMA ÚNICA LINHA de nenhuma tabela** (**NOVO** — prova o *fail closed*)
- [ ] ⚠ **Um cliente NÃO consegue alterar o próprio `role` nem `organization_id`** (tentativa direta pela API do Supabase → **negada pela RLS**) — ⚠ **sem este teste, a RLS inteira pode ser decoração**
- [ ] ⚠ **Frontend envia valor adulterado** (`total_cents: 1`) → **ignorado**; o servidor usa o valor **do contrato**
- [ ] ⚠ **Frontend envia `installment_count: 60`** numa condição com `max_installments: 10` → **rejeitado** (**NOVO**)
- [ ] ⚠ **Frontend envia um método diferente do da condição** → **ignorado**; usa-se o do banco (**NOVO**)
- [ ] **Frontend envia `payment_term_id` de outra proposta** → 403
- [ ] ⚠ **Duplo clique / duas requisições simultâneas → UMA cobrança, UMA URL**
- [ ] ⚠ **Webhook sem `asaas-access-token` → 401, NADA persistido**
- [ ] **Webhook com token errado → 401**
- [ ] ⚠ **Replay: o mesmo evento 2× → processado 1×.** A `transaction` **não** é duplicada (**[ASAAS]** *at least once* — ⚠ **isso VAI acontecer em produção**)
- [ ] **Payload inválido → 400**, sem quebrar o servidor
- [ ] **Cliente tenta rota administrativa → 403** (testado **na action**, não só na UI)
- [ ] ⚠ **Cliente tenta `INSERT`/`UPDATE` direto em `charges` via API do Supabase → NEGADO pela RLS** — ⚠ **o teste que prova que a RLS não é decorativa**
- [ ] ⚠ **NENHUMA função `SECURITY DEFINER` é executável pelo papel `anon`** (**NOVO** — ⚠ **a chave `anon` é PÚBLICA; uma função assim seria um endpoint público de escrita em dados financeiros**. DEC-008)
- [ ] ⚠ **Toda função `SECURITY DEFINER` tem `search_path` fixo** (**NOVO** — contra *search_path hijacking*)
- [ ] ⚠ **`ASAAS_API_KEY` NÃO aparece no bundle** — buscar a string em `.next/static/` após o build
- [ ] ⚠ **`SUPABASE_SERVICE_ROLE_KEY` NÃO aparece no bundle**
- [ ] **Nenhum segredo em log** (revisar a saída dos testes)
- [ ] ⚠ **O retorno do navegador NÃO confirma pagamento**: acessar a URL de retorno na mão **não muda o estado da cobrança**

---

## 4. Testes de resiliência

Simulados com mock do `AsaasClient`.

- [ ] ⚠ **Timeout na criação COM a cobrança JÁ criada no Asaas** → o sistema **consulta por `externalReference`**, **encontra**, vincula, e ⚠ **NÃO cria uma segunda**. ⚠ **É o teste mais importante da suíte: é o que impede cobrar duas vezes.**
- [ ] **Timeout SEM a cobrança criada** → retry seguro cria **uma**
- [ ] ⚠ **Asaas fora do ar** → a charge fica `criada`; a mensagem ao cliente é ⚠ **"estamos confirmando"**, **nunca "falhou"**; a reconciliação resolve depois
- [ ] **Resposta inválida do Asaas** (JSON quebrado, campo faltando) → erro tratado, **nada corrompido**
- [ ] **Webhook duplicado** → §3
- [ ] **Evento fora de ordem** → §1.2
- [ ] ⚠ **Falha do BANCO no `INSERT` de `webhook_events` → 500** (⚠ **o ÚNICO caso** em que queremos o retry do Asaas — **nada foi salvo**)
- [ ] ⚠ **Falha no PROCESSAMENTO → 200 + `erro` + alerta.** ⚠ **A fila do Asaas NÃO é derrubada** — ⚠ **o teste que prova que um bug nosso não para a sincronização inteira**
- [ ] ⚠ **Evento desconhecido → 200 + `ignorado` + alerta.** Fila **viva**
- [ ] ⚠ **Operação parcialmente concluída** (cliente criado no Asaas, mas o `INSERT` do vínculo falhou) → a próxima tentativa **encontra** por `externalReference` e **não duplica**
- [ ] ⚠ **Rollback do webhook NÃO deixa cobrança-fantasma no Asaas** (**NOVO** — ⚠ **prova que a chamada externa está FORA da transação**)
- [ ] ⚠ **Comando de outbox travado é retomado pelo cron** (**NOVO**)
- [ ] **Reconciliação** encontra e corrige uma cobrança com webhook perdido
- [ ] ⚠ **Reconciliação NÃO regride estado nem "corrige" valor divergente sozinha** → **exige intervenção manual**

---

## 5. Homologação em Sandbox — roteiro ponta a ponta

⚠ **[ASAAS] Nunca usar dinheiro real durante desenvolvimento e homologação.**
⚠ **Guarda obrigatória:** `ASAAS_ENVIRONMENT='production'` com `NODE_ENV !== 'production'` ⚠ **deve FALHAR O BOOT**. **Sem isso, um `.env` errado gera cobranças reais em dinheiro real.**

- [ ] 1. Conta Sandbox criada; **[ASAAS]** URL **`https://api-sandbox.asaas.com/v3`** confirmada; `User-Agent` correto
- [ ] 2. ⚠ **Webhook cadastrado apontando para uma URL ESTÁVEL** (**[REC]** `staging.anterosistemas.com.br` — ⚠ **NUNCA uma URL de preview da Vercel**, que muda a cada deploy — DEC-015), com **token próprio**
- [ ] 3. Criar cliente no Asaas a partir de uma `organization` real do nosso banco
- [ ] 4. Criar cobrança (Pix) → obter a URL
- [ ] 5. Abrir a URL: a página carrega e mostra **o valor certo**
- [ ] 6. Simular o pagamento
- [ ] 7. ⚠ **Receber `PAYMENT_CONFIRMED` (ou `RECEIVED`)** → conferir `webhook_events` (⚠ **payload BRUTO gravado**), `charges.status`, `installments`, `transactions`
- [ ] 8. Dashboard do cliente mostra **"Pago"**
- [ ] 9. ⚠ **Receber `PAYMENT_RECEIVED`** → `liquidada`. ⚠ **Confirmar que o cliente CONTINUA vendo "Pago"** e o financeiro passa a ver "Liquidado" — ⚠ **valida a decisão central de `ARCHITECTURE.md` §3**
- [ ] 10. Repetir com **boleto** — **[ASAAS]** `CREATED → CONFIRMED → RECEIVED`
- [ ] 11. Repetir com **cartão parcelado (10x)** — conferir as 10 parcelas, **centavo a centavo**
- [ ] 12. ⚠ **Entrada + saldo: pagar a entrada VIA PIX** → ⚠ **confirmar que o parcelamento do saldo é criado AUTOMATICAMENTE** — ⚠ **[ASAAS] o Pix pode disparar SÓ o `RECEIVED`, e o saldo TEM que ser criado mesmo assim** (o bug corrigido nesta revisão)
- [ ] 13. ⚠ **Conferir que o saldo foi criado UMA ÚNICA VEZ** (`outbox_events` tem **um** comando `concluido`)
- [ ] 14. (Se DEC-001 = B) ⚠ **Checkout com `customer_choice`: escolher 7x e pagar** → ⚠ **confirmar que o nº escolhido volta e que as 7 parcelas são materializadas** (**lacuna H2**)
- [ ] 15. (Se B) ⚠ **Deixar um checkout EXPIRAR** → `CHECKOUT_EXPIRED` → `expirada` → oferece nova tentativa
- [ ] 16. **Cancelar** → `PAYMENT_DELETED` → `cancelada`
- [ ] 17. **Estornar** → `PAYMENT_REFUNDED` → `estornada` + transação **negativa**
- [ ] 18. ⚠ **Estorno PARCIAL de Pix** → `parcialmente_estornada`; depois um segundo que completa → `estornada`
- [ ] 19. ⚠ **Reenviar manualmente um evento já processado → NADA acontece** (idempotência provada em ambiente real)
- [ ] 20. ⚠ **Derrubar o endpoint de propósito** e deixar falhar → conferir o **alerta**. Restaurar. ⚠ **Se a fila for interrompida, PRATICAR A REATIVAÇÃO MANUAL** no painel do Asaas — ⚠ **essa recuperação precisa ter sido feita ao menos uma vez em treino, e não pela primeira vez sob pressão em produção**
- [ ] 21. ⚠ **Executar a reconciliação** → conferir que corrige as divergências de (20), ⚠ **destrava comandos de outbox**, e ⚠ **NÃO corrige o que exige humano**

---

## 6. Critérios para liberar Produção

⚠ **Nada marcado — nada foi implementado.**

**Bloqueantes de segurança (`SECURITY.md` §4):**
- [ ] Papéis (⚠ **`pending`/`admin`/`cliente`**) e RLS implementados e **testados**
- [ ] ⚠ **Cliente não consegue se auto-promover a admin** (testado)
- [ ] Proxy ***fail closed*** em produção
- [ ] ⚠ **`ASAAS_API_KEY` e `SUPABASE_SERVICE_ROLE_KEY` confirmadamente AUSENTES do bundle**
- [ ] ⚠ **Nenhuma função `SECURITY DEFINER` executável por `anon`**
- [ ] **Todos** os testes de segurança da §3 **passando**

**Bloqueantes funcionais:**
- [ ] Todos os unitários da §1 — em especial ⚠ **`soma(parcelas) === total`** e ⚠ **nenhum `BigInt` em JSON**
- [ ] Todos os de resiliência da §4 — em especial ⚠ **o timeout com cobrança já criada**
- [ ] ⚠ **A entrada via Pix cria o saldo — UMA vez** (§1.6)
- [ ] Roteiro de Sandbox (§5) executado **INTEGRALMENTE**, ⚠ **inclusive a reativação manual da fila (item 20)**
- [ ] Reconciliação testada e funcionando

**Bloqueantes operacionais:**
- [ ] Logs estruturados, ⚠ **sem segredos e sem dados pessoais completos**
- [ ] Alertas configurados **e testados** (webhook · ⚠ **outbox** · chargeback · falhas ≥ 5)
- [ ] Painel de saúde (webhooks **e outbox**) acessível à equipe
- [ ] ⚠ **Runbook escrito:** o que fazer quando a fila for interrompida · quando um chargeback chegar · quando a reconciliação achar divergência · ⚠ **quando um comando de outbox falhar em definitivo**
- [ ] Credenciais de **Produção** só na infra de produção
- [ ] ⚠ Webhook de produção em **`https://anterosistemas.com.br/api/webhooks/asaas`**, com token **próprio**
- [ ] ⚠ **Política de notificação definida** — o cliente **não** recebe mensagem duplicada (DEC-013)

**Liberação gradual [REC]:**
- [ ] ⚠ **Primeira cobrança real: valor baixo, cliente conhecido, acompanhada em tempo real**
- [ ] ⚠ **Dinheiro confirmado na conta do Asaas** antes de liberar para todos

⚠ **[REC] Não liberar numa sexta-feira.** **[ASAAS]** Se a fila for interrompida no sábado, os eventos represados **começam a expirar (14 dias)**, a recuperação é **manual** — **e ninguém está olhando**.
