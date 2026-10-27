# Revisão — retrato do responsável técnico e envio de e-mail do formulário

## Objetivo

1. Substituir o monograma "DN" da seção `#responsavel-tecnico` pela foto `/public/eu.jpeg`.
2. Diagnosticar o erro "Configuração de email incompleta: RESEND_API_KEY, MAIL_FROM, MAIL_TO" e revisar segurança e tratamento de falhas do formulário de contato.

## Retrato

- `next/image` com `/eu.jpeg` (1024×1536), `alt="Retrato de David Nascimento"`.
- Quadro quadrado (96 px; 80 px abaixo de 576 px) no lugar do monograma, ao lado do nome. Recorte do rosto feito por CSS (imagem ampliada e deslocada em %), sem distorção e sem gerar arquivo derivado.
- Acabamento: borda neutra, cantoneiras no accent (`--dn-secondary`), sombra de card — mesmo vocabulário do monograma anterior.

## Diagnóstico do formulário

- O envio usa a **API HTTP do Resend** (`resend` SDK, `src/app/api/contact/route.ts`). Não há SMTP, Brevo ou nodemailer no código nem nas dependências.
- Causa do erro: no ambiente local não existe `.env.local` nem `.env`; as três variáveis estão ausentes e a rota responde 500 listando-as.
- `.env*` é ignorado pelo Git (exceto `.env.example`); nenhum `.env` com valores reais aparece no histórico.

## Correções

- Rota: corpo JSON inválido → 400; variáveis ausentes registradas no log do servidor; em produção o visitante recebe só a mensagem genérica (detalhe apenas em desenvolvimento); mensagens com acentuação correta.
- Formulário: resposta sem JSON ou falha de rede não exibem mensagem técnica; status com `role="status"`/`role="alert"`.
- `.env.example` e docs: variáveis obrigatórias, formato e exigência de domínio verificado no Resend.

## Fora do escopo

DNS, Resend (painel), VPS, Coolify, deploy, portfólio pessoal, Antero Pedidos.
