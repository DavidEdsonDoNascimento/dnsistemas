Quero integrar dois vídeos à landing page da Antero, respeitando a nova identidade visual premium já implementada.

Arquivos disponíveis:

* `public/videos/dark-tec.mp4`
* `public/videos/office-1.mp4`

Antes de alterar qualquer arquivo:

1. Leia o `CLAUDE.md`, as rules e a skill relacionadas a frontend e identidade visual.
2. Analise a estrutura atual do Hero e da seção com `id="about"`.
3. Inspecione as dimensões, proporção, duração, codec e tamanho dos dois vídeos.
4. Identifique como cada vídeo se comportará em desktop e mobile.
5. Liste os arquivos que pretende modificar.
6. Apresente um plano curto de implementação.
7. Aguarde minha aprovação antes de alterar o código.

Não faça uma simples inserção de tags `<video>`. Quero uma integração visual coerente com a identidade da Antero.

---

## 1. Vídeo no Hero

Utilize:

`public/videos/dark-tec.mp4`

Quero que o vídeo:

* ocupe toda a área visual do Hero;
* fique atrás dos textos e dos CTAs;
* funcione como background real da seção;
* cubra toda a área sem distorcer;
* preserve o enquadramento da parte visualmente mais importante;
* não altere a altura, estrutura ou posicionamento atual do Hero;
* não prejudique a legibilidade;
* não desloque o conteúdo durante o carregamento.

A implementação deve considerar algo equivalente a:

* `position: absolute`;
* preenchimento completo da seção;
* `width: 100%`;
* `height: 100%`;
* `object-fit: cover`;
* controle adequado de `object-position`;
* conteúdo do Hero em uma camada superior;
* `overflow: hidden` na área correta.

Não copie essas propriedades mecanicamente. Analise a estrutura existente e implemente da forma mais segura para o projeto.

### Comportamento do vídeo

O vídeo deve:

* iniciar automaticamente;
* permanecer sem áudio;
* ficar em loop;
* usar `playsInline`;
* não exibir controles;
* não capturar cliques;
* não impedir interação com textos e botões;
* ter comportamento consistente em navegadores mobile;
* ser tratado como elemento decorativo para acessibilidade.

Avalie também:

* `preload`;
* poster ou fallback;
* falha de reprodução;
* conexão lenta;
* preferência por movimento reduzido;
* impacto no Largest Contentful Paint;
* carregamento em dispositivos móveis.

Não adicione dependências.

### Filtro escuro com tonalidade ouro

Sobre o vídeo, quero uma camada escurecida com um leve caráter dourado/bronze.

O filtro deve:

* escurecer suficientemente o vídeo;
* preservar a leitura dos textos;
* integrar o vídeo à nova paleta;
* reduzir tons frios ou azulados;
* ter um ouro discreto e dessaturado;
* não parecer sépia;
* não parecer amarelo;
* não parecer um filtro forte de Instagram;
* não esconder completamente o conteúdo do vídeo.

Considere combinar:

* camada preta;
* leve tonalidade bronze/ouro;
* gradiente localizado para proteger os textos;
* contraste diferente entre desktop e mobile, quando necessário.

Use como referência a nova identidade:

* preto;
* branco;
* cinza;
* ouro fosco `#B08D57`;
* bronze mais escuro derivado da paleta.

O ouro deve ser percebido de forma sutil, não explícita.

O resultado deve preservar a sensação:

* premium;
* tecnológica;
* robusta;
* cinematográfica;
* discreta.

Evite:

* glow;
* neon;
* brilho dourado;
* filtro amarelo evidente;
* excesso de contraste;
* movimento visual competindo com o texto.

---

## 2. Vídeo na seção `id="about"`

Utilize:

`public/videos/office-1.mp4`

Esse vídeo mostra um escritório funcionando de maneira natural.

Quero utilizá-lo para transmitir:

* empresa real;
* trabalho em andamento;
* organização;
* colaboração;
* ambiente profissional;
* tecnologia aplicada de forma humana;
* capacidade de execução.

Não quero que o vídeo pareça:

* banco de imagens genérico;
* propaganda corporativa artificial;
* banner solto;
* elemento decorativo sem relação com o conteúdo;
* vídeo simplesmente colocado abaixo do texto.

### Integração visual

Analise o layout atual da seção `about` e proponha a melhor composição sem reescrever seu conteúdo.

A integração pode envolver, conforme fizer mais sentido:

* vídeo ao lado do conteúdo;
* composição assimétrica;
* janela editorial;
* vídeo parcialmente enquadrado;
* mídia ocupando uma das colunas;
* vídeo como elemento de profundidade;
* recorte que acompanhe a hierarquia da seção.

Não crie uma nova seção.

Não remova o conteúdo existente.

Não transforme a seção em um Hero secundário.

O vídeo deve complementar a mensagem e atrair o usuário sem dominar toda a página.

### Tratamento visual do vídeo do escritório

Quero um tratamento mais natural que o Hero.

Pode existir:

* leve escurecimento;
* contraste ajustado;
* borda discreta;
* máscara ou recorte elegante;
* sombra muito sutil;
* pequeno detalhe em ouro;
* sobreposição gráfica mínima;
* entrada suave durante o scroll.

Evite:

* filtro dourado forte;
* moldura pesada;
* borda muito arredondada;
* efeito de notebook ou dispositivo;
* card genérico;
* controles visíveis;
* animação chamativa;
* parallax agressivo.

O vídeo deve parecer integrado ao sistema visual do site.

### Comportamento

Avalie tecnicamente se o vídeo deve:

* reproduzir automaticamente;
* iniciar somente quando estiver próximo da viewport;
* pausar fora da viewport;
* usar loop;
* utilizar `IntersectionObserver`;
* respeitar `prefers-reduced-motion`;
* apresentar imagem estática ou poster como fallback.

Escolha a solução com melhor equilíbrio entre:

* experiência;
* performance;
* simplicidade;
* compatibilidade;
* manutenção.

Não adicione biblioteca para fazer algo possível com APIs nativas do navegador.

---

## Responsividade

Valide cuidadosamente:

### Desktop

* enquadramento dos dois vídeos;
* sobreposição do Hero;
* largura dos textos;
* leitura dos CTAs;
* equilíbrio da seção `about`;
* ausência de espaços vazios estranhos.

### Tablet

* proporção dos vídeos;
* reorganização das colunas;
* legibilidade;
* altura da seção;
* corte adequado do vídeo.

### Mobile

* Hero sem altura excessiva;
* texto completamente legível;
* vídeo sem deformação;
* `object-position` adequado;
* filtro mais intenso, caso necessário;
* seção `about` sem ficar longa ou pesada;
* vídeo com proporção agradável;
* sem autoplay problemático;
* sem overflow horizontal.

Não esconda automaticamente os vídeos no mobile sem primeiro justificar.

---

## Acessibilidade

Preserve:

* contraste WCAG;
* navegação por teclado;
* foco visível;
* legibilidade;
* `prefers-reduced-motion`;
* conteúdo principal acessível mesmo sem vídeo;
* vídeos decorativos fora da árvore de leitura quando apropriado.

O site deve continuar plenamente compreensível caso:

* o vídeo não carregue;
* autoplay seja bloqueado;
* JavaScript esteja indisponível;
* o usuário prefira movimento reduzido.

---

## Performance

Analise e reporte:

* tamanho de cada MP4;
* impacto estimado no carregamento;
* estratégia de preload;
* necessidade de poster;
* possibilidade futura de gerar WebM;
* possibilidade futura de versões diferentes para desktop e mobile.

Nesta tarefa, não converta os arquivos e não instale ferramentas de vídeo sem aprovação.

Se os vídeos estiverem pesados demais para produção, implemente de forma segura para validação local e documente claramente o que precisa ser otimizado antes do deploy.

---

## Restrições

Não alterar:

* textos;
* SEO;
* metadados;
* JSON-LD;
* URLs;
* arquitetura;
* rotas;
* conteúdo institucional;
* painel;
* login;
* identidade visual aprovada;
* componentes fora do escopo;
* dependências.

Não criar nova biblioteca de vídeo.

Não adicionar animações complexas.

Não usar canvas.

Não adicionar partículas.

Não fazer refatorações oportunistas.

Não alterar outros assets.

---

## Resultado esperado

No Hero, quero sentir que a Antero constrói tecnologia sofisticada e robusta.

Na seção `about`, quero perceber uma empresa em funcionamento, com pessoas, ambiente profissional e capacidade real de execução.

Os dois vídeos devem cumprir papéis diferentes:

* `dark-tec.mp4`: impacto, tecnologia, atmosfera e posicionamento;
* `office-1.mp4`: proximidade, credibilidade, operação e humanidade.

Eles devem pertencer à mesma identidade visual, mas não receber exatamente o mesmo tratamento.

---

## Validação obrigatória após implementação

Após minha aprovação do plano e depois da implementação:

1. execute `npm run lint`;
2. execute `npm run build`;
3. informe todos os arquivos modificados;
4. explique a estrutura de camadas do Hero;
5. explique como o vídeo do `about` foi integrado;
6. reporte como `prefers-reduced-motion` foi tratado;
7. reporte o comportamento de fallback;
8. informe os tamanhos dos vídeos;
9. liste limitações para produção;
10. confirme que não houve alteração de conteúdo, SEO ou arquitetura;
11. aguarde minha avaliação visual antes de realizar refinamentos.

Não instale Playwright, Puppeteer ou qualquer ferramenta de screenshot. Eu farei a conferência visual no navegador.
