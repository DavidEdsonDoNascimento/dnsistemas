# Posicionamento institucional da ANTERO

Como a ANTERO Sistemas deve ser apresentada em qualquer superfície do site
público: textos, headings, microcopy, rótulos de botão, alt de imagem, metadata,
JSON-LD, escolha de imagens e decisões visuais.

Esta regra **orienta** o tom e o conteúdo. Ela **não autoriza** reescrever
conteúdo existente — ver `.claude/rules/frontend-guardrails.md`.

---

## A ANTERO é

- uma **empresa de engenharia de software**;
- **desenvolvedora de sistemas sob medida**;
- **parceira técnica** na construção de infraestrutura digital;
- orientada a **robustez, confiabilidade e crescimento**;
- uma empresa de **alto padrão técnico e visual**.

## A ANTERO não é comunicada como

- fábrica genérica de sites;
- startup neon;
- agência de marketing;
- fornecedora de soluções prontas e superficiais;
- emissora de promessas exageradas;
- usuária de "inovação" como palavra vazia;
- voz excessivamente comercial ou genérica.

## Como isso se aplica na prática

- **Tom:** afirmativo e técnico. Descrever capacidade e método, não entusiasmo.
- **Prova antes de adjetivo.** "Escopo transparente" vale mais que "soluções
  incríveis". Se um adjetivo não puder ser sustentado por algo verificável,
  ele não entra.
- **Sem superlativo vazio:** evitar "revolucionário", "disruptivo",
  "de ponta", "líder de mercado", "o melhor". Nada disso está sustentado por
  informação existente no repositório.
- **Sem número inventado.** Anos de atuação, quantidade de clientes, tamanho de
  equipe e cases **não estão identificados no repositório**. Não preencher.
  Se uma seção pedir esse dado, marcar como `necessita confirmação humana`.
- **Imagens seguem o mesmo posicionamento.** Foto genérica de banco de imagens
  como se fosse a equipe contradiz o posicionamento — as imagens `person-f-*` /
  `person-m-*` em `public/assets/img/person/` são de template e **não são
  funcionários da ANTERO** (ver `docs/ASSETS_AND_IMAGES.md` §3).
- **Sofisticação é contenção.** Menos elementos, mais respiro, hierarquia clara.
  Efeito visual chamativo empurra a percepção para "startup neon" e trabalha
  contra o posicionamento.

## Fatos institucionais verificáveis

O que o repositório de fato afirma sobre a empresa está em
`docs/PROJECT_CONTEXT.md` §3 — e **só isso** pode ser tratado como fato.
CNPJ, endereço, e-mail institucional real, telefone fixo, redes sociais,
sócios e ano de fundação **não estão identificados no repositório**.
