Quero realizar uma revisão da identidade visual dos botões da landing page da Antero.

Contexto
- Recentemente migramos a identidade da empresa do azul para o dourado.
- Atualmente muitos botões utilizam fundo dourado (#b08d57) com texto preto.
- Após diversos testes percebemos que essa combinação perdeu a aparência premium que queremos transmitir.
- A identidade da Antero deve passar sofisticação, tecnologia, minimalismo e alto padrão.

Objetivo

Quero abandonar os botões com fundo dourado sólido.

A partir de agora, o padrão visual deverá ser:

Botão primário
- Background: #111111
- Texto: #F5F5F5
- Borda: 1px sólida #b08d57
- Border-radius: manter o atual
- Padding: manter o atual
- Tipografia: manter a existente
- Peso da fonte: 600 (caso atualmente seja menor)

Hover
- Background: #1b1b1b
- Borda: #c7a26a
- Texto: branco
- Adicionar uma transição suave (200~250ms)

Focus
- Manter acessibilidade
- Outline visível utilizando o dourado da identidade

Active
- Fundo levemente mais escuro que o hover
- Sem perder contraste

Importante

O dourado deixa de ser a cor principal do botão e passa a ser apenas um elemento de destaque.

Quero que o usuário enxergue primeiro um botão elegante e escuro, com detalhes dourados.

Escopo

Revise todos os componentes reutilizáveis da landing page e do site institucional.

Verifique principalmente:

- Hero
- CTA principal
- Navbar
- Footer
- About
- Services
- Contact
- Forms
- Dialogs
- Cards que possuam ações
- Botões secundários

Não altere:

- Layout
- Espaçamentos
- Responsividade
- Hierarquia visual
- Tipografia (exceto peso 600 caso necessário)

Também revise estados:

- hover
- active
- focus
- disabled

Caso existam variáveis de tema (tokens, CSS variables, Tailwind theme ou design tokens), atualize o sistema de design ao invés de alterar valores diretamente nos componentes.

Ao finalizar:

1. Liste todos os arquivos modificados.
2. Explique quais tokens foram alterados.
3. Informe quais componentes passaram a utilizar o novo padrão.
4. Não altere nenhuma funcionalidade, apenas o visual dos botões.