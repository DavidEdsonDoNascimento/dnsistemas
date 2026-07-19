Antes de iniciarmos a proposta de evolução visual do site da Antero, quero organizar as instruções permanentes e os procedimentos reutilizáveis deste repositório.

O objetivo desta tarefa ainda NÃO é modificar o visual do site.

Quero primeiro estruturar corretamente o contexto do Claude Code para que as futuras decisões de design respeitem o posicionamento, a identidade e as restrições técnicas da Antero.

## Contexto atual

O repositório já possui um `CLAUDE.md` com regras de trabalho, documentação obrigatória, processo de aprovação e cuidados específicos do projeto.

Não quero apagar, reescrever ou substituir esse conteúdo sem necessidade.

Quero analisar o que deve:

1. permanecer no `CLAUDE.md`;
2. virar uma regra modular em `.claude/rules/`;
3. virar uma skill em `.claude/skills/`;
4. permanecer apenas na documentação existente.

## Antes de alterar qualquer arquivo

Leia integralmente:

* `CLAUDE.md`;
* `AGENTS.md`, caso exista;
* todos os arquivos em `docs/`;
* todos os arquivos existentes em `.claude/`;
* arquivos de configuração de estilo;
* arquivos de tema;
* variáveis CSS;
* tokens;
* configuração do MUI/Emotion;
* configuração do Bootstrap;
* arquivos globais de CSS;
* componentes compartilhados relevantes.

Inspecione também a estrutura real do repositório.

Não modifique nenhum arquivo nesta primeira etapa.

## Estrutura inicial a avaliar

Considere a seguinte estrutura, sem tratá-la como obrigatória:

```text
.claude/
├── rules/
│   ├── repository-workflow.md
│   ├── institutional-positioning.md
│   ├── visual-identity.md
│   ├── frontend-quality.md
│   └── seo-and-content-safety.md
└── skills/
    └── visual-identity-review/
        └── SKILL.md
```

Avalie se todos esses arquivos são realmente necessários.

Prefira a menor estrutura que mantenha as responsabilidades bem separadas.

## Regras propostas

### 1. Fluxo do repositório

Deve cobrir apenas regras permanentes de execução, como:

* analisar antes de implementar;
* apresentar plano;
* listar arquivos afetados;
* informar comandos;
* aguardar aprovação explícita;
* não aumentar escopo;
* não fazer refatorações oportunistas;
* não alterar arquivos não relacionados;
* separar fatos, inferências e hipóteses;
* relatar exatamente o que foi realizado.

Evite duplicar regras que já estejam claras no `CLAUDE.md`.

### 2. Posicionamento institucional

A Antero deve ser apresentada como:

* empresa de engenharia de software;
* desenvolvedora de sistemas sob medida;
* parceira técnica para construção de infraestrutura digital;
* empresa orientada a robustez, confiabilidade e crescimento;
* empresa de alto padrão técnico e visual.

Evitar comunicação que transmita:

* fábrica genérica de sites;
* startup neon;
* agência de marketing;
* soluções prontas e superficiais;
* promessas exageradas;
* inovação como palavra vazia;
* linguagem excessivamente comercial ou genérica.

O posicionamento deve orientar textos, imagens, componentes, páginas, SEO, microcopy e decisões visuais.

### 3. Identidade visual

A identidade deve utilizar predominantemente:

* preto;
* branco;
* cinza;
* pequenos acentos em ouro fosco ou bronze dessaturado.

Princípios:

* aproximadamente 95% de tons neutros e 5% de cor de acento;
* o acento deve conduzir o olhar, não dominar o layout;
* evitar azul neon;
* evitar glows fortes;
* evitar partículas futuristas genéricas;
* evitar dourado brilhante;
* evitar gradientes metálicos;
* evitar estética de joalheria ou luxo ostensivo;
* priorizar sofisticação por tipografia, espaçamento, proporção e composição;
* preservar contraste, legibilidade e acessibilidade;
* não definir códigos de cor isolados quando já existir um sistema de tokens.

A alteração da paleta atual ainda não faz parte desta tarefa.

### 4. Qualidade de frontend

Deve preservar:

* responsividade;
* acessibilidade;
* performance;
* estados de foco;
* navegação por teclado;
* contraste;
* `prefers-reduced-motion`;
* consistência entre componentes;
* funcionamento nos principais tamanhos de tela.

Não instalar dependências apenas para produzir efeitos visuais.

Não introduzir efeitos pesados, canvas, partículas, bibliotecas de animação ou novos sistemas de estilo sem tarefa específica e aprovação.

Não unificar MUI/Emotion e Bootstrap sem autorização explícita.

### 5. Proteção de SEO e conteúdo

Em tarefas exclusivamente visuais:

* não alterar textos;
* não alterar headings;
* não alterar metadados;
* não alterar JSON-LD;
* não alterar URLs;
* não remover conteúdo indexável;
* não transformar conteúdo textual importante em imagem;
* não alterar estrutura sem analisar impacto em SEO;
* não modificar chamadas institucionais sem tarefa explícita.

## Skill proposta: revisão de identidade visual

Avalie criar uma skill chamada `visual-identity-review`.

Essa skill deve ser acionada somente em tarefas de:

* revisão de paleta;
* mudança de identidade visual;
* auditoria de componentes;
* refinamento visual;
* remoção de estética neon;
* análise de consistência entre páginas;
* aplicação da identidade institucional.

A skill deve orientar o seguinte processo:

1. ler o contexto institucional e visual;
2. identificar sistemas de estilo existentes;
3. localizar tokens e variáveis;
4. mapear cores hardcoded;
5. identificar todos os usos da cor que será substituída;
6. classificar os usos por função semântica;
7. analisar contraste e acessibilidade;
8. propor uma paleta sem alterar arquivos;
9. listar arquivos afetados;
10. apresentar plano em fases;
11. aguardar aprovação;
12. implementar somente a fase aprovada;
13. validar desktop e mobile;
14. executar lint, typecheck e build conforme os scripts reais;
15. documentar cores antigas e novas;
16. relatar limitações e pontos que precisam de análise humana.

A skill não deve definir antecipadamente que toda cor azul será substituída diretamente por dourado.

Primeiro deve compreender a função de cada cor.

Exemplos:

* um azul de destaque pode virar ouro;
* um azul utilizado para informação pode precisar de outra solução;
* um azul usado em estado de foco não pode perder contraste;
* uma cor proveniente de biblioteca externa pode não precisar ser alterada;
* uma cor usada apenas no painel interno pode estar fora do escopo do site institucional.

## Requisitos da análise

Apresente:

1. diagnóstico do `CLAUDE.md` atual;
2. regras que já estão suficientemente cobertas;
3. duplicações que devem ser evitadas;
4. estrutura mínima recomendada;
5. arquivos que seriam criados;
6. conteúdo resumido de cada arquivo;
7. o que deve permanecer no `CLAUDE.md`;
8. o que deve ficar em documentação;
9. o que deve ser regra;
10. o que deve ser skill;
11. possíveis conflitos entre as instruções;
12. impacto estimado no contexto carregado pelo Claude;
13. estratégia para aplicar posteriormente a nova identidade visual.

Ao final, utilize:

```text
Objetivo:
Arquivos a criar:
Arquivos a modificar:
Arquivos a remover:
Comandos a executar:
Fora de escopo:
Critérios de aceite:
```

Não crie nem modifique arquivos ainda.

Aguarde minha aprovação explícita.
