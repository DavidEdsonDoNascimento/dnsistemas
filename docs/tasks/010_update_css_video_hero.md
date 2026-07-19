Quero realizar um pequeno ajuste visual apenas na versão mobile da seção `id="hero"`.

Contexto

Atualmente o vídeo de fundo do Hero está corretamente dimensionado, porém na visualização mobile a parte mais interessante do vídeo (onde acontece a animação principal) fica muito abaixo da área visível.

O usuário precisa rolar a página para enxergar essa parte do vídeo, o que reduz o impacto visual logo na abertura do site.

Objetivo

Quero reposicionar o vídeo alguns pixels para cima APENAS no mobile.

Importante:

- Não quero alterar o tamanho do vídeo.
- Não quero aplicar zoom.
- Não quero alterar o aspect-ratio.
- Não quero modificar a altura da section Hero.
- Não quero alterar o desktop nem tablets.
- Não quero alterar textos, gradientes ou overlays.
- O objetivo é somente deslocar a área visível do vídeo para cima.

Implementação

Analise qual é a melhor abordagem considerando a implementação atual.

Se o vídeo estiver utilizando:
- object-fit: cover → ajuste apenas o `object-position`.
- transform → ajuste apenas o translateY.
- container com overflow → ajuste apenas o posicionamento necessário.

Evite soluções que alterem o layout ou criem efeitos colaterais.

Escopo

- Apenas a seção `id="hero"`.
- Apenas viewport mobile.
- Desktop deve permanecer visualmente idêntico.

Resultado esperado

Ao abrir o site no celular, a parte mais chamativa do vídeo deve aparecer imediatamente, sem necessidade de rolagem, mantendo o enquadramento natural e preservando toda a identidade visual atual.

Ao finalizar:

1. Informe qual propriedade foi alterada (`object-position`, `translateY` ou equivalente).
2. Informe o valor aplicado.
3. Liste os arquivos modificados.
4. Não faça nenhuma outra alteração além desse reposicionamento.