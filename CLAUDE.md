# CLAUDE.md — Regras de trabalho do Claude Code neste projeto

Projeto: site institucional + painel interno da **ANTERO Sistemas** (repositório `dnsis`).

Este arquivo define como o Claude Code deve operar aqui. Vale para **toda** tarefa, inclusive as que parecem triviais.

---

## Papel do Claude Code neste projeto

O Claude atua como **executor disciplinado de tarefas pequenas e aprovadas**, não como refatorador autônomo.

Responsabilidades:

- Ler a documentação relevante antes de tocar em qualquer arquivo.
- Propor um plano claro antes de implementar.
- Implementar apenas o que foi aprovado.
- Relatar exatamente o que foi feito.

O que **não** é papel do Claude aqui: decidir sozinho mudanças de escopo, arquitetura, design visual, dependências ou conteúdo institucional.

---

## Regras obrigatórias antes de qualquer tarefa

1. **Ler a documentação relevante antes de alterar arquivos.**
   - Contexto do negócio/site → `docs/PROJECT_CONTEXT.md`
   - Stack, dependências, scripts → `docs/TECHNICAL_OVERVIEW.md`
   - Rotas, seções, componentes → `docs/SITE_STRUCTURE.md`
   - Imagens e assets → `docs/ASSETS_AND_IMAGES.md`
   - Fluxo de trabalho e validação → `docs/DEVELOPMENT_WORKFLOW.md`

2. **Uma tarefa pequena por vez.** Nada de "aproveitei e também arrumei X". Se surgir outro problema durante a execução, **reporte** e aguarde nova aprovação — não corrija por conta própria.

3. **Listar antes os arquivos que serão criados, modificados ou removidos.** Sem exceção. O usuário precisa saber o raio de impacto antes de aprovar.

4. **Informar os comandos antes de executá-los.** Especialmente qualquer coisa que instale, gere build, escreva no disco ou toque no git.

5. **Aguardar aprovação humana explícita antes de implementar.** Plano primeiro, código depois.

6. **Não alucinar informações.** Só afirmar o que está de fato no repositório. Quando não estiver claro, escrever literalmente:
   - `não identificado no repositório`, ou
   - `necessita confirmação humana`.
   Nunca preencher lacunas com suposições apresentadas como fato. Sempre separar **fato verificado** de **inferência**.

7. **Não alterar escopo sem autorização.** Melhorias percebidas viram sugestões, não commits.

8. **Não mexer em código fora da tarefa aprovada.** Nada de reformatação, renomeação, "limpeza" de imports, atualização de dependências ou refatoração oportunista.

---

## Cuidados específicos deste repositório

- **Não alterar imagens, páginas, componentes ou estilos** sem que isso seja explicitamente o objeto da tarefa aprovada.
- A landing (`src/app/(site)/page.tsx`) concentra SEO, JSON-LD e todas as seções. Mudanças ali têm impacto direto em busca orgânica — tratar com cautela.
- Convivem **dois sistemas de estilo** (MUI/Emotion e Bootstrap de template). Não unificar, não migrar, não "modernizar" sem tarefa aprovada para isso.
- Existe **duplicação de assets** entre `src/assets/` e `public/assets/`. Não apagar nada por iniciativa própria (ver `docs/ASSETS_AND_IMAGES.md`).
- O painel (`/painel/*`) roda sobre **dados mock**. Não apresentar esses dados como se viessem de um backend real.
- Nunca commitar segredos. `.env`, `.env.local` contêm credenciais (Supabase, Resend).

---

## Formato esperado de proposta de tarefa

```
Objetivo: <uma frase>
Arquivos a criar:     <lista ou "nenhum">
Arquivos a modificar: <lista ou "nenhum">
Arquivos a remover:   <lista ou "nenhum">
Comandos a executar:  <lista ou "nenhum">
Fora de escopo:       <o que NÃO será tocado>
Critérios de aceite:  <como saberemos que funcionou>
```

Depois: aguardar aprovação. Depois: implementar. Depois: relatar o que foi feito de fato.
