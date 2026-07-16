# SOCIAL_SHARING.md — Imagem de compartilhamento (Open Graph / Twitter Cards)

> **Regra para o Claude Code:** sempre que uma tarefa envolver alterar imagens de
> compartilhamento, metadata de Open Graph ou Twitter Cards, **consultar este
> documento antes de qualquer modificação.**

---

## 1. Imagem oficial de compartilhamento

| Item | Valor |
|---|---|
| Arquivo | `public/antero-encaminhamento.png` |
| URL pública | `https://anterosistemas.com.br/antero-encaminhamento.png` |
| Dimensões reais | **1731 × 909 px** (proporção ≈ 1,90:1) |
| Formato | PNG |
| Tamanho | ~1,84 MB |
| Onde é referenciada | `src/app/layout.tsx` → `metadata.openGraph.images` e `metadata.twitter.images` |

Essa é a **imagem oficial** exibida quando qualquer URL do site é compartilhada
em redes sociais e mensageiros. Não substituir, recriar ou alterar sua
identidade visual sem aprovação humana explícita.

> ⚠ **Ponto de atenção (registrado em 2026-07-16):** o arquivo tem ~1,84 MB.
> O WhatsApp pode ignorar previews com imagens muito pesadas (recomendação
> usual: < 600 KB). Se o preview não aparecer no WhatsApp, a otimização do
> peso do arquivo (sem alterar a arte) é a primeira hipótese a investigar —
> mediante tarefa aprovada.

---

## 2. Quando usar esta imagem

- **Sempre**, por padrão: ela está no metadata **global** (`src/app/layout.tsx`),
  então todas as rotas herdam essa imagem automaticamente.
- Páginas internas (`/painel/*`, `/entrar`) são `noindex` e não definem OG
  próprio — herdam do root, o que é aceitável pois não são compartilháveis
  publicamente.

## 3. Quando criar imagens específicas por página

Criar uma imagem dedicada apenas quando:

- uma página/rota nova tiver conteúdo próprio relevante para compartilhamento
  (ex.: página de produto, landing de campanha, artigo de blog);
- houver aprovação humana da arte.

Como implementar (Next.js App Router — escolher **uma** das opções):

1. **Arquivo estático por rota:** colocar `opengraph-image.png` (e opcionalmente
   `twitter-image.png`) dentro da pasta da rota em `src/app/...`; o Next gera as
   tags automaticamente. *(não existe nenhum no repositório hoje)*
2. **Metadata por página:** exportar `metadata.openGraph.images` no `page.tsx`
   ou `layout.tsx` da rota — isso **sobrescreve** a imagem global apenas ali.

## 4. Dimensões e formato recomendados

- **Recomendado pelo padrão OG:** 1200 × 630 px (1,91:1), mínimo 200 × 200 px.
- Proporções próximas de 1,91:1 funcionam bem (a imagem oficial atual é 1,90:1).
- Formatos aceitos: PNG, JPG, WebP (PNG/JPG têm melhor compatibilidade;
  WhatsApp/Telegram lidam melhor com JPG/PNG).
- Peso: idealmente **< 600 KB** (limite prático do WhatsApp); máximo 5 MB
  (Facebook) / 8 MB (Facebook via scraper).

## 5. Como alterar a imagem oficial no futuro

Checklist obrigatório:

- [ ] Consultar este documento e `docs/ASSETS_AND_IMAGES.md`.
- [ ] Colocar o novo arquivo em `public/` (nome novo de preferência — ver §7
      sobre cache; um nome novo força atualização imediata nas plataformas).
- [ ] Medir as **dimensões reais** do arquivo (não presumir 1200×630).
- [ ] Atualizar em `src/app/layout.tsx`:
  - `openGraph.images[0].url`, `.width`, `.height`, `.alt`
  - `twitter.images[0]`
- [ ] Atualizar este documento (§1) e o inventário em `docs/ASSETS_AND_IMAGES.md`.
- [ ] Rodar `npm run lint`, `npx tsc --noEmit`, `npm run build`.
- [ ] Conferir no HTML gerado as tags `og:image`, `og:image:width`,
      `og:image:height`, `og:image:alt`, `twitter:image`.
- [ ] Após o deploy, confirmar que a URL pública responde 200.
- [ ] Limpar o cache das plataformas (§7).
- [ ] Só remover a imagem antiga de `public/` mediante aprovação
      (ver política em `docs/ASSETS_AND_IMAGES.md`).

## 6. Como validar a implementação

1. **Local:** `npm run build` e inspecionar o HTML gerado (as tags `og:*` e
   `twitter:*` devem aparecer no `<head>` com URL **absoluta**, resolvida via
   `metadataBase`).
2. **Validadores online (após deploy):**
   - Facebook Sharing Debugger — <https://developers.facebook.com/tools/debug/>
   - LinkedIn Post Inspector — <https://www.linkedin.com/post-inspector/>
   - Twitter/X Card Validator — <https://cards-dev.twitter.com/validator>
   - opengraph.xyz (genérico)
3. Confirmar acesso público direto:
   `https://anterosistemas.com.br/antero-encaminhamento.png` → HTTP 200.

## 7. Plataformas que usam Open Graph e limpeza de cache

| Plataforma | Usa OG? | Como limpar o cache do preview |
|---|---|---|
| WhatsApp | Sim | Não há ferramenta oficial. O cache expira sozinho (~dias/semanas). Solução prática: mudar a URL da imagem (nome de arquivo novo) ou acrescentar query string à URL compartilhada (`?v=2`). |
| Facebook / Instagram | Sim | [Sharing Debugger](https://developers.facebook.com/tools/debug/) → informar a URL → **Scrape Again**. |
| LinkedIn | Sim | [Post Inspector](https://www.linkedin.com/post-inspector/) → inspecionar a URL (re-faz o scrape na hora). |
| Telegram | Sim | Enviar mensagem para o bot **@WebpageBot** com a URL — ele re-escaneia e atualiza o cache. |
| Discord | Sim | Sem ferramenta oficial; cache expira em ~30 min a algumas horas, ou usar query string (`?v=2`) na URL. |
| Twitter/X | Sim (via `twitter:*` com fallback para `og:*`) | Card Validator ou aguardar expiração (~7 dias). |
| Slack, iMessage, Signal | Sim | Sem ferramenta oficial; cache próprio, geralmente curto. |

---

*Documento criado em 2026-07-16 (tarefa `docs/tasks/005_img_antero_share.md`).*
