# Fluxos de pagamento, idempotência e reconciliação

> Data: 14/07/2026 (revisado). Rótulos: **[REPO]** · **[ASAAS]** · **[REC]** · **[HIP]**.
> Pressupõe o modelo de `DATA_MODEL.md` e a máquina de estados de `ARCHITECTURE.md` §3.
> ⚠ **A estratégia (A `invoiceUrl` × B Checkout) ainda NÃO está decidida** — DEC-001 `pendente`, à espera do teste das lacunas H1/H2/H3 em Sandbox. **Os fluxos abaixo indicam explicitamente onde as duas divergem.**

---

## 1. O fluxo de negócio × a arquitetura atual

| Passo do negócio | Onde | Existe hoje? |
|---|---|---|
| 1-4. Equipe cadastra empresa, projeto, proposta, condições | Área administrativa | **[REPO] Não.** Telas mock, somente leitura, **sem nenhum formulário de criação**. |
| 5. Cliente recebe acesso | Supabase Auth + `profiles` | **[REPO] Parcial.** Login funciona; **papel e vínculo não existem**. |
| 6. Cliente entra na área autenticada | `/login` → `src/proxy.ts` → `/painel` | **[REPO] ✅ Sim, funciona.** |
| 7-9. Cliente vê projeto, proposta, condições | Dashboard | **[REPO] Não.** |
| 10. Cliente escolhe condição **(e, se aplicável, o nº de parcelas)** | Server Action | **[REPO] Não.** |
| 11-14. Servidor valida, calcula, cria cliente e cobrança | `CobrancaService` | **[REPO] Não.** |
| 15. Cliente paga | **Página hospedada do Asaas** | (é do Asaas) |
| 16-17. Webhook, processado idempotentemente | `POST /api/webhooks/asaas` | **[REPO] Não.** |
| 18-19. Status atualizado; cliente acompanha | Dashboard | **[REPO] Não.** |
| 20. Equipe acompanha | Área administrativa | **[REPO] Não.** |

**Dos 20 passos, o único que existe é o 6 (login).** Não é crítica ao projeto — é o retrato de um painel construído como protótipo visual, que ainda não recebeu backend. Mas define a ordem: **não há atalho que comece pelos pagamentos.**

---

## 2. Fluxo — cadastro do cliente (equipe da ANTERO)

```
Admin (profiles.role = 'admin')
  ├─► criarOrganizacao({ legal_name, tax_id, ... })
  │     ├─ valida CPF/CNPJ (dígito verificador) e normaliza (só dígitos)
  │     ├─ INSERT organizations  → UNIQUE(tax_id) impede empresa duplicada
  │     └─ audit_logs
  ├─► criarProjeto({ organization_id, name })
  ├─► criarProposta({ project_id, version: 1, total_cents })
  │     └─► criarCondicoes([payment_terms])   ⚠ ver §2.1
  └─► convidarUsuario({ email, organization_id })
        ├─ o usuário nasce com role='pending' (⚠ NÃO VÊ NADA — DATA_MODEL.md §3.1)
        └─ admin o promove a 'cliente' + organization_id  → audit_logs (activated_by)
```

**[REC]** ⚠ **O cliente do Asaas ainda NÃO foi criado.** Não há razão para criar um `customer` no Asaas para uma empresa que talvez nem aceite a proposta. **A criação é preguiçosa** — acontece no primeiro pagamento (§3).

### 2.1 ⚠ Criar as condições de pagamento — onde a regra dos métodos é aplicada

Este é o ponto em que a correção de `DATA_MODEL.md` §3.5 se torna operacional.

```
A equipe quer oferecer: "Pix à vista com desconto" OU "Cartão em até 10x"

❌ ERRADO (o que a v1 desta doc permitia):
   1 condição com allowed_billing_types = ['PIX','CREDIT_CARD']
   → [ASAAS] IMPOSSÍVEL de impor na cobrança tradicional: billingType é UM valor.
     Usar UNDEFINED liberaria TUDO que a conta tem habilitado — boleto incluído.
     O label diria "Pix ou cartão" e o cliente veria boleto. ⚠ Promessa falsa.

✅ CERTO — Estratégia A (invoiceUrl): DUAS CONDIÇÕES SEPARADAS
   payment_term #1: label='Pix à vista (5% desconto)'
                    billing_type='PIX'  ← concreto, imposto pelo Asaas
                    selection_mode='fixed', installment_count=1
                    total: R$ 19.000
   payment_term #2: label='Cartão em até 10x'
                    billing_type='CREDIT_CARD'  ← concreto
                    selection_mode='fixed', installment_count=10
                    total: R$ 20.000
   → O cliente escolhe a CONDIÇÃO. A condição determina o método. ✅
   → Bônus: preços diferentes por método passam a ser naturais (e são, comercialmente).

✅ CERTO — Estratégia B (Checkout): UMA condição, se preferido
   payment_term: billing_types = ['PIX','CREDIT_CARD']   ← [ASAAS] array, IMPOSTO
                 selection_mode='customer_choice', max_installments=10
   → O Asaas mostra só Pix e cartão, e o cliente escolhe as parcelas. ✅
```

⚠ **[REC] Regra a ser aplicada em revisão de código e de cadastro:** **nenhuma condição pode oferecer, no seu `label`, um método que o `billing_type` não imponha.** Se o `label` diz "Pix ou cartão" e o `billing_type` é `UNDEFINED`, **a condição está errada** — e o cliente pagará por um método que a ANTERO não pretendia aceitar.

---

## 3. Fluxo — sincronização do cliente com o Asaas (preguiçosa e idempotente)

```
garantirClienteAsaas(organization_id):
  1. SELECT payment_provider_customers WHERE organization_id=? AND provider='asaas'
     └─ ACHOU → retorna. FIM.  (caminho comum: zero chamadas de rede)

  2. Valida o que o Asaas EXIGE:
     [ASAAS] name e cpfCnpj são OBRIGATÓRIOS.
     Sem tax_id → ⚠ ERRO DE NEGÓCIO CLARO, ANTES de qualquer rede:
        "Cadastro incompleto: informe o CNPJ da empresa."  (ação para o admin)

  3. ⚠ ANTES de criar, BUSCA no Asaas:
     GET /v3/customers?externalReference={organization_id}
     └─ ACHOU → vínculo órfão (criamos antes e falhamos ao gravar). NÃO cria de novo.
     [ASAAS] Necessário porque a API PERMITE duplicatas e NÃO deduplica por CPF/CNPJ.

  4. POST /v3/customers { name, cpfCnpj, ..., externalReference: organization_id }

  5. INSERT payment_provider_customers ... ON CONFLICT (organization_id, provider) DO NOTHING
     └─ Duas requisições em paralelo? O UNIQUE decide o vencedor.
        O perdedor relê a linha e segue com o MESMO customer. ✅ Sem duplicata.
```

**[REC] Fonte da verdade:** **a ANTERO**. `organizations` é o mestre; o Asaas é **cópia**. **Nunca** sobrescrever `organizations` com dado vindo do Asaas.

**[REC] Atualização:** ao editar uma organização já vinculada, enfileirar **`sincronizar_cliente_asaas`** na **outbox** (é chamada de rede → **não pode acontecer dentro da transação da edição**). Se falhar, **não bloquear a edição** — grava `sync_error` e a reconciliação reprocessa. Um dado desatualizado no Asaas é problema menor; **travar a operação da equipe é problema maior**.

**[HIP]** Cliente removido/bloqueado no Asaas: **não confirmado**. Postura provisória: um 404 do Asaas para um `provider_customer_id` que temos **não apaga o vínculo automaticamente** — marca `sync_error` e **exige intervenção**. ⚠ **Apagar vínculo automaticamente destrói a rastreabilidade de cobranças antigas.**

---

## 4. Fluxo — criação da cobrança

> ⚠ **Correção da v1.** A v1 dizia: *"o frontend envia APENAS `{ payment_term_id }`. NADA MAIS."* Isso **estava incompleto**: se a condição é **`customer_choice`**, o cliente **precisa** dizer **em quantas vezes** quer parcelar — e essa informação **vem do frontend**, necessariamente. O princípio correto não é "o frontend não envia nada"; é **"o frontend não DECIDE nada; ele PROPÕE, e o servidor VALIDA contra a condição aprovada"**.

### 4.1 O que o frontend envia — depende do modo

| Modo da condição | O frontend envia | O servidor faz |
|---|---|---|
| **`fixed`** | **`{ payment_term_id }`** — e **só** | Usa `payment_term.installment_count`. ⚠ **Ignora qualquer nº de parcelas que venha do cliente.** |
| ⚠ **`customer_choice`** (na nossa UI) | **`{ payment_term_id, installment_count }`** | ⚠ **VALIDA `installment_count` contra a condição aprovada:** inteiro, `>= 1`, **`<= payment_term.max_installments`**. Fora disso → **rejeita (400/409)**. |
| ⚠ **`customer_choice`** (na página do Asaas — Estratégia B) | **`{ payment_term_id }`** | Envia **`maxInstallmentCount`** ao Asaas. ⚠ **A escolha final acontece LÁ** e volta pelo **webhook** — ver §4.3. |

⚠ **O que o frontend NUNCA decide, em nenhum modo:**
preço · desconto · valor da entrada · **o TETO de parcelas** · status · `provider_customer_id` · projeto relacionado · **permissão para pagar**.

⚠ **A distinção que importa:** o cliente pode **escolher dentro do que foi autorizado**. Ele **não pode** alterar **o que foi autorizado**. O `max_installments` vem **do banco**, da condição que a ANTERO cadastrou e o cliente aceitou — **nunca** da requisição.

### 4.2 O fluxo completo

```
[Frontend] { payment_term_id, installment_count? }   ← o "?" só existe em customer_choice
                │
                ▼
[Server Action] criarCobranca(input)
 1.  getCurrentUser()                     → sem usuário? 401
 2.  carrega profiles                     → ⚠ role='pending'? 403. (fail closed)
 3.  carrega payment_term → proposal → project → organization
     ⚠ AUTORIZAÇÃO: project.organization_id === profile.organization_id ? senão 403.
        (E a RLS já teria negado a leitura — defesa em camadas.)
 4.  ⚠ existe CONTRATO aceito (contracts) para esta proposal_version e este payment_term?
        Não? → 409 "Condição não aceita." ⚠ Sem aceite, não se cobra.
 5.  proposal.status='aprovada' · payment_term.is_active · project.status permite? senão 409
 6.  ⚠ CALCULA OS VALORES NO SERVIDOR, a partir de contracts.total_cents (o SNAPSHOT
        do aceite — NÃO de proposals, que pode ter mudado desde então)
 7.  ⚠ VALIDA O Nº DE PARCELAS (§4.1):
        fixed            → usa payment_term.installment_count. Ignora o input.
        customer_choice  → 1 <= input.installment_count <= payment_term.max_installments
                           senão → 409
 8.  ⚠ MÉTODO: usa payment_term.billing_type / billing_types. NUNCA do input.
 9.  ⚠ localiza ou cria a payment_intent (DATA_MODEL.md §4.4)
        └─ intent.status = 'satisfeita'?  → ⚠ 409 "Esta parcela já foi paga." PARA.
           (a guarda que impede cobrar duas vezes uma parcela já paga)
10.  ⚠ idempotency_key = sha256(intent_id + ':' + intent.current_attempt || 1)
     INSERT charges (status='criada', provider_charge_id=NULL, intent_id, attempt_number)
       ON CONFLICT (idempotency_key) DO NOTHING
       └─ ⚠ JÁ EXISTIA? → duplo clique / retry.
          Relê. Tem invoice_url/checkout_url? → devolve A MESMA. FIM. Nada é criado no Asaas.
     ⚠ Esta linha é criada ANTES da chamada de rede. É o que torna o duplo clique inofensivo
        E o que salva o estado em caso de timeout (§6.3).
11.  garantirClienteAsaas(organization_id)     ← §3
12.  ⚠ CHAMA O ASAAS  (aqui A e B divergem — §5)
        externalReference = charges.id         ⚠ o elo entre os dois mundos
13.  UPDATE charges SET provider_charge_id | provider_checkout_id,
                        invoice_url | checkout_url, expires_at,
                        status='aguardando_pagamento'
14.  audit_logs: 'charge.create'
15.  ⚠ RETORNA AO FRONTEND: apenas { url }
        Nunca a API Key, nunca o payload do Asaas, nunca dado de outro cliente.
                │
                ▼
[Frontend] redireciona → o cliente paga no ambiente do Asaas
```

### 4.3 ⚠ `customer_choice` na página do Asaas — como o nº final é recuperado e persistido

**Só se aplica à Estratégia B (Checkout).** É a lacuna **H2** de `REFERENCES.md` §4.

```
Criação:
  POST /v3/checkouts {
    billingTypes: ['CREDIT_CARD'],          ← [ASAAS] array, imposto
    chargeTypes:  ['INSTALLMENT'],
    installment:  { maxInstallmentCount: 10 },   ← ⚠ O TETO. Vem do banco.
    minutesToExpire: 60,
    callback: { successUrl, cancelUrl, expiredUrl },
    externalReference: charges.id
  }
  → charges.installment_count = NULL      ⚠ AINDA NÃO SABEMOS
  → payment_plans.installments_count = NULL
  → ⚠ NENHUMA linha em installments ainda  (DATA_MODEL.md §4.3)

O cliente escolhe 7x na página do Asaas e paga.
                │
                ▼
Webhook CHECKOUT_PAID (ou PAYMENT_CONFIRMED / PAYMENT_RECEIVED)
  ⚠ [HIP] O payload traz o nº de parcelas escolhido e o payment id?
     → ESTA É A LACUNA H2. NÃO CONFIRMADO na documentação.
                │
     ┌──────────┴───────────────────────────────────────────────┐
     │ SE SIM (a confirmar em Sandbox — F4):                     │
     │   dentro da MESMA transação do webhook:                   │
     │     UPDATE charges SET installment_count = 7,             │
     │                        provider_charge_id = <payment id>  │
     │     UPDATE payment_plans SET installments_count = 7       │
     │     INSERT outbox_events ('materializar_parcelas',        │
     │                  idempotency_key='materializar:{plan_id}') │
     │   → o DISPATCHER, fora da transação:                      │
     │       - busca as parcelas reais: GET /v3/installments/{id}/payments
     │       - cria as 7 linhas de installments com os valores    │
     │         EXATOS do Asaas ⚠ (não recalculados por nós —      │
     │         [ASAAS] o resto vai para a última parcela)         │
     │       - cria as 7 charges espelho                          │
     │   ⚠ UNIQUE(outbox.idempotency_key) → mesmo que CHECKOUT_PAID│
     │      e PAYMENT_CONFIRMED cheguem, materializa UMA vez ✅    │
     └──────────┬───────────────────────────────────────────────┘
     │ SE NÃO (payload não traz o nº):                            │
     │   ⚠ FALLBACK: o comando de outbox CONSULTA o Asaas:        │
     │     GET /v3/payments?externalReference={charges.id}         │
     │     → descobre o parcelamento e o nº real de parcelas       │
     │   ⚠ Se nem assim for recuperável → customer_choice é        │
     │      INVIÁVEL. Todas as condições viram 'fixed'.            │
     │      → isso REPROVA a Estratégia B para este uso. DEC-001.  │
     └────────────────────────────────────────────────────────────┘
```

⚠ **[REC] Consequência de projeto:** **não prometer `customer_choice` ao cliente antes de H2 estar respondida em Sandbox.** Se o número escolhido não for recuperável, o sistema saberia que o cliente pagou, **mas não em quantas vezes** — e o dashboard não teria o que mostrar. **[REC] Postura segura para a 1ª versão: usar `fixed` em todas as condições**, e habilitar `customer_choice` **depois** de comprovado.

---

## 5. Como cada condição é criada no Asaas

### Estratégia A — `invoiceUrl`

```
À VISTA:      POST /v3/payments { customer, billingType:'PIX',  value: 20000.00,
                                  dueDate, externalReference }
              ⚠ [ASAAS] SEM installmentCount — "somente 2+ parcelas usa os atributos".
              ⚠ billingType CONCRETO, nunca UNDEFINED (DATA_MODEL.md §3.5).

PARCELADO:    POST /v3/payments { customer, billingType:'CREDIT_CARD',
                                  installmentCount: 10, totalValue: 20000.00, ... }
              ⚠ [ASAAS] A resposta traz SÓ a 1ª cobrança.
                As demais: GET /v3/installments/{id}/payments
              ⚠ [ASAAS] Divisão inexata → a diferença vai para a ÚLTIMA parcela.
                ⚠ NÓS NÃO RECALCULAMOS: lemos os valores REAIS do Asaas e gravamos.
                  Recalcular por conta própria faria a nossa tela divergir da fatura dele.
              ⚠ selection_mode DEVE ser 'fixed' — em A o cliente NÃO escolhe.
```

### Estratégia B — Checkout

```
POST /v3/checkouts {
  billingTypes: ['PIX','CREDIT_CARD'],     ← ⚠ [ASAAS] ARRAY: impõe o conjunto ✅
  chargeTypes:  ['INSTALLMENT'],
  installment:  { maxInstallmentCount: 10 },
  minutesToExpire: 60,                      ← ⚠ [ASAAS] 10 a 1440
  callback: { successUrl, cancelUrl, expiredUrl },
  items: [{ name: 'Projeto X — ANTERO', quantity: 1, value: 20000.00 }],
  externalReference: charges.id             ← ⚠ [ASAAS] máx. 200 chars (uuid cabe ✅)
}
→ resposta: { id, link }   → charges.provider_checkout_id, charges.checkout_url
⚠ [HIP] BOLETO em billingTypes: NÃO CONFIRMADO (lacuna H1).
⚠ [ASAAS] "A criação do checkout NÃO confirma o pagamento" — só o webhook confirma.
```

### ⚠ Entrada + saldo — as duas operações, sequenciadas pela OUTBOX

```
⚠ [ASAAS] NÃO EXISTE cobrança com dois billingType. São DUAS operações, obrigatoriamente.

(a) ENTRADA:  POST /v3/payments { billingType:'PIX', value: 6000.00 }   → 1 charge

    ⚠ REGRA DE NEGÓCIO: o saldo (b) NÃO é criado agora.
       Se criássemos os dois juntos e o cliente pagasse só o cartão e sumisse com a entrada,
       teríamos 10 parcelas ativas de um projeto sem entrada. Sequenciar elimina isso.

(b) SALDO:    criado APÓS a entrada ser paga — ⚠ VIA OUTBOX, nunca no webhook:

   Webhook (PAYMENT_CONFIRMED **OU** PAYMENT_RECEIVED — §6 abaixo):
     BEGIN;
       UPDATE charges SET status='paga'|'liquidada';
       INSERT transactions;
       INSERT outbox_events (command_type='criar_parcelamento_saldo',
                             idempotency_key='criar_saldo:{payment_plan_id}');  ⚠ UNIQUE
     COMMIT;   ⚠ nenhuma chamada de rede aqui dentro
     responde 200 ✅

   OutboxDispatcher (⚠ FORA da transação):
     POST /v3/payments { billingType:'CREDIT_CARD', installmentCount:10, totalValue:14000.00 }
     → cria as 10 charges do saldo → outbox.status='concluido'
```

⚠ **Por que `CONFIRMED` OU `RECEIVED` — o bug que a revisão corrigiu:**

**[ASAAS]** O Pix vai de `CREATED` **direto para `RECEIVED`, pulando o `CONFIRMED`** (`REFERENCES.md` §6). A entrada é **via Pix**. A v1 disparava a criação do saldo **no `PAYMENT_CONFIRMED`** — que **pode nunca chegar**. Resultado: **o cliente pagaria a entrada e o parcelamento do saldo nunca seria criado.** O sistema ficaria mudo, e ninguém perceberia até o cliente ligar.

✅ **A correção:** **ambos** os eventos enfileiram **o mesmo comando**, com **a mesma `idempotency_key`**. O **`UNIQUE (outbox_events.idempotency_key)`** garante que, **cheguem os dois, chegue só um, ou chegue o mesmo duas vezes**, o comando é criado **uma única vez** — e o saldo é criado **uma única vez**. ✅ **Uma restrição de banco resolve o problema inteiro.**

### Mensal / marcos

**N cobranças avulsas independentes**, cada uma com `dueDate` próprio. Nos **marcos**, cada cobrança é criada **quando o marco é atingido** — pela equipe, via outbox (`criar_cobranca_marco`). ⚠ **Nunca usar `installmentCount`** nesses casos: **[ASAAS]** parcelamento é **uma venda única**, e mensal/marco **não são**.

---

## 6. Idempotência — os cinco cenários, consistentes

**Por que não é opcional:** **[ASAAS]** a documentação recomenda **timeout mínimo de 60s** nas chamadas de cartão *"para evitar duplicidade"* — o Asaas dizendo, com todas as letras, que **a resposta pode se perder mesmo tendo a cobrança sido criada**. **Cobrar R$ 20.000 duas vezes é o pior defeito possível deste sistema.**

**[HIP]** **Não existe header oficial de idempotência no Asaas** (`REFERENCES.md` §10). ⚠ **A integração NÃO deve depender de um.** Toda a proteção é nossa.

### 6.1 A chave

```
idempotency_key = sha256( intent_id + ':' + attempt_number )
```
⚠ **Determinística.** A mesma **tentativa** → a mesma chave. Uma tentativa **nova** → chave nova. **Uma chave aleatória (`uuid()`) NÃO serviria**: dois cliques gerariam duas chaves e **duas cobranças**.

### 6.2 Os cinco cenários — tabela única, sem ambiguidade

| Cenário | `intent` | `attempt` | Chave | Resultado |
|---|---|---|---|---|
| **1ª tentativa** | I1 | 1 | K(I1,1) | ✅ Cria a charge. |
| ⚠ **Duplo clique** | I1 | 1 | **a mesma** | ✅ `UNIQUE` colide → devolve **a mesma URL**. **Uma** cobrança. |
| ⚠ **Retry após timeout** | I1 | 1 | **a mesma** | ✅ **Não cria nada.** Consulta o Asaas por `externalReference` e **vincula** (§6.3). |
| ⚠ **Nova tentativa após recusa** | I1 | **2** | **diferente** | ✅ Nova charge. A anterior fica `falha`. **Histórico preservado.** |
| ⚠ **Reprocessamento administrativo** | I1 | (existente) | **a mesma** | ✅ **Não cria cobrança** — só reexecuta o processamento do que já existe. |

⚠ **A guarda final:** nova tentativa **só se `payment_intents.status = 'aberta'`**. Se a intenção está **`satisfeita`**, **nenhuma tentativa nova é criada** — nem por duplo clique, nem por botão antigo, nem por reprocessamento. **É isso que impede cobrar de novo uma parcela já paga.**

### 6.3 ⚠ Timeout com resposta ambígua — o caso mais perigoso

```
POST /v3/payments → TIMEOUT / erro de rede.  ⚠ NÃO SABEMOS se a cobrança foi criada.

⚠ O QUE NÃO FAZER: repetir o POST.
   Se a primeira funcionou, o cliente recebe DUAS cobranças de R$ 20.000.

✅ O QUE FAZER — sempre VERIFICAR antes de retentar:

1. A charge local JÁ EXISTE (criada no passo 10, ANTES da rede), com
   status='criada' e provider_charge_id=NULL.
   ⚠ É POR ISSO que ela é criada antes. Nenhum estado se perde.

2. NÃO retentar às cegas. CONSULTAR:
   GET /v3/payments?externalReference={charges.id}
   ├─ ACHOU  → a cobrança FOI criada; só a resposta se perdeu.
   │           Grava provider_charge_id + invoice_url → 'aguardando_pagamento'. ✅ Zero duplicata.
   └─ NÃO ACHOU → não foi criada. ✅ Agora é seguro retentar, com a MESMA chave.

3. Se a CONSULTA também falhar (Asaas fora do ar):
   Deixa status='criada', provider_charge_id=NULL.
   ⚠ Mostra ao cliente: "Estamos confirmando seu pagamento. Você será avisado."
   ⚠ NUNCA dizer "falhou" — pode não ter falhado. Dizer "falhou" leva o cliente
      a tentar de novo, e é assim que se cobra duas vezes.
   → A RECONCILIAÇÃO (§10) resolve depois. É exatamente para isso que ela existe.
```

⚠ **O `externalReference` é o que salva.** É ele que permite perguntar ao Asaas — **com o NOSSO identificador** — *"você tem uma cobrança minha com este id?"*. Sem ele, após um timeout, seria preciso varrer todas as cobranças da conta. **É o campo mais importante da integração**, e **[ASAAS]** é justamente o que a documentação indica para conciliação.

### 6.4 Requisições simultâneas

O `UNIQUE (idempotency_key)` resolve **no banco**, não no código: uma insere, a outra colide, relê e devolve **a mesma URL**. ⚠ **Nenhuma trava de aplicação seria confiável** em serverless — não há memória compartilhada entre instâncias. **A garantia tem que estar no Postgres.**

---

## 7. Fluxo — pagamento, webhook, outbox e dashboard

```
Cliente paga na página do Asaas
   │
   ├──────► [Asaas] POST /api/webhooks/asaas   (header asaas-access-token)
   │            │
   │            ├─ valida o token (⚠ tempo constante)         → inválido? 401
   │            │
   │            ├─ BEGIN TRANSACTION  ⚠ (sem NENHUMA chamada de rede aqui dentro)
   │            │    1. INSERT webhook_events (payload BRUTO)
   │            │         ON CONFLICT (provider, provider_event_id) DO NOTHING
   │            │         └─ ⚠ conflito = reentrega → responde 200 e PARA ✅
   │            │    2. mapeia evento → estado (ARCHITECTURE.md §3.2)
   │            │         └─ transição não permitida? → no-op (registra, não altera) ✅
   │            │    3. UPDATE charges / installments / payment_intents
   │            │    4. INSERT transactions (append-only, bruto/taxa/líquido)
   │            │    5. ⚠ INSERT outbox_events (efeitos externos)
   │            │  COMMIT   ⚠ tudo ou nada
   │            │
   │            └─ responde 200 ✅  (rápido — [ASAAS] 15 falhas derrubam a fila)
   │
   │      ⚠ OutboxDispatcher — FORA da transação:
   │            POST /v3/payments (parcelamento do saldo)
   │            e-mail via Resend
   │            ...
   │
   └──────► [Return/callback] navegador volta para /painel/.../retorno
                │
                └─ ⚠ NÃO CONFIRMA NADA. Lê o estado do BANCO.
                   - charge.status='paga'|'liquidada' → "Pagamento confirmado ✅"
                   - ainda 'aguardando_pagamento'     → "Estamos confirmando seu pagamento…"
                     (polling leve do NOSSO banco, ⚠ nunca do Asaas)

⚠ [ASAAS] O webhook PODE CHEGAR ANTES do navegador voltar. É normal.
   O webhook é a fonte da verdade. O retorno do navegador é cosmético.
```

⚠ **[REC] Regra inegociável:** **o navegador nunca atualiza o banco.** Um cliente que digitar a URL de retorno na mão **não pode** marcar a própria cobrança como paga. Parece óbvio; é exatamente o que se implementa errado sob pressa.

---

## 8. Fluxo — falha e nova tentativa

```
Cartão recusado → [ASAAS] PAYMENT_CREDIT_CARD_CAPTURE_REFUSED → charge.status='falha'
  (ou, na Estratégia B: [ASAAS] CHECKOUT_EXPIRED → charge.status='expirada')
   │
   ├─ Dashboard: "Não foi possível processar o pagamento." + [Tentar novamente]
   │
   └─ "Tentar novamente":
        ⚠ NÃO reusa a charge com falha.
        1. verifica payment_intents.status = 'aberta'  (⚠ se 'satisfeita' → 409, PARA)
        2. intent.current_attempt++          (1 → 2)
        3. nova idempotency_key = sha256(intent_id + ':2')   ⚠ chave DIFERENTE
        4. nova charge, attempt_number=2
        ⚠ A charge antiga permanece 'falha'. Nunca sobrescrita.
           → o histórico "o cartão dele foi recusado 3 vezes" é informação
             relevante para a equipe, e se perderia se reaproveitássemos a linha.
```

---

## 9. Fluxo — cancelamento e reembolso

```
CANCELAMENTO (não paga)
  Admin → confirma → ⚠ MOTIVO obrigatório
    ├─ outbox: DELETE /v3/payments/{id}    ⚠ chamada externa → fora da transação
    ├─ charges.status='cancelada'
    ├─ audit_logs { actor, reason }
    └─ [ASAAS] chega PAYMENT_DELETED → confirma (⚠ idempotente: já cancelada = no-op)

REEMBOLSO (já paga)   ⚠ requer role='admin'
  Admin → confirma → ⚠ MOTIVO obrigatório
    ├─ INSERT refunds (status='solicitado', reason, requested_by, idempotency_key)
    │     └─ ⚠ UNIQUE(idempotency_key) impede duplo clique de estornar duas vezes
    ├─ outbox: POST /v3/payments/{id}/refund { value? }
    │     ⚠ [ASAAS] Pix admite estornos PARCIAIS e MÚLTIPLOS (soma <= recebido)
    │     ⚠ [ASAAS] Cartão: estornável se RECEIVED ou CONFIRMED
    │     ⚠ [HIP] Boleto tem regras próprias (existe PAYMENT_REFUND_DENIED só p/ boleto) — TESTAR
    ├─ [ASAAS] PAYMENT_REFUND_IN_PROGRESS → refunds.status='em_processamento'
    ├─ [ASAAS] PAYMENT_REFUNDED → refunds.status='concluido'
    │     ⚠ O ESTADO DA COBRANÇA DERIVA DA SOMA (DATA_MODEL.md §4.7):
    │        soma < total → 'parcialmente_estornada'
    │        soma = total → 'estornada'
    │        soma > total → ⚠ IMPOSSÍVEL. Rejeita + ALERTA.
    │     └─ INSERT transactions (kind='estorno', gross_amount_cents NEGATIVO)
    └─ [ASAAS] PAYMENT_REFUND_DENIED → 'negado' → ⚠ ALERTA À EQUIPE
```

⚠ **[REC]** O estorno **nunca zera** o valor da cobrança nem apaga a transação de pagamento. Ele **acrescenta** uma transação **negativa**. O saldo é a **soma**. **O histórico permanece íntegro e auditável.**

---

## 10. Reconciliação financeira

**Por que existe.** **[ASAAS]** Três fatos tornam o webhook, sozinho, insuficiente:
1. **15 falhas consecutivas interrompem a fila** — reativação **manual**.
2. **Eventos são descartados após 14 dias.**
3. Entrega *at least once*, **nunca** *exactly once*.

⚠ **Somando: um deploy quebrado numa sexta-feira pode fazer o sistema perder PERMANENTEMENTE o estado de pagamento de duas semanas, sem que ninguém perceba.** A reconciliação é a rede contra isso. **Não é luxo.**

### 10.1 O que ela varre — só os suspeitos

```
(a) charges status='criada' AND provider_charge_id IS NULL
       → ⚠ possível timeout na criação (§6.3): existe no Asaas?
(b) charges status IN ('aguardando_pagamento','em_analise')
       AND updated_at < now() - interval '24 hours'
       → paradas: o webhook não chegou?
(c) charges due_date < today AND status='aguardando_pagamento'
       → deveriam ter recebido PAYMENT_OVERDUE
(d) webhook_events status='erro'                → reprocessar
(e) ⚠ outbox_events status='falha' OU (status='pendente' AND next_attempt_at < now()-1h)
       → ⚠ NOVO: comandos travados. Um 'criar_parcelamento_saldo' falho =
         um cliente que pagou a entrada e não recebeu as parcelas.
(f) payment_provider_customers sync_error IS NOT NULL
(g) ⚠ charges 'paga'/'liquidada' com fee_cents IS NULL
       → ⚠ NOVO: taxa não informada → o financeiro está incompleto
```

⚠ **[ASAAS]** A doc recomenda a consulta de status para checagens **pontuais**, **não** como **polling recorrente**. Por isso: **nunca varrer a base inteira**; só os suspeitos, com `LIMIT` e paginação. **[HIP]** Rate limits **não confirmados** → lotes pequenos, espaçados.

⚠ **[REC]** A reconciliação usa **exatamente o mesmo mapeador e o mesmo `WebhookProcessor`** do webhook. Duas implementações do mesmo mapeamento **divergiriam com o tempo** — e a divergência entre "o que o webhook grava" e "o que a reconciliação grava" seria um bug particularmente difícil de achar.

### 10.2 O que é automático e o que exige humano

| Divergência | Ação |
|---|---|
| Cobrança existe no Asaas, `provider_charge_id` nulo | ✅ **Automática** — grava o vínculo. **É a cura do timeout.** |
| Asaas diz `RECEIVED`, nós `aguardando_pagamento` | ✅ **Automática** — a transição **está na tabela** (`ARCHITECTURE.md` §3.2). |
| Asaas diz `OVERDUE`, nós `aguardando_pagamento` | ✅ **Automática.** |
| `webhook_events.status='erro'` | ✅ **Automática** — reprocessa (idempotente por construção). |
| ⚠ **`outbox_events` travado/falho** | ✅ **Automática** — reexecuta. ⚠ Após `max_attempts`, **ALERTA**. |
| ⚠ **Asaas diz `PENDING`, nós dizemos `paga`** | 🔴 **MANUAL.** É **regressão** — **transição PROIBIDA**. Alerta. |
| ⚠ **Valor divergente** | 🔴 **MANUAL.** Alerta imediato. **Nunca "corrigir" sozinho.** |
| ⚠ **Cobrança no Asaas que não existe no nosso banco** | 🔴 **MANUAL.** Pode ser cobrança criada **direto no painel do Asaas**, fora da plataforma — legítima, mas **exige decisão humana** sobre a que projeto pertence. ⚠ **Nunca criar uma charge órfã automaticamente** — seria **inventar vínculo financeiro**. |
| Estorno divergente | 🔴 **MANUAL.** |

⚠ **[REC] O princípio:** a reconciliação **automatiza o que só pode estar certo de um jeito** e **para e chama um humano** diante de qualquer coisa que cheire a inconsistência real. **Um robô que "conserta" divergências financeiras sozinho é mais perigoso do que a divergência.**

⚠ **[REC] Só aplica transições que estão na tabela de `ARCHITECTURE.md` §3.2.** Nunca regride estado.

### 10.3 Quando executar

- **F8 — manual.** Um botão na área administrativa. Suficiente no volume atual e **muito mais seguro** que um cron mal testado escrevendo em dados financeiros.
- **Depois — agendada.** Diária, fora do horário comercial. ⚠ **[HIP]** O agendador (Vercel Cron × `pg_cron`) **não foi decidido** → **DEC-014** (é o mesmo mecanismo que roda o dispatcher da outbox).
- ⚠ **Sempre — após reativar uma fila interrompida.** **[ASAAS]** Os represados são reenviados em ordem, **mas os que passaram de 14 dias foram DESCARTADOS. Só a reconciliação os recupera.**
