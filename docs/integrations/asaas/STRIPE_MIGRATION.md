# Migração do planejamento anterior de Stripe

> Data: 14/07/2026. Rótulos: **[REPO]** · **[REC]** · **[HIP]**.

---

## 1. Resultado da busca — em uma frase

**[REPO] Não existe nenhuma implementação, nenhum planejamento e nenhum vestígio de Stripe neste repositório.**

A hipótese de que o projeto teria "possível preparação para pagamentos com Stripe" **foi investigada e não se confirmou**.

---

## 2. Método da busca

**[REPO]** Busca em **todo o repositório** (excluindo `node_modules/`, `.git/` e `.next/`), sem distinção de maiúsculas, pelos termos:

`stripe` · `Stripe` · `STRIPE` · `STRIPE_SECRET_KEY` · `STRIPE_PUBLISHABLE_KEY` · `STRIPE_WEBHOOK_SECRET` · `checkout` · `payment` · `payments` · `billing` · `subscription` · `invoice` · `webhook` · `customer` · `price` · `product` · `installment` · `charge` · `transaction` · `pagamento` · `pagamentos` · `cobrança` · `cobranca` · `parcela` · `parcelamento` · `assinatura` · `fatura` · `cliente` · `transação` · `transacao`

Verificados: dependências (`package.json`), lockfiles, arquivos de configuração, variáveis de ambiente (`.env.example`), serviços, adaptadores, classes, funções, Server Actions, API Routes, Route Handlers, componentes, páginas, hooks, schemas, tipos, migrations, tabelas, webhooks, documentação, testes, mocks, código comentado e código aparentemente não utilizado.

---

## 3. Todas as ocorrências encontradas, classificadas

Nenhuma é uma implementação de pagamento.

| # | Arquivo | Símbolo / trecho | Finalidade real | Em uso? | Incompleto? | Reaproveitável? | Adaptar? | Remover? | Risco de remover | Dependências |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `src/assets/vendor/bootstrap-icons/bootstrap-icons.json:1821` e `bootstrap-icons.scss:1855` | `"stripe": 63559` | **Nome de um glifo** do Bootstrap Icons (o ícone da marca Stripe, junto de centenas de outros) | Sim (o arquivo de ícones é usado) | Não | — | **Não** | **NÃO** | ⚠ Alto — é parte de um arquivo de biblioteca de terceiros. Editar quebraria os ícones. | Bootstrap Icons |
| 2 | `src/assets/vendor/bootstrap/css/bootstrap*.css` (várias linhas) | `.table-striped`, `--bs-table-striped-bg`, `progress-bar-stripes` | **Classes CSS do Bootstrap** ("listrado") | Sim | Não | — | Não | **NÃO** | ⚠ Alto — CSS de terceiros. | Bootstrap 5 |
| 3 | `src/assets/vendor/php-email-form/php-email-form.php` (várias) | `smtp_transaction_id`, `getLastTransactionID()` | **Código PHP do PHPMailer**, herdado do template HTML original. Nada a ver com pagamento. | **Não** — é PHP num projeto Next.js. **Código morto.** | — | Não | Não | **Sim, um dia** — mas é **outra tarefa** | Baixo, **mas fora do escopo desta integração** | Nenhuma |
| 4 | `src/features/painel/mocks/dashboard.ts:49` | `titulo: 'Fatura recebida'` | **Texto de uma atividade fictícia** numa lista mock | Sim (a tela renderiza) | — | **Não** — é dado falso | Não | Junto com os mocks, na Fase 0/6 | Baixo | — |
| 5 | `src/app/(painel)/painel/financeiro/page.tsx:81` | `description="Movimentações recentes — entradas, saídas e status de cobrança."` | **Texto descritivo** da tela | Sim | — | O **texto**, não | Não | Junto com a tela | Baixo | — |
| 6 | `src/features/auth/actions/sign-in-password.ts:16` | `Assinatura compatível com React 19 useActionState` | **Comentário** sobre a *assinatura de uma função* TypeScript | Sim | Não | — | Não | **NÃO** | — | — |
| 7 | `src/features/painel/types.ts:31-39` + `mocks/financeiro.ts` | `MovimentoFinanceiro` | **Tipo de apresentação** de uma tela mock de fluxo de caixa (entradas **e saídas**, incluindo "Infraestrutura AWS" e "Licença ferramentas"). **Não é uma cobrança.** | Sim (só para a tela mock) | É mock | ⚠ **Ver §5 — cuidado** | Ver §5 | Ver §5 | **Médio** — a tela `/painel/financeiro` quebra se removido sem substituição | `financeiro/page.tsx` |

**[REPO] Não foram encontrados:** dependência Stripe (nem no `package.json`, nem em nenhum lockfile), variável `STRIPE_*` (nem em `.env.example`), serviço, adaptador, Server Action, Route Handler, webhook, componente, hook, schema, tipo, migration, tabela, teste ou mock relacionado a pagamento **de qualquer provedor**.

---

## 4. Classificação exigida pela tarefa

| Categoria | Itens |
|---|---|
| Reutilizável sem alteração | **Nenhum item de Stripe** (não há Stripe). Reaproveitáveis do projeto em geral: autenticação, padrão de Route Handler, padrão de Server Action, padrão de `env.ts`, componentes de UI do painel. Ver `CURRENT_STATE.md` §12. |
| Reutilizável com adaptação | **Nenhum item de Stripe.** |
| **Específico do Stripe** | **NENHUM. A lista é vazia.** |
| Obsoleto | `php-email-form.php` (resíduo de template, **sem relação com pagamentos** — fora do escopo). |
| Ainda em uso | Os falsos positivos 1, 2, 6 (bibliotecas de terceiros e um comentário) — permanecem, intocados. |
| Remoção futura | Os mocks do painel (4, 5, 7), **quando** substituídos por dados reais na Fase 0/6. **Não por serem "de Stripe"** — não são —, mas por serem mocks. |
| **Risco desconhecido** | **Nenhum.** A busca foi exaustiva e o resultado é conclusivo. |

---

## 5. O único ponto que exige cuidado: `MovimentoFinanceiro`

**[REPO]** A tela `/painel/financeiro` e o tipo `MovimentoFinanceiro` são a coisa mais parecida com "pagamento" que existe no projeto. **E são uma armadilha.**

**O que eles são de fato:** um **fluxo de caixa** — entradas *e saídas*, com linhas como "Infraestrutura AWS" (saída, R$ 1.860) e "Licença ferramentas — anual" (saída, R$ 9.200). Ver `src/features/painel/mocks/financeiro.ts:26-48`. O `status` é `{ label, tone }` — **um rótulo visual, não uma máquina de estados** (`src/features/painel/types.ts:5-8`).

**O que eles não são:** uma cobrança. Um fluxo de caixa registra **dinheiro que entrou ou saiu da empresa**, por qualquer motivo. Uma cobrança é **uma dívida de um cliente específico, vinculada a um projeto, com ciclo de vida, provedor externo e webhook**. São conceitos diferentes, com donos diferentes (contabilidade × comercial).

**[REC] Recomendação: NÃO evoluir `MovimentoFinanceiro` para virar a entidade de cobrança.** Tentar isso produziria um tipo que é as duas coisas e não serve direito para nenhuma — o clássico caso em que a semelhança superficial de nomes leva à fusão indevida de conceitos.

**[REC] O caminho correto:** criar o domínio de cobranças **novo** (`DATA_MODEL.md`) e, depois, **em tarefa separada**, decidir o destino da tela `/painel/financeiro`:
- **(a)** vira o painel administrativo de **cobranças** (alimentado por `charges`), ou
- **(b)** continua sendo fluxo de caixa, e as cobranças ganham tela própria, ou
- **(c)** é removida.

**Isso é uma decisão de produto, não técnica.** → **DEC-005**, pendente.

⚠ **Risco de remover às cegas:** a tela `/painel/financeiro` está na navegação (`src/features/painel/config/navigation.ts:19`). Apagar o mock sem substituir **quebra a rota**. **Não fazer nada disso "de passagem".**

---

## 6. Estratégia de transição

**Não há transição de Stripe a fazer.** Não há o que renomear, substituir, manter temporariamente, aposentar ou migrar. Não há dependência a remover, variável a aposentar, tabela a preservar nem migration que não se possa apagar (não existem migrations).

**A integração com o Asaas é greenfield.**

**Consequências práticas:**
- ✅ **Não há risco de quebrar o dashboard** por causa de Stripe — nada nele depende de pagamento.
- ✅ **Não há risco de quebrar a autenticação** — ela é independente e será apenas **estendida** (papéis), não alterada na sua mecânica.
- ✅ **Não há ordem de transição a respeitar** — não há de onde transitar.
- ✅ **Nenhum dado existente em risco** — não existe banco.

**[REC] A "Fase 10 — Remoção segura do Stripe" do plano de tarefas está VAZIA.** Ela permanece no `IMPLEMENTATION_PLAN.md` **apenas como registro formal de que foi investigada e encerrada**, sem itens. Manter uma fase inteira para remover código que não existe seria teatro.

---

## 7. Critérios para "remover definitivamente os resíduos do Stripe"

**Já atendidos, por vacuidade** — não há resíduos:

- [x] Busca exaustiva executada em todo o repositório (§2)
- [x] Todas as ocorrências classificadas (§3)
- [x] Confirmado: **nenhuma dependência Stripe** no `package.json` nem nos lockfiles
- [x] Confirmado: **nenhuma variável `STRIPE_*`** no `.env.example`
- [x] Confirmado: **nenhum código, tabela, migration, teste ou tipo** de Stripe
- [x] Confirmado: **nenhum dado em risco** (não há banco)

**Nenhum arquivo foi removido, alterado ou tocado nesta etapa.**

---

## 8. Onde a menção ao Stripe pode ter vindo

**[HIP] Hipótese, explicitamente marcada como tal.** O `docs/PROJECT_CONTEXT.md` §6.3 (escrito em 13/07/2026, um dia antes desta análise) já registrava como pendência: *"Destino do painel interno: é protótipo de validação visual, ou haverá integração real com Supabase (tabelas, RLS)? Não há schema/migrations no repo. Necessita confirmação humana."*

Isso sugere que a "preparação para pagamentos com Stripe" existiu como **intenção ou conversa**, e **nunca chegou ao código**. **[HIP] Não confirmado, e irrelevante para o plano** — o repositório é a fonte da verdade, e ele é inequívoco.

**[HIP]** Se houver planejamento de Stripe **fora do repositório** (documento, ferramenta de gestão, conversa), ele **não foi analisado** e **necessita confirmação humana**. Se existir e contiver decisões de modelagem, vale a pena comparar com `DATA_MODEL.md` antes de aprovar.
