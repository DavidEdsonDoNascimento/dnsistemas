# Tarefa 002 — Renovação da experiência visual da Hero

## Objetivo

Criar uma nova experiência visual para a seção Hero da Antero Sistemas.

Atualmente a Hero utiliza a imagem genérica `illustration-14.webp` e possui
uma composição visual simples, que não representa adequadamente o nível
técnico da Antero.

A nova Hero deverá transmitir imediatamente a ideia de uma empresa
especializada em desenvolvimento de software sob medida, aplicações web,
aplicativos, inteligência artificial, integrações e soluções em nuvem.

O objetivo não é apenas substituir uma imagem, mas criar uma experiência
visual memorável e coerente com a identidade da empresa.

---

# Arquivo base

Utilizar como ponto de partida o vídeo localizado em:

`public/videos/hero-experience.mp4`

O vídeo mostra um notebook sobre uma mesa.

A tela do notebook deverá ser transformada em uma demonstração visual das
capacidades da Antero por meio de uma composição sobreposta.

Não modificar o vídeo original.

---

# Processo obrigatório

Antes de alterar qualquer arquivo:

1. analisar a implementação atual da Hero;
2. identificar componentes envolvidos;
3. identificar estilos utilizados;
4. identificar dependências instaladas;
5. verificar se o projeto utiliza Framer Motion;
6. analisar a estrutura responsiva existente;
7. identificar possíveis limitações técnicas.

Após essa análise:

- apresentar um plano detalhado;
- listar arquivos que serão criados;
- listar arquivos que serão modificados;
- justificar cada alteração;
- aguardar aprovação antes de implementar.

Não realizar alterações antes da aprovação.

---

# Objetivos visuais

A Hero deve comunicar que a Antero desenvolve:

- software sob medida;
- aplicações web;
- aplicativos mobile;
- integrações entre sistemas;
- APIs;
- automações;
- inteligência artificial;
- bancos de dados;
- infraestrutura em nuvem.

O usuário deve perceber isso imediatamente ao acessar o site.

---

# Direção visual

A composição deve transmitir:

- sofisticação;
- tecnologia;
- engenharia de software;
- estabilidade;
- confiança;
- modernidade;
- alto padrão.

Paleta:

- azul-marinho;
- azul elétrico;
- violeta;
- pequenos detalhes em branco.

Evitar:

- aparência gamer;
- aparência hacker;
- códigos aleatórios;
- excesso de partículas;
- gráficos financeiros;
- criptomoedas;
- excesso de brilho;
- excesso de animações;
- interfaces extremamente carregadas.

---

# Estrutura da composição

A Hero deverá possuir cinco camadas.

## Camada 1

Vídeo original.

## Camada 2

Tratamento visual do vídeo.

Aplicar:

- leve redução da luminosidade;
- contraste discreto;
- overlay azul-marinho;
- vinheta suave;
- degradês para integração ao fundo da Hero.

Preservar a aparência natural da mesa e do notebook.

## Camada 3

Animação tecnológica posicionada sobre a tela do notebook.

## Camada 4

Reflexos discretos em azul e violeta próximos à tela.

## Camada 5 (opcional)

Pequenos elementos digitais saindo da tela, desde que não interfiram no
texto da Hero.

---

# Implementação da tela

Não modificar os pixels do vídeo.

Criar uma camada independente utilizando SVG.

Utilizar:

```
viewBox="0 0 3840 2160"
```

O SVG deverá compartilhar exatamente o mesmo contêiner do vídeo.

Vídeo e SVG devem:

- possuir a mesma proporção;
- possuir o mesmo enquadramento;
- utilizar o mesmo comportamento de escala;
- permanecer perfeitamente alinhados em qualquer resolução.

Não assumir que apenas utilizar o mesmo `viewBox` garante o alinhamento.

---

# Área da tela

Criar um `clipPath` delimitando apenas a área interna da tela do notebook.

Coordenadas iniciais aproximadas:

- superior esquerdo: 447,333
- superior direito: 2103,378
- inferior direito: 2136,1404
- inferior esquerdo: 483,1473

Essas coordenadas servem apenas como ponto inicial.

Antes da implementação definitiva:

- validar visualmente a posição;
- confirmar a resolução do vídeo;
- verificar se existe movimento perceptível da tela.

Caso o notebook se movimente durante o vídeo, explicar como isso será
tratado antes da implementação.

---

# Perspectiva

O `clipPath` limita a área da animação, porém não aplica perspectiva.

Antes da implementação, escolher e justificar uma das abordagens:

- desenhar diretamente no sistema de coordenadas do SVG;
- utilizar transformações SVG;
- utilizar transformação CSS (`matrix3d`) caso seja estável.

Não adicionar bibliotecas específicas para perspectiva.

---

# Modo de calibração

Criar um componente exclusivo para desenvolvimento.

Durante a calibração deverão aparecer:

- contorno do polígono;
- quatro vértices;
- grade interna.

O modo de calibração deve:

- permanecer desativado por padrão;
- funcionar apenas em desenvolvimento;
- nunca aparecer em produção.

---

# Narrativa da animação

A duração do vídeo é de aproximadamente 11,5 segundos.

Criar um loop visual seguindo aproximadamente esta sequência.

## Cena 1

0 → 1,5 s

- tela acende;
- grade tecnológica discreta;
- pulso inicial;
- estrutura vazia.

## Cena 2

1,5 → 4 s

Construção do sistema.

Representar:

- aplicação;
- API;
- banco de dados;
- IA;
- nuvem.

Utilizar ícones simples.

Evitar logotipos de terceiros.

---

## Cena 3

4 → 7 s

Integração.

Conectar módulos.

Mostrar fluxo de dados.

Transmitir arquitetura organizada.

---

## Cena 4

7 → 10 s

Sistema concluído.

Revelar:

- interface web;
- aplicativo mobile;
- módulos administrativos;
- indicadores operacionais.

Não utilizar gráficos financeiros.

---

## Cena 5

10 → 11,5 s

Sistema operando.

Reduzir suavemente a intensidade.

Preparar um loop contínuo sem cortes perceptíveis.

---

# Sincronização

Priorizar uma animação independente.

Iniciar a animação quando o vídeo disparar o evento `playing`.

Não sincronizar continuamente utilizando `video.currentTime` na primeira
implementação.

---

# Desktop

No desktop:

- manter texto no lado esquerdo;
- posicionar vídeo no lado direito;
- manter proporção 16:9;
- integrar vídeo ao fundo utilizando degradês;
- não parecer um player convencional.

Não exibir:

- controles;
- barra de progresso;
- botão play;
- áudio.

---

# Mobile

No mobile:

- posicionar o vídeo abaixo do texto;
- simplificar a animação;
- manter o alinhamento da tela;
- preservar a composição.

Utilizar poster estático quando:

- `prefers-reduced-motion`;
- falha na reprodução;
- dispositivo incapaz de executar a animação de forma adequada.

---

# Componentização

Criar componentes independentes.

Sugestão:

- HeroTechVisual
- LaptopScreenAnimation
- LaptopScreenCalibration

Não concentrar toda a implementação dentro do componente principal da Hero.

---

# Otimização do vídeo

O vídeo original não deverá ser utilizado diretamente em produção.

Caso exista FFmpeg disponível:

1. analisar o arquivo original;
2. informar codec;
3. informar resolução;
4. informar duração;
5. informar tamanho;
6. apresentar os comandos propostos;
7. aguardar aprovação.

Após autorização:

Gerar:

- WebM;
- MP4 H.264.

Características:

- máximo 1920×1080;
- sem áudio;
- qualidade adequada;
- tamanho preferencial inferior a 4 MB.

Preservar o arquivo original.

Salvar derivados em:

`public/videos/`

---

# Estrutura do vídeo

Utilizar uma implementação equivalente a:

```tsx
<video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
/>
```

Adicionar:

- source WebM;
- source MP4;
- poster;
- tratamento para erro;
- fallback estático;
- ausência de layout shift.

---

# Acessibilidade

Respeitar `prefers-reduced-motion`.

Quando ativo:

- não iniciar vídeo;
- utilizar poster;
- mostrar interface estática;
- remover animações contínuas.

O vídeo é decorativo.

Não deve ser anunciado por leitores de tela.

---

# Não modificar

Não alterar:

- H1;
- textos;
- descrição;
- botão;
- SEO;
- links;
- menu;
- outras seções da página.

---

# Fases de implementação

## Fase 1

Estrutura.

- integrar vídeo;
- criar HeroTechVisual;
- criar SVG;
- implementar calibração;
- validar alinhamento;
- implementar fallback.

Após concluir a Fase 1, aguardar nova aprovação.

---

## Fase 2

Narrativa visual.

Implementar todas as cenas da animação.

Após concluir, aguardar aprovação.

---

## Fase 3

Otimização.

- gerar versões otimizadas;
- revisar mobile;
- revisar performance;
- executar lint;
- executar build.

---

# Resposta esperada

Antes de implementar, apresentar:

1. análise da Hero atual;
2. arquivos que serão criados;
3. arquivos que serão modificados;
4. estratégia para manter SVG e vídeo alinhados;
5. estratégia para o `clipPath`;
6. abordagem para perspectiva;
7. verificação do Framer Motion;
8. estratégia para otimização do vídeo;
9. comportamento responsivo;
10. possíveis riscos técnicos;
11. plano completo de implementação.

Após apresentar o plano, aguardar autorização.