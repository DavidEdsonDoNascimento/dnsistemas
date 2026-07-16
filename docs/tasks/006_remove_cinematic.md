Durante o deploy foi identificado que o componente HeroCinematic está impedindo a compilação por depender de "framer-motion".

Neste momento esse componente NÃO está sendo utilizado no projeto.

Ele faz parte de uma funcionalidade planejada para o futuro (Hero Cinemático), portanto NÃO quero perdê-lo.

Quero que você faça uma desativação segura.

Antes de alterar qualquer arquivo:

1. Verifique onde HeroCinematic está sendo importado.
2. Verifique se existe algum componente relacionado, como:
   - HeroVideo
   - HeroBackground
   - HeroAnimation
   - HeroEffects
   - ou qualquer outro componente cinematográfico.
3. Confirme se algum deles realmente está sendo renderizado atualmente.

Se confirmar que nenhum está sendo utilizado:

### Desative temporariamente essa funcionalidade.

Regras:

- Não excluir arquivos.
- Não apagar código.
- Não remover comentários existentes.
- Não perder a implementação.

Faça apenas o necessário para que ela deixe de participar do build.

Se houver importações não utilizadas:

- remova apenas as importações dos componentes não utilizados.

Se houver exportações não utilizadas:

- deixe comentadas ou preserve conforme o padrão do projeto.

Se o componente inteiro estiver isolado:

- mantenha-o no repositório para uso futuro.

Também verifique se, após essa remoção, a dependência:

framer-motion

continua sendo utilizada em algum outro lugar.

Se NÃO existir nenhuma outra utilização:

- remova a dependência do projeto (package.json e lockfile).

Depois execute:

- build
- lint

e informe:

- quais arquivos deixaram de importar HeroCinematic;
- se framer-motion foi removido;
- se ainda existe alguma referência ao Hero Cinemático;
- resultado do build.

Por fim, atualize a documentação do projeto registrando que:

"O Hero Cinemático foi temporariamente desativado por ainda não fazer parte da versão atual do site. A implementação foi preservada para futura reativação."

Caso já exista documentação para funcionalidades futuras, atualize-a em vez de criar uma nova.