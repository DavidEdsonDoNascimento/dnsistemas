# Segurança

> Data: 14/07/2026 (revisado). Rótulos: **[REPO]** · **[ASAAS]** · **[REC]** · **[HIP]**.
> ⚠ **Nenhum segredo, credencial ou valor de variável foi lido, copiado ou registrado.** Apenas **nomes** de variáveis.
> **Correções desta revisão:** estado `pending` de `profiles` (§1.2 S1) · **DEC-008 reformulada** (§2.3) · variáveis atualizadas (§3).

---

## 1. Segurança do que existe hoje

### 1.1 O que está **correto** — e deve ser preservado

**[REPO]**

| Item | Evidência | Por que está certo |
|---|---|---|
| **Validação real do JWT no servidor** | `src/proxy.ts:43-45` e `src/features/auth/session/get-user.ts:12-18` usam **`getUser()`**, não `getSession()` | `getSession()` **apenas lê o cookie** (falsificável); `getUser()` **valida contra o servidor do Supabase**. ⚠ **É a diferença entre uma checagem de segurança e uma decoração.** |
| **Proteção contra open redirect** | `src/app/auth/callback/route.ts:4,16` e `src/features/auth/actions/sign-in-google.ts:7,30` validam `next` contra `/^\/painel(?:\/.*)?$/` | Impede `?next=https://site-malicioso.com`. ✅ Feito **nos dois** pontos. |
| **PKCE no OAuth** | `exchangeCodeForSession(code)` | Padrão correto. |
| **Defesa em camadas** | Proxy **e** `(painel)/layout.tsx` verificam o usuário | Intencional, comentado no código. |
| **Segredos sem `NEXT_PUBLIC_`** | `.env.example` | Convenção correta **já estabelecida** — a integração deve segui-la. |
| **Sanitização de saída** | `escapeHtml()` em `src/app/api/contact/route.ts` | Cuidado deliberado. |

### 1.2 Problemas **existentes** a resolver **antes** da integração

---

#### 🔴 **S1 — Não existe autorização. Apenas autenticação.**

**[REPO]** Não há papel, permissão, `role` ou claim em lugar nenhum. `src/features/auth/types.ts` só reexporta o `User` do Supabase. ⚠ **Qualquer usuário autenticado entra em `/painel`, `/painel/financeiro` e `/painel/clientes` com acesso idêntico.**

Hoje não vaza nada (dados mock). ⚠ **Com cobranças reais, é vazamento de dados financeiros entre clientes** — um cliente da ANTERO veria as cobranças de outro.

**Gravidade: 🔴 BLOQUEANTE.**

⚠ **Correção — com o estado `pending` (corrigido nesta revisão):**

A v1 propunha `profiles.role DEFAULT 'cliente'` **com `organization_id` obrigatório para clientes**. ⚠ **Isso era contraditório:** um usuário recém-criado **não tem organização** → o `INSERT` do perfil **violaria o `CHECK`** e **quebraria o cadastro**. E relaxar o `CHECK` criaria um "cliente sem organização" — um estado ambíguo, **o oposto de *fail closed***.

✅ **Solução: três papéis.** `CHECK IN ('pending','admin','cliente')`, com **`DEFAULT 'pending'`**:

```
Usuário novo  →  role='pending', organization_id=NULL
                 ⚠ A RLS de TODAS as tabelas exige role IN ('admin','cliente')
                 ⚠ Um 'pending' NÃO LÊ UMA ÚNICA LINHA de nenhuma tabela.
                    Não por omissão — por regra explícita.
                 → fail closed ✅

Admin promove →  role='cliente' + organization_id  (auditado: activated_by, activated_at)
```

⚠ **Duas guardas indispensáveis:**
1. ⚠ **O usuário NÃO pode alterar o próprio `role` nem o próprio `organization_id`.** A política de `UPDATE` de `profiles` permite editar `full_name` e **nada mais**. **Sem isso, qualquer cliente se promoveria a admin com uma chamada à API do Supabase** — e a RLS inteira viraria decoração.
2. ⚠ **Bootstrap do primeiro admin.** Se todo usuário nasce `pending` e só um admin promove, **o primeiro admin não pode nascer pela aplicação**. Ele é criado por **migration/seed** ou manualmente no Supabase, **uma vez**. ⚠ **Isso precisa ser um passo explícito da F0B**, não uma descoberta em produção. Ver `DATA_MODEL.md` §3.1.

Detalhes: `DATA_MODEL.md` §3.1 e §6. → **DEC-003**.

---

#### 🟠 **S2 — O *fail-safe* do proxy libera o painel sem envs**

**[REPO]** `src/proxy.ts:21-24`:
```ts
// Fail-safe: sem envs, não bloqueia a navegação (evita brick em dev sem setup).
if (!url || !anon) {
  return response
}
```

⚠ Sem `NEXT_PUBLIC_SUPABASE_URL` ou `NEXT_PUBLIC_SUPABASE_ANON_KEY`, **o proxy libera `/painel/*` para qualquer visitante, sem autenticação.**

Razoável para um painel com dados falsos. ⚠ **Com dados financeiros, é crítico: uma variável mal configurada num deploy expõe a área inteira à internet.** **Falha de configuração vira falha de segurança** — o oposto do que um *fail-safe* deveria fazer.

**Gravidade: 🟠 MÉDIA hoje · 🔴 CRÍTICA com dados reais.**
**Correção [REC]:** ***fail closed* em produção** — se as envs faltarem com `NODE_ENV === 'production'`, **bloquear**; manter o comportamento permissivo **apenas** em desenvolvimento. **F0B.** → **DEC-010**.

---

#### 🟠 **S3 — Nenhuma validação de entrada estruturada**
**[REPO]** Sem Zod/Yup/Valibot. Validação manual e pontual.
⚠ A integração recebe **payload de webhook (de fora)**, formulários administrativos e a escolha do cliente (⚠ **incluindo o nº de parcelas** — `PAYMENT_FLOWS.md` §4.1). **Validar isso com `if`s é como se introduz falha.**
**Gravidade: 🟠 ALTA.** → **DEC-007**.

#### 🟠 **S4 — Nenhum log, nenhuma observabilidade**
**[REPO]** ⚠ **Um webhook falhando hoje seria invisível.** Combinado com **[ASAAS]** "15 falhas interrompem a fila" + "eventos descartados após 14 dias": ⚠ **a sincronização financeira pode parar e ninguém saber por duas semanas — quando os eventos já terão sido descartados para sempre.**
**Gravidade: 🟠 ALTA.** → **DEC-011**.

#### 🟡 **S5 — Dois lockfiles**
**[REPO]** `package-lock.json` **e** `yarn.lock`. Instalações divergentes entre dev e produção. ⚠ Numa integração financeira, *"funciona na minha máquina"* não é aceitável. Amplia também a superfície de cadeia de suprimentos: **não se sabe qual árvore de dependências vai a produção.**
**Gravidade: 🟡 MÉDIA → 🟠 ALTA no momento em que uma dependência for instalada** (e a integração vai instalar). ⚠ **Resolver na F0A, ANTES de qualquer `install`.**

#### 🟡 **S6 — Ponto flutuante em dinheiro**
**[REPO]** `MovimentoFinanceiro.valor: number` somado com `reduce`. É mock — **mas o padrão não pode ser herdado**. → **DEC-006**.

---

## 2. Requisitos de segurança **da integração**

### 2.1 API Key — só no servidor

**[ASAAS]** Autenticação por **API Key** no header **`access_token`** (`REFERENCES.md` §1).

⚠ **[REC] Regras inegociáveis:**
- ⚠ **`ASAAS_API_KEY` JAMAIS recebe o prefixo `NEXT_PUBLIC_`.** Com o prefixo, **o Next.js inlina a variável no bundle do navegador** — a chave iria para o JavaScript público. **[REPO]** A convenção do projeto já é essa; **manter sem exceção**.
- Lida **apenas** em: `AsaasClient`, Server Actions, Route Handlers. **Nunca** em Client Component.
- ⚠ **[REC] Isolar num módulo com `import 'server-only'` no topo** — o mesmo padrão de `src/features/auth/lib/supabase-server.ts:1`. ⚠ **Com `server-only`, qualquer import acidental a partir de um componente de cliente QUEBRA O BUILD.** A proteção deixa de depender de disciplina e passa a ser **garantida pelo compilador**. ✅ **É a defesa mais eficaz contra vazamento de chave, e é barata.**
- ⚠ **Critério de aceite da F2:** buscar a string da chave em `.next/static/` e **confirmar que NÃO aparece**.

### 2.2 Sandbox × Produção

**[ASAAS]** Confirmado (`REFERENCES.md` §1): Sandbox **`https://api-sandbox.asaas.com/v3`** · Produção **`https://api.asaas.com/v3`**.

**[REC]**
- ⚠ Chaves **completamente separadas**. **Nunca** a chave de produção em ambiente de dev.
- `ASAAS_ENVIRONMENT` (`sandbox` | `production`) validado no boot.
- ⚠ **Guarda:** se `ASAAS_ENVIRONMENT === 'production'` **e** `NODE_ENV !== 'production'` → ⚠ **FALHAR O BOOT IMEDIATAMENTE.** Isso impede que alguém, em desenvolvimento, **gere cobranças reais em dinheiro real** por engano — erro fácil de cometer e caro de desfazer.
- ⚠ **Tokens de webhook distintos por ambiente** (`WEBHOOKS.md` §10). ⚠ **Um evento de sandbox processado em produção criaria uma transação financeira falsa.**
- **[REC]** `User-Agent` identificando ambiente: `AnteroSistemas/1.0 (Next.js; sandbox|production)`.

### 2.3 ⚠ Escrita sem sessão (webhook e outbox) — **DEC-008 REFORMULADA**

> ⚠ **Correção da v1 — a recomendação anterior estava errada.** A v1 recomendava **funções `SECURITY DEFINER` chamadas com a chave `anon`**, afirmando que seriam "mais seguras" que a `service_role`. **Isso não se sustenta.**

**O problema:** o webhook chega **sem usuário autenticado** (o Asaas não faz login) e precisa **escrever** em `charges`, `transactions`, `webhook_events` e `outbox_events`. A chave `anon`, submetida à RLS, **não pode**. O dispatcher da outbox tem o mesmo problema.

#### ⚠ Por que a recomendação anterior estava errada

⚠ **A chave `anon` do Supabase é PÚBLICA.** Ela vai para o bundle do navegador — é o seu propósito (`NEXT_PUBLIC_SUPABASE_ANON_KEY`). **Qualquer pessoa que abra o site tem essa chave.**

⚠ **Logo: uma função `SECURITY DEFINER` executável pelo papel `anon` é uma função que QUALQUER PESSOA NA INTERNET pode chamar** — diretamente, via API REST do Supabase, sem passar pelo nosso servidor, sem token de webhook, sem nada. Uma função que escreve em `charges` e é chamável por `anon` **não é uma barreira; é um endpoint público de escrita em dados financeiros.** Seria **pior** que a `service_role`, não melhor.

⚠ **"`SECURITY DEFINER` é mais seguro que `service_role`" é falso como afirmação geral.** O que importa é **quem pode executar a função**.

#### As duas opções, corrigidas

**Opção A — `SUPABASE_SERVICE_ROLE_KEY`, exclusivamente no servidor**

| Requisito | Detalhe |
|---|---|
| Módulo dedicado com ⚠ **`import 'server-only'`** | Import acidental pelo cliente **quebra o build** |
| **Cliente privilegiado isolado** | Uma única função `createPrivilegedClient()`; **nunca** a chave passada como parâmetro |
| ⚠ **Nunca importado pelo frontend** | Garantido pelo `server-only`, não por disciplina |
| ⚠ **Nunca registrado em logs** | Nem em erro, nem em APM, nem em stack trace |
| ⚠ **Usada APENAS por** | webhook · dispatcher da outbox · reconciliação · tarefas internas. **Nunca** numa Server Action de usuário. |

⚠ **Risco:** a chave **ignora TODA a RLS**. Se vazar, é acesso total ao banco.

**Opção B — Funções `SECURITY DEFINER` *endurecidas***

| Requisito | Detalhe |
|---|---|
| ⚠ **`SET search_path = ''`** (ou fixo e explícito) | ⚠ **Sem isso, a função é vulnerável a *search_path hijacking***: um objeto malicioso num schema anterior no path seria executado **com o privilégio do dono da função**. É a falha clássica de `SECURITY DEFINER`. |
| **Nomes de schema explícitos** | `public.charges`, nunca `charges` |
| ⚠ **`REVOKE EXECUTE ON FUNCTION ... FROM PUBLIC`** | ⚠ Por padrão, o Postgres concede `EXECUTE` a `PUBLIC`. **Sem o `REVOKE`, a função nasce chamável por todos.** |
| ⚠ **`REVOKE ... FROM anon, authenticated`** | ⚠ **É isto que impede a chamada pública direta.** |
| **Validação interna contra abuso** | A função valida os próprios argumentos; não confia no chamador |

⚠ **A constatação decisiva:** **se revogamos `EXECUTE` de `anon` e `authenticated` — e precisamos revogar —, então a função só pode ser chamada por um papel privilegiado.** ⚠ **Ou seja: a Opção B, feita corretamente, AINDA EXIGE uma chave privilegiada para invocá-la.** ⚠ **B não substitui A. B é uma camada SOBRE A.**

#### ⚠ [REC] Recomendação corrigida: **A como transporte, B como defesa em profundidade**

```
✅ [REC]
   1. SUPABASE_SERVICE_ROLE_KEY, em módulo com `import 'server-only'`,
      encapsulada numa única função, nunca logada, usada SÓ por
      webhook / outbox / reconciliação.                        ← Opção A (o transporte)

   2. ⚠ E, ONDE FIZER SENTIDO, as escritas passam por funções SECURITY DEFINER
      endurecidas (search_path fixo, EXECUTE revogado de PUBLIC/anon/authenticated),
      em vez de UPDATEs livres.                                ← Opção B (o escopo)

   → A chave privilegiada existe (é inevitável), mas o que ela PODE FAZER
     fica limitado a um conjunto de operações nomeadas e auditáveis.
     ⚠ Se o código do servidor tiver um bug, ele não consegue apagar `charges`:
        não existe função para isso.
```

⚠ **O que NÃO fazer, sob nenhuma hipótese:** expor uma função `SECURITY DEFINER` que escreve em dados financeiros **ao papel `anon`**. Isso é um **endpoint público de escrita**, e a chave para chamá-lo **está no bundle do site**.

→ **DEC-008**, ⚠ **permanece `pendente`.** É **a decisão de segurança de maior peso** do planejamento.

### 2.4 Autorização por projeto e por empresa

**[REC]** Três camadas independentes — **uma só sempre falha em algum momento**:
1. **Server Action** — `profile.organization_id === project.organization_id`, ⚠ **e `role != 'pending'`**, antes de qualquer coisa.
2. **RLS** — nega a leitura mesmo que o código esqueça o `WHERE`.
3. **Chaves estrangeiras + triggers** — a `charge` **não pode** apontar para projeto de outra organização.

⚠ **O cliente NUNCA escreve em tabela financeira.** Ele **pede**; o servidor **decide**. O papel `authenticated` **não tem `INSERT`/`UPDATE` em `charges`** — nem via RLS.

⚠ **E o cliente NUNCA decide o que foi autorizado.** Ele pode **escolher dentro** do autorizado (o nº de parcelas, quando `customer_choice`), mas o **teto**, o **preço** e o **método** vêm **do banco** (`PAYMENT_FLOWS.md` §4.1).

### 2.5 Proteção do webhook

`WEBHOOKS.md` §3. Resumo: **[ASAAS]** header `asaas-access-token`, conferido **sempre**, em ⚠ **tempo constante** (`crypto.timingSafeEqual` — comparação com `===` **vaza o segredo por timing**); token **nunca** em log; ambiente verificado; ⚠ **[REPO]** a rota `/api/*` **não passa pelo proxy** (`src/proxy.ts:68`) — **toda a segurança é do handler**.

### 2.6 Rate limiting

**[REPO]** ⚠ **Não existe rate limiting em lugar nenhum** — nem no `/api/contact`.

**[REC]** Necessário em:
- **Criação de cobrança** — a idempotência cobre o duplo clique; o rate limit cobre o **abuso deliberado**.
- **Webhook** — contra flood. ⚠ **CUIDADO:** um limite mal calibrado **rejeitaria o Asaas legítimo** durante uma rajada de reentregas (ex.: **após reativar uma fila interrompida**, quando os represados chegam de uma vez) — ⚠ **e 15 rejeições derrubariam a fila de novo**. **[REC]** Limite **generoso**, e ⚠ **nunca aplicado a requisições com token válido**.

### 2.7 CSRF

**[REC]** Server Actions do Next.js já têm proteção embutida (checagem de `Origin`). **Não é preciso mecanismo adicional.**
⚠ **O webhook não usa cookie de sessão** — é autenticado por token —, logo **não é vulnerável a CSRF por construção**: um ataque CSRF só funciona quando o navegador anexa credenciais automaticamente, e **aqui não há credencial de navegador envolvida**.

### 2.8 Dados de cartão

⚠ **Com as estratégias A (`invoiceUrl`) ou B (Checkout) — as duas candidatas —, a ANTERO NUNCA recebe número de cartão nem CVV.** Eles são digitados **na página do Asaas**.

✅ A exigência do negócio — *"não armazenar CVV, número completo do cartão, credenciais do cliente"* — deixa de ser **uma regra a cumprir** e passa a ser ⚠ **estruturalmente impossível de violar**. **Não há como armazenar um dado que nunca chega.**

⚠ **Se a Estratégia D (checkout transparente) fosse escolhida**, isso mudaria por completo: os dados **passariam** pelo nosso servidor, e seria preciso garantir que **não aparecem em log, em APM, em tela de erro, em relatório de exceção** — e **a lista de lugares onde um dado pode acidentalmente aparecer é maior do que qualquer pessoa consegue enumerar**. ⚠ **É a segunda razão mais forte para descartar D** (`ARCHITECTURE.md` §1).

### 2.9 LGPD e minimização

| Requisito | Como atender **[REC]** |
|---|---|
| **Minimização** | Coletar **apenas** o que o Asaas exige. **[ASAAS]** Obrigatórios: `name`, `cpfCnpj`. Endereço **só quando o método exigir**. ⚠ **Não pedir dado "porque pode ser útil um dia".** |
| ⚠ **Mascaramento em log** | CPF/CNPJ mascarado. E-mail/telefone parciais. ⚠ **Nunca o payload inteiro do webhook em log de texto** — ele contém dados pessoais. (Ele **está** em `webhook_events.payload`, **no banco, protegido por RLS** — que é o lugar certo.) |
| **Retenção** | Dados financeiros têm guarda legal. ⚠ `webhook_events.payload` contém dados pessoais → definir política de retenção/anonimização. **[HIP]** O prazo **necessita orientação jurídica** — **não é decisão técnica**. |
| **Acesso** | Só `role='admin'`, com RLS. Consultas administrativas a dado financeiro **auditáveis**. |
| **Trilha** | `audit_logs`: **quem**, **o quê**, **quando**, ⚠ **e por quê** (`reason` obrigatório em ação financeira). |
| ⚠ **Comunicação** | **[ASAAS]** O Asaas **envia notificações próprias ao pagador**. ⚠ **Sem política, o cliente recebe DUAS mensagens de cada evento.** → `DATA_MODEL.md` §4.9 e **DEC-013**. |

### 2.10 Mensagens de erro

**[REC]** Nunca expor ao cliente: resposta crua do Asaas, stack trace, id interno de outra entidade, ou o motivo técnico de uma recusa de cartão (**pode revelar informação do emissor**).

- **Cliente:** "Não foi possível processar o pagamento. Tente novamente ou fale conosco."
- **Log/equipe:** o erro completo, correlacionado.

⚠ **E, sobretudo: NUNCA dizer "falhou" quando o resultado é ambíguo.** Num timeout, **a cobrança pode ter sido criada** (`PAYMENT_FLOWS.md` §6.3). ⚠ **Dizer "falhou" leva o cliente a tentar de novo — e é assim que se cobra duas vezes.** A mensagem correta é **"estamos confirmando seu pagamento"**.

---

## 3. Variáveis de ambiente propostas

**[REC]** Seguindo a convenção **[REPO]** existente (segredos **sem** `NEXT_PUBLIC_`; leitura *lazy* e tipada num `env.ts` com `server-only`).

| Nome | Finalidade | Ambiente | Escopo | Obrig. | Onde | Risco | Validação |
|---|---|---|---|---|---|---|---|
| `ASAAS_API_KEY` | Header `access_token` | Sandbox **e** Produção, ⚠ **valores distintos** | **Servidor** | **Sim** | `.env.local` + infra | 🔴 **CRÍTICO** — vazou = cobranças e estornos em nome da ANTERO | Presença; falha no boot. ⚠ **Nunca logar.** ⚠ **Confirmar ausência no bundle.** |
| `ASAAS_API_URL` | URL base | Por ambiente | Servidor | **Sim** | idem | Baixo | **[ASAAS]** `https://api-sandbox.asaas.com/v3` \| `https://api.asaas.com/v3`. ⚠ Continua **configurável** (é o que permite trocar de ambiente sem recompilar). Validar **HTTPS**. |
| `ASAAS_ENVIRONMENT` | `sandbox` \| `production` | Ambos | Servidor | **Sim** | idem | Baixo | ⚠ **Guarda: `production` + `NODE_ENV !== 'production'` → FALHAR O BOOT.** |
| `ASAAS_WEBHOOK_TOKEN` | Valida `asaas-access-token` | Por ambiente, ⚠ **valores distintos** | **Servidor** | **Sim** | idem | 🔴 **CRÍTICO** — vazou = **qualquer um forja eventos e marca cobranças como pagas** | Presença + comprimento mínimo. ⚠ **Comparação em tempo constante.** ⚠ **Nunca logar.** |
| ⚠ **`SUPABASE_SERVICE_ROLE_KEY`** | ⚠ **Escrita sem sessão** (webhook, outbox, reconciliação) | Ambos | **Servidor** | **Sim** (ver DEC-008) | idem | 🔴 **CRÍTICO — o maior do projeto.** ⚠ **Ignora TODA a RLS** | ⚠ **`import 'server-only'`** obrigatório. Encapsulada numa única função. ⚠ **Nunca em log.** |
| `NEXT_PUBLIC_SITE_URL` | **[REPO]** já existe | — | Público | Sim | — | Baixo | Usada nos `callback` URLs do Checkout. |

⚠ **[REC] Regras:**
- ⚠ **NENHUMA dessas variáveis pode ter o prefixo `NEXT_PUBLIC_`** (exceto a que já existe). **Todas** são segredos de servidor.
- `.env.example` ganha os **nomes** com comentário — ⚠ **nunca os valores**.
- **[REPO]** `.env` e `.env.local` já não são versionados. **Manter.**
- Validar **todas** no boot, com mensagem clara — ⚠ o padrão de `src/features/auth/lib/env.ts:10-18` **já faz exatamente isso** e deve ser replicado.

⚠ **Nenhum valor de variável existente foi lido, exibido ou registrado nesta análise.**

---

## 4. Checklist obrigatório antes da produção

⚠ **Nenhum item marcado — nada foi implementado.**

**Bloqueantes (F0):**
- [ ] ⚠ `profiles` com **`role IN ('pending','admin','cliente')`, DEFAULT `'pending'`** **(S1)**
- [ ] ⚠ **Usuário não pode alterar o próprio `role`/`organization_id`** (política de `UPDATE`)
- [ ] ⚠ **Bootstrap do primeiro admin** definido e documentado
- [ ] ⚠ **RLS em TODAS as tabelas**, negando por padrão, exigindo `role IN ('admin','cliente')`
- [ ] ⚠ **Teste: um `pending` não lê NADA**
- [ ] ⚠ **Teste: cliente da empresa A não lê dados da empresa B**
- [ ] Proxy ***fail closed*** em produção **(S2, DEC-010)**
- [ ] **Um único lockfile** **(S5)** — ⚠ **antes de instalar qualquer coisa**
- [ ] Representação monetária em centavos **(S6, DEC-006)**

**Da integração:**
- [ ] `ASAAS_API_KEY` só no servidor, em módulo com **`server-only`**
- [ ] ⚠ **Confirmado que a chave NÃO aparece no bundle do cliente**
- [ ] Sandbox e Produção com chaves e tokens **separados**
- [ ] ⚠ Guarda impedindo credencial de produção em ambiente de dev
- [ ] Webhook valida `asaas-access-token` em **tempo constante**
- [ ] Verificação de ambiente no webhook
- [ ] ⚠ **DEC-008 decidida e implementada** (chave privilegiada isolada + funções endurecidas)
- [ ] ⚠ **Nenhuma função `SECURITY DEFINER` executável por `anon`** (verificado no schema)
- [ ] Validação de schema em toda entrada **(DEC-007)** — ⚠ **inclusive o nº de parcelas**
- [ ] Rate limiting (⚠ **sem estrangular o Asaas legítimo**)
- [ ] ⚠ Valores **sempre** calculados no servidor; o cliente escolhe **dentro** do autorizado
- [ ] Logs sem segredos e sem dados pessoais completos
- [ ] `audit_logs` em toda ação financeira, com `reason` e responsável
- [ ] ⚠ Alertas: erro de webhook · **falha de outbox** · chargeback · falhas consecutivas ≥ 5
- [ ] ⚠ **Política de notificação definida** — cliente **não** recebe mensagem duplicada **(DEC-013)**
- [ ] Testes de segurança de `TESTING.md` §3 **passando**
