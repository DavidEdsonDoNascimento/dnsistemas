Quero implementar corretamente a imagem de compartilhamento (Open Graph) da Antero.

IMPORTANTE:

A imagem já foi criada.

Ela está localizada em:

public/antero-encaminhamento.png

Essa imagem é a imagem oficial de compartilhamento da Antero.

Não gere outra imagem.
Não altere sua identidade visual.
Não substitua por outra.
Utilize exatamente esse arquivo.

--------------------------------------------------------
ETAPA 1 — ANÁLISE
--------------------------------------------------------

Antes de alterar qualquer arquivo:

1. Analise toda a documentação existente do projeto.

Procure por:

- CLAUDE.md
- README.md
- docs/
- .claude/
- qualquer documentação relacionada a:
    - SEO
    - Metadata
    - Open Graph
    - Twitter Cards
    - Social Sharing
    - Assets
    - Branding
    - Identidade Visual

2. Informe:

- quais documentos encontrou;
- se já existe documentação referente a Open Graph;
- se existe algum padrão para assets;
- se existe algum padrão para metadata.

Não modifique nada ainda.

--------------------------------------------------------
ETAPA 2 — DOCUMENTAÇÃO
--------------------------------------------------------

Caso NÃO exista documentação sobre imagens de compartilhamento, crie uma documentação permanente.

Escolha o local mais adequado seguindo a organização do projeto.

Essa documentação deverá registrar:

• qual é a imagem oficial de compartilhamento

public/antero-encaminhamento.png

• quando utilizar essa imagem

• quando criar imagens específicas para páginas futuras

• dimensões recomendadas

• formato recomendado

• como alterar a imagem futuramente

• como validar a implementação

• quais plataformas utilizam Open Graph

• como limpar cache das plataformas

Além disso, inclua um checklist para futuras alterações.

Sempre que no futuro eu pedir para alterar imagens de compartilhamento, o Claude deverá consultar essa documentação antes de qualquer modificação.

--------------------------------------------------------
ETAPA 3 — IMPLEMENTAÇÃO
--------------------------------------------------------

Analise a estrutura do projeto.

Verifique onde o metadata global está sendo definido.

Configure corretamente o metadata para utilizar a imagem:

/antero-encaminhamento.png

A URL pública deverá ser:

https://anterosistemas.com.br/antero-encaminhamento.png

Configure:

metadataBase

title

description

openGraph

twitter

siteName

locale

url

type

image

image width

image height

image alt

Utilize URLs absolutas quando necessário.

Verifique também se existem:

- generateMetadata
- opengraph-image.tsx
- twitter-image.tsx
- metadata específicos
- layouts aninhados

Caso exista conflito, explique antes de alterar.

--------------------------------------------------------
ETAPA 4 — VALIDAÇÃO
--------------------------------------------------------

Depois da implementação:

Execute:

✓ lint

✓ typecheck

✓ build

Verifique se o HTML final contém corretamente:

og:title

og:description

og:image

og:image:width

og:image:height

og:image:alt

og:type

og:site_name

og:url

twitter:card

twitter:title

twitter:description

twitter:image

Confirme também que a imagem está acessível publicamente em:

https://anterosistemas.com.br/antero-encaminhamento.png

--------------------------------------------------------
ETAPA 5 — ENTREGA
--------------------------------------------------------

Ao final informe:

- documentação encontrada;

- documentação criada ou atualizada;

- arquivos modificados;

- metadata final;

- URL pública da imagem;

- validações executadas;

- possíveis conflitos encontrados;

- instruções para atualizar o cache do WhatsApp, Facebook, LinkedIn, Telegram e Discord.

IMPORTANTE:

Não altere nenhuma outra funcionalidade do projeto.

Caso exista qualquer dúvida sobre a estrutura do projeto ou sobre o local correto do metadata, pare e me consulte antes de modificar.