# Arquitetura recomendada

> Data: 14/07/2026 (revisado na 2ª rodada). Rótulos: **[REPO]** · **[ASAAS]** · **[REC]** · **[HIP]**.

---

## 1. Comparação das QUATRO estratégias de integração

> **Correção da 1ª versão:** a análise anterior comparou apenas três caminhos e **omitiu o produto oficial Asaas Checkout**. Ele está incluído aqui e **muda a análise** — em particular no controle dos métodos de pagamento.

### As quatro opções

| | Estratégia | O que é |
|---|---|---|
| **A** | **Cobrança tradicional + `invoiceUrl`** | `POST /v3/payments` cria a cobrança; o cliente é enviado à **página de fatura** do Asaas. |
| **B** | **Asaas Checkout** (`POST /v3/checkouts`) | Produto de **checkout hospedado**. Devolve um `link`. O cliente escolhe método e parcelas **na página do Asaas**, dentro dos limites que **nós definimos**. |
| **C** | **Link de pagamento** (`/v3/paymentLinks`) | Link **reutilizável**, compartilhável. |
| **D** | **Checkout transparente** | O cliente digita o cartão **na nossa interface**; enviamos `creditCard` + CVV à API. |

### Comparação

| Critério | **A — `invoiceUrl`** | **B — Asaas Checkout** | **C — Link** | **D — Transparente** |
|---|---|---|---|---|
| **Pix** | ✅ **[ASAAS]** | ✅ **[ASAAS]** (`billingTypes: ["PIX"]`) | ✅ | ⚠ Fluxo próprio (QR), não é o form de cartão |
| **Boleto** | ✅ **[ASAAS]** | ⚠ **[HIP] NÃO CONFIRMADO** — todos os exemplos oficiais usam só `PIX` e `CREDIT_CARD`. **Lacuna H1** (`REFERENCES.md` §4) | ✅ | ⚠ Idem |
| **Cartão** | ✅ | ✅ | ✅ | ✅ |
| **Parcelamento** | ✅ `installmentCount` | ✅ `chargeTypes: ["INSTALLMENT"]` | ✅ `chargeType: INSTALLMENT` | ✅ |
| **Cliente escolhe o nº de parcelas** | ❌ **NÃO.** O nº é **fixado por nós** na criação (`installmentCount`) | ✅ **SIM** — **[ASAAS]** `maxInstallmentCount` define o teto e **o cliente escolhe na página** | ✅ `maxInstallmentCount` | ✅ (nós controlamos a UI) |
| **`maxInstallmentCount`** | ❌ não existe | ✅ **[ASAAS]** | ✅ **[ASAAS]** | n/a |
| ⚠ **Controle dos métodos aceitos** | ⚠ **FRACO.** **[ASAAS]** `billingType` é **um valor único**: ou **um** método concreto, ou **`UNDEFINED`** — que libera **tudo que a conta tiver habilitado**, sem controle nosso. **Não há como dizer "Pix ou cartão, mas não boleto".** | ✅ **FORTE.** **[ASAAS]** `billingTypes` é um **ARRAY** — **impõe exatamente o conjunto** que definirmos | ✅ Array? **[HIP]** a doc mostra `billingType` singular | ✅ total (é nossa UI) |
| **Callbacks** | ⚠ Só *Return URL* (sucesso) | ✅ **[ASAAS]** `callback` com **`successUrl`, `cancelUrl`, `expiredUrl`** | limitado | n/a |
| **Expiração** | Via `dueDate` (data) | ✅ **[ASAAS]** `minutesToExpire` (**10 a 1440 min**) — sessão de pagamento com validade | não | n/a |
| **Webhooks** | ✅ `PAYMENT_*` (bem documentados) | ✅ `CHECKOUT_*`. ⚠ **[HIP]** Emite também `PAYMENT_*`? **Lacuna H3** | `PAYMENT_*` | ✅ `PAYMENT_*` |
| ⚠ **Vínculo cliente/projeto/proposta/cobrança** | ✅ **FORTE.** `externalReference` = nossa `charge.id`; a cobrança **já existe** no nosso banco antes do redirect | ✅ **[ASAAS]** `externalReference` (**máx. 200 chars**). ⚠ **[HIP]** o payload de `CHECKOUT_PAID` traz o **`payment id`** gerado? **Lacuna H2 — sem isso, o vínculo com a cobrança fica frágil** | ❌ **FRACO.** **[ASAAS]** aceita **CPF/CNPJ duplicado**; link reutilizável gera registros soltos | ✅ Forte |
| **Segurança / dados de cartão** | ✅ **Nunca** passam por nós | ✅ **Nunca** passam por nós | ✅ Nunca | 🔴 **Passam pelo nosso servidor** (nº + CVV) |
| **Conformidade PCI** | ✅ Escopo mínimo (**[ASAAS]** *"minimiza o ônus PCI"*) | ✅ Escopo mínimo | ✅ Mínimo | 🔴 Escopo ampliado |
| **Complexidade** | **Baixa** | **Baixa/média** (mais parâmetros) | Baixa | **Alta** (form PCI, tokenização, recusas, antifraude) |
| **Experiência do usuário** | Boa | ✅ **Melhor** dos hospedados (itens, expiração, callbacks, escolha de parcelas) | Média | ✅ Melhor (não sai do site) |
| **Personalização** | Limitada | Limitada (itens/imagens) | Limitada | ✅ Total |
| **Manutenção** | Baixa | Baixa | Baixa | **Alta** |
| **Homologação** | ✅ Rápida | Média (**3 lacunas a testar**) | Rápida | Lenta |
| **Dependência da UI do Asaas** | Sim | Sim | Sim | Não |
| **Riscos operacionais** | Baixo. **[ASAAS]** `UNDEFINED` pode expor método indesejado | ⚠ **[HIP] Boleto pode não existir.** Checkout expira | ⚠ Pagamento sem vínculo confiável | 🔴 Vazamento de cartão; timeout com cobrança criada |
| **Limitações da conta** | **[HIP]** métodos habilitados variam por conta | **[HIP]** idem + disponibilidade do produto Checkout | **[HIP]** idem | **[HIP]** idem |

### O trade-off central, em uma frase

- **A (`invoiceUrl`)** tem **boleto confirmado**, mas **não controla o conjunto de métodos** (`UNDEFINED` = tudo) e **não deixa o cliente escolher parcelas**.
- **B (Checkout)** **controla os métodos** (array), **deixa o cliente escolher parcelas** (`maxInstallmentCount`), tem expiração e callbacks — **mas o suporte a boleto não está confirmado**.

**O negócio da ANTERO exige boleto.** Logo, **a escolha depende inteiramente de responder a lacuna H1.**

### Recomendação — **[REC] condicional, e a DEC-001 permanece PENDENTE**

**Não é honesto recomendar B sem saber se ele faz boleto, nem recomendar A sabendo que ele não controla os métodos.** A recomendação é, portanto, **condicional ao resultado de um teste em Sandbox**:

| Se, em Sandbox… | Então **[REC]** |
|---|---|
| **H1 = Checkout ACEITA `BOLETO`** e **H2 = `CHECKOUT_PAID` traz o `payment id` e o nº de parcelas** | **Estratégia B (Asaas Checkout)** como fluxo principal. É estritamente superior a A: mesmos métodos, **mais** controle (array de métodos), **mais** capacidade (cliente escolhe parcelas), **mais** UX (expiração, callbacks de cancelamento e expiração). |
| **H1 = Checkout NÃO aceita boleto**, ou **H2 não se resolve** | **Estratégia A (`invoiceUrl`)** como fluxo principal, com a ⚠ **restrição obrigatória** de **nunca usar `billingType: UNDEFINED`** — usar sempre **um método concreto por condição**, e oferecer **condições separadas** ("Pix à vista", "Boleto à vista", "Cartão em até 10x"). É assim que se recupera o controle dos métodos que A não dá. Ver `DATA_MODEL.md` §3.5. |

**Em ambos os casos:**
- **D (transparente) é descartada.** É a única em que a ANTERO **vê número de cartão e CVV**. A exigência do negócio ("não armazenar CVV, não armazenar número do cartão") deixa de ser **impossível de violar** e passa a depender de disciplina — em logs, APM, telas de erro, relatórios de exceção. O ganho de conversão que justificaria D é problema de e-commerce de alto volume; **o cliente da ANTERO é uma empresa fechando um projeto de dezenas de milhares de reais**, para quem o redirect a um ambiente bancário reconhecido **aumenta** a confiança.
- **C (link) é descartada como fluxo principal** e mantida como **ferramenta administrativa pontual** (cobrar um extra fora do fluxo de projeto), pelo problema de vínculo.

⚠ **Como o teste de H1/H2/H3 exige uma conta Sandbox — que ainda não existe —, a DEC-001 fica `pendente` e a Fase 2 ganha, como entregável obrigatório, responder essas três perguntas** (`IMPLEMENTATION_PLAN.md`, F2).

**[REC] Consequência de projeto — desenhar para as duas.** A diferença entre A e B é **onde a cobrança é criada e como as parcelas são escolhidas**. Se o `CobrancaService` for escrito com uma fronteira clara (`criarCobranca(payment_term) → { url, provider_ids }`), trocar A por B é **substituir uma implementação**, não reescrever o domínio. **O modelo de dados de `DATA_MODEL.md` suporta as duas sem alteração** — foi desenhado assim de propósito.

---

## 2. Camadas propostas

**Princípio [REC]:** não criar abstração por antecipação. Cada camada existe por um problema **concreto e já identificado**.

### 2.1 Camadas a criar

| Camada | Problema que resolve | Quando |
|---|---|---|
| **`AsaasClient`** | Centraliza URL por ambiente, header `access_token`, `Content-Type`, **`User-Agent`**, timeout, tratamento de erro, **e a conversão centavos ↔ reais** (`DECISIONS.md` DEC-006). Impede que a API Key escape do servidor. | **F2.** Obrigatório. |
| **`CobrancaService`** | O fluxo de criação tem ~20 passos de validação/autorização. Não pode viver num componente nem num Route Handler — é chamado pela Server Action, pela área administrativa e pela reconciliação. | **F4.** |
| **`WebhookProcessor`** | **[ASAAS]** O endpoint precisa responder 2xx rápido (15 falhas derrubam a fila). **Receber ≠ processar.** | **F5.** Obrigatório. |
| **Mapeador de estados** | **[ASAAS]** Eventos e status mudam sem aviso. Um único ponto de tradução evita `'RECEIVED'` como string mágica espalhada. | **F1.** |
| **⚠ `OutboxDispatcher`** | **NOVO nesta revisão.** Executa os efeitos externos **fora** da transação do webhook. Ver §4. | **F5.** Obrigatório. |
| **`ReconciliacaoService`** | **[ASAAS]** A fila pode ser interrompida e os eventos são **descartados após 14 dias**. Sem reconciliação, uma indisponibilidade vira **perda permanente e silenciosa**. | **F8.** |

### 2.2 Camadas a **NÃO** criar

| Camada | Por quê |
|---|---|
| **Interface `PaymentProvider` genérica** | Existe **um** provedor. Uma interface abstraída de um único caso vaza os detalhes desse caso e não serve para o segundo. O que **de fato** protege a troca é: estados internos próprios, **um** ponto de tradução, e referências externas isoladas em colunas prefixadas (`provider_*`) — tudo isso já está no modelo. Criar quando houver um **segundo provedor real**. |
| **`CustomerService` / `ChargeService` separados** | No volume da ANTERO, seriam três arquivos onde um `CobrancaService` basta. Separar quando ele crescer. |
| **Fila/worker dedicado (Redis, SQS…)** | ⚠ **A outbox (§4) já resolve o problema sem infraestrutura nova** — a "fila" é uma tabela no Postgres que já temos. Um broker só se justifica com volume que a ANTERO não tem. |

---

## 3. Máquina de estados — **transições explícitas**

> **Correção da 1ª versão.** A versão anterior usava **apenas uma ordenação linear de pesos** ("o estado só avança"). **Isso estava errado** e teria travado transições legítimas: uma cobrança **vencida** que é paga com atraso, uma **liquidada** que sofre chargeback, um estorno **parcial**. Substituído por uma **tabela explícita de transições permitidas**.

### 3.1 Estados internos da cobrança (`charges.status`)

| Estado | Significado |
|---|---|
| `criada` | Existe no nosso banco; ainda não confirmada no Asaas (ou resposta perdida). |
| `aguardando_pagamento` | Emitida no Asaas; aguardando o cliente. |
| `em_analise` | Cartão autorizado, não capturado / antifraude. |
| **`paga`** | **O cliente pagou.** É o que o **cliente** vê e o que **libera o projeto**. |
| **`liquidada`** | **O dinheiro caiu na conta da ANTERO.** É o que interessa ao **financeiro**. |
| `vencida` | Passou do vencimento sem pagamento. ⚠ **Não é terminal.** |
| **`parcialmente_estornada`** | **NOVO.** Houve estorno(s), mas a soma **< valor pago**. **[ASAAS]** Pix admite **múltiplos parciais**. |
| `estornada` | Estorno **total** (ou parciais que **somam** o total). |
| `contestada` | Chargeback aberto. |
| `cancelada` | Cancelada/removida antes do pagamento. |
| `falha` | Recusa definitiva (ex.: captura de cartão recusada). |
| `expirada` | **NOVO** — só na Estratégia B. **[ASAAS]** `CHECKOUT_EXPIRED` (estourou `minutesToExpire`). |

### 3.2 Transições permitidas — a tabela é a regra

Uma transição que **não** esteja aqui é **rejeitada** e registrada como anomalia.

| De → Para | Permitida? | Gatilho |
|---|---|---|
| `criada` → `aguardando_pagamento` | ✅ | Cobrança confirmada no Asaas / `PAYMENT_CREATED` |
| `criada` → `falha` | ✅ | Erro definitivo na criação |
| `aguardando_pagamento` → `em_analise` | ✅ | `PAYMENT_AUTHORIZED` |
| `aguardando_pagamento` → **`paga`** | ✅ | `PAYMENT_CONFIRMED` |
| ⚠ `aguardando_pagamento` → **`liquidada`** | ✅ | **`PAYMENT_RECEIVED`** — **[ASAAS] Pix pula o `CONFIRMED`** |
| `aguardando_pagamento` → `vencida` | ✅ | `PAYMENT_OVERDUE` |
| `aguardando_pagamento` → `cancelada` | ✅ | `PAYMENT_DELETED` |
| `aguardando_pagamento` → `expirada` | ✅ | `CHECKOUT_EXPIRED` (Estratégia B) |
| `em_analise` → `paga` / `liquidada` / `falha` | ✅ | `CONFIRMED` / `RECEIVED` / `CAPTURE_REFUSED` |
| ⚠ **`vencida` → `paga`** | ✅ **SIM** | `PAYMENT_CONFIRMED`. **Pagamento com atraso é normal** — boleto pago depois do vencimento. A v1 proibia isto. |
| ⚠ **`vencida` → `liquidada`** | ✅ **SIM** | `PAYMENT_RECEIVED`. Idem (Pix atrasado). |
| `vencida` → `cancelada` | ✅ | Cancelamento administrativo |
| **`paga`** → **`liquidada`** | ✅ | `PAYMENT_RECEIVED` (**~32 dias depois**, em cartão) |
| ⚠ **`paga`** → **`parcialmente_estornada`** | ✅ **SIM** | `PAYMENT_REFUNDED` com `valor < pago` |
| **`paga`** → `estornada` | ✅ | `PAYMENT_REFUNDED` total |
| **`paga`** → `contestada` | ✅ | `PAYMENT_CHARGEBACK_REQUESTED` |
| ⚠ **`liquidada`** → **`contestada`** | ✅ **SIM** | `PAYMENT_CHARGEBACK_REQUESTED`. **Chargeback ocorre DEPOIS de o dinheiro cair** — é o caso normal. A v1 proibia. |
| ⚠ **`liquidada`** → **`parcialmente_estornada`** | ✅ **SIM** | `PAYMENT_REFUNDED` parcial |
| **`liquidada`** → `estornada` | ✅ | `PAYMENT_REFUNDED` total |
| ⚠ **`parcialmente_estornada`** → **`parcialmente_estornada`** | ✅ **SIM** | **Novo estorno parcial** (**[ASAAS]** Pix admite múltiplos). Cada um gera uma linha em `refunds`; o **estado só muda quando a soma atinge o total**. |
| ⚠ **`parcialmente_estornada`** → **`estornada`** | ✅ **SIM** | Estorno parcial que **completa** o valor total |
| `parcialmente_estornada` → `contestada` | ✅ | Chargeback após estorno parcial |
| ⚠ **`contestada`** → **`liquidada`** | ✅ **SIM** | **Chargeback RESOLVIDO A FAVOR da ANTERO.** ⚠ **Exige registro do desfecho e ação administrativa** — não é automático. |
| ⚠ **`contestada`** → **`estornada`** | ✅ **SIM** | **Chargeback resolvido a favor do cliente** (dinheiro devolvido). |
| `falha` → *(nada)* | terminal | Nova tentativa **cria uma NOVA charge** (§ `PAYMENT_FLOWS.md` §8), não reusa esta. |
| `cancelada` / `expirada` → *(nada)* | terminais | Idem. |
| ⚠ **`paga` → `aguardando_pagamento`** | ❌ **PROIBIDA** | Regressão. Sinaliza inconsistência → **intervenção humana** (`PAYMENT_FLOWS.md` §10.3). |
| ⚠ **`liquidada` → `paga`** | ❌ **PROIBIDA** | Idem. |
| Qualquer → mesmo estado | ✅ **no-op** | Idempotência: reentrega do mesmo evento **não faz nada**. |

### 3.3 Eventos fora de ordem — a regra derivada

**[ASAAS]** A ordem de entrega **não é garantida** e o **Pix pula o `CONFIRMED`**.

**[REC]** Regra: **se a transição não está na tabela, ela não é aplicada — mas o evento é registrado como `processado`, não como erro.**

Exemplos concretos:
- `RECEIVED` chega **antes** de `CONFIRMED` (Pix, ou atraso de rede) → vai a `liquidada`. Quando o `CONFIRMED` atrasado chegar, `liquidada → paga` **não está na tabela** → **no-op**. ✅ Estado preservado.
- `CREATED` chega depois de `CONFIRMED` → `paga → aguardando_pagamento` **proibida** → **no-op**. ✅

### 3.4 ⚠ O efeito "entrada paga" — disparado por **`CONFIRMED` OU `RECEIVED`**

**Este é o bug mais sutil que a revisão corrigiu.**

**[ASAAS]** O Pix vai de `CREATED` **direto** para `RECEIVED`. A v1 desta documentação disparava a criação do parcelamento do saldo **no `PAYMENT_CONFIRMED`**. Como **a entrada do fluxo "entrada + saldo" é justamente via Pix**, o `CONFIRMED` **pode nunca chegar** — e **o parcelamento do saldo jamais seria criado**. O cliente pagaria a entrada e o sistema ficaria mudo.

**[REC] Correção:** o efeito "a entrada foi paga" é disparado por **`PAYMENT_CONFIRMED` ou `PAYMENT_RECEIVED`, o que vier primeiro**, e é **idempotente por construção**: ambos criam **o mesmo comando na outbox**, com a **mesma chave idempotente** (`outbox:criar_saldo:{payment_plan_id}`). O `UNIQUE` da outbox garante que, se os dois eventos chegarem, **o comando é criado uma única vez** — e o parcelamento do saldo **não é duplicado**.

→ Detalhes em §4 e em `WEBHOOKS.md` §5.

### 3.5 Outros estados

- **Parcela (`installments.status`)**: `pendente` · `paga` · `liquidada` · `vencida` · `parcialmente_estornada` · `estornada` · `cancelada`. Espelha a cobrança.
- **Plano (`payment_plans.status`)**: `rascunho` · `ativo` · `quitado` · `cancelado` · `inadimplente`.
- **Proposta (`proposals.status`)**: `rascunho` · `enviada` · `aprovada` · `recusada` · `expirada`. Só **`aprovada`** gera plano.
- **Projeto**: `prospeccao` · `proposta` · `contratado` · `em_execucao` · `entregue` · `cancelado`.
- **`transactions`**: **sem estado** — append-only. Um erro se corrige com **lançamento compensatório**, nunca reescrevendo.

### 3.6 Mapeamento Asaas → interno

| Evento **[ASAAS]** | Estado interno | Ação |
|---|---|---|
| `PAYMENT_CREATED` | `aguardando_pagamento` | Registra. |
| `PAYMENT_AUTHORIZED` | `em_analise` | Registra. |
| **`PAYMENT_CONFIRMED`** | **`paga`** | ⚠ **Enfileira o efeito "pagamento efetivado"** (§3.4). |
| **`PAYMENT_RECEIVED`** | **`liquidada`** | Transação para o financeiro. ⚠ **Enfileira o MESMO efeito** (§3.4) — idempotente. |
| `PAYMENT_OVERDUE` | `vencida` | Alerta. |
| `PAYMENT_DELETED` | `cancelada` | Registra. |
| `PAYMENT_REFUND_IN_PROGRESS` | (mantém) | Registra em `refunds`. |
| `PAYMENT_REFUNDED` | **`parcialmente_estornada`** ou **`estornada`** | ⚠ **Depende da SOMA dos estornos**, não do evento isolado. |
| `PAYMENT_REFUND_DENIED` | (mantém) | ⚠ **Ação administrativa.** |
| `PAYMENT_CREDIT_CARD_CAPTURE_REFUSED` | `falha` | Notifica o cliente. |
| `PAYMENT_CHARGEBACK_REQUESTED` | `contestada` | ⚠ **Ação administrativa + ALERTA.** Chargeback tem prazo de defesa. |
| `PAYMENT_CHARGEBACK_DISPUTE` | (mantém `contestada`) | ⚠ **Ação administrativa.** |
| **`CHECKOUT_CREATED`** (B) | `aguardando_pagamento` | Registra. |
| **`CHECKOUT_PAID`** (B) | *(ver H2)* | ⚠ **[HIP]** Se trouxer o `payment id` e o nº de parcelas, **materializa as parcelas** (`PAYMENT_FLOWS.md` §5). |
| **`CHECKOUT_CANCELED`** (B) | `cancelada` | Registra. |
| **`CHECKOUT_EXPIRED`** (B) | `expirada` | Registra. Oferece nova tentativa. |
| **Desconhecido** | **nenhum** | ⚠ Persiste bruto · `ignorado` · **responde 200** · **alerta**. Ver §3.7. |

### 3.7 O desconhecido — a regra que protege a fila

**[ASAAS]** Novos eventos aparecem **sem aviso**. E **15 falhas consecutivas interrompem a fila**.

**[REC]** Diante de evento/status desconhecido: **persistir bruto → marcar `ignorado` → responder 200 → alertar.** **Nunca responder erro por não reconhecer um evento.** Uma atualização de roadmap do Asaas **não pode** derrubar a sincronização financeira da ANTERO — mas derrubaria, se respondêssemos 500 quinze vezes.

---

## 4. ⚠ Outbox — efeitos externos **fora** da transação (NOVO)

> **Correção da 1ª versão.** A v1 mandava o webhook, **dentro de uma transação de banco**, "criar o parcelamento do saldo" — o que é uma **chamada HTTP ao Asaas**. Isso está errado, por três razões independentes, e cada uma sozinha já bastaria.

### 4.1 O problema

```
❌ ERRADO (v1):
BEGIN;
  UPDATE charges SET status='paga';
  INSERT transactions;
  POST https://api.asaas.com/v3/payments  ← ⚠ CHAMADA HTTP DENTRO DA TRANSAÇÃO
  INSERT charges (parcelas do saldo);
COMMIT;
```

**Por que é errado:**
1. ⚠ **A transação fica aberta durante uma chamada de rede.** Se o Asaas demorar 30s, o Postgres segura locks por 30s. Sob carga, isso esgota conexões e derruba o banco.
2. ⚠ **A chamada HTTP NÃO é transacional.** Se o `COMMIT` falhar **depois** de o `POST` ter criado o parcelamento no Asaas, **o rollback desfaz o nosso lado — mas não o do Asaas.** Resultado: **10 cobranças reais existem no Asaas e nenhuma existe no nosso banco.** Cobranças-fantasma que o cliente vai receber e nós não conhecemos.
3. ⚠ **[ASAAS]** O webhook precisa responder **rápido** (15 falhas derrubam a fila). Uma chamada externa lenta faz o handler estourar o tempo — e uma indisponibilidade do Asaas **derrubaria a nossa própria fila de eventos do Asaas**.

### 4.2 A solução: **padrão outbox**

**[REC]** O webhook **nunca** chama o Asaas. Ele **registra a intenção** numa tabela (`outbox_events`) **dentro da mesma transação** que atualiza o estado. Um **dispatcher**, **fora** da transação, executa.

```
✅ CERTO:
BEGIN;
  1. INSERT webhook_events (payload bruto)        ← idempotente por UNIQUE(provider_event_id)
  2. UPDATE charges / installments  (estado interno)
  3. INSERT transactions
  4. INSERT outbox_events (comando 'criar_parcelamento_saldo')  ← idempotente por UNIQUE(idempotency_key)
COMMIT;                                            ← ⚠ TUDO OU NADA. Sem rede envolvida.
  5. responde 2xx  ← rápido ✅

--- fora da transação, depois, de forma independente ---

OutboxDispatcher:
  6. lê comandos 'pendente' com next_attempt_at <= now()
  7. POST /v3/payments  ← ⚠ A CHAMADA EXTERNA ACONTECE AQUI
  8. sucesso → status='concluido'; grava os ids retornados
     falha   → attempts++, next_attempt_at = now() + backoff, status='pendente'
     falha definitiva (max attempts) → status='falha' → ⚠ ALERTA
```

**A propriedade que isso garante:** o estado interno e a **intenção** de chamar o Asaas são **commitados atomicamente**. Ou os dois existem, ou nenhum. **Nunca** "atualizei o estado mas esqueci de criar o parcelamento", nem "criei no Asaas mas perdi no meu banco".

### 4.3 O que passa pela outbox

**[REC]** **Todo efeito externo disparado por webhook**:

| Comando | Disparado por | Por que precisa de outbox |
|---|---|---|
| **`criar_parcelamento_saldo`** | Entrada paga (**`CONFIRMED` OU `RECEIVED`** — §3.4) | Chamada HTTP ao Asaas. **O caso original do problema.** |
| `notificar_cliente` | Pagamento confirmado, cobrança vencida | Envio de e-mail (Resend) = chamada de rede |
| `notificar_equipe` | Chargeback, erro, evento desconhecido | Idem |
| `sincronizar_cliente_asaas` | Dados da organização alterados | Chamada HTTP |
| `reprocessar_evento` | Reconciliação / ação administrativa | Reusa o mesmo caminho |
| `criar_cobranca_marco` | Marco atingido (ação administrativa) | Chamada HTTP |

**[REC] Regra geral:** **se o handler do webhook precisar fazer QUALQUER chamada de rede além do banco, ela vai para a outbox.** Sem exceção. É uma regra fácil de verificar em revisão de código, e é o que impede a reintrodução do bug.

### 4.4 Quem executa o dispatcher

**[REPO]** A produção roda na **Vercel** (`CURRENT_STATE.md` §7) — **serverless, sem worker persistente**.

**[REC] Duas formas, ambas sem infraestrutura nova:**
1. **Disparo imediato, após a resposta:** o handler responde 2xx e, em seguida, aciona o dispatcher (ex.: `after()` do Next.js, que roda depois de enviar a resposta). **Rápido no caminho feliz.**
2. **Rede de segurança — cron:** um job periódico varre a outbox por comandos `pendente` ou `falha` e reexecuta. **É o que garante que nada se perde** se (1) falhar.

⚠ **(2) é obrigatório.** (1) é otimização. Um sistema que depende só de (1) perde comandos quando a função morre logo após responder. **[HIP]** O agendador (Vercel Cron ou `pg_cron` do Supabase) **não foi decidido** → **DEC-014**.

### 4.5 Por que não uma fila de verdade (Redis/SQS)

**[REC]** Porque a outbox **já é uma fila** — durável, transacional, auditável — construída sobre o Postgres que **já temos**. Um broker adicionaria: mais um componente para operar, mais um modo de falha, mais um segredo, e **o problema clássico de consistência entre o commit do banco e o publish na fila** — que é exatamente o problema que a outbox existe para eliminar. **No volume da ANTERO, seria custo sem benefício.**
