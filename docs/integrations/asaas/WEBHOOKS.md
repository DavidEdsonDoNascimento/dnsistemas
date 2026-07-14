# Webhooks — plano do endpoint

> Data: 14/07/2026 (revisado). **Nada foi implementado.** Rótulos: **[REPO]** · **[ASAAS]** · **[REC]** · **[HIP]**.
> **Correções desta revisão:** eventos de **Checkout** · **outbox** (nenhuma chamada HTTP dentro da transação) · **efeito "entrada paga" disparado por `CONFIRMED` OU `RECEIVED`** · **transições explícitas** em vez de pesos lineares · **URLs de webhook definidas**.

---

## 1. As cinco regras do Asaas que ditam todo o desenho

**[ASAAS]** Confirmadas em `REFERENCES.md` §6:

1. **Entrega *at least once*** — o mesmo evento **pode chegar mais de uma vez**.
2. **Cada evento tem `id` único, que se repete no reenvio.**
3. **Resposta esperada: HTTP 2xx.** Qualquer outra coisa dispara retry.
4. ⚠ **15 falhas consecutivas INTERROMPEM a fila.** O Asaas **para de enviar**. Reativação **manual**.
5. ⚠ **Eventos são descartados após 14 dias.**

⚠ **A consequência que precisa ficar clara:** o custo de responder erro **não é "perder um evento"**. É **parar a sincronização financeira inteira**, silenciosamente, com recuperação manual e prazo de validade. **Um único bug que lance exceção em 15 eventos seguidos derruba tudo.**

⚠ **Daí a regra central [REC]: o endpoint responde 2xx sempre que conseguir PERSISTIR o evento — mesmo que não consiga PROCESSÁ-LO.** Persistir e processar são coisas distintas, e **só a primeira determina a resposta HTTP**.

---

## 2. O endpoint

**[REC]**

| Item | Valor |
|---|---|
| **Rota** | `POST /api/webhooks/asaas` → `src/app/api/webhooks/asaas/route.ts` |
| **Método** | Apenas `POST`. Outro → `405`. |
| **Runtime** | **Node.js** (não Edge) — precisamos de acesso privilegiado ao banco e leitura crua do corpo. |
| ⚠ **URL de produção** | **`https://anterosistemas.com.br/api/webhooks/asaas`** (**[REPO]** Vercel — `CURRENT_STATE.md` §7) |
| ⚠ **URL de Sandbox** | **[REC]** **`https://staging.anterosistemas.com.br/api/webhooks/asaas`** — **um subdomínio de staging estável** |

⚠ **[REC] NUNCA usar uma URL de preview da Vercel como webhook permanente.** URLs de preview (`*-git-branch-*.vercel.app`) **mudam a cada deploy** — o webhook cadastrado no Asaas apontaria para um deploy morto, **as entregas falhariam, e após 15 falhas a fila seria interrompida**. Para desenvolvimento local, usar um túnel (temporário, e só isso). **Para Sandbox de verdade, um subdomínio estável.** ⚠ **A criação do ambiente de staging e do subdomínio está fora do escopo desta tarefa**, mas **é pré-requisito da F5**.

**[REPO]** ⚠ `src/proxy.ts:68` tem `matcher: ['/painel/:path*', '/login']` — **a rota `/api/*` NÃO passa pelo proxy**. Isso é **bom** (o webhook não pode ser barrado pela autenticação de usuário), mas significa que **toda a segurança do webhook é responsabilidade do próprio handler**. **Não há rede de proteção acima dele.**

---

## 3. Autenticação

**[ASAAS]** *"Você deve criar uma hash forte e conferir sempre o header `asaas-access-token`."*

```
1. Lê o header  asaas-access-token
2. Compara com a env  ASAAS_WEBHOOK_TOKEN
3. ⚠ Comparação em TEMPO CONSTANTE (crypto.timingSafeEqual), NUNCA com ===
      → uma comparação de string comum vaza o token, byte a byte, por timing.
4. Ausente ou diferente → 401. ⚠ NÃO persiste nada. ⚠ NÃO loga o token recebido.
```

**[REC]** Um `401` por token inválido **não é a "falha" que nos ameaça**: se o token está errado, ou é um atacante (e queremos rejeitar), ou nós configuramos errado (e a fila **deve** mesmo parar, para não processarmos lixo). **A regra das 15 falhas nos ameaça quando o Asaas LEGÍTIMO recebe erro nosso** — e é isso que o desenho da §4 evita.

**[HIP]** Não localizei **assinatura HMAC do payload** na documentação do Asaas (como faz o Stripe). O token no header é o mecanismo oficial. ⚠ **Logo, a segurança do endpoint depende inteiramente do segredo do token** — que deve ser longo, aleatório e **nunca aparecer em log**.

⚠ **Tokens distintos por ambiente.** Sandbox e Produção têm webhooks e tokens **separados**. **Nunca reutilizar.**

---

## 4. ⚠ Fluxo de processamento — com outbox (corrigido)

> **Correção da v1.** A v1 mandava o handler, **dentro da transação**, "criar o parcelamento do saldo" — o que é **uma chamada HTTP ao Asaas**. Isso está errado: mantém a transação aberta durante uma chamada de rede, **não é transacional** (um rollback nosso não desfaz uma cobrança criada no Asaas), e faz o handler estourar o tempo. Ver `ARCHITECTURE.md` §4.

```
POST /api/webhooks/asaas
  │
  1. Valida asaas-access-token (⚠ tempo constante)          → inválido? 401. FIM.
  2. Parse do JSON                                          → inválido? 400 (§6).
  3. Extrai  event.id  e  event.event                       → ausentes? 400 + alerta.
  │
  4. ⚠ BEGIN TRANSACTION — ⚠ NENHUMA CHAMADA DE REDE AQUI DENTRO
  │
  │   4.1 ⚠ PERSISTE PRIMEIRO:
  │       INSERT webhook_events (provider_event_id, event_type, payload BRUTO,
  │                              status='recebido')
  │         ON CONFLICT (provider, provider_event_id) DO NOTHING
  │       ├─ ⚠ CONFLITO → REENTREGA ([ASAAS] at least once).
  │       │     Nada a fazer. COMMIT. Responde 200. FIM. ✅
  │       │     ⚠ A idempotência é garantida pelo UNIQUE do Postgres — não por
  │       │       um "if já processei" no código, que teria condição de corrida.
  │       └─ INSERIU → é novo. Segue.
  │
  │   4.2 MAPEIA event_type → estado interno (ARCHITECTURE.md §3.6)
  │       └─ ⚠ DESCONHECIDO? → status='ignorado'. COMMIT. Responde 200. ALERTA. FIM. (§5.4)
  │
  │   4.3 LOCALIZA a charge (por provider_charge_id; fallback: externalReference;
  │                          na Estratégia B: provider_checkout_id)
  │       └─ não achou? → status='erro'. COMMIT. Responde 200. ALERTA. (§6)
  │
  │   4.4 ⚠ VERIFICA A TRANSIÇÃO na tabela de ARCHITECTURE.md §3.2
  │       └─ ⚠ NÃO PERMITIDA? → no-op. Marca 'processado'. COMMIT. 200. ✅
  │          (evento fora de ordem — normal, não é erro. Ver §7.)
  │
  │   4.5 UPDATE charges / installments / payment_intents
  │   4.6 INSERT transactions (append-only; bruto / taxa / líquido)
  │   4.7 ⚠ INSERT outbox_events  ← TODOS os efeitos externos, como INTENÇÃO
  │         ON CONFLICT (idempotency_key) DO NOTHING
  │   4.8 UPDATE webhook_events SET status='processado'
  │
  │  COMMIT   ⚠ TUDO OU NADA. Estado interno + intenções, atomicamente.
  │
  5. Responde 200 ✅   (rápido — sem rede no caminho)
  │
  6. ⚠ Aciona o OutboxDispatcher — FORA da transação, APÓS a resposta
     (ver §8)

  ⚠ Se o passo 4 LANÇOU EXCEÇÃO:
     - ROLLBACK → estado consistente (nada pela metade)
     - marca webhook_events.status='erro' + error_message (em transação separada)
     - ⚠ RESPONDE 200 MESMO ASSIM. E ALERTA.
     - a RECONCILIAÇÃO reprocessa depois.
```

### ⚠ Por que responder **200 mesmo em erro de processamento**

**Esta é a decisão mais contraintuitiva do documento, e é deliberada.**

O reflexo é responder 500, "para o Asaas tentar de novo". ⚠ **Mas [ASAAS] 15 falhas consecutivas interrompem a fila.** Um bug determinístico (um campo novo que quebra o nosso parse) falharia **em todos os retries** e, em 15 tentativas, **derrubaria a sincronização de TODAS as cobranças de TODOS os clientes** — não só a do evento problemático.

Respondendo 200 e persistindo o evento com `status='erro'`:
- ✅ **o evento não se perde** — está guardado, bruto, em `webhook_events`;
- ✅ **a fila continua viva** — os demais eventos continuam chegando;
- ✅ **a reconciliação reprocessa** quantas vezes for preciso;
- ✅ **o alerta chama um humano** para corrigir a causa.

⚠ **Trocamos o retry automático do Asaas — que é perigoso, porque tem um gatilho de desligamento — pelo nosso próprio mecanismo de recuperação, que controlamos.** É uma boa troca.

⚠ **Isso SÓ é seguro porque (a) a persistência vem primeiro e (b) a reconciliação existe.** Sem a reconciliação, responder 200 em erro seria simplesmente **engolir a falha**. ⚠ **Os dois desenhos são inseparáveis: a Fase 5 não vai a produção sem a Fase 8.**

---

## 5. Eventos

### 5.1 Cobrança — necessários na 1ª versão

| Evento **[ASAAS]** | Estado | Ação |
|---|---|---|
| `PAYMENT_CREATED` | `aguardando_pagamento` | Registra. |
| ⚠ **`PAYMENT_CONFIRMED`** | **`paga`** | ⚠ **Enfileira o efeito "pagamento efetivado"** (§5.3). Libera o projeto; notifica. |
| ⚠ **`PAYMENT_RECEIVED`** | **`liquidada`** | Transação para o financeiro. ⚠ **Enfileira o MESMO efeito** (§5.3). **[ASAAS]** em cartão, **~32 dias** após o `CONFIRMED`. **Não muda o que o cliente vê.** |
| `PAYMENT_OVERDUE` | `vencida` | Inadimplência. Alerta. ⚠ **Não é terminal** — pode ser paga depois. |
| `PAYMENT_DELETED` | `cancelada` | Registra. |
| `PAYMENT_REFUNDED` | ⚠ **`parcialmente_estornada` ou `estornada`** | ⚠ **Depende da SOMA dos estornos**, não do evento isolado (`DATA_MODEL.md` §4.7). **[ASAAS]** Pix admite parciais. |
| `PAYMENT_CREDIT_CARD_CAPTURE_REFUSED` | `falha` | Notifica para nova tentativa. |

### 5.2 ⚠ Checkout — **NOVO** (só na Estratégia B)

| Evento **[ASAAS]** | Estado | Ação |
|---|---|---|
| `CHECKOUT_CREATED` | `aguardando_pagamento` | Registra. |
| ⚠ **`CHECKOUT_PAID`** | **`paga`** | ⚠ **[HIP] LACUNA H2:** o payload traz o **`payment id`** e o **nº de parcelas escolhido**? **Não confirmado.** Se sim → enfileira **`materializar_parcelas`**. Se não → o comando **consulta o Asaas** por `externalReference` (`PAYMENT_FLOWS.md` §4.3). |
| `CHECKOUT_CANCELED` | `cancelada` | Registra. |
| ⚠ **`CHECKOUT_EXPIRED`** | **`expirada`** | **[ASAAS]** estourou o `minutesToExpire`. Oferece **nova tentativa** (`attempt_number + 1`). |

⚠ **[HIP] LACUNA H3:** o Checkout emite **também** os `PAYMENT_*` da cobrança que gera? **Não confirmado.** Se emitir, os dois conjuntos chegam e **ambos** precisam ser idempotentes — ⚠ **o que já são, pelo `UNIQUE (provider_event_id)` e pelas chaves da outbox.** ✅ **O desenho suporta as duas respostas** — mas **é preciso testar em Sandbox (F4)** para saber qual delas é a verdadeira.

### 5.3 ⚠ O efeito "pagamento efetivado" — `CONFIRMED` **OU** `RECEIVED`

**Este é o bug mais sutil que a revisão corrigiu.**

⚠ **[ASAAS] O Pix vai de `CREATED` DIRETO para `RECEIVED`, pulando o `CONFIRMED`** (`REFERENCES.md` §6).

A v1 disparava a criação do parcelamento do saldo **no `PAYMENT_CONFIRMED`**. Como **a entrada do fluxo "entrada + saldo" é justamente via Pix**, o `CONFIRMED` **pode nunca chegar** → **o parcelamento do saldo jamais seria criado**. O cliente pagaria a entrada e **o sistema ficaria mudo**, até ele ligar reclamando.

✅ **Correção — ambos os eventos enfileiram o MESMO comando, com a MESMA chave:**

```
PAYMENT_CONFIRMED  ─┐
                    ├─► INSERT outbox_events (
PAYMENT_RECEIVED   ─┘        command_type   = 'criar_parcelamento_saldo',
                             entity_id      = payment_plan_id,
                             idempotency_key = 'criar_saldo:{payment_plan_id}'  ⚠ UNIQUE
                        ) ON CONFLICT (idempotency_key) DO NOTHING

⚠ Resultado, em TODOS os cenários possíveis:
   - só CONFIRMED chega (cartão)            → 1 comando ✅
   - só RECEIVED chega  (Pix)               → 1 comando ✅
   - os DOIS chegam     (boleto/cartão)     → 1 comando ✅ (o 2º colide no UNIQUE)
   - o mesmo chega DUAS vezes (at least once) → 1 comando ✅
   - chegam FORA DE ORDEM                   → 1 comando ✅

⚠ O parcelamento do saldo é criado UMA ÚNICA VEZ, sempre.
   Uma restrição de banco resolve o problema inteiro. Nenhum `if` no código.
```

⚠ **[REC] Regra geral, verificável em revisão de código:** **todo efeito ligado a "o cliente pagou" é disparado por `CONFIRMED` OU `RECEIVED`, o que vier primeiro, e é idempotente pela chave da outbox.** Isso vale para: criar o parcelamento do saldo, materializar parcelas (`customer_choice`), notificar o cliente, liberar o projeto.

### 5.4 Fases posteriores

`PAYMENT_AUTHORIZED` (`em_analise`) · `PAYMENT_REFUND_IN_PROGRESS` · ⚠ **`PAYMENT_REFUND_DENIED`** (**[ASAAS]** só boleto — **ação administrativa**) · ⚠ **`PAYMENT_CHARGEBACK_REQUESTED`** (**`contestada`** — ⚠ **ALERTA: chargeback tem prazo de defesa; perder o prazo é perder o dinheiro**) · `PAYMENT_CHARGEBACK_DISPUTE` · eventos de assinatura (só com a recorrência).

⚠ **Resolução de chargeback** (`contestada` → `liquidada` ou → `estornada`) **é ação administrativa, nunca automática** (`ARCHITECTURE.md` §3.2).

### 5.5 ⚠ Eventos desconhecidos

**[ASAAS]** *"Prepare seu código para atributos inesperados; novos campos podem ser adicionados sem aviso."* E **15 falhas derrubam a fila**.

**[REC]** Diante de `event_type` desconhecido:
1. **Persistir o payload bruto** (já feito no 4.1).
2. **Marcar `ignorado`** — ⚠ **não `erro`**. Não é falha nossa; é um evento que ainda não nos interessa.
3. **Responder 200.**
4. **Alertar** — para que alguém decida se aquele evento importa.

⚠ **JAMAIS responder erro por não reconhecer um evento.** Uma atualização de roadmap do Asaas **não pode** ter o poder de derrubar a sincronização financeira da ANTERO — **mas teria, se respondêssemos 500 quinze vezes.**

---

## 6. Casos difíceis

| Caso | Tratamento **[REC]** |
|---|---|
| **Evento duplicado** | `ON CONFLICT (provider, provider_event_id) DO NOTHING` → 200. **[ASAAS]** É **esperado** (*at least once*), não é anomalia. |
| ⚠ **Evento fora de ordem** | ⚠ **A tabela de transições decide** (§7). Não aplicável → **no-op**, marcado `processado`. **Não é erro.** |
| **Charge não encontrada** | Pode ser cobrança criada **direto no painel do Asaas**, fora da plataforma. → `erro`, **200**, alerta. ⚠ **Decisão humana.** **Nunca criar charge órfã automaticamente** — seria **inventar vínculo financeiro**. |
| **Payload inválido / não-JSON** | `400` + alerta. ⚠ Aqui o erro é aceitável: **não vem do Asaas legítimo**, e não há o que persistir de útil. |
| ⚠ **Falha do BANCO no INSERT (4.1)** | ⚠ **500.** É o **ÚNICO** caso em que responder erro é correto: **nada foi salvo**, e queremos o retry do Asaas. ⚠ **Se o banco ficar fora por 15 entregas, a fila para** → **banco indisponível exige ALERTA imediato**. |
| **Falha no PROCESSAMENTO** | `erro`, **200**, alerta, reconciliação depois (§4). |
| ⚠ **Fila interrompida** (15 falhas) | **Recuperação manual:** (1) corrigir a causa; (2) reativar no painel do Asaas (Minha Conta → Integração); (3) **[ASAAS]** os pendentes voltam em ordem cronológica; (4) ⚠ **RODAR A RECONCILIAÇÃO** — **os eventos com mais de 14 dias foram DESCARTADOS e só ela os recupera.** |

---

## 7. ⚠ Transições — a tabela, não os pesos (corrigido)

> **Correção da v1.** A v1 usava uma **ordenação linear de pesos** ("o estado só avança"). ⚠ **Isso teria travado transições legítimas e comuns:** uma cobrança **`vencida` que é paga com atraso** (boleto pago depois do vencimento — corriqueiro), uma **`liquidada` que sofre chargeback** (que **sempre** ocorre depois de o dinheiro cair), um **estorno parcial**.

**[REC]** A regra agora é: ⚠ **uma transição é aplicada se, e somente se, estiver na tabela de `ARCHITECTURE.md` §3.2.** Se não estiver: **no-op**, registrado como `processado`, **sem erro**.

Casos concretos que a nova tabela resolve e a antiga quebrava:

| Situação | v1 (pesos) | ✅ Agora |
|---|---|---|
| Boleto vencido, pago 3 dias depois (`vencida` → `paga`) | ❌ **Bloqueada** — "peso menor" | ✅ **Permitida** |
| Pix vencido, pago depois (`vencida` → `liquidada`) | ❌ Bloqueada | ✅ **Permitida** |
| Chargeback após o dinheiro cair (`liquidada` → `contestada`) | ❌ Bloqueada | ✅ **Permitida** |
| Estorno parcial de Pix (`paga` → `parcialmente_estornada`) | ❌ **Estado não existia** | ✅ **Permitida** |
| Segundo estorno parcial que completa o total | ❌ Não existia | ✅ `parcialmente_estornada` → `estornada` |
| Chargeback resolvido a favor da ANTERO | ❌ Não existia | ✅ `contestada` → `liquidada` (⚠ **ação administrativa**) |
| `RECEIVED` chega antes de `CONFIRMED` (Pix) | ✅ ok | ✅ ok — `CONFIRMED` posterior é **no-op** |
| `CREATED` chega depois de `CONFIRMED` | ✅ ok | ✅ ok — **no-op** |
| ⚠ `paga` → `aguardando_pagamento` | ✅ bloqueada | ✅ **PROIBIDA** → **intervenção humana** |

⚠ **A propriedade preservada:** o sistema continua **imune à ordem de chegada** — porque a ordem **não é garantida**. Mas agora **sem proibir o que a vida real faz**.

---

## 8. ⚠ Outbox — quem executa (NOVO)

**[REPO]** Produção na **Vercel** — **serverless, sem worker persistente** (`CURRENT_STATE.md` §7).

**[REC] Duas formas, ambas sem infraestrutura nova:**

1. **Disparo imediato:** o handler responde 2xx e **em seguida** aciona o dispatcher (ex.: `after()` do Next.js, que executa **depois** de enviar a resposta). ✅ Rápido no caminho feliz.
2. ⚠ **Cron — a rede de segurança:** um job periódico varre `outbox_events` com `status IN ('pendente','falha')` **e `next_attempt_at <= now()`**, e reexecuta com **backoff exponencial**.

⚠ **(2) é OBRIGATÓRIO.** (1) é otimização. **Um sistema que depende só de (1) perde comandos quando a função morre logo após responder** — e um comando `criar_parcelamento_saldo` perdido significa **um cliente que pagou a entrada e nunca recebeu as parcelas**.

⚠ **Concorrência:** o dispatcher usa **`SELECT ... FOR UPDATE SKIP LOCKED`** e marca `em_execucao`. **Sem isso, dois cold starts simultâneos na Vercel processariam o MESMO comando e criariam o parcelamento DUAS vezes** — e o `UNIQUE` do comando **não protege contra isso** (o comando é o mesmo; o que se duplica é a **execução**).

⚠ **`status='falha'` após `max_attempts`** → **ALERTA obrigatório**, com severidade alta.

**[HIP]** O agendador (**Vercel Cron** × **`pg_cron` do Supabase**) **não foi decidido** → **DEC-014**.

---

## 9. Logs, auditoria e alertas

**[REPO] Ponto grave:** o projeto **não tem log estruturado nem observabilidade** (`CURRENT_STATE.md` §6). ⚠ **Um webhook falhando hoje seria completamente invisível.**

**[REC] Mínimo antes da produção:**

| Item | Requisito |
|---|---|
| **Log de toda entrega** | ✅ **A tabela `webhook_events` JÁ É esse log** — vantagem do desenho: **a auditoria é o banco**, não um arquivo de texto que ninguém lê. |
| ⚠ **NUNCA logar** | O `asaas-access-token`. A `ASAAS_API_KEY`. Dados pessoais completos (CPF/CNPJ **mascarado**). Qualquer dado de cartão (**não os temos** — mas a regra fica registrada). |
| ⚠ **Alertas obrigatórios** | (a) `webhook_events.status='erro'`; (b) evento desconhecido; (c) **`CHARGEBACK_*`**; (d) `REFUND_DENIED`; (e) ⚠ **`outbox_events.status='falha'`** (**NOVO** — é o que revela "pagou a entrada e não recebeu as parcelas"); (f) ⚠ **falhas consecutivas ≥ 5** — **muito antes do limite de 15**, para dar margem de reação. |
| **Painel de saúde** | Eventos recebidos hoje · quantos com erro · último evento recebido · **comandos de outbox pendentes/falhos**. ⚠ **"Nenhum evento nas últimas 24h" é, por si só, um ALERTA** — pode significar **fila interrompida**. **Silêncio não é sinal de saúde.** |

**[HIP]** O meio do alerta (e-mail via **Resend** — **[REPO]** já instalado — × Slack × outro) **não foi decidido** → DEC-011.

---

## 10. Configuração no Asaas

**[REC]** Na F5, ⚠ **em Sandbox primeiro**:

1. Gerar um **token forte e aleatório** (≥ 32 bytes). Guardar em `ASAAS_WEBHOOK_TOKEN`.
2. Cadastrar o webhook (painel do Asaas ou `POST /v3/webhooks`) apontando para a URL do §2, com o token.
3. **[HIP]** Confirmar se os eventos podem ser assinados **seletivamente** e assinar **apenas** os das §5.1/§5.2 — menos superfície, menos ruído.
4. ⚠ **Sandbox e Produção: webhooks e tokens SEPARADOS. Nunca reutilizar o token de sandbox em produção.**
5. ⚠ **Verificação de ambiente:** o handler deve **rejeitar** eventos cujo ambiente não corresponda ao configurado. ⚠ **Um evento de sandbox processado em produção criaria uma TRANSAÇÃO FINANCEIRA FALSA no banco de produção.** Tokens distintos por ambiente **já resolvem** — desde que **nunca sejam misturados**.
