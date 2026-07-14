Leia novamente todos os arquivos em `docs/integrations/asaas/`.

A direção geral do planejamento foi aprovada, mas a implementação ainda NÃO está autorizada.

Nesta tarefa, altere apenas os arquivos Markdown da documentação. Não altere código, configurações, dependências, banco, migrations, variáveis de ambiente, lockfiles ou qualquer arquivo fora da documentação da integração.

Atualize o planejamento para resolver obrigatoriamente os pontos abaixo.

## 1. Incluir o Asaas Checkout na comparação arquitetural

A comparação atual analisa `invoiceUrl`, checkout transparente e link de pagamento, mas não analisa o produto oficial Asaas Checkout.

Consulte novamente a documentação oficial atual e compare:

1. cobrança tradicional com `invoiceUrl`;
2. Asaas Checkout;
3. link de pagamento;
4. checkout transparente.

Avalie especialmente:

* Pix;
* boleto;
* cartão;
* parcelamento;
* possibilidade de o cliente escolher o número de parcelas;
* `maxInstallmentCount`;
* controle dos métodos aceitos;
* callbacks;
* webhooks;
* vínculo com cliente, projeto, proposta e cobrança interna;
* expiração;
* experiência do usuário;
* limitações da conta.

Atualize `ARCHITECTURE.md`, `REFERENCES.md`, `DECISIONS.md`, `PAYMENT_FLOWS.md` e `IMPLEMENTATION_PLAN.md`.

Mantenha a DEC-001 como pendente até essa comparação estar completa.

## 2. Corrigir a modelagem das condições de pagamento

A documentação atual mistura:

* número fixo de parcelas;
* quantidade máxima de parcelas;
* escolha feita pelo cliente.

Diferencie claramente:

* `installment_count`: quantidade fixa;
* `max_installments`: limite máximo;
* `installment_selection_mode`: `fixed` ou `customer_choice`.

Explique como cada campo é usado em:

* cobrança tradicional;
* `invoiceUrl`;
* Asaas Checkout;
* link de pagamento.

Corrija também o fluxo em que o frontend envia somente `payment_term_id`.

Caso o cliente escolha a quantidade de parcelas dentro da plataforma, documente que o frontend poderá enviar a quantidade escolhida, mas que o servidor deverá validá-la contra a condição aprovada.

Caso a escolha aconteça na página do Asaas, documente como a quantidade final será recuperada e persistida.

## 3. Corrigir `allowed_billing_types`

Explique como as formas de pagamento permitidas serão efetivamente aplicadas.

Não mantenha um array de métodos no banco se a integração utilizada não conseguir impor esse conjunto.

Considere:

* uma condição com `billing_type` concreto;
* uma condição com `billing_type = UNDEFINED`;
* Asaas Checkout com `billingTypes`;
* condições separadas como “Pix à vista”, “Boleto à vista” e “Cartão em até 10x”.

A documentação deve impedir que uma condição comercial permita um método diferente daquele apresentado ao cliente.

## 4. Corrigir o estado inicial de `profiles`

A regra atual possui uma contradição:

* `role` possui default `cliente`;
* clientes exigem `organization_id`;
* usuários recém-criados deveriam permanecer sem organização até serem vinculados.

Proponha e documente um estado seguro para usuário ainda não vinculado.

Considere:

* `role = pending`;
* ou `access_status = pending`;
* ou permitir `organization_id` nulo, com RLS negando todo acesso.

O comportamento precisa ser `fail closed`.

Atualize `DATA_MODEL.md`, `SECURITY.md`, `DECISIONS.md`, `TESTING.md` e `IMPLEMENTATION_PLAN.md`.

## 5. Revisar a DEC-006

Mantenha valores monetários em centavos, mas não determine `bigint` como tipo obrigatório em todo o domínio TypeScript.

Proponha:

* PostgreSQL: `bigint`;
* TypeScript: `number` inteiro em centavos, dentro de `Number.MAX_SAFE_INTEGER`;
* validação com `Number.isSafeInteger`;
* conversão explícita na leitura e escrita do banco;
* nenhuma serialização direta de JavaScript `BigInt`;
* conversão para reais decimais somente na fronteira do `AsaasClient`.

Atualize os testes de serialização e conversão monetária.

## 6. Revisar a DEC-008

A recomendação atual de chamar uma função `SECURITY DEFINER` com a chave pública `anon` não pode permanecer sem uma barreira adicional.

Compare novamente:

### Opção A

`SUPABASE_SERVICE_ROLE_KEY` exclusivamente no servidor:

* módulo com `import 'server-only'`;
* cliente privilegiado isolado;
* nunca importado pelo frontend;
* nunca registrado em logs;
* utilizado apenas por webhooks, reconciliação e tarefas internas.

### Opção B

Funções `SECURITY DEFINER`:

* `search_path` fixo ou vazio;
* nomes de schemas explícitos;
* `REVOKE EXECUTE FROM PUBLIC`;
* revogação de `anon` e `authenticated`, exceto quando houver justificativa segura;
* função não exposta diretamente para chamadas públicas;
* validação contra abuso e chamadas diretas.

Não trate uma função executável pelo papel `anon` como automaticamente mais segura do que `service_role`.

Atualize a recomendação e mantenha a DEC-008 pendente.

## 7. Introduzir padrão de outbox

O webhook não deve executar chamadas HTTP para o Asaas dentro de uma transação do banco.

Adicione ao modelo uma entidade equivalente a:

`payment_commands`, `payment_jobs` ou `outbox_events`.

Ela deve conter:

* tipo do comando;
* entidade relacionada;
* payload mínimo;
* chave idempotente;
* status;
* número de tentativas;
* próximo horário de tentativa;
* erro;
* datas de criação, execução e conclusão.

Use esse mecanismo para operações como:

* criar o parcelamento do saldo depois de a entrada ser paga;
* enviar notificações;
* reprocessar sincronizações;
* executar outros efeitos externos disparados por webhooks.

O webhook deve:

1. persistir o evento;
2. atualizar o estado interno;
3. criar o comando na outbox;
4. confirmar a transação;
5. responder 2xx.

A chamada externa deve acontecer fora da transação.

## 8. Corrigir a máquina de estados

Não utilize apenas uma ordenação linear de pesos.

Documente transições explícitas.

Considere obrigatoriamente:

* `vencida → paga`;
* `vencida → liquidada`;
* `liquidada → contestada`;
* `paga → parcialmente_estornada`;
* `liquidada → parcialmente_estornada`;
* `parcialmente_estornada → estornada`;
* resolução de chargeback;
* eventos recebidos fora de ordem.

Pix pode ir diretamente de `PAYMENT_CREATED` para `PAYMENT_RECEIVED`.

Portanto, qualquer efeito associado ao conceito “entrada paga” deve ser disparado idempotentemente tanto por `PAYMENT_CONFIRMED` quanto por `PAYMENT_RECEIVED`, sem duplicar o parcelamento do saldo.

Atualize os testes correspondentes.

## 9. Corrigir a idempotência das novas tentativas

Adicione ao modelo de `charges` ou a uma entidade de tentativas:

* `attempt_number`;
* vínculo com a intenção original;
* restrição única apropriada.

A documentação precisa ser consistente entre:

* primeira tentativa;
* duplo clique;
* retry após timeout;
* nova tentativa após recusa;
* reprocessamento administrativo.

A mesma tentativa deve produzir a mesma chave. Uma nova tentativa legítima deve produzir uma chave diferente e preservar o histórico.

## 10. Revisar outras lacunas do modelo

Analise e documente:

* por que existe `UNIQUE(project_id)` para planos ativos;
* como suportar proposta adicional, aditivo ou trabalho extra no mesmo projeto;
* se a unicidade deve ser por `proposal_id` ou contrato;
* ausência de uma tabela ou entidade de contratos;
* registro do aceite da proposta;
* quem pode aprovar;
* versão da proposta aceita;
* data e usuário do aceite;
* valores bruto, líquido, taxas e antecipações;
* estorno parcial;
* notificações enviadas diretamente pelo Asaas;
* política de comunicação para evitar mensagens duplicadas.

## 11. Atualizar informações oficiais da API

Registre como regra confirmada:

* Sandbox: `https://api-sandbox.asaas.com/v3`;
* Produção: `https://api.asaas.com/v3`;
* header `access_token`;
* `Content-Type: application/json`;
* `User-Agent` identificando a aplicação.

O `AsaasClient` deve prever um `User-Agent` equivalente a:

`AnteroSistemas/1.0 (Next.js; sandbox)`

ou:

`AnteroSistemas/1.0 (Next.js; production)`

Mantenha a URL configurável por ambiente.

Registre também que não foi localizado um header oficial de idempotência para criação/processamento de pagamentos e que a integração não deve depender de um.

## 12. Resolver a infraestrutura conhecida

Registre:

* produção hospedada na Vercel;
* URL de produção: `https://anterosistemas.com.br`;
* webhook de produção previsto:
  `https://anterosistemas.com.br/api/webhooks/asaas`.

Para Sandbox, recomende uma URL estável de staging, preferencialmente:

`https://staging.anterosistemas.com.br/api/webhooks/asaas`

Não utilizar como configuração permanente uma URL variável de preview da Vercel.

A criação do ambiente e do subdomínio continua fora desta tarefa.

## 13. Dividir a Fase 0

A Fase 0 atual está ampla demais.

Reorganize em etapas menores, por exemplo:

### F0A — Higiene e ferramentas

* escolher um gerenciador de pacotes;
* manter um único lockfile;
* instalar e configurar testes;
* instalar e configurar validação;
* confirmar schema atual do Supabase.

### F0B — Identidade, papéis e autorização

* `profiles`;
* organizações;
* estado pendente;
* admin e cliente;
* RLS;
* proxy fail closed;
* bootstrap seguro do primeiro administrador.

### F0C — Domínio comercial

* organizações;
* projetos;
* propostas;
* condições de pagamento;
* contratos ou registro explícito de aceite.

### F0D — Migração do painel

* substituir os mocks uma tela por vez;
* preservar layout;
* testar acesso cruzado;
* remover mocks somente depois da substituição.

Nenhuma subfase deve ser iniciada sem aprovação explícita.

## 14. Entrega

Ao finalizar:

1. atualize o histórico de alterações;
2. liste todos os documentos modificados;
3. informe quais decisões continuam pendentes;
4. apresente as recomendações atualizadas;
5. confirme que nenhum arquivo fora da documentação foi alterado;
6. não implemente nenhuma fase;
7. pare e aguarde nova revisão.
