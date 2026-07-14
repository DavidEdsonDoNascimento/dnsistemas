# Integração de pagamentos com o Asaas — Planejamento

> **Status:** planejamento **revisado (2ª rodada)**. ⚠ **Nenhuma linha de código foi escrita. A implementação NÃO está autorizada.**
> **Data da análise:** 14/07/2026 · **Data da revisão:** 14/07/2026
> **Repositório:** `dnsis` (site institucional + painel interno da ANTERO Sistemas), branch `main`, commit `d29f678`.

---

## 1. Objetivo

Planejar a integração da plataforma da **ANTERO Sistemas** com o **Asaas** para receber pagamentos de **projetos de software sob medida** — não de um e-commerce.

O Asaas foi escolhido por atender o mercado brasileiro (real, Pix, boleto, parcelamento no cartão). Uma intenção anterior de usar **Stripe** foi abandonada — e, como se verificou, **nunca chegou ao código** (`STRIPE_MIGRATION.md`).

A integração deve suportar: cartão de crédito, parcelamento, Pix, boleto, pagamento à vista, **entrada + saldo parcelado**, cobranças mensais vinculadas a projeto, recorrência futura, acompanhamento pelo cliente e acompanhamento administrativo.

## 2. Escopo desta etapa

**Feito:** investigação do repositório, levantamento técnico, consulta à documentação oficial do Asaas, análise arquitetural, proposta de modelo de dados, plano por fases, e esta documentação — **revisada** após crítica externa.

⚠ **NÃO feito (por instrução explícita):** implementação, instalação de dependências, alteração de código ou configuração, migrations, alteração de banco, endpoints, webhooks, telas, alteração de `.env`, remoção de Stripe, commit, push ou pull request.

⚠ **A única alteração no repositório foi a criação/atualização dos arquivos Markdown deste diretório.**

## 3. Índice

| Arquivo | Conteúdo |
|---|---|
| [`CURRENT_STATE.md`](./CURRENT_STATE.md) | Estado atual **confirmado** do repositório: stack, rotas, autenticação, painel, banco, testes, **infraestrutura**. Inventário de Stripe. Lacunas. |
| [`REFERENCES.md`](./REFERENCES.md) | Documentação oficial do Asaas: links, data, regra, impacto. ⚠ **Inclui o Asaas Checkout e as três lacunas que bloqueiam a DEC-001.** |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | ⚠ Comparação das **quatro** estratégias · **máquina de estados com transições explícitas** · **padrão outbox**. |
| [`DATA_MODEL.md`](./DATA_MODEL.md) | Tabelas, campos, chaves, índices, RLS, representação monetária. ⚠ Inclui `contracts`, `payment_intents`, `outbox_events`. |
| [`PAYMENT_FLOWS.md`](./PAYMENT_FLOWS.md) | Fluxos ponta a ponta · condições comerciais · **idempotência nos 5 cenários** · reconciliação. |
| [`WEBHOOKS.md`](./WEBHOOKS.md) | Endpoint: autenticação, eventos (**incl. `CHECKOUT_*`**), idempotência, ordem, falhas, **outbox**. |
| [`SECURITY.md`](./SECURITY.md) | Segurança do que existe + requisitos da integração. ⚠ **DEC-008 reformulada.** Variáveis. |
| [`TESTING.md`](./TESTING.md) | Testes (unitário, integração, segurança, resiliência) e roteiro de homologação em Sandbox. |
| [`STRIPE_MIGRATION.md`](./STRIPE_MIGRATION.md) | ⚠ **Resultado: não existe Stripe no projeto.** Busca e classificação. |
| [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) | Plano por fases. ⚠ **F0 dividida em F0A/F0B/F0C/F0D.** |
| [`DECISIONS.md`](./DECISIONS.md) | **DEC-001 a DEC-015.** ⚠ **Todas `pendente`.** |

## 4. Convenção de rótulos

- **[REPO]** — **confirmado** pela leitura de arquivos do repositório (com caminho e linhas).
- **[ASAAS]** — **confirmado na documentação oficial** do Asaas (link e data em `REFERENCES.md`).
- **[REC]** — **recomendação** deste planejamento. **Não é fato.**
- **[HIP]** — ⚠ **hipótese ou ponto NÃO confirmado.** Precisa de validação humana ou teste real.

⚠ **Nada marcado [REC] ou [HIP] deve ser tratado como fato.**

## 5. Estado encontrado

- **[REPO]** Next.js 16.1.6 (App Router) + React 19 + TypeScript; MUI/Emotion no painel, Bootstrap de template na landing.
- **[REPO]** ⚠ **Não existe nenhum vestígio de Stripe** — nem código, nem dependência, nem variável.
- **[REPO]** A autenticação Supabase **é real e funciona** (senha + Google, proxy protegendo `/painel/*`).
- **[REPO]** ⚠ **Não existe banco de dados modelado.** Sem `supabase/`, sem migrations, sem RLS. **O painel inteiro é mock.**
- **[REPO]** ⚠ **Não existem papéis nem permissões.** **Todo usuário autenticado tem acesso idêntico ao painel** — não há distinção entre a equipe da ANTERO e um cliente.
- **[REPO]** Sem testes, sem logs, sem observabilidade.
- **[REPO]** Produção na **Vercel**, em **`https://anterosistemas.com.br`**. ⚠ **Não existe ambiente de staging.**

⚠ **Consequência central:** a integração **não pode começar pela camada de pagamentos**. A base — persistência, domínio (empresa/projeto/proposta/**contrato**), papéis, autorização e RLS — **ainda não existe**. É o conteúdo das fases **F0A–F0D** e **F1**.

## 6. Recomendação principal — ⚠ **condicional**

⚠ **A DEC-001 NÃO pode ser fechada com a informação disponível.**

A comparação agora inclui o **Asaas Checkout** (ausente da 1ª análise), e ele **muda o quadro**:

- **[ASAAS]** Na **cobrança tradicional (`invoiceUrl`)**, `billingType` é **um valor único**: ou um método **concreto**, ou **`UNDEFINED`** (que libera **tudo que a conta tem habilitado**). ⚠ **Não há como impor um subconjunto**, e **o cliente não escolhe o nº de parcelas**.
- **[ASAAS]** No **Checkout**, `billingTypes` é um **array** — ⚠ **impõe exatamente o conjunto** — e `maxInstallmentCount` permite que **o cliente escolha as parcelas**.
- ⚠ **[HIP] MAS: não foi possível confirmar que o Checkout aceita BOLETO** (todos os exemplos oficiais usam só Pix e cartão). ⚠ **E o negócio da ANTERO exige boleto.**

⚠ **Recomendar o Checkout sem saber se ele faz boleto, para um negócio que exige boleto, seria irresponsável.** A recomendação é, portanto, **condicional ao resultado de um teste em Sandbox** (entregável da **F2**) — ver `ARCHITECTURE.md` §1 e DEC-001.

**Em ambos os cenários:** o **checkout transparente é descartado** (única opção em que a ANTERO veria número de cartão e CVV) e o **link de pagamento é descartado como fluxo principal** (**[ASAAS]** aceita CPF/CNPJ duplicado, quebrando o vínculo cobrança↔projeto↔cliente).

## 7. Primeiro passo recomendado

⚠ **Não é código de pagamento.** É a **F0A** — higiene e ferramentas: escolher **um** gerenciador de pacotes (**[REPO]** hoje há **dois lockfiles**), instalar testes e validação, e ⚠ **confirmar se existe schema criado à mão no Supabase**. É a fase mais barata, mais segura, e **pré-requisito de todas as outras**.

## 8. Decisões pendentes

⚠ **Todas as 15 estão `pendente`. Nenhuma foi aprovada.** As mais bloqueantes:

1. ⚠ **DEC-001** — Estratégia de checkout. ⚠ **Bloqueada até H1/H2/H3 serem testados em Sandbox.**
2. **DEC-002** — Criar o domínio persistido (pré-requisito de tudo).
3. ⚠ **DEC-003** — Papéis, com o estado **`pending`** (*fail closed*).
4. ⚠ **DEC-008** — Escrita sem sessão. ⚠ **A decisão de segurança de maior peso.**
5. **DEC-006** — Representação monetária.

## 9. ⚠ Histórico de alterações

| Data | Resumo | Arquivos alterados | Fase | Decisões | Responsável |
|---|---|---|---|---|---|
| **14/07/2026** | **Criação inicial** do planejamento. Análise do repositório, consulta à documentação oficial, proposta de arquitetura, modelo de dados e plano por fases. ⚠ Nenhum arquivo fora de `docs/integrations/asaas/` foi alterado. | Todos (criados) | Planejamento (pré-F0) | **DEC-001 a DEC-012** adicionadas, todas `pendente` | Claude Code — tarefa `docs/tasks/003_integration.md` |
| **14/07/2026** | ⚠ **REVISÃO (2ª rodada), após crítica externa.** Correções: **(1)** incluído o **Asaas Checkout** na comparação — 4 estratégias; **(2)** ⚠ **`allowed_billing_types` REMOVIDO** (a cobrança tradicional **não consegue impor** um subconjunto de métodos) e condições remodeladas com **3 campos de parcelas** (`installment_selection_mode`, `installment_count`, `max_installments`); **(3)** ⚠ corrigida a contradição de `profiles` — novo estado **`pending`**; **(4)** ⚠ **DEC-006 corrigida** — `BigInt` **não é serializável em JSON**; TS usa `number` inteiro; **(5)** ⚠ **DEC-008 corrigida** — uma função `SECURITY DEFINER` executável por `anon` seria um **endpoint público de escrita**, pois **a chave `anon` é pública**; **(6)** ⚠ introduzido o **padrão outbox** — **nenhuma chamada HTTP dentro de transação**; **(7)** ⚠ **máquina de estados com transições explícitas** (a v1, com pesos lineares, **bloqueava `vencida → paga` e `liquidada → contestada`**); **(8)** ⚠ o efeito **"entrada paga" agora dispara por `CONFIRMED` OU `RECEIVED`** — **[ASAAS]** o **Pix pula o `CONFIRMED`**, e a v1 **nunca teria criado o parcelamento do saldo**; **(9)** ⚠ **`payment_intents` + `attempt_number`** — tentativas agora modeladas; **(10)** **`contracts`**, propostas **versionadas**, **`UNIQUE(contract_id)`** (permitindo **aditivos**), **taxas/bruto/líquido**, **estorno parcial**, **política de notificações**; **(11)** URLs, headers e `User-Agent` **confirmados**; **(12)** infraestrutura **confirmada** (Vercel, `anterosistemas.com.br`); **(13)** ⚠ **F0 dividida em F0A/F0B/F0C/F0D**. | **10 modificados:** `README.md`, `CURRENT_STATE.md`, `REFERENCES.md`, `ARCHITECTURE.md`, `DATA_MODEL.md`, `PAYMENT_FLOWS.md`, `WEBHOOKS.md`, `SECURITY.md`, `TESTING.md`, `IMPLEMENTATION_PLAN.md`, `DECISIONS.md` · **0 criados** · **0 removidos** · ⚠ **`STRIPE_MIGRATION.md` inalterado** (conclusão permanece válida) | Planejamento (pré-F0) | **DEC-001, DEC-003, DEC-004, DEC-006, DEC-008 REVISADAS** · **DEC-013, DEC-014, DEC-015 ADICIONADAS** · ⚠ **todas continuam `pendente`** | Claude Code — tarefa `docs/tasks/004_review_integration.md` |

## 10. Estado do Git

**[REPO]** Registrado para não haver dúvida sobre o que já estava modificado **antes** desta tarefa (`git status --porcelain`, branch `main`):

```
?? docs/integrations/          ← criado na tarefa 003 (esta documentação)
?? docs/tasks/002_renew_hero.md
?? docs/tasks/003_integration.md
?? docs/tasks/004_review_integration.md
?? public/videos/
?? src/components/hero/
```

⚠ `public/videos/` e `src/components/hero/` pertencem a **outro trabalho em andamento** (aparentemente a tarefa `002_renew_hero.md`), **não têm relação com pagamentos, e NÃO foram tocados**. Os arquivos em `docs/tasks/` são as tarefas em si.
