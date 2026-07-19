# Identidade visual da ANTERO

Direção visual do **site institucional**. Vale para tokens, CSS, componentes,
estados de interação e escolha de assets.

---

## 1. Decisão tomada: o azul sai da identidade institucional

**Decidido pelo responsável do projeto em 18/07/2026.** A ANTERO deixa de usar
azul como cor institucional. A remoção alcança **todo** uso de azul ligado ao
site público:

accent · botões · links · hover · focus · outlines · glows · gradientes ·
indicadores · elementos decorativos · destaques · componentes compartilhados
do site público.

Isso **não** é substituir azul por dourado mecanicamente. Antes de trocar
qualquer cor, **classificar a função semântica daquele uso** e escolher a
solução mais elegante entre:

- **ouro fosco** — o accent institucional;
- **tons de cinza**;
- **branco**;
- **preto**.

Se um estado (foco, hover, feedback) ficar tecnicamente inadequado em ouro —
tipicamente por contraste —, a alternativa é **cinza**. Nunca manter azul por
esse motivo.

**Azul padrão de biblioteca também sai.** Se MUI, Bootstrap ou qualquer vendor
entregar azul como default (foco, `--bs-primary`, `--bs-link-color`, ripple,
seleção), adaptar para a nova identidade sempre que possível. "É o padrão da
biblioteca" não é justificativa para manter.

## 2. Estado atual do repositório (fato verificado, 18/07/2026)

A paleta implementada **ainda é a azul**. `src/theme/landingTokens.ts:8` define
`accent: '#2563EB'`. A identidade descrita nesta regra é o **alvo**, não o que
está no código.

**Executar a troca exige tarefa própria e aprovação explícita.** Até lá, não
alterar cor de nenhum arquivo. Quando a tarefa vier, usar a skill
`visual-identity-review`, que traz o mapeamento dos pontos afetados.

## 3. Princípios

- **~95% de neutros, ~5% de accent.** O ouro conduz o olhar; não domina o
  layout. Hoje o accent ocupa bem mais que 5% da superfície (é fundo de CTA e
  cor de todos os links) — chegar à proporção é **redesign**, não troca de
  variável.
- **Ouro fosco / bronze dessaturado.** Não dourado brilhante, não metálico.
- **Vetados:** azul neon, glow forte, partícula futurista genérica, gradiente
  metálico, estética de joalheria ou luxo ostensivo.
- **Sofisticação vem de tipografia, espaçamento, proporção e composição** —
  não de efeito. Se um refinamento precisa de brilho para funcionar, o problema
  está na composição.
- **Contraste, legibilidade e acessibilidade são inegociáveis.** Nenhuma decisão
  estética justifica reprovar em WCAG AA. Ver `frontend-guardrails.md`.
- **Contraste do accent precisa de atenção específica:** os CTAs hoje são texto
  branco sobre o accent. Ouro fosco com texto branco tende a **reprovar em AA** —
  a saída provável é texto escuro sobre o accent. É decisão de design, a ser
  proposta e aprovada, não conversão automática.

## 4. Cor entra pelo sistema de tokens

Existe cadeia de tokens e ela é a única porta de entrada de cor nova:

```
src/theme/landingTokens.ts     ← fonte única
  → src/theme/landingCssVars.ts  (gera as vars --dn-*)
  → src/theme/ThemeRegistry.tsx  (injeta em :root + mapeia vars legadas do template)
  → src/theme/landing-root.css   (fallback de SSR — precisa espelhar os mesmos valores)
```

**Não introduzir hex solto em componente ou CSS module.** Adicionar um token e
consumi-lo.

⚠ **Isto é obrigação, não descrição do presente.** Existem hardcodes hoje —
4 gradientes de CTA em `src/theme/landing.module.css` e cores diretas nas
páginas do painel e no login. Estão inventariados na skill
`visual-identity-review`. Não corrigir de passagem: é tarefa própria.

⚠ **`landing-root.css` precisa ser atualizado junto com `landingTokens.ts`.**
Ele é o fallback da primeira pintura; se divergir, a página muda de cor ao
hidratar.

## 5. `starAccent` — pendência aberta

`src/theme/landingTokens.ts:43` define `starAccent: '#FBBF24'` (dourado
brilhante), exposto como `--dn-star`.

**Ele não faz parte da nova identidade.** Definição do responsável: analisar se
possui significado semântico próprio.

- Se for **resquício da identidade anterior** ou mero decorativo → propor
  remoção.
- Se representar **conceito semântico independente da marca** (ex.: avaliação,
  classificação) → manter, porém **separado do accent institucional** e
  renomeado para refletir a semântica, nunca reaproveitado como cor de marca.

A análise faz parte da skill `visual-identity-review`. Não decidir por conta
própria.

## 6. Escopo: site público × painel interno

Esta regra trata do **site institucional**. `/painel/*` e `/login` são
`noindex`, rodam sobre dados mock e não são vitrine da marca — mas **também
contêm o azul** (sidebar ativa, badge de status, botões, foco do formulário de
login).

**Se o painel entra ou não no escopo da nova identidade ainda não foi decidido.**
`necessita confirmação humana` antes de qualquer alteração ali.
