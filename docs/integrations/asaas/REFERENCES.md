# Documentação oficial do Asaas consultada

> **Datas de consulta:** primeira rodada **14/07/2026**; segunda rodada (revisão) **14/07/2026** — inclui o produto **Asaas Checkout**, ausente da primeira análise.
> Rótulos: **[ASAAS]** regra confirmada na documentação oficial · **[HIP]** ponto não confirmado, depende da conta ou de teste real.
>
> ⚠ **Aviso de método.** Antes de implementar cada fase, **reler a página correspondente**: a documentação do Asaas muda, e ela própria avisa que **novos campos e novos eventos podem ser adicionados sem aviso prévio** — **[ASAAS]**.

---

## 1. Autenticação, ambientes e headers — **CONFIRMADO**

| Item | Conteúdo |
|---|---|
| **Recursos** | Visão geral da API · Criar novo checkout (referência) |
| **Links** | https://docs.asaas.com/docs/visao-geral · https://docs.asaas.com/reference/criar-novo-checkout |
| **Consulta** | 14/07/2026 |

**[ASAAS] Regras confirmadas — as URLs deixaram de ser hipótese:**

| Item | Valor |
|---|---|
| **URL base — Sandbox** | **`https://api-sandbox.asaas.com/v3`** |
| **URL base — Produção** | **`https://api.asaas.com/v3`** |
| **Header de autenticação** | **`access_token: <API Key>`** |
| **Content-Type** | **`application/json`** |
| **User-Agent** | Deve identificar a aplicação |

> **Correção em relação à análise anterior.** A primeira rodada registrou a URL do sandbox como **[HIP]**, por ter encontrado duas formas (`sandbox.asaas.com/api/v3` e `api-sandbox.asaas.com/v3`). A página de referência do endpoint de checkout mostra explicitamente **`https://api-sandbox.asaas.com/v3/checkouts`**. **A forma correta é `https://api-sandbox.asaas.com/v3`.** O ponto deixa de ser hipótese e passa a ser **[ASAAS] regra confirmada**.

**[REC] `User-Agent` do `AsaasClient`:**
```
AnteroSistemas/1.0 (Next.js; sandbox)
AnteroSistemas/1.0 (Next.js; production)
```
Enviado em toda requisição. Serve para o Asaas identificar a origem em caso de suporte e para separarmos tráfego de sandbox e produção nos logs deles.

**[REC] A URL base continua vindo de variável de ambiente** (`ASAAS_API_URL`), mesmo agora que é conhecida — porque é o que permite alternar ambiente sem recompilar, e porque fixá-la no código elimina a única barreira contra apontar dev para produção.

**[ASAAS]** O Asaas é instituição de pagamento autorizada pelo Banco Central e mantém certificação **PCI-DSS**. Oferece: Pix, boleto, cartão de crédito/débito, split, assinaturas, webhooks, links de pagamento, **checkout hospedado**, tokenização e antecipação de recebíveis.

**Impacto:** a API Key é segredo de servidor. Isso, por si só, elimina qualquer arquitetura em que o frontend fale direto com o Asaas.

---

## 2. Clientes (`customers`)

| Item | Conteúdo |
|---|---|
| **Recurso** | Criar novo cliente |
| **Link** | https://docs.asaas.com/reference/criar-novo-cliente |
| **Consulta** | 14/07/2026 |

**[ASAAS] Regras confirmadas:**
- Obrigatórios: **`name`** e **`cpfCnpj`**.
- Opcionais relevantes: `email`, `mobilePhone`, `phone`, `postalCode`, `address`, `addressNumber`, `complement`, `province`, `externalReference`, `company`.
- **`externalReference`** guarda o identificador do cliente **no nosso sistema**; a documentação afirma que *"facilita a conciliação entre sistemas"*.
- ⚠ **A API permite criar clientes duplicados.** O Asaas **não** deduplica por CPF/CNPJ. **Prevenir é responsabilidade da integração.**
- Estratégias recomendadas pela própria documentação: buscar por `cpfCnpj`; validar por `externalReference`; **armazenar e reutilizar o `id` já criado**.

**Impacto:** justifica a tabela `payment_provider_customers` com `UNIQUE`, em vez de um `asaas_customer_id` solto.

**[HIP]** Comportamento quando um cliente é removido/bloqueado no Asaas e ainda temos o `id`: **não confirmado.** Testar em Sandbox (F3).

---

## 3. Cobrança tradicional (`/v3/payments`) e parcelamento

| Item | Conteúdo |
|---|---|
| **Recursos** | Criar nova cobrança · Criar uma cobrança parcelada · Cobranças via cartão de crédito |
| **Links** | https://docs.asaas.com/reference/criar-nova-cobranca · https://docs.asaas.com/docs/criar-uma-cobranca-parcelada · https://docs.asaas.com/docs/cobrancas-via-cartao-de-credito |
| **Consulta** | 14/07/2026 |

**[ASAAS] Regras confirmadas:**

- **Avulsa (1x):** envia-se `value`. **Não** se usam atributos de parcelamento. *"Somente cobranças com 2 ou mais parcelas usa-se os atributos do parcelamento."*
- **Parcelada (2x+):** `installmentCount` + `installmentValue`, **ou** `installmentCount` + `totalValue` (o Asaas divide).
- **Arredondamento:** quando `totalValue` não divide exato, **a diferença é compensada na última parcela**.
- A resposta traz **apenas a primeira** cobrança. As demais: `GET /v3/installments/{id}/payments`.
- ⚠ **`billingType` é um valor ÚNICO**, não uma lista: `BOLETO` · `PIX` · `CREDIT_CARD` · `UNDEFINED`.
  - ⚠ **Não é possível criar uma cobrança com dois `billingType`** (ex.: Pix *e* cartão).
  - Quando o pagador deve **escolher** o método, usa-se **`UNDEFINED`** — *"desde que os métodos desejados estejam habilitados na conta"*.
- **Limite de parcelas no cartão:** **até 21x** em **Visa e Mastercard**; **até 12x** nas demais bandeiras.

> ### ⚠ Consequência crítica de `billingType` ser único — corrige um erro da análise anterior
>
> Na cobrança tradicional existem **apenas duas possibilidades**:
> 1. **Um método concreto** (`PIX`, ou `BOLETO`, ou `CREDIT_CARD`) — impõe exatamente aquele; ou
> 2. **`UNDEFINED`** — libera **todos os métodos habilitados na conta**, e **nós não controlamos quais são**.
>
> **Não existe meio-termo.** Não há como dizer "aceite Pix e cartão, mas não boleto" numa cobrança tradicional.
>
> A primeira versão desta documentação propunha um campo `allowed_billing_types text[]` no banco. **Isso estava errado**: um array de métodos permitidos que a integração **não consegue impor** é uma promessa falsa — a condição comercial diria "Pix ou cartão" e o cliente veria, na tela do Asaas, **tudo que a conta tiver habilitado**, boleto incluído. Corrigido em `DATA_MODEL.md` §3.5 e `ARCHITECTURE.md` §1.

**[ASAAS] Cartão — duas formas:**
- **Página de fatura hospedada (`invoiceUrl`):** cria-se a cobrança e redireciona-se o cliente. *"Minimiza o ônus de conformidade PCI."*
- **API direta (transparente):** objetos `creditCard` + `creditCardHolderInfo` + `remoteIp`. Exige HTTPS e **timeout mínimo de 60s "para evitar duplicidade"**. Devolve `creditCardToken` reutilizável.

**Impacto:** o alerta de *timeout para evitar duplicidade* é o Asaas confirmando que **respostas ambíguas acontecem** — a cobrança pode ter sido criada e a resposta se perder. Idempotência e reconciliação são **obrigatórias**.

**[HIP] Não confirmado:** quais métodos a conta da ANTERO terá habilitados; juros/multa e **quem os assume** (varia por conta e contrato). **Necessita confirmação na conta real.** Ver DEC-009.

---

## 4. **Asaas Checkout** (`/v3/checkouts`) — **NOVO nesta revisão**

| Item | Conteúdo |
|---|---|
| **Recursos** | Asaas Checkout · Criar novo checkout · Checkout para Pix · Checkout para Cartão de Crédito · Eventos para Checkout |
| **Links** | https://docs.asaas.com/docs/checkout-asaas · https://docs.asaas.com/reference/criar-novo-checkout · https://docs.asaas.com/docs/checkout-para-pix · https://docs.asaas.com/docs/eventos-para-checkout |
| **Consulta** | 14/07/2026 |

**[ASAAS] O que é:** uma **página de pagamento hospedada pelo Asaas**, criada via API, para quem já tem um fluxo de compra próprio e não quer construir a interface de pagamento. **É um produto distinto da `invoiceUrl`** (que é a *fatura* de uma cobrança já criada).

**[ASAAS] Endpoint:** `POST /v3/checkouts` → sandbox: `https://api-sandbox.asaas.com/v3/checkouts`

**[ASAAS] Parâmetros confirmados:**

| Parâmetro | Regra confirmada |
|---|---|
| **`billingTypes`** | ⚠ **É um ARRAY.** Métodos disponíveis ao pagador. Ex.: `["PIX"]`, `["CREDIT_CARD"]`, `["PIX","CREDIT_CARD"]`. **Pelo menos um é obrigatório.** |
| **`chargeTypes`** | ⚠ **Também um ARRAY.** `DETACHED` (avulsa) · `INSTALLMENT` (parcelado) · `RECURRENT` (assinatura). **Pelo menos um é obrigatório.** |
| **`installment.maxInstallmentCount`** | **Obrigatório quando `chargeTypes` inclui `INSTALLMENT`.** Define **o número máximo de parcelas que o CLIENTE poderá escolher na página do Asaas.** |
| **`minutesToExpire`** | Validade do checkout. **Entre 10 e 1440 minutos.** Expirado, o link deixa de valer e o cliente é redirecionado ao `expiredUrl`. |
| **`callback`** | Objeto com **`successUrl`**, **`cancelUrl`** e **`expiredUrl`** — redirecionamento automático conforme o desfecho. |
| **`items`** | Array de produtos/serviços exibidos na página: `name`, `description`, `quantity`, `value`, imagem opcional. |
| **`customerData`** | Dados do pagador. |
| **`externalReference`** | Identificador do nosso sistema. **Máximo 200 caracteres.** |
| **`subscription`** | Obrigatório quando `chargeTypes` inclui `RECURRENT`. |
| **Resposta** | **`id`** (do checkout) e **`link`** (a URL hospedada para onde redirecionar o cliente). |

**[ASAAS] Regra de validação:** *"Pelo menos um método de pagamento deve ser especificado em `billingTypes` e pelo menos um tipo de cobrança em `chargeTypes`"* — caso contrário a requisição é rejeitada.

**[ASAAS] Eventos de webhook do Checkout** (distintos dos de cobrança):

| Evento | Significado |
|---|---|
| `CHECKOUT_CREATED` | Checkout criado |
| `CHECKOUT_PAID` | **Checkout pago** |
| `CHECKOUT_CANCELED` | Checkout cancelado |
| `CHECKOUT_EXPIRED` | **Checkout expirado** (estourou o `minutesToExpire`) |

**[ASAAS]** O payload do evento inclui: id e status do checkout, `billingTypes`, `chargeTypes`, itens, dados do cliente, ciclo de assinatura (quando aplicável), configuração de split e tempo restante até expirar.

**[ASAAS] Alerta explícito da documentação:** *"A criação do checkout não confirma o pagamento — é preciso monitorar os webhooks para o status real da transação."* E: a entrega de webhooks é **"at least once"**, exigindo **processamento idempotente**.

### ⚠ **[HIP] Três lacunas do Checkout que precisam ser resolvidas antes de decidir a DEC-001**

Estas **não** foram confirmadas na documentação e **são decisivas**:

| # | Lacuna | Por que é decisiva | Como resolver |
|---|---|---|---|
| **H1** | ⚠ **`BOLETO` é aceito em `billingTypes` do Checkout?** Todos os exemplos oficiais mostram apenas `["PIX"]` e `["CREDIT_CARD"]`. **Não localizei nenhum exemplo com `BOLETO` no Checkout.** | O negócio da ANTERO **exige boleto** (§ tarefa). Se o Checkout não suportar boleto, **ele não pode ser o fluxo único** — e a recomendação muda. | **Testar em Sandbox (F2/F4):** enviar `billingTypes: ["BOLETO"]` e ver se é aceito. |
| **H2** | ⚠ **O payload do `CHECKOUT_PAID` traz o `id` da cobrança (`payment`) gerada e o número de parcelas escolhido pelo cliente?** A documentação dos eventos **não detalha isso explicitamente**. | Sem o `payment id`, **não conseguimos vincular o checkout à cobrança** nem receber os eventos `PAYMENT_*` correlacionados. Sem o nº de parcelas, **não sabemos o que o cliente contratou** (`DATA_MODEL.md` §3.5). | **Testar em Sandbox (F4):** pagar um checkout parcelado e **inspecionar o payload bruto** de `CHECKOUT_PAID`. Registrar o resultado aqui. |
| **H3** | **O Checkout emite também os eventos `PAYMENT_*`** da cobrança que ele gera, ou apenas os `CHECKOUT_*`? | Determina se reaproveitamos toda a máquina de estados de cobrança ou se precisamos de uma paralela. | **Testar em Sandbox (F4).** |

**[REC]** **A DEC-001 permanece `pendente` até que H1, H2 e H3 sejam respondidos em Sandbox.** Recomendar uma estratégia cujo suporte a boleto é desconhecido, para um negócio que exige boleto, seria irresponsável. Ver `ARCHITECTURE.md` §1.

---

## 5. Links de pagamento (`/v3/paymentLinks`)

| Item | Conteúdo |
|---|---|
| **Recurso** | Criando um link de pagamentos |
| **Link** | https://docs.asaas.com/docs/criando-um-link-de-pagamentos |
| **Consulta** | 14/07/2026 |

**[ASAAS] Regras confirmadas:**
- Endpoint `/v3/paymentLinks`. Parâmetros: `name`, `description`, `value`, `billingType`, `chargeType`, `notificationEnabled`.
- **`chargeType`**: `DETACHED` (cobrança nova a cada uso) · `INSTALLMENT` (o cliente escolhe as parcelas, até **`maxInstallmentCount`**) · `RECURRENT` (assinatura, com `subscriptionCycle`).
- ⚠ **O Asaas aceita CPF/CNPJ duplicado**: um mesmo cliente usando o mesmo link várias vezes **pode virar registros separados**.

**Impacto:** o link é **reutilizável e desvinculado** do nosso cliente até que alguém o use — o que quebra a rastreabilidade "cobrança ↔ projeto ↔ cliente" exigida pelo negócio. **Descartado como fluxo principal**, mantido como **ferramenta administrativa pontual** (cobrar um extra fora do fluxo de projeto).

---

## 6. Webhooks — as regras que ditam todo o desenho

| Item | Conteúdo |
|---|---|
| **Recursos** | Introdução aos Webhooks · Eventos para cobranças · Fila pausada / Como reativar fila interrompida |
| **Links** | https://docs.asaas.com/docs/sobre-os-webhooks · https://docs.asaas.com/docs/webhook-para-cobrancas · https://docs.asaas.com/docs/como-reativar-fila-interrompida |
| **Consulta** | 14/07/2026 |

**[ASAAS] Regras confirmadas:**

1. **Entrega *at least once*** — o mesmo evento **pode chegar mais de uma vez**.
2. **Cada evento tem `id` único, que se repete no reenvio.** → chave natural de deduplicação.
3. **Resposta esperada: HTTP 2xx** (`200 OK` ou `204 No Content`). Qualquer outro status dispara retry.
4. ⚠ **15 falhas consecutivas INTERROMPEM a fila.** O Asaas para de enviar. Reativação **manual** (Minha Conta → Integração).
5. **Após a reativação, os pendentes são processados em ordem cronológica.**
6. ⚠ **Eventos são guardados por 14 dias.** Depois, **descartados permanentemente**.
7. **Autenticação:** token conferido no header **`asaas-access-token`**. *"Você deve criar uma hash forte e conferir sempre o header."*
8. **Novos campos e eventos podem ser adicionados sem aviso.** *"Always prepare your code to handle unexpected attributes."*

**[ASAAS] Eventos de cobrança:** `PAYMENT_CREATED`, `PAYMENT_AUTHORIZED`, `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_OVERDUE`, `PAYMENT_DELETED`, `PAYMENT_REFUNDED`, `PAYMENT_REFUND_IN_PROGRESS`, `PAYMENT_REFUND_DENIED`, `PAYMENT_CREDIT_CARD_CAPTURE_REFUSED`, `PAYMENT_CHARGEBACK_REQUESTED`, `PAYMENT_CHARGEBACK_DISPUTE`.

**[ASAAS] Fluxos variam por método — confirmado:**
- **Boleto:** `CREATED` → `CONFIRMED` → `RECEIVED`
- ⚠ **Pix:** `CREATED` → **`RECEIVED`** — **pode pular o `CONFIRMED`**
- **Cartão:** `CREATED` → `CONFIRMED` → `RECEIVED`, com o `RECEIVED` **~32 dias depois**

> ### ⚠ Duas consequências que estruturam o modelo
>
> **(a) `CONFIRMED` ≠ `RECEIVED`.** Em cartão, o pagamento é *confirmado* na hora e o dinheiro *cai* ~32 dias depois. Para o **cliente**, importa `CONFIRMED` ("paguei"). Para o **financeiro da ANTERO**, importa `RECEIVED` ("o dinheiro entrou"). Tratá-los como a mesma coisa faz ou o cliente ver "pendente" por um mês após pagar, ou o financeiro contar dinheiro que não entrou. → dois estados: `paga` e `liquidada`.
>
> **(b) ⚠ Pix pode ir direto de `CREATED` para `RECEIVED`, SEM passar por `CONFIRMED`.** Portanto **qualquer efeito ligado a "o cliente pagou" — em especial a criação do parcelamento do saldo após a entrada via Pix — NÃO pode depender exclusivamente do `PAYMENT_CONFIRMED`.** Ele precisa ser disparado **idempotentemente** por `CONFIRMED` **ou** por `RECEIVED`, o que vier primeiro, **sem duplicar**. Isto é tratado pela **outbox** (`ARCHITECTURE.md` §4, `WEBHOOKS.md` §5).

**[HIP] Não confirmado:** modo de entrega (sequencial vs. paralelo) e **timeout numérico** aceito na resposta. Projetar para responder em **poucas centenas de milissegundos**.

---

## 7. Estornos e reembolsos

| Item | Conteúdo |
|---|---|
| **Recursos** | Estornos · Estornar cobrança |
| **Links** | https://docs.asaas.com/docs/estornos · https://docs.asaas.com/reference/estornar-cobranca |
| **Consulta** | 14/07/2026 |

**[ASAAS] Regras confirmadas:**
- **Cartão:** estornável quando **`RECEIVED` ou `CONFIRMED`**.
- ⚠ **Pix: estorno total OU MÚLTIPLOS ESTORNOS PARCIAIS**, desde que a soma **não exceda** o valor recebido.
- Após estornos, a cobrança retorna o atributo **`refunds`** (lista), com `dateCreated`, `status` (ex.: `DONE`), `value`, `description`.
- Eventos: `PAYMENT_REFUNDED`, `PAYMENT_REFUND_IN_PROGRESS`, `PAYMENT_REFUND_DENIED` (**apenas boleto**).

**Impacto:** estorno **não é booleano**, é uma **lista**. Exige tabela `refunds` própria **e** um estado interno **`parcialmente_estornada`** — que faltava na primeira versão da máquina de estados (`ARCHITECTURE.md` §3).

**[HIP] Não confirmado:** regras e prazos de estorno de **boleto** (a existência de `PAYMENT_REFUND_DENIED` só para boleto sugere restrições próprias). Testar em Sandbox.

---

## 8. Consulta de status e conciliação

| Item | Conteúdo |
|---|---|
| **Recurso** | Recuperar status de uma cobrança |
| **Link** | https://docs.asaas.com/reference/recuperar-status-de-uma-cobranca |
| **Consulta** | 14/07/2026 |

**[ASAAS]**
- `GET /v3/payments/{id}/status` devolve **apenas o status**.
- ⚠ Recomendado para **checagens pontuais**, **não** como estratégia de **polling recorrente**.
- ⚠ `GET` deve ter **corpo vazio** — enviar corpo pode retornar **403**.

**Impacto:** confirma o desenho — **webhook é primário**; a consulta serve à **reconciliação**, de forma **limitada e direcionada**.

**[HIP] Não confirmado:** *rate limits* da API. Reconciliação deve ser paginada, limitada e espaçada, por precaução.

---

## 9. Redirecionamento após o pagamento

| Item | Conteúdo |
|---|---|
| **Recurso** | Redirecionamento após o pagamento |
| **Link** | https://docs.asaas.com/docs/redirecionamento-apos-o-pagamento |
| **Consulta** | 14/07/2026 |

**[ASAAS]** É possível configurar uma *Return URL*: após pagar na fatura (`invoiceUrl`), o cliente volta para uma URL nossa. No **Checkout**, o equivalente é o objeto **`callback`** (`successUrl`, `cancelUrl`, `expiredUrl`) — **mais completo**, por tratar também cancelamento e expiração.

⚠ **O retorno visual do cliente NÃO é confirmação de pagamento.** A página de retorno mostra "estamos confirmando"; o estado real vem **do webhook**. **[ASAAS]** O webhook pode inclusive **chegar antes** do navegador voltar.

---

## 10. Idempotência — **[HIP] registrado como regra de projeto**

**[HIP] Não foi localizado um header oficial de idempotência na API do Asaas** (equivalente ao `Idempotency-Key` do Stripe), nem para criação de cobranças, nem para criação de checkouts, nem para processamento.

**[REC] Regra de projeto, decorrente disso:** **a integração NÃO deve depender da existência de um mecanismo de idempotência do provedor.** Toda a proteção contra duplicidade é **nossa**, e é estrutural:

1. **Chave idempotente interna determinística**, com `UNIQUE` no banco (`DATA_MODEL.md` §8).
2. **`externalReference`** enviado em toda criação — é ele que permite **perguntar ao Asaas, com o nosso identificador**, se a operação já ocorreu, depois de um timeout.
3. **Consulta antes de retentar**, nunca retry cego (`PAYMENT_FLOWS.md` §6.3).
4. **Deduplicação de webhook** por `UNIQUE (provider, provider_event_id)`.

**[REC]** Se, no futuro, o Asaas publicar um header oficial de idempotência, ele deve ser **adicionado como reforço** — mas **as garantias acima permanecem**, porque são elas que protegem contra falhas do nosso lado, não só do lado dele.

---

## 11. Recursos citados nas tarefas que **NÃO** foram confirmados

Registrados honestamente:

| Tema | Situação |
|---|---|
| **Boleto no `billingTypes` do Checkout** | ⚠ **[HIP] NÃO CONFIRMADO — lacuna H1, bloqueia a DEC-001.** Ver §4. |
| **`payment id` e nº de parcelas no payload de `CHECKOUT_PAID`** | ⚠ **[HIP] NÃO CONFIRMADO — lacuna H2.** Ver §4. |
| **Emissão de eventos `PAYMENT_*` pelo Checkout** | ⚠ **[HIP] NÃO CONFIRMADO — lacuna H3.** Ver §4. |
| **Header oficial de idempotência** | **[HIP] Não localizado.** A integração **não deve depender de um**. Ver §10. |
| **Comportamento de `maxInstallmentCount` acima do limite da bandeira** (ex.: 15x com cartão Elo, limite 12) | **[HIP] Não confirmado.** Testar. Ver DEC-004. |
| **Assinaturas / recorrência** (`/v3/subscriptions`) | Existe (confirmado via `chargeTypes: RECURRENT`), **não estudada em profundidade** — fora da 1ª versão. |
| **Antecipação de recebíveis** | Citada na visão geral, **não aprofundada**. Fora do escopo. |
| **Taxas do Asaas, valores brutos × líquidos, prazos de repasse** | ⚠ **[HIP] Dependem do contrato comercial.** **Não são regras de API.** Impactam o modelo de dados (`DATA_MODEL.md` §4.6). **Necessitam confirmação com o Asaas.** |
| **Rate limits** | **[HIP] Não confirmado.** |
| **Timeout aceito na resposta do webhook** | **[HIP] Não confirmado.** |
| **Notificações automáticas do Asaas ao cliente** | O Asaas envia e-mails/SMS próprios ao pagador (há `notificationEnabled` nos links). ⚠ **[HIP]** O comportamento padrão **por conta** não foi confirmado. **Risco de mensagem duplicada** — ver `DATA_MODEL.md` §4.9 e DEC-013. |

---

## 12. Regra de ouro

**Antes de cada fase, revalidar na documentação oficial.** Este arquivo é um retrato de **14/07/2026**. Os pontos marcados **[HIP]** — sobretudo **H1, H2 e H3** — **não devem virar código sem confirmação em Sandbox.**
