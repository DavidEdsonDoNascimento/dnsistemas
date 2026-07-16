# ASSETS_AND_IMAGES.md — Assets e imagens

> Baseado no repositório em 13/07/2026. As referências foram levantadas por varredura em `src/**/*.ts(x)`.

---

## 1. Onde ficam as imagens (fatos verificados)

Existem **três locais distintos**, com naturezas diferentes:

| Local | Conteúdo | Servido como |
|---|---|---|
| `public/` (raiz) | Logos da ANTERO, favicon, SVGs padrão do `create-next-app` | URL direta (`/antero_logo_v1.png`) |
| `public/images/` | **Capturas de tela de produtos reais** (`sistema/`, `app/`, `site/`) | URL direta (`/images/...`) |
| `public/assets/img/` | **Imagens herdadas de template** (portfolio, person, about…) | URL direta (`/assets/img/...`) |
| `src/assets/img/` | **Cópia idêntica** das imagens de template | via import (não usado para imagens hoje) |

⚠ **`src/assets/` e `public/assets/` são duplicatas** — mesmas imagens, mesmos vendor libs (Bootstrap, AOS, GLightbox, Isotope, Swiper, PureCounter, bootstrap-icons). Ver §5.

---

## 2. Imagens efetivamente referenciadas no código

Esta é a lista **completa** do que a varredura encontrou sendo usado:

| Imagem | Onde é usada |
|---|---|
| `/antero_logo_v1.png` | `src/app/layout.tsx` (ícones, apple-touch) · `src/app/(site)/page.tsx` (JSON-LD, linhas 62 e 84) · `src/components/SiteHeader.tsx:71` · `src/features/auth/components/LoginCard.tsx:53` |
| `/antero-encaminhamento.png` | `src/app/layout.tsx` (Open Graph e Twitter Card) — **imagem oficial de compartilhamento**, 1731×909 px (ver `docs/SOCIAL_SHARING.md`) |
| `/favicon.ico` | `src/app/layout.tsx` (`icon` e `shortcut`) |
| `/assets/img/illustration/illustration-14.webp` | `src/app/(site)/page.tsx:228` — ilustração do **hero** |
| `/assets/img/about/about-square-8.webp` | `src/app/(site)/page.tsx:252` — seção **about** |
| ⚠ `/antero_logo_header_croppezd.png` | `src/components/Header/index.tsx:22` — **referência quebrada** (ver §4) |

**Conclusão importante:** de todas as imagens do repositório, apenas **cinco** estão realmente em uso na aplicação. Todo o resto é template não utilizado ou material preparado para uso futuro.

---

## 3. Padrões de nome observados

| Padrão | Exemplos | Origem (inferência) |
|---|---|---|
| `<categoria>-<n>.webp` | `portfolio-4.webp`, `person-m-11.webp`, `about-square-8.webp`, `services-3.webp`, `illustration-14.webp`, `misc-16.webp` | **Template pronto.** A numeração esparsa e não sequencial (portfolio 4–12, sem 1–3) é a assinatura típica de arquivos selecionados de um pacote maior de template. |
| `person-f-N` / `person-m-N` | `person-f-3.webp`, `person-m-14.webp` | Fotos genéricas de pessoas (female/male) — **não são funcionários da ANTERO**. |
| nome descritivo em português | `mapeamento-detalhes.png`, `pendentes-aprovacao.png`, `lista-testes.PNG`, `visao-ativo.png` | **Conteúdo próprio da ANTERO** — capturas de telas reais. |
| `antero_logo_*` / `logo_v1` | `antero_logo_v1.png`, `antero_logo_header_cropped.png`, `logo_v1.png` | Marca própria. |

Note a inconsistência de extensão em `public/images/`: `.PNG` em maiúsculas (`login.PNG`, `home.PNG`) e `.png` em minúsculas. Em Windows não causa problema; **em servidor Linux (produção) o caminho é case-sensitive** — se essas imagens forem referenciadas no futuro, a extensão precisa bater exatamente.

---

## 4. ⚠ Referência quebrada identificada

`src/components/Header/index.tsx:22` aponta para:

```
/antero_logo_header_croppezd.png     ← não existe
```

O arquivo real é:

```
public/antero_logo_header_cropped.png     ← "cropped", não "croppezd"
```

**Impacto atual: nenhum.** Esse componente `Header` **não é importado por nenhum arquivo** — o cabeçalho em uso na landing é `src/components/SiteHeader.tsx`. Trata-se de código morto contendo um defeito.

*Requer decisão humana:* corrigir o caminho e usar o componente, ou removê-lo. **Nenhuma ação foi tomada.**

---

## 5. ⚠ Duplicação `src/assets/` × `public/assets/`

Os dois diretórios contêm o **mesmo conteúdo**: `img/`, `js/main.js`, e todo o `vendor/` (Bootstrap completo com sourcemaps, bootstrap-icons, AOS, GLightbox, Isotope, imagesLoaded, PureCounter, Swiper).

Só que são consumidos por **caminhos diferentes**, e por isso **os dois estão em uso hoje**:

- **`src/assets/`** → consumido por **import** no `src/app/layout.tsx`:
  ```ts
  import '@/assets/vendor/bootstrap/css/bootstrap.min.css'
  import '@/assets/css/main.css'
  import '@/assets/vendor/bootstrap-icons/bootstrap-icons.css'
  ```
- **`public/assets/`** → consumido por **URL** em `src/app/(site)/page.tsx`:
  ```tsx
  <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" ... />
  <Script src="/assets/js/main.js" ... />
  <img src="/assets/img/illustration/illustration-14.webp" ... />
  ```

**Consequência prática: NÃO apagar nenhum dos dois diretórios sem uma tarefa dedicada de limpeza.** Remover `src/assets/` quebra o CSS global; remover `public/assets/` quebra o JS do template e as duas imagens da landing.

Uma limpeza segura seria uma tarefa própria (mapear o que é realmente carregado, mover para um único local, testar visualmente). **Não faz parte de nenhuma tarefa aprovada até agora.**

---

## 6. Assets herdados de template — inventário

**Imagens de template presentes mas NÃO utilizadas** (existem em `src/assets/img/` **e** `public/assets/img/`):

- `portfolio/portfolio-4..12.webp` (9 arquivos) — nenhuma seção de portfólio existe hoje na landing.
- `person/person-f-*.webp` e `person/person-m-*.webp` (11 arquivos) — nenhuma seção de equipe/depoimentos existe hoje.
- `about/about-9.webp` — só `about-square-8.webp` é usada.
- `services/services-3.webp`, `misc/misc-16.webp`, `logo.webp`, `favicon.png`, `apple-touch-icon.png`.

**Outros resquícios de template:**

- `assets/vendor/php-email-form/php-email-form.php` — **arquivo PHP em um projeto Next.js**. Inerte (não é executado), mas é lixo de template. O envio real de e-mail é feito por `src/app/api/contact/route.ts` via Resend.
- `src/assets/scss/` — SCSS-fonte do template (`_hero.scss`, `_portfolio.scss`, `_team.scss`, `_testimonials.scss`, etc.). **Não há dependência `sass` no `package.json`** e o layout importa o CSS já compilado. Portanto **editar o SCSS não tem efeito nenhum no site**.
- Vendor libs carregadas mas de uso não confirmado: AOS (animações), GLightbox, Isotope, imagesLoaded, PureCounter. O `public/assets/js/main.js` (do template) é que as inicializa. *Necessita confirmação humana sobre quais ainda são desejadas.*
- SVGs do `create-next-app`: `public/next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg` — não referenciados.

---

## 7. Material próprio preparado, mas não usado

Em `public/images/` há capturas de tela que parecem ser de **entregas reais da ANTERO**:

- `public/images/sistema/` → `mapeamento-detalhes.png`, `pendentes-aprovacao.png`, `visao-ativo.png`
- `public/images/sistema-dashboard.png`
- `public/images/app/` → `identificacao.PNG`, `lista-testes.PNG`, `login.PNG`, `teste-andamento.PNG`
- `public/images/site/` → `acomodacoes.PNG`, `contato.PNG`, `home.PNG`

**Nenhuma delas é referenciada no código atual.** *Inferência:* foram preparadas para uma futura seção de cases/portfólio. *Necessita confirmação humana.*

---

## 8. Resumo dos riscos

1. Referência quebrada em componente órfão (`Header/index.tsx`) — §4.
2. Duplicação de assets: peso no repositório e risco de editar o arquivo errado (mexer em `src/assets/img/` não muda o que a landing exibe, pois ela serve de `public/`) — §5.
3. SCSS decorativo: alterá-lo não produz efeito — §6.
4. Extensões `.PNG` maiúsculas: risco de 404 em produção Linux se vierem a ser usadas — §3.
5. Imagens de template não utilizadas inflam o deploy sem entregar valor — §6.
