# ETAPA 01 — Evolução Comercial da Antero Sistemas

Atue como Senior Frontend Engineer, UI/UX Designer e especialista em websites B2B focados em geração de oportunidades comerciais.

**OBJETIVO: transformar o site atual em uma apresentação comercial mais convincente, adicionando projetos reais e informações sobre o profissional responsável pela engenharia de software.**

Esta é uma evolução incremental. Não reconstrua o site do zero. Não altere sua identidade visual sem necessidade. Não implemente ferramentas de analytics nesta etapa.

## 1. Antes de implementar

Inspecione o projeto (estrutura Next.js, seções, tokens, tipografia, Header/Footer, serviços, processo, formulário, Resend, SEO, responsividade, gerenciador de pacotes, Git). Respeite os padrões. Não migre o gerenciador de pacotes nem atualize dependências. Trabalhe exclusivamente neste repositório.

## 2. Nova seção — Projetos e Soluções

Título: **Projetos e soluções desenvolvidas**
Subtítulo: "Tecnologia aplicada a problemas reais de negócio."
Descrição: "Conheça exemplos de soluções desenvolvidas para organizar operações, automatizar processos e transformar necessidades específicas em software sob medida."

Seguir a identidade visual existente da Antero (não copiar o visual do portfólio pessoal).

### Projeto principal — Plataforma de Gestão de Pedidos

- Categoria: Automação de processos comerciais.
- Projeto real, aplicação privada hospedada em `https://pedidos.anterosistemas.com.br/`. Não acessar com credenciais, não chamar rotas privadas, não expor dados da operação.
- Contexto do problema: recebimento de informações por mensagens; organização e conferência dos pedidos; planilhas e controles manuais; agrupamento de lançamentos por cliente; cálculo e preparação das cobranças.
- Solução: aplicação web para apoiar a gestão dos pedidos — organização de lançamentos, revisão de informações, agrupamento de pedidos por cliente e apoio à preparação das cobranças. Apresentar somente funcionalidades confirmadas; não inventar módulos, integrações ou resultados.
- Descrição comercial: "Desenvolvimento de uma plataforma personalizada para centralizar pedidos, organizar informações comerciais e simplificar a preparação de cobranças, substituindo fluxos fragmentados por uma experiência integrada."
- Card: categoria, nome, contexto, solução, destaques confirmados, representação visual, CTA "Precisa de uma solução semelhante?" → seção de contato existente.
- Privacidade: sem nome da cliente, compradores, pedidos reais, valores, dados financeiros, credenciais ou capturas reais. Ilustração conceitual em SVG/CSS com dados fictícios, identificada como "Ilustração conceitual".
- Resultados: não inventar percentuais, redução de tempo, produtividade, usuários, faturamento ou volume. Sem depoimentos fictícios.

## 3. Estrutura para futuros projetos

Dados estruturados e tipados (id, title, category, description, challenge, solution, highlights, visual, cta) para permitir novos cases sem reconstruir a seção. Publicar somente o case de Gestão de Pedidos; sem cards fictícios ou placeholders. Não apresentar trabalhos para antigos empregadores como contratos da Antero.

## 4. Nova seção — Responsável Técnico

Informações confirmadas: David Nascimento, Engenheiro de Software Full Stack Sênior, mais de 10 anos de experiência em desenvolvimento de software. Especialidades: aplicações web e mobile; sistemas empresariais; engenharia backend; arquitetura de software; integrações entre sistemas; aplicações em tempo real; automação de processos; soluções personalizadas para negócios. Experiência em empresas de tecnologia e projetos de varejo, logística, sistemas geoespaciais e SaaS; liderança técnica de squad e colaboração com equipes multidisciplinares.

Título: "Experiência de engenharia por trás de cada solução." Monograma DN, sem fotografia nem avatar artificial. Não apresentar a Antero como grande equipe nem como operação exclusivamente individual; foco na responsabilidade técnica.

CTA "Conhecer o portfólio técnico" → `https://davidnascimento.io` (`target="_blank"`, `rel="noopener noreferrer"`). O CTA comercial de contato continua visualmente prioritário.

## 5. Integração

Ordem preferida: Hero → Serviços → Projetos → Processo → Responsável técnico → demais → Contato. Preservar navegação, footer, serviços, processo, FAQ, formulário, Resend, Cloudflare e SEO. Adicionar "Projetos" à navegação; não adicionar "Portfólio pessoal" ao Header.

## 6. Conversão

Revisar CTAs (ex.: "Agendar análise" → "Solicitar análise"). Sem agendamento online, pop-ups, contadores ou urgência artificial.

## 7–8. Responsividade, performance e acessibilidade

375, 390, 768, 1024, 1440 px sem overflow horizontal. Sem bibliotecas pesadas; CSS e SVG; manter Server Components. Contraste, hierarquia semântica, foco visível, teclado, `prefers-reduced-motion`.

## 9–10. Fora do escopo e SEO

Sem analytics, CRM, chatbot, IA, novo formulário, agendamento, banco, APIs. Não modificar o sistema de pedidos, o portfólio, VPS, Coolify, DNS ou Resend. Preservar metadados; não criar páginas de estudo de caso; não alterar sitemap/canonical/robots.

## 11–12. Validação e Git

Lint, typecheck, testes (se houver) e build. Commit local `feat: add case studies and technical leadership section`. Sem push e sem deploy.

---

## Ajustes aprovados junto com o plano

1. **Navegação responsiva:** autonomia para pequenos ajustes de espaçamento/breakpoint no Header se os oito itens não couberem.
2. **Textos sobre a equipe:** correções pontuais em expressões que apresentam a Antero como fábrica/equipe grande, preferindo "engenharia de software com experiência sênior", "desenvolvimento de software sob medida", "soluções conduzidas com responsabilidade técnica". Sem reescrever o conteúdo comercial.
3. **Telefone no JSON-LD:** divergência com o WhatsApp do site mantida como pendência documentada (`docs/PROJECT_CONTEXT.md` §6, item 7) para confirmação antes do deploy.
4. **Identidade visual:** ouro `#B08D57` é a referência válida; documentação de identidade visual pode ser atualizada para refletir o estado atual.
5. **Gerenciador de pacotes:** npm (`npm ci`), sem modificar lockfiles.
6–8. Implementar conforme o plano; validar lint, typecheck, build e inspeção visual em 375, 390, 768, 1024, 1200 e 1440 px; commit local sem push nem deploy.
