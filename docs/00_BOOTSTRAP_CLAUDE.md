# Bootstrap inicial do Claude Code no projeto Antero

## Objetivo

Criar a documentação base do projeto para orientar futuras tarefas com Claude Code.

Esta tarefa serve para reduzir alucinações, documentar o que existe de fato no repositório e estabelecer regras de trabalho antes de qualquer alteração no código.

## Escopo desta tarefa

Nesta primeira etapa, o Claude deve apenas analisar o projeto e propor um plano.

Não deve criar arquivos ainda.
Não deve alterar código.
Não deve alterar componentes, páginas, estilos, imagens, rotas ou configurações.
Não deve instalar dependências.
Não deve executar comandos destrutivos.

## Regras obrigatórias

1. Analise apenas o que existe no repositório.
2. Não invente informações.
3. Quando algo não estiver claro, registre como:
   - "não identificado no repositório";
   - ou "necessita confirmação humana".
4. Separe fatos verificados de inferências.
5. Não documente funcionalidades futuras como se já existissem.
6. Não faça refatorações.
7. Não altere arquivos sem aprovação.
8. Antes de criar qualquer documentação, apresente um plano e aguarde aprovação humana.

## O que analisar

Analise o projeto e identifique:

- framework utilizado;
- linguagem principal;
- estrutura de pastas;
- sistema de rotas;
- páginas existentes;
- componentes principais;
- seções principais do site;
- pasta de assets/imagens;
- imagens usadas no site;
- arquivos de estilo;
- arquivos de configuração relevantes;
- scripts disponíveis no `package.json`;
- dependências principais;
- padrões técnicos observados;
- pontos de atenção ou riscos.

## Arquivos de documentação esperados

Após aprovação humana, criar:

- `CLAUDE.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/TECHNICAL_OVERVIEW.md`
- `docs/SITE_STRUCTURE.md`
- `docs/ASSETS_AND_IMAGES.md`
- `docs/DEVELOPMENT_WORKFLOW.md`

## Conteúdo esperado de cada arquivo

### CLAUDE.md

Deve conter:

- papel do Claude Code neste projeto;
- regras obrigatórias antes de qualquer tarefa;
- obrigação de ler a documentação relevante antes de alterar arquivos;
- obrigação de propor apenas uma tarefa pequena por vez;
- obrigação de listar arquivos que serão criados, modificados ou removidos;
- obrigação de informar comandos antes de executá-los;
- obrigação de aguardar aprovação antes de implementar;
- regra de não alucinar informações;
- regra de não alterar escopo sem autorização;
- regra de não mexer em código fora da tarefa aprovada.

### docs/PROJECT_CONTEXT.md

Deve conter:

- contexto geral do projeto;
- objetivo aparente do site;
- informações verificadas sobre a Antero Sistemas;
- páginas ou seções identificadas;
- pontos que precisam de confirmação humana.

### docs/TECHNICAL_OVERVIEW.md

Deve conter:

- stack identificada;
- estrutura técnica;
- dependências principais;
- scripts disponíveis;
- padrões técnicos observados.

### docs/SITE_STRUCTURE.md

Deve conter:

- estrutura das páginas;
- componentes principais;
- seções da landing page;
- fluxo visual geral do site;
- arquivos mais relevantes para manutenção do site.

### docs/ASSETS_AND_IMAGES.md

Deve conter:

- onde ficam as imagens;
- quais imagens foram identificadas;
- onde aparecem;
- padrão de nomes;
- observações sobre imagens herdadas de template, caso existam.

### docs/DEVELOPMENT_WORKFLOW.md

Deve conter:

- processo esperado de trabalho com Claude Code;
- como propor tarefas;
- como aguardar aprovação;
- como validar alterações;
- comandos recomendados de verificação.

## Resposta esperada nesta primeira execução

Antes de criar qualquer arquivo, responda com:

1. Resumo do que foi encontrado no projeto.
2. Lista de arquivos que pretende criar.
3. Finalidade de cada arquivo.
4. Comandos que pretende executar, se houver.
5. Critérios de aceite.
6. Confirmação de que aguardará aprovação antes de criar ou modificar arquivos.

## Critérios de aceite da tarefa final

A tarefa só estará concluída quando:

- `CLAUDE.md` existir na raiz do projeto;
- a pasta `docs` possuir os arquivos de documentação definidos;
- a documentação estiver baseada no projeto real;
- informações incertas estiverem marcadas como pendentes de confirmação;
- nenhum código de produção tiver sido alterado;
- nenhuma imagem, página, componente ou estilo tiver sido modificado;
- o Claude tiver informado todos os arquivos criados.