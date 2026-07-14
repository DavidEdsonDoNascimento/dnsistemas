# Planejamento da integração de pagamentos com o Asaas

## 1. Objetivo

Quero planejar a integração da plataforma da **Antero Sistemas** com o **Asaas** para receber pagamentos relacionados a projetos de desenvolvimento de software sob medida.

Anteriormente, existia a intenção de utilizar o Stripe. Essa decisão foi alterada.

O provedor principal de pagamentos da plataforma será o **Asaas**, pois precisamos atender adequadamente ao mercado brasileiro, trabalhando com pagamentos em reais e métodos locais.

A integração deverá considerar:

* cartão de crédito;
* parcelamento em 10 vezes ou mais, quando permitido pelo Asaas e pelas condições da conta;
* Pix;
* boleto bancário;
* pagamentos à vista;
* pagamentos parcelados;
* entrada mais saldo parcelado;
* cobranças mensais vinculadas a projetos;
* possível recorrência no futuro;
* acompanhamento das cobranças pela área do cliente;
* acompanhamento administrativo pela equipe da Antero.

## 2. Natureza desta etapa

Esta etapa é exclusivamente de:

* investigação do projeto existente;
* levantamento técnico;
* análise arquitetural;
* consulta à documentação oficial do Asaas;
* identificação do que já existe;
* planejamento da integração;
* criação da documentação permanente do planejamento.

Nesta etapa:

* não implemente a integração;
* não instale dependências;
* não altere arquivos de código;
* não altere arquivos de configuração;
* não crie migrations;
* não modifique o banco de dados;
* não remova código relacionado ao Stripe;
* não crie endpoints;
* não implemente webhooks;
* não implemente telas;
* não altere variáveis de ambiente;
* não faça commit;
* não faça push;
* não abra pull request.

A única alteração permitida é a criação ou atualização dos arquivos Markdown destinados à documentação deste planejamento.

## 3. Primeiras ações obrigatórias

Antes de produzir qualquer conclusão:

1. Leia integralmente este arquivo `003_integration.md`.
2. Leia integralmente o `CLAUDE.md`.
3. Localize e leia os arquivos de documentação existentes no projeto.
4. Identifique as convenções arquiteturais e organizacionais já utilizadas.
5. Analise a estrutura real do repositório.
6. Verifique o estado atual do Git antes de iniciar.
7. Registre quais arquivos já estavam modificados antes desta análise.
8. Não reverta alterações preexistentes feitas por outras pessoas.
9. Não presuma que a estrutura descrita neste documento já existe.
10. Não proponha uma arquitetura genérica sem antes compreender o projeto atual.

As conclusões devem ser fundamentadas em evidências encontradas no repositório.

## 4. Análise da stack atual

Identifique e documente:

* framework utilizado;
* versão do framework;
* linguagem;
* gerenciador de pacotes;
* estrutura de rotas;
* estratégia de renderização;
* organização entre componentes de servidor e cliente;
* banco de dados;
* ORM ou cliente de banco;
* sistema de autenticação;
* uso de Supabase;
* APIs existentes;
* Route Handlers;
* Server Actions;
* validação de dados;
* organização de serviços;
* organização de repositórios;
* organização de casos de uso;
* tratamento de erros;
* gerenciamento de variáveis de ambiente;
* estratégia de migrations;
* políticas RLS;
* testes existentes;
* sistema de logs;
* observabilidade;
* hospedagem;
* configuração da Vercel;
* integrações externas já existentes.

Não faça suposições.

Para cada descoberta importante, apresente:

* caminho do arquivo;
* função, componente, tabela, classe ou símbolo relacionado;
* trecho ou intervalo de linhas, quando possível;
* explicação do que foi encontrado;
* impacto dessa descoberta na integração com o Asaas.

## 5. Localização da área autenticada

Lembro que o projeto possui ou chegou a possuir:

* rota `/login`;
* dashboard;
* autenticação;
* área interna para clientes;
* possível preparação para pagamentos com Stripe.

Faça uma busca completa no repositório.

Identifique:

* onde está a rota `/login`;
* onde está o dashboard;
* quais outras rotas autenticadas existem;
* como o usuário é autenticado;
* como a sessão é criada;
* como a sessão é validada;
* como as rotas são protegidas;
* middlewares existentes;
* callbacks de autenticação;
* redirecionamentos;
* integração com Google, caso exista;
* integração com Supabase Auth, caso exista;
* tabelas relacionadas a usuários;
* tabelas de perfis;
* tabelas de empresas;
* tabelas de clientes;
* papéis ou permissões;
* diferença entre administrador e cliente;
* políticas RLS;
* componentes incompletos;
* páginas ainda não utilizadas;
* estruturas planejadas, mas não implementadas.

Documente o fluxo atual no seguinte formato:

`login → autenticação → criação da sessão → proteção da rota → dashboard → carregamento dos dados → aplicação das permissões`

Informe:

* o que já funciona;
* o que está incompleto;
* o que pode ser reaproveitado;
* o que precisa ser corrigido antes da integração;
* quais riscos de segurança existem.

## 6. Busca por Stripe e implementações de pagamento

Faça uma busca ampla no repositório pelos termos:

* `stripe`;
* `Stripe`;
* `STRIPE`;
* `STRIPE_SECRET_KEY`;
* `STRIPE_PUBLISHABLE_KEY`;
* `STRIPE_WEBHOOK_SECRET`;
* `checkout`;
* `payment`;
* `payments`;
* `billing`;
* `subscription`;
* `invoice`;
* `webhook`;
* `customer`;
* `price`;
* `product`;
* `installment`;
* `charge`;
* `transaction`;
* `pagamento`;
* `pagamentos`;
* `cobrança`;
* `cobranca`;
* `parcela`;
* `parcelamento`;
* `assinatura`;
* `fatura`;
* `cliente`;
* `transação`;
* `transacao`.

Verifique:

* dependências instaladas;
* arquivos de configuração;
* variáveis de ambiente referenciadas;
* serviços;
* adaptadores;
* classes;
* funções;
* Server Actions;
* API Routes;
* Route Handlers;
* componentes;
* páginas;
* hooks;
* schemas;
* tipos;
* migrations;
* tabelas;
* webhooks;
* documentação;
* testes;
* mocks;
* código comentado;
* código aparentemente não utilizado.

Para cada ocorrência relevante, documente:

1. caminho do arquivo;
2. símbolo ou trecho relacionado;
3. finalidade aparente;
4. se está em uso;
5. se está incompleto;
6. se pode ser reaproveitado;
7. se deve ser adaptado;
8. se deverá ser removido futuramente;
9. risco de removê-lo;
10. dependências relacionadas.

Não remova nem modifique nada nesta etapa.

## 7. Consulta à documentação oficial do Asaas

Consulte a documentação oficial e atual do Asaas.

Utilize prioritariamente fontes oficiais do Asaas.

Analise pelo menos:

* autenticação da API;
* API Key;
* diferenças entre Sandbox e Produção;
* URLs de cada ambiente;
* criação de clientes;
* atualização de clientes;
* consulta de clientes;
* prevenção contra clientes duplicados;
* cobranças avulsas;
* cobranças parceladas;
* cartão de crédito;
* Pix;
* boleto;
* assinaturas;
* recorrência;
* checkout hospedado;
* links de pagamento;
* página de pagamento;
* `invoiceUrl`;
* `externalReference`;
* webhooks;
* autenticação de webhooks;
* tokens de webhook;
* idempotência;
* eventos de pagamento;
* status de cobrança;
* estornos;
* reembolsos;
* chargebacks;
* cobranças vencidas;
* cancelamentos;
* exclusão de cobranças;
* antecipação de recebíveis;
* limites de parcelamento;
* juros;
* quem pode assumir os juros;
* consulta e conciliação de cobranças;
* comportamento em caso de falha;
* tentativas de reenvio de webhooks;
* regras que podem variar conforme a conta.

Não presuma que um número específico de parcelas estará sempre disponível.

A quantidade máxima de parcelas deverá ser tratada como uma configuração ou limitação externa, e não como uma constante fixa espalhada pelo código.

Para cada informação relevante retirada da documentação oficial, registre:

* título do recurso;
* link oficial;
* data da consulta;
* resumo da regra;
* impacto na arquitetura;
* pontos que ainda precisam ser confirmados em uma conta real do Asaas.

Diferencie claramente:

* regras confirmadas na documentação;
* comportamentos que dependem da conta;
* recomendações arquiteturais;
* hipóteses ainda não confirmadas.

## 8. Comparação das formas de integração

Compare estas estratégias.

### Estratégia A — Checkout ou página de pagamento hospedada pelo Asaas

O cliente inicia o pagamento dentro da plataforma da Antero e é direcionado para um ambiente seguro do Asaas.

### Estratégia B — Checkout integrado na plataforma da Antero

O cliente informa os dados necessários dentro da interface da Antero, e o backend envia as informações ao Asaas.

### Estratégia C — Link de pagamento

A plataforma gera uma cobrança ou link de pagamento e apresenta o endereço ao cliente no dashboard ou por e-mail.

Para cada estratégia, avalie:

* segurança;
* experiência do usuário;
* complexidade técnica;
* prazo de implementação;
* manutenção;
* responsabilidade sobre dados do cartão;
* requisitos de conformidade;
* exposição a dados sensíveis;
* personalização;
* compatibilidade com Pix;
* compatibilidade com boleto;
* compatibilidade com parcelamento;
* compatibilidade com entrada mais saldo;
* integração com o dashboard;
* facilidade de homologação;
* dependência da interface do Asaas;
* riscos operacionais.

Ao final, recomende a estratégia mais adequada para a primeira versão.

Priorize:

* segurança;
* simplicidade operacional;
* menor exposição a dados financeiros;
* rapidez de homologação;
* boa experiência para o cliente;
* possibilidade de evoluir posteriormente.

A Antero não deve armazenar:

* CVV;
* número completo do cartão;
* dados sensíveis desnecessários;
* credenciais do cliente;
* informações que deveriam permanecer sob responsabilidade do provedor.

## 9. Contexto de negócio da Antero

A plataforma não será um e-commerce tradicional.

Os pagamentos serão referentes a projetos de software sob medida.

Considere o seguinte fluxo de negócio:

1. A equipe da Antero cadastra uma empresa ou cliente.
2. A equipe cria um projeto.
3. O projeto recebe uma proposta comercial.
4. A proposta define valor e condições de pagamento.
5. O cliente recebe acesso à plataforma.
6. O cliente entra na área autenticada.
7. O cliente visualiza o projeto.
8. O cliente visualiza a proposta aprovada.
9. O cliente visualiza as condições de pagamento permitidas.
10. O cliente seleciona uma condição disponível.
11. O backend valida o projeto e a autorização do cliente.
12. O backend calcula os valores no servidor.
13. O backend cria ou localiza o cliente correspondente no Asaas.
14. O backend cria a cobrança ou plano de pagamento.
15. O cliente realiza o pagamento em ambiente seguro.
16. O Asaas envia eventos por webhook.
17. A plataforma processa os eventos de forma idempotente.
18. O status financeiro é atualizado.
19. O cliente acompanha parcelas, vencimentos e pagamentos.
20. A equipe da Antero acompanha as cobranças na área administrativa.

Analise como esse fluxo se encaixa na arquitetura atual.

## 10. Condições comerciais que devem ser suportadas

A arquitetura deve ser planejada para suportar os modelos abaixo, mesmo que nem todos sejam implementados na primeira versão.

### 10.1 Pagamento à vista

* Pix;
* boleto;
* cartão de crédito em uma parcela.

### 10.2 Parcelamento tradicional no cartão

Exemplo:

* projeto de R$ 20.000;
* pagamento em 10 parcelas;
* a venda total é processada como parcelamento no cartão.

### 10.3 Entrada mais saldo parcelado

Exemplo:

* valor do projeto: R$ 20.000;
* entrada de 30% via Pix;
* saldo restante parcelado em cartão.

### 10.4 Cobranças mensais vinculadas ao projeto

Exemplo:

* entrada inicial;
* pagamentos mensais durante a execução;
* cada mensalidade possui vencimento e status próprios.

### 10.5 Pagamento por etapas ou marcos

Exemplo:

* primeira parcela na contratação;
* segunda parcela na aprovação do design;
* terceira parcela na homologação;
* última parcela na entrega.

### 10.6 Recorrência futura

Exemplo:

* manutenção mensal;
* suporte;
* hospedagem;
* evolução contínua;
* licença de software.

Não trate como equivalentes:

* parcelamento tradicional no cartão;
* recorrência mensal;
* cobrança mensal independente;
* pagamento por etapas.

Explique como cada modelo deverá ser representado no domínio, no banco de dados e na interface.

## 11. Análise do domínio atual

Antes de propor novas entidades, identifique se o projeto já possui conceitos equivalentes a:

* usuário;
* perfil;
* empresa;
* organização;
* cliente;
* projeto;
* proposta;
* orçamento;
* contrato;
* pagamento;
* cobrança;
* parcela;
* assinatura;
* plano;
* transação;
* produto;
* serviço.

Documente:

* entidades existentes;
* tabelas existentes;
* tipos existentes;
* relacionamentos;
* responsabilidades atuais;
* inconsistências;
* nomes que possam causar confusão;
* possíveis conflitos entre o domínio interno e o modelo do Asaas.

Não crie entidades duplicadas sem justificar.

## 12. Modelo de dados proposto

Após analisar o banco atual, apresente uma proposta de modelo de dados.

A proposta pode conter entidades equivalentes a:

* `users`;
* `profiles`;
* `organizations`;
* `clients`;
* `projects`;
* `proposals`;
* `contracts`;
* `payment_terms`;
* `payment_plans`;
* `installments`;
* `charges`;
* `transactions`;
* `payment_provider_customers`;
* `webhook_events`;
* `refunds`;
* `audit_logs`.

Não é obrigatório utilizar esses nomes.

Para cada tabela nova ou alteração sugerida, detalhe:

* objetivo;
* campos;
* tipos;
* campos obrigatórios;
* campos opcionais;
* chave primária;
* chaves estrangeiras;
* relacionamentos;
* índices;
* restrições;
* valores únicos;
* status;
* campos de auditoria;
* campos de criação e atualização;
* campos relacionados ao Asaas;
* campos de referência externa;
* estratégia de exclusão;
* política RLS;
* quem pode ler;
* quem pode criar;
* quem pode atualizar;
* quem pode executar ações administrativas;
* como evitar duplicidade;
* como preservar histórico.

Não escreva migrations nesta etapa.

Valores monetários não devem utilizar ponto flutuante impreciso.

Analise o padrão atual do projeto e recomende uma representação segura, como:

* valor inteiro em centavos;
* tipo decimal adequado no banco.

Justifique a escolha.

## 13. Separação entre domínio interno e Asaas

A plataforma não deve depender diretamente dos status brutos do Asaas em todas as regras de negócio.

Proponha:

* estados internos para projetos;
* estados internos para propostas;
* estados internos para planos de pagamento;
* estados internos para parcelas;
* estados internos para cobranças;
* estados internos para transações;
* mapeamento dos status do Asaas;
* mapeamento dos eventos do Asaas;
* comportamento para status desconhecidos;
* comportamento para novos eventos adicionados pelo Asaas;
* armazenamento do payload original;
* preservação do histórico;
* estratégia para conciliação;
* estratégia para substituir ou adicionar outro provedor no futuro.

Avalie, conforme a arquitetura real do projeto, a necessidade de estruturas equivalentes a:

* `PaymentProvider`;
* `AsaasPaymentProvider`;
* `PaymentService`;
* `CustomerService`;
* `ChargeService`;
* `WebhookProcessor`;
* `PaymentReconciliationService`.

Não crie abstrações apenas por antecipação.

Para cada camada sugerida, explique:

* problema que resolve;
* razão para existir;
* impacto;
* custo de manutenção;
* alternativas mais simples;
* momento correto de introdução.

## 14. Integração de clientes com o Asaas

Planeje como relacionar um cliente interno da Antero com um cliente no Asaas.

Considere:

* pessoa física;
* pessoa jurídica;
* CPF;
* CNPJ;
* nome;
* razão social;
* nome fantasia;
* e-mail;
* telefone;
* celular;
* endereço;
* CEP;
* número;
* complemento;
* cidade;
* estado;
* identificador interno;
* identificador do cliente no Asaas;
* `externalReference`;
* atualização de dados;
* sincronização;
* prevenção contra duplicidade;
* dados obrigatórios conforme o método de pagamento;
* cliente existente no Asaas;
* cliente removido ou bloqueado no Asaas;
* divergência de dados.

Explique:

* qual sistema será a fonte principal de cada dado;
* quando os dados serão enviados ao Asaas;
* quando serão atualizados;
* como impedir duplicidade;
* como lidar com falhas parciais;
* como preservar o vínculo entre os sistemas.

## 15. Criação de cobranças

Planeje como a plataforma deverá criar uma cobrança.

O fluxo deve considerar:

1. usuário autenticado;
2. validação da sessão;
3. autorização de acesso ao projeto;
4. confirmação de que a proposta foi aprovada;
5. carregamento da condição de pagamento no servidor;
6. cálculo do valor no servidor;
7. validação da quantidade de parcelas;
8. validação dos métodos permitidos;
9. validação do estado atual do projeto;
10. criação de chave idempotente interna;
11. localização ou criação do cliente no Asaas;
12. criação da cobrança;
13. armazenamento dos identificadores retornados;
14. armazenamento do estado inicial;
15. retorno ao frontend apenas dos dados necessários;
16. prevenção contra múltiplos cliques;
17. prevenção contra cobranças duplicadas;
18. tratamento de timeout;
19. tratamento de resposta ambígua;
20. conciliação posterior.

Nunca confie em valores enviados pelo frontend.

O frontend não deve decidir:

* preço;
* desconto;
* entrada;
* número máximo de parcelas;
* status;
* identificador do cliente no Asaas;
* projeto relacionado;
* permissão para realizar o pagamento.

Esses dados devem ser determinados e validados no servidor.

## 16. Idempotência

A arquitetura precisa prevenir duplicidades.

Planeje idempotência para:

* criação de cliente;
* criação de cobrança;
* criação de plano de pagamento;
* processamento de webhook;
* solicitação de reembolso;
* cancelamento;
* reprocessamento manual;
* conciliação.

Explique:

* como gerar a chave;
* onde armazenar;
* por quanto tempo manter;
* quais campos devem ser únicos;
* como responder a uma repetição legítima;
* como tratar duas requisições simultâneas;
* como tratar timeout após o Asaas ter processado a operação;
* como verificar o resultado antes de tentar novamente.

## 17. Webhooks

A integração deverá utilizar webhooks para manter o sistema sincronizado.

Planeje:

* rota do webhook;
* método HTTP;
* autenticação;
* token;
* validação do payload;
* validação de headers;
* verificação do ambiente;
* armazenamento do evento recebido;
* identificador único do evento;
* idempotência;
* processamento duplicado;
* eventos fora de ordem;
* eventos atrasados;
* eventos desconhecidos;
* payload inválido;
* resposta HTTP;
* tempo de resposta;
* retries;
* falha no banco;
* falha interna;
* logs;
* auditoria;
* alertas;
* conciliação posterior;
* processamento síncrono;
* eventual processamento assíncrono;
* limitações reais da infraestrutura atual.

Considere que:

* o mesmo evento pode ser entregue mais de uma vez;
* eventos podem chegar fora de ordem;
* o webhook pode chegar antes do retorno visual ao cliente;
* o webhook deve ser considerado mais confiável que o estado apresentado pelo frontend;
* a rota precisa responder rapidamente;
* falhas repetidas precisam ser observáveis;
* o Asaas pode adicionar novos tipos de evento no futuro.

Liste:

* eventos necessários para a primeira versão;
* eventos recomendados para fases posteriores;
* como cada evento afeta os estados internos;
* quais eventos exigem ação administrativa;
* quais eventos apenas registram histórico.

Não implemente a rota nesta etapa.

## 18. Reconciliação financeira

Webhooks não devem ser o único mecanismo de consistência.

Planeje uma estratégia de reconciliação capaz de:

* consultar cobranças no Asaas;
* comparar com o banco interno;
* localizar cobranças sem atualização;
* localizar webhooks não processados;
* localizar pagamentos divergentes;
* corrigir estados inconsistentes;
* registrar ajustes;
* preservar auditoria;
* permitir execução manual;
* futuramente permitir execução agendada.

Explique:

* quando a reconciliação deve ocorrer;
* quais registros devem ser consultados;
* como limitar o volume;
* como evitar alteração indevida;
* como registrar divergências;
* quais ações podem ser automáticas;
* quais ações devem exigir intervenção administrativa.

## 19. Segurança

Faça uma análise específica de segurança.

Considere:

* API Key apenas no servidor;
* separação entre Sandbox e Produção;
* variáveis de ambiente;
* prevenção contra exposição no bundle;
* proteção da área autenticada;
* autorização por projeto;
* autorização por empresa;
* autorização administrativa;
* RLS;
* validação de entrada;
* schemas de validação;
* CSRF, quando aplicável;
* rate limiting;
* prevenção contra cobranças duplicadas;
* proteção do webhook;
* logs sem dados sensíveis;
* mascaramento de dados;
* auditoria;
* LGPD;
* retenção mínima de dados;
* minimização de dados pessoais;
* acesso administrativo;
* trilha de alterações;
* separação de responsabilidades;
* tratamento de erros;
* mensagens apresentadas ao cliente;
* ausência de CVV persistido;
* ausência de número completo do cartão persistido;
* ausência de segredos no frontend;
* ausência de confiança em status enviados pelo navegador.

Analise também a segurança atual de:

* login;
* callbacks;
* middleware;
* dashboard;
* consultas ao banco;
* RLS;
* papéis;
* permissões;
* Server Actions;
* endpoints.

Liste problemas existentes que precisam ser resolvidos antes da integração.

## 20. Dashboard do cliente

Planeje como o dashboard do cliente poderá apresentar:

* empresa;
* projeto;
* proposta;
* contrato;
* valor contratado;
* entrada;
* saldo;
* condição de pagamento;
* método escolhido;
* quantidade de parcelas;
* valor das parcelas;
* vencimentos;
* parcelas pagas;
* parcelas pendentes;
* parcelas vencidas;
* status financeiro;
* botão para pagar;
* link para pagamento;
* segunda via;
* boleto;
* código Pix;
* Pix copia e cola, quando aplicável;
* comprovantes;
* histórico;
* cancelamentos;
* reembolsos;
* mensagens de erro;
* tentativa novamente;
* contato com a Antero.

Planeje os estados visuais:

* carregando;
* sem cobrança;
* aguardando pagamento;
* pagamento em análise;
* pagamento confirmado;
* pagamento vencido;
* pagamento cancelado;
* pagamento reembolsado;
* pagamento contestado;
* erro temporário;
* integração indisponível.

A interface deverá aproveitar:

* identidade visual existente;
* componentes existentes;
* padrões de layout;
* responsividade;
* acessibilidade;
* convenções atuais do projeto.

Não implemente telas nesta etapa.

## 21. Área administrativa

Analise se já existe uma área administrativa.

Caso exista, documente:

* rotas;
* componentes;
* permissões;
* limitações;
* dados disponíveis.

Caso não exista, proponha uma área em que a equipe da Antero possa:

* cadastrar empresa;
* cadastrar cliente;
* cadastrar projeto;
* criar proposta;
* registrar contrato;
* definir valor;
* definir entrada;
* definir saldo;
* escolher métodos permitidos;
* definir quantidade máxima de parcelas;
* definir vencimentos;
* determinar quem assume juros;
* gerar plano de pagamento;
* gerar cobrança;
* acompanhar cobranças;
* consultar parcelas;
* identificar inadimplência;
* reenviar link;
* gerar segunda via;
* cancelar cobrança;
* solicitar reembolso;
* registrar pagamento externo;
* registrar pagamento manual;
* consultar eventos;
* consultar erros;
* reprocessar eventos;
* executar conciliação;
* visualizar auditoria.

Ações financeiras sensíveis devem exigir:

* autenticação;
* autorização administrativa;
* confirmação;
* auditoria;
* registro do responsável;
* data;
* motivo.

## 22. Variáveis de ambiente

Liste as variáveis de ambiente provavelmente necessárias.

Para cada variável, informe:

* nome sugerido;
* finalidade;
* ambiente;
* Sandbox ou Produção;
* servidor ou frontend;
* obrigatória ou opcional;
* onde deverá ser configurada;
* risco de exposição;
* estratégia de validação.

Considere nomes equivalentes a:

* `ASAAS_API_KEY`;
* `ASAAS_API_URL`;
* `ASAAS_ENVIRONMENT`;
* `ASAAS_WEBHOOK_TOKEN`;
* `ASAAS_WEBHOOK_URL`.

Esses nomes são apenas referências.

Avalie as convenções já usadas no projeto antes de recomendar os nomes finais.

Não crie nem modifique arquivos `.env`.

Não revele valores existentes.

Não inclua segredos na documentação.

## 23. Testes

Proponha uma estratégia completa de testes.

### Testes unitários

Considere:

* cálculo de entrada;
* cálculo de saldo;
* divisão em parcelas;
* arredondamento;
* transição de estados;
* mapeamento de status;
* idempotência;
* autorização;
* validação.

### Testes de integração

Considere:

* criação de cliente;
* atualização de cliente;
* criação de cobrança;
* consulta de cobrança;
* criação de parcelamento;
* Pix;
* boleto;
* cartão;
* webhook;
* cancelamento;
* reembolso;
* conciliação.

### Testes de segurança

Considere:

* usuário acessando projeto de outra empresa;
* alteração de valor pelo frontend;
* criação duplicada;
* webhook sem autenticação;
* payload inválido;
* tentativa de acessar rotas administrativas;
* exposição de variáveis;
* bypass de RLS;
* replay de evento.

### Testes de resiliência

Considere:

* timeout;
* API indisponível;
* resposta inválida;
* webhook duplicado;
* evento fora de ordem;
* falha do banco;
* operação parcialmente concluída;
* reconciliação;
* retry.

### Sandbox

Planeje o fluxo completo em Sandbox:

1. criação do cliente;
2. criação da cobrança;
3. simulação de pagamento;
4. recebimento de webhook;
5. atualização interna;
6. exibição no dashboard;
7. cancelamento;
8. reembolso, quando suportado;
9. conciliação.

Defina os critérios necessários para liberar Produção.

Não utilize dinheiro real durante o desenvolvimento e a homologação.

## 24. Migração do planejamento anterior de Stripe

Após localizar todos os itens relacionados ao Stripe, apresente uma estratégia segura de transição.

Classifique cada item como:

* reutilizável sem alteração;
* reutilizável com adaptação;
* específico do Stripe;
* obsoleto;
* ainda em uso;
* remoção futura;
* risco desconhecido.

Documente:

* o que pode ser reaproveitado;
* o que precisa ser renomeado;
* o que precisa ser substituído;
* o que deve permanecer temporariamente;
* dependências que poderão ser removidas;
* variáveis que poderão ser aposentadas;
* tabelas que exigem cuidado;
* migrations que não podem ser apagadas;
* risco de quebrar o dashboard;
* risco de quebrar autenticação;
* ordem correta da transição;
* critérios para remover definitivamente os resíduos do Stripe.

Não remova nada nesta etapa.

A remoção de código do Stripe deverá ocorrer somente depois de:

* a integração com Asaas estar implementada;
* os testes estarem aprovados;
* o Sandbox estar validado;
* a Produção estar homologada;
* os dados existentes estarem protegidos;
* a remoção ter sido aprovada explicitamente.

## 25. Documentação permanente obrigatória

Todo o planejamento deve ser documentado de forma permanente dentro do repositório.

O objetivo é permitir que essa documentação seja posteriormente enviada para revisão externa, inclusive por outra inteligência artificial, sem depender do histórico desta conversa.

A documentação deve ser autossuficiente.

Não utilize frases como:

* “conforme conversamos”;
* “como você pediu”;
* “conforme o prompt”;
* “como informado anteriormente”;
* “de acordo com a conversa”.

Todo o contexto necessário deve estar escrito nos documentos.

### 25.1 Local da documentação

Antes de criar arquivos, verifique se o projeto já possui uma convenção para documentação.

Caso exista, respeite essa convenção.

Caso não exista, utilize:

```text
docs/integrations/asaas/
```

A documentação principal poderá ser:

```text
docs/integrations/asaas/PLANNING.md
```

Caso o volume torne um único arquivo difícil de consultar, utilize uma estrutura semelhante a:

```text
docs/integrations/asaas/
├── README.md
├── CURRENT_STATE.md
├── ARCHITECTURE.md
├── DATA_MODEL.md
├── PAYMENT_FLOWS.md
├── WEBHOOKS.md
├── SECURITY.md
├── IMPLEMENTATION_PLAN.md
├── TESTING.md
├── STRIPE_MIGRATION.md
├── REFERENCES.md
└── DECISIONS.md
```

Não crie vários arquivos apenas por formalidade.

Utilize um único arquivo quando isso for mais legível.

Divida a documentação somente quando a separação melhorar:

* leitura;
* manutenção;
* rastreabilidade;
* revisão;
* atualização futura.

### 25.2 Conteúdo obrigatório da documentação

A documentação deve registrar:

* data da análise;
* objetivo;
* escopo;
* itens fora do escopo;
* stack identificada;
* arquitetura atual;
* autenticação;
* login;
* dashboard;
* banco;
* migrations;
* RLS;
* entidades;
* fluxos existentes;
* inventário do Stripe;
* inventário de pagamentos;
* recursos reaproveitáveis;
* lacunas;
* riscos;
* problemas de segurança;
* documentação oficial consultada;
* links oficiais;
* data de consulta;
* regras confirmadas;
* pontos não confirmados;
* arquitetura recomendada;
* modelo de dados;
* fluxos de pagamento;
* integração de clientes;
* criação de cobranças;
* idempotência;
* webhooks;
* reconciliação;
* segurança;
* variáveis;
* testes;
* migração do Stripe;
* fases de implementação;
* decisões pendentes;
* dúvidas;
* primeiro passo recomendado.

### 25.3 Separação das informações

Em toda a documentação, diferencie claramente:

#### Estado atual confirmado no repositório

Informações comprovadas pela leitura dos arquivos.

#### Informação confirmada na documentação oficial do Asaas

Regras e recursos encontrados nas fontes oficiais.

#### Recomendação arquitetural

Decisões sugeridas com base na análise.

#### Hipótese ou ponto não confirmado

Informação que precisa de validação.

Não apresente hipóteses como fatos.

### 25.4 Evidências do repositório

Sempre que registrar uma descoberta técnica, informe:

* caminho completo do arquivo;
* símbolo;
* função;
* componente;
* tabela;
* migration;
* intervalo de linhas, quando possível;
* explicação da evidência;
* impacto na integração.

Não copie arquivos inteiros.

Registre apenas os trechos necessários.

### 25.5 Registro de decisões

Crie uma seção ou arquivo chamado `Registro de decisões`.

Cada decisão deve conter:

* identificador, como `DEC-001`;
* título;
* contexto;
* problema;
* alternativas;
* recomendação;
* justificativa;
* riscos;
* impacto;
* dependências;
* status;
* data.

Status possíveis:

* `pendente`;
* `aprovada`;
* `rejeitada`;
* `substituída`.

Todas as decisões que dependem de aprovação devem permanecer como `pendente`.

Não marque decisões como aprovadas sem autorização explícita.

### 25.6 Histórico de alterações

Inclua um histórico contendo:

* data;
* resumo;
* arquivos alterados;
* fase relacionada;
* decisões adicionadas;
* decisões alteradas;
* responsável pela alteração, quando identificável.

Nesta análise, registre a criação inicial do planejamento.

### 25.7 Checklists

O plano de implementação deve utilizar checklists Markdown.

Exemplo:

```markdown
- [ ] Criar estrutura de domínio de pagamentos
- [ ] Criar migration
- [ ] Configurar Sandbox
- [ ] Implementar cliente Asaas
```

Não marque como concluído nada que não tenha sido implementado e validado.

Como esta etapa é apenas de planejamento, os itens de implementação devem permanecer desmarcados.

## 26. Plano de implementação por fases

Apresente um plano dividido em fases pequenas e verificáveis.

Utilize uma estrutura semelhante à abaixo, ajustando-a conforme o projeto real.

### Fase 0 — Correções estruturais

Possíveis itens:

* autenticação;
* autorização;
* RLS;
* modelagem;
* organização arquitetural;
* problemas encontrados no dashboard.

### Fase 1 — Domínio de pagamentos

Possíveis itens:

* estados internos;
* entidades;
* interfaces;
* modelo de dados;
* migrations.

### Fase 2 — Ambiente Sandbox

Possíveis itens:

* credenciais;
* variáveis;
* cliente HTTP;
* configuração;
* validação de conexão.

### Fase 3 — Clientes do Asaas

Possíveis itens:

* criação;
* sincronização;
* vínculo;
* prevenção contra duplicidade.

### Fase 4 — Criação de cobranças

Possíveis itens:

* Pix;
* boleto;
* cartão;
* parcelamento;
* idempotência.

### Fase 5 — Webhooks

Possíveis itens:

* endpoint;
* autenticação;
* eventos;
* armazenamento;
* processamento;
* retries.

### Fase 6 — Dashboard do cliente

Possíveis itens:

* projeto;
* condição;
* cobrança;
* parcelas;
* status;
* links de pagamento.

### Fase 7 — Área administrativa

Possíveis itens:

* criação;
* acompanhamento;
* cancelamento;
* reembolso;
* auditoria.

### Fase 8 — Testes e homologação

Possíveis itens:

* testes;
* Sandbox;
* cenários de falha;
* segurança;
* reconciliação.

### Fase 9 — Produção

Possíveis itens:

* credenciais;
* webhooks;
* monitoramento;
* homologação;
* liberação gradual.

### Fase 10 — Remoção segura do Stripe

Possíveis itens:

* dependências;
* variáveis;
* código;
* documentação;
* limpeza final.

Para cada fase, informe:

* identificador;
* objetivo;
* pré-requisitos;
* dependências;
* arquivos provavelmente afetados;
* banco envolvido;
* endpoints envolvidos;
* alterações previstas;
* itens fora do escopo;
* riscos;
* testes;
* critérios de aceitação;
* critério de conclusão;
* decisões pendentes;
* necessidade de aprovação.

Nenhuma fase deve ser iniciada sem autorização explícita.

## 27. Entregável esperado na resposta

Ao finalizar a análise, apresente também um relatório na conversa com esta estrutura.

### A. Resumo executivo

Explique:

* estado atual;
* principais descobertas;
* riscos;
* recomendação principal;
* primeiro caminho sugerido.

### B. Arquitetura atual encontrada

Liste:

* stack;
* autenticação;
* banco;
* dashboard;
* infraestrutura;
* arquivos que comprovam as descobertas.

### C. Inventário da área autenticada

Mostre:

* rotas;
* componentes;
* tabelas;
* sessões;
* permissões;
* RLS;
* fluxo atual.

### D. Inventário de Stripe e pagamentos

Liste todas as ocorrências relevantes e classifique cada uma.

### E. Lacunas atuais

Mostre o que ainda não existe, está incompleto ou precisa de correção.

### F. Estratégia recomendada para o Asaas

Compare as alternativas e recomende o fluxo inicial.

### G. Fluxos

Apresente fluxos textuais para:

1. cadastro do cliente;
2. sincronização com o Asaas;
3. criação da cobrança;
4. pagamento;
5. webhook;
6. atualização do dashboard;
7. falha;
8. nova tentativa;
9. cancelamento;
10. reembolso;
11. conciliação.

### H. Modelo de dados

Apresente:

* tabelas;
* campos;
* relacionamentos;
* índices;
* restrições;
* RLS;
* identificadores externos.

### I. Mapeamento de estados

Mostre estados internos e sua relação com o Asaas.

### J. Segurança

Liste:

* vulnerabilidades;
* riscos;
* correções obrigatórias;
* medidas recomendadas.

### K. Plano por fases

Apresente todas as fases com critérios claros.

### L. Decisões pendentes

Apresente uma lista numerada das decisões que precisam de aprovação.

### M. Primeiro passo recomendado

Indique apenas o primeiro passo após a aprovação.

### N. Documentação criada

Liste:

* arquivos criados;
* arquivos modificados;
* resumo de cada documento;
* caminho completo;
* motivo da divisão, caso tenha criado vários arquivos.

## 28. Conferência final obrigatória

Antes de encerrar:

1. Compare o relatório da conversa com os arquivos de documentação.
2. Confirme que nenhuma descoberta importante ficou apenas na conversa.
3. Confirme que os documentos são autossuficientes.
4. Confirme que os links oficiais foram registrados.
5. Confirme que hipóteses foram identificadas como hipóteses.
6. Confirme que as decisões pendentes não foram marcadas como aprovadas.
7. Verifique o estado do Git.
8. Liste todos os arquivos alterados.
9. Confirme que nenhum arquivo de código foi alterado.
10. Confirme que nenhum arquivo de configuração foi alterado.
11. Confirme que nenhuma dependência foi instalada.
12. Confirme que nenhuma migration foi criada.
13. Confirme que nenhum segredo foi registrado.
14. Confirme que nenhuma credencial foi exposta.
15. Confirme que nenhum commit foi realizado.
16. Confirme que nenhum push foi realizado.
17. Confirme que a documentação está pronta para revisão externa.

Caso um arquivo fora da documentação tenha sido alterado acidentalmente durante esta tarefa, reverta apenas a alteração acidental feita por esta execução.

Não reverta alterações preexistentes de outros trabalhos.

## 29. Restrições finais

* Não implemente a integração.
* Não instale SDK do Asaas.
* Não instale dependências.
* Não altere `package.json`.
* Não altere arquivos de lock.
* Não altere código.
* Não altere componentes.
* Não altere páginas.
* Não altere rotas.
* Não altere middleware.
* Não altere autenticação.
* Não altere o banco.
* Não crie migrations.
* Não execute migrations.
* Não altere RLS.
* Não crie endpoints.
* Não implemente webhooks.
* Não crie conta no Asaas.
* Não configure credenciais reais.
* Não utilize Produção.
* Não modifique `.env`.
* Não exponha variáveis existentes.
* Não remova o Stripe.
* Não faça commit.
* Não faça push.
* Não abra pull request.
* Não comece nenhuma fase de implementação.
* Não marque tarefas de implementação como concluídas.
* Não apresente código completo de implementação.
* Não faça alterações fora da documentação Markdown.
* Não avance sem autorização explícita.

## 30. Instrução de execução

Execute agora apenas:

1. a análise completa do repositório;
2. a consulta à documentação oficial do Asaas;
3. o planejamento técnico;
4. a criação da documentação Markdown;
5. a apresentação do relatório final.

Ao finalizar, pare e aguarde a revisão e a aprovação do planejamento antes de sugerir qualquer alteração de código.
