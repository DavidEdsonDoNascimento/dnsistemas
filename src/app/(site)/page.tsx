import Script from 'next/script'
import AboutOfficeVideo from '@/components/about/AboutOfficeVideo'
import ContactForm from '@/components/contact-form'
import HeroBackgroundVideo from '@/components/hero/HeroBackgroundVideo'
import SiteHeader from '@/components/SiteHeader'
import { getWhatsAppOrcamentoHref } from '@/lib/whatsapp-orcamento'
import lc from '@/theme/landing.module.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://anterosistemas.com.br'

const FAQ_ITEMS: Array<{ question: string; answer: string }> = [
  {
    question: 'Quanto custa desenvolver um sistema personalizado para empresa?',
    answer:
      'O investimento em um sistema sob medida varia conforme escopo, integrações e complexidade. Projetos pontuais costumam começar em poucos milhares de reais, e plataformas internas completas envolvem investimento maior, sempre cobrado por marcos entregáveis. Após uma conversa de 30 minutos, enviamos uma proposta clara com valores e prazos antes de qualquer compromisso.',
  },
  {
    question: 'Quanto tempo leva para criar um software sob medida?',
    answer:
      'Um MVP funcional de software personalizado costuma ficar pronto entre 6 e 12 semanas. Sistemas empresariais maiores são entregues por marcos quinzenais, e cada marco já entra em uso pela operação. Trabalhamos com prazos realistas alinhados ao tamanho do problema e à urgência do seu negócio.',
  },
  {
    question: 'Vale a pena automatizar processos na empresa?',
    answer:
      'Sim, sempre que existem tarefas repetitivas, planilhas paralelas, retrabalho manual ou erros recorrentes. A automação de processos empresariais reduz custo operacional, libera o time para atividades estratégicas e aumenta a previsibilidade. Em geral, o retorno aparece em poucos meses quando o processo automatizado tem volume relevante.',
  },
  {
    question: 'Como funciona o desenvolvimento de software sob medida?',
    answer:
      'Começamos com uma descoberta curta para entender o problema de negócio, mapear o processo atual e validar premissas. Depois formalizamos um escopo enxuto com marcos quinzenais, definimos arquitetura, stack e contrato de entrega. A cada marco, você usa, valida e dá feedback — sem surpresas de escopo nem entregas-fantasma.',
  },
  {
    question: 'Vocês atendem empresas em todo o Brasil ou só em Santa Catarina?',
    answer:
      'Atendemos empresas em todo o Brasil de forma 100% remota, com reuniões por videoconferência e WhatsApp. Nossa base é em Santa Catarina, e por isso temos forte presença em clientes da região Sul, mas a operação é distribuída e funciona igualmente bem para empresas de qualquer estado.',
  },
  {
    question: 'Quem é dono do código-fonte do sistema desenvolvido?',
    answer:
      'Você. Todo software personalizado que entregamos é seu, com código-fonte, documentação mínima e acesso aos repositórios. Isso significa que você não fica refém: pode evoluir o sistema com o seu time interno, com a ANTERO ou com qualquer outro fornecedor no futuro.',
  },
  {
    question: 'Qual a diferença entre sistema pronto e sistema sob medida?',
    answer:
      'Sistemas prontos resolvem problemas genéricos com a lógica de negócio que o fornecedor decidiu impor. Já um sistema sob medida é construído em torno do seu processo real, integra com as ferramentas que você já usa e cresce junto com a empresa. Quando o processo é diferencial competitivo, software sob medida costuma se pagar muito mais rápido.',
  },
  {
    question: 'Vocês fazem manutenção e suporte depois da entrega?',
    answer:
      'Sim. Oferecemos contratos de evolução e sustentação após o go-live, com SLA combinado. Também é possível receber o sistema, treinar seu time e seguir sem dependência da ANTERO — fica a critério do que faz mais sentido para o seu negócio.',
  },
]

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'ANTERO Sistemas',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/antero_logo_v1.png`,
        width: 512,
        height: 512,
      },
      description:
        'Empresa de desenvolvimento de software sob medida em Santa Catarina. Criação de sistemas empresariais, automação de processos e aplicativos personalizados para empresas em todo o Brasil.',
      email: 'contato@anterosistemas.com.br',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+55 47 99682-4402',
          contactType: 'sales',
          areaServed: 'BR',
          availableLanguage: ['Portuguese'],
        },
      ],
      sameAs: [],
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: 'ANTERO Sistemas',
      image: `${SITE_URL}/antero_logo_v1.png`,
      url: SITE_URL,
      telephone: '+55 47 99682-4402',
      email: 'contato@anterosistemas.com.br',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'SC',
        addressCountry: 'BR',
      },
      areaServed: [
        { '@type': 'Country', name: 'Brasil' },
        { '@type': 'AdministrativeArea', name: 'Santa Catarina' },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'ANTERO Sistemas',
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'Service',
      '@id': `${SITE_URL}/#service-software`,
      serviceType: 'Desenvolvimento de software sob medida',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'Country', name: 'Brasil' },
      description:
        'Desenvolvimento de software personalizado para empresas: sistemas empresariais, automação de processos, integrações e aplicativos sob medida.',
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
}

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="main">
        <section
          id="hero"
          className={`hero section ${lc.landingHero}`}
          aria-labelledby="hero-title"
        >
          <HeroBackgroundVideo />
          <div className={lc.landingHeroGlow} aria-hidden />

          <div className="container position-relative">
            <div className={`row align-items-center ${lc.landingHeroLayout}`}>
              <div className="col-lg-6">
                <div className={`hero-content ${lc.landingHeroContent}`}>
                  <span className={lc.landingEyebrow}>
                    Desenvolvimento de software sob medida
                  </span>

                  <h1 id="hero-title" className={lc.landingHeroTitle}>
                    Desenvolvimento de software personalizado para empresas em Santa Catarina e
                    todo o Brasil.
                  </h1>

                  <p className={lc.landingHeroLead}>
                    Criamos sistemas sob medida, automação de processos empresariais e aplicativos
                    personalizados para reduzir custo operacional, eliminar planilhas e escalar a
                    operação com previsibilidade.
                  </p>

                  <div className={`d-flex flex-wrap gap-2 ${lc.landingHeroActions}`}>
                    <a
                      href="#contact"
                      className={`btn ${lc.landingBtnPrimary}`}
                      aria-label="Solicitar orçamento de software personalizado"
                    >
                      Solicitar um orçamento
                    </a>
                    <a
                      href="#services"
                      className={`btn ${lc.landingBtnGhost}`}
                      aria-label="Ver serviços de desenvolvimento de software"
                    >
                      Ver serviços
                    </a>
                  </div>

                  <p className={lc.landingHeroMeta}>
                    <strong>Engenharia e produto</strong> · Orçamento claro · Entregas por marcos
                    quinzenais
                  </p>

                  <div className="row mt-4 gx-3 gy-3">
                    <div className="col-sm-4">
                      <div className={lc.landingCardWhite}>
                        <h2 className={lc.landingMiniHeading}>Eficiência operacional</h2>
                        <p className={lc.landingParagraphNoMargin}>
                          Processos críticos automatizados, com menos retrabalho manual.
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className={lc.landingCardWhite}>
                        <h2 className={lc.landingMiniHeading}>Escala previsível</h2>
                        <p className={lc.landingParagraphNoMargin}>
                          Arquitetura preparada para crescimento real do seu negócio.
                        </p>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className={lc.landingCardWhite}>
                        <h2 className={lc.landingMiniHeading}>Controle e dados</h2>
                        <p className={lc.landingParagraphNoMargin}>
                          Informação rastreável para decisões mais seguras.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mt-4 mt-lg-0">
                <div className={lc.landingHeroVisualWrap}>
                  <div className={lc.landingHeroPanel}>
                    <span className={lc.landingHeroPanelLabel}>Visão do produto</span>
                    <strong className={lc.landingHeroPanelTitle}>
                      Dashboard operacional em tempo real
                    </strong>
                    <p className={lc.landingHeroPanelText}>
                      KPIs críticos, alertas e fluxo de trabalho centralizados em um sistema
                      empresarial sob medida.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className={`section ${lc.landingSectionSoft}`}
          aria-labelledby="about-title"
        >
          <div className="container">
            <div className="row align-items-start gy-5 gx-lg-5">
              <div className="col-lg-6">
                <div className={lc.landingAboutContent}>
                  <span className={lc.landingEyebrow}>Empresa de software no Brasil</span>

                  <h2 id="about-title" className={lc.landingHeading2Tight}>
                    Fábrica de software com time sênior e escopo transparente.
                  </h2>

                  <p className={lc.landingParagraph}>
                    A ANTERO Sistemas é uma empresa de desenvolvimento de software personalizado
                    sediada em Santa Catarina, atendendo empresas em todo o Brasil. Trabalhamos com
                    times de engenharia sênior para resolver problemas reais: reduzir planilhas
                    paralelas, eliminar erro manual e dar rastreabilidade a processos críticos.
                  </p>

                  <p className={lc.landingParagraphLoose}>
                    Cada projeto começa com uma descoberta curta, escopo claro e marcos
                    quinzenais — sem surpresas no orçamento, sem folhetos vagos sobre
                    &quot;tecnologia de ponta&quot;. O código sai documentado no mínimo necessário
                    para o seu time dar continuidade ou para outro fornecedor assumir.
                  </p>

                  <div className="row gy-4 gx-3">
                    <div className="col-sm-6">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Clareza antes do código</h3>
                        <p className={lc.landingParagraphNoMargin}>
                          Definimos primeiro o objetivo de negócio, depois arquitetura, stack e
                          contrato de entrega.
                        </p>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Pronto para produção</h3>
                        <p className={lc.landingParagraphNoMargin}>
                          Performance, segurança e manutenção entram no desenho do sistema desde o
                          primeiro marco.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <AboutOfficeVideo />
              </div>
            </div>
          </div>
        </section>

        <section
          id="services"
          className={`section ${lc.landingSectionWhite}`}
          aria-labelledby="services-title"
        >
          <div className="container">
            <div className={`text-center ${lc.landingSectionIntroWide} ${lc.landingSectionIntro}`}>
              <span className={lc.landingEyebrow}>Serviços</span>
              <h2 id="services-title" className={lc.landingHeading2}>
                Serviços de desenvolvimento de sistemas sob medida para empresas
              </h2>
              <p className={lc.landingParagraphCenter}>
                Três frentes de atuação, cada uma focada em reduzir custo operacional, aumentar
                conversão ou diminuir tempo de ciclo do seu negócio.
              </p>
            </div>

            <div className="row gy-4 gx-lg-4">
              <div className="col-lg-4">
                <article className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon} aria-hidden>
                    <i className="bi bi-diagram-3"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>
                    Sistemas empresariais e automação de processos
                  </h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Plataformas internas que unificam dados, automatizam processos empresariais
                    repetitivos, eliminam retrabalho e oferecem auditoria. Mais throughput com o
                    mesmo headcount.
                  </p>
                </article>
              </div>

              <div className="col-lg-4">
                <article className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon} aria-hidden>
                    <i className="bi bi-window-stack"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>
                    Desenvolvimento de sistemas web e site institucional B2B
                  </h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Sites institucionais e portais B2B otimizados para SEO, performance e
                    conversão. Plataforma rápida, com posicionamento claro e suporte a vendas
                    consultivas.
                  </p>
                </article>
              </div>

              <div className="col-lg-4">
                <article className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon} aria-hidden>
                    <i className="bi bi-phone"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>
                    Aplicativos personalizados e integração de sistemas
                  </h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Aplicativos mobile sob medida e integrações entre ERP, CRM, e-commerce e
                    APIs externas. Para times em campo, operações híbridas e fluxos
                    omnichannel.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Como funciona */}
        <section
          id="como-funciona"
          className={`section ${lc.landingSectionSoft}`}
          aria-labelledby="how-title"
        >
          <div className="container">
            <div className={`text-center ${lc.landingSectionIntroWide} ${lc.landingSectionIntro}`}>
              <span className={lc.landingEyebrow}>Como funciona</span>
              <h2 id="how-title" className={lc.landingHeading2}>
                Como funciona o desenvolvimento de software personalizado na ANTERO
              </h2>
              <p className={lc.landingParagraphCenter}>
                Um processo simples, com marcos quinzenais e zero surpresa de escopo. Você
                acompanha cada etapa do desenvolvimento do sistema sob medida.
              </p>
            </div>

            <div className="row gy-4 gx-lg-4">
              <div className="col-md-6 col-lg-3">
                <article className={lc.landingServiceCard}>
                  <span className={lc.landingStepNumber}>01</span>
                  <h3 className={lc.landingServiceTitle}>Descoberta e diagnóstico</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Entendemos o problema de negócio, mapeamos o processo atual e validamos
                    hipóteses com dados reais — sem briefing genérico.
                  </p>
                </article>
              </div>

              <div className="col-md-6 col-lg-3">
                <article className={lc.landingServiceCard}>
                  <span className={lc.landingStepNumber}>02</span>
                  <h3 className={lc.landingServiceTitle}>Escopo, proposta e arquitetura</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Você recebe escopo enxuto, prazo, valor e arquitetura técnica do sistema
                    personalizado antes de qualquer compromisso.
                  </p>
                </article>
              </div>

              <div className="col-md-6 col-lg-3">
                <article className={lc.landingServiceCard}>
                  <span className={lc.landingStepNumber}>03</span>
                  <h3 className={lc.landingServiceTitle}>Desenvolvimento por marcos</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Entregas funcionais a cada 2 semanas. Você usa, valida e prioriza junto com o
                    time de engenharia.
                  </p>
                </article>
              </div>

              <div className="col-md-6 col-lg-3">
                <article className={lc.landingServiceCard}>
                  <span className={lc.landingStepNumber}>04</span>
                  <h3 className={lc.landingServiceTitle}>Go-live, evolução e suporte</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Implantação em produção, treinamento do time e plano de evolução contínua do
                    software empresarial.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Para quem */}
        <section
          id="para-quem"
          className={`section ${lc.landingSectionWhite}`}
          aria-labelledby="who-title"
        >
          <div className="container">
            <div className={`text-center ${lc.landingSectionIntroWide} ${lc.landingSectionIntro}`}>
              <span className={lc.landingEyebrow}>Para quem é</span>
              <h2 id="who-title" className={lc.landingHeading2}>
                Quais empresas precisam de automação de processos e sistemas sob medida
              </h2>
              <p className={lc.landingParagraphCenter}>
                Se a sua empresa se identifica com algum destes cenários, um sistema personalizado
                provavelmente resolve mais barato do que contratar gente para tapar o buraco.
              </p>
            </div>

            <div className="row gy-4 gx-lg-4">
              <div className="col-md-6">
                <article className={lc.landingServiceCard}>
                  <h3 className={lc.landingServiceTitle}>
                    Operações que vivem em planilhas paralelas
                  </h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Indústria, logística, distribuição ou serviços B2B onde Excel virou banco de
                    dados oficial e ninguém sabe qual versão é a verdadeira.
                  </p>
                </article>
              </div>

              <div className="col-md-6">
                <article className={lc.landingServiceCard}>
                  <h3 className={lc.landingServiceTitle}>
                    Empresas com ERP que não cobre o processo principal
                  </h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Quando o sistema pronto não atende ao seu fluxo real e o time inventa
                    workarounds. Aqui um software sob medida integrado ao ERP resolve.
                  </p>
                </article>
              </div>

              <div className="col-md-6">
                <article className={lc.landingServiceCard}>
                  <h3 className={lc.landingServiceTitle}>
                    Negócios em crescimento com retrabalho manual
                  </h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Empresas escalando vendas, atendimento ou produção e percebendo que o custo de
                    operar dobra a cada novo cliente — sinal claro para automatizar processos.
                  </p>
                </article>
              </div>

              <div className="col-md-6">
                <article className={lc.landingServiceCard}>
                  <h3 className={lc.landingServiceTitle}>
                    Times comerciais e de campo sem aplicativo próprio
                  </h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Vendedores externos, técnicos em campo ou franquias que precisam de um
                    aplicativo personalizado conectado ao core do negócio.
                  </p>
                </article>
              </div>

              <div className="col-md-6">
                <article className={lc.landingServiceCard}>
                  <h3 className={lc.landingServiceTitle}>
                    Empresas que precisam integrar sistemas
                  </h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Integração entre ERP, CRM, e-commerce, marketplaces e APIs externas. Fim das
                    importações manuais e da exportação de planilhas entre setores.
                  </p>
                </article>
              </div>

              <div className="col-md-6">
                <article className={lc.landingServiceCard}>
                  <h3 className={lc.landingServiceTitle}>
                    Negócios que tratam dado como ativo
                  </h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Indicadores em tempo real, BI operacional e dashboards executivos para decisões
                    rápidas baseadas em dados confiáveis.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Benefícios */}
        <section
          id="beneficios"
          className={`section ${lc.landingSectionSoft}`}
          aria-labelledby="benefits-title"
        >
          <div className="container">
            <div className="row align-items-start gy-5 gx-lg-5">
              <div className="col-lg-6">
                <span className={lc.landingEyebrow}>Benefícios</span>
                <h2 id="benefits-title" className={lc.landingHeading2Tight}>
                  Benefícios de um sistema personalizado para a sua empresa
                </h2>
                <p className={lc.landingParagraph}>
                  Diferente de software pronto, um sistema sob medida é construído em torno do seu
                  processo, dos seus números e da sua realidade operacional. O resultado aparece
                  no P&amp;L, não em folhetos.
                </p>

                <ul className={lc.landingCheckList}>
                  <li>
                    <strong>Redução de custo operacional</strong> — menos horas em trabalho manual
                    repetitivo e menos erros caros.
                  </li>
                  <li>
                    <strong>Escala sem dobrar headcount</strong> — automação de processos para
                    crescer vendas, atendimento ou produção sem inflar o time.
                  </li>
                  <li>
                    <strong>Decisões com dados confiáveis</strong> — indicadores rastreáveis em
                    tempo real, fim das planilhas conflitantes.
                  </li>
                  <li>
                    <strong>Integração com o que você já usa</strong> — ERP, CRM, e-commerce,
                    marketplaces e APIs internas conversando entre si.
                  </li>
                  <li>
                    <strong>Independência tecnológica</strong> — código, arquitetura e
                    documentação são seus, sem refém de fornecedor.
                  </li>
                  <li>
                    <strong>Vantagem competitiva real</strong> — o seu processo vira diferencial,
                    não vira limite.
                  </li>
                </ul>
              </div>

              <div className="col-lg-6">
                <div className={lc.landingCardWhite}>
                  <h3 className={lc.landingMiniHeading}>Quando faz sentido contratar</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Software personalizado costuma se pagar quando o processo automatizado tem
                    volume relevante, quando o ERP padrão limita o crescimento, ou quando o
                    diferencial competitivo da empresa está no jeito de operar.
                  </p>
                </div>

                <div className={`mt-3 ${lc.landingCardWhite}`}>
                  <h3 className={lc.landingMiniHeading}>Quando NÃO faz sentido</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Se o problema é resolvido por uma planilha bem feita ou por uma ferramenta de
                    prateleira de R$ 200/mês, dizemos. Não vendemos projeto que você não precisa.
                  </p>
                </div>

                <div className={`mt-3 ${lc.landingCardWhite}`}>
                  <h3 className={lc.landingMiniHeading}>Atendimento em todo o Brasil</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Operação remota com base em Santa Catarina. Atendemos empresas em São Paulo,
                    Rio de Janeiro, Paraná, Rio Grande do Sul, Minas Gerais e demais estados sem
                    fronteira de localização.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investimento */}
        <section
          id="investimento"
          className={`section ${lc.landingSectionWhite}`}
          aria-labelledby="invest-title"
        >
          <div className="container">
            <div className={`text-center ${lc.landingSectionIntroWide} ${lc.landingSectionIntro}`}>
              <span className={lc.landingEyebrow}>Investimento</span>
              <h2 id="invest-title" className={lc.landingHeading2}>
                Quanto custa um sistema sob medida para empresa
              </h2>
              <p className={lc.landingParagraphCenter}>
                O preço de desenvolvimento de software personalizado depende de escopo,
                integrações e complexidade. Trabalhamos por marcos quinzenais e proposta enxuta,
                sem aluguel eterno disfarçado de mensalidade.
              </p>
            </div>

            <div className="row gy-4 gx-lg-4">
              <div className="col-lg-4">
                <article className={lc.landingServiceCard}>
                  <h3 className={lc.landingServiceTitle}>Projeto pontual</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Automação de um processo específico, integração entre dois sistemas, módulo
                    interno ou MVP de produto digital. Escopo curto, entrega em poucas semanas.
                  </p>
                </article>
              </div>

              <div className="col-lg-4">
                <article className={lc.landingServiceCard}>
                  <h3 className={lc.landingServiceTitle}>Plataforma interna</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Sistema empresarial completo cobrindo um processo crítico de ponta a ponta:
                    cadastros, fluxos, integrações, relatórios e controle de acesso.
                  </p>
                </article>
              </div>

              <div className="col-lg-4">
                <article className={lc.landingServiceCard}>
                  <h3 className={lc.landingServiceTitle}>Produto digital</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Software para vender ao mercado, com discovery, MVP, validação com
                    clientes-piloto e roadmap de evolução. Trabalhamos como time de engenharia e
                    produto.
                  </p>
                </article>
              </div>
            </div>

            <p
              className={`text-center mt-4 ${lc.landingParagraphCenter}`}
              style={{ maxWidth: '40rem' }}
            >
              Após uma conversa de 30 minutos, enviamos uma proposta clara com escopo, prazo e
              valor. Sem reunião com 12 pessoas, sem PDF de 80 páginas, sem letras miúdas.
            </p>
          </div>
        </section>

        <section className={`section ${lc.landingSectionPadBottom}`} aria-label="Próximos passos">
          <div className="container">
            <div className={lc.landingRibbon}>
              <div className="row align-items-center gy-3 gx-lg-4">
                <div className="col-lg-8">
                  <h2 className={lc.landingRibbonTitle}>
                    Próximo passo: 30 minutos para alinhar escopo e orçamento.
                  </h2>
                  <p className={lc.landingRibbonText}>
                    Conte o problema em uma frase. Devolvemos se faz sentido contratar
                    desenvolvimento de software sob medida — e em que formato.
                  </p>
                </div>
                <div className="col-lg-4 text-lg-end">
                  <a href="#contact" className={`btn ${lc.landingRibbonBtn}`}>
                    Agendar análise
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className={`section ${lc.landingSectionSoft}`}
          aria-labelledby="faq-title"
        >
          <div className="container">
            <div className={`text-center ${lc.landingSectionIntroWide} ${lc.landingSectionIntro}`}>
              <span className={lc.landingEyebrow}>Dúvidas frequentes</span>
              <h2 id="faq-title" className={lc.landingHeading2}>
                Perguntas frequentes sobre desenvolvimento de software sob medida
              </h2>
              <p className={lc.landingParagraphCenter}>
                Respostas diretas para as dúvidas mais buscadas no Google sobre criação de
                sistemas personalizados, prazo, custo e contratação de fábrica de software.
              </p>
            </div>

            <div className={lc.landingFaqWrap}>
              {FAQ_ITEMS.map((item, index) => (
                <details
                  key={item.question}
                  className={lc.landingFaqItem}
                  open={index === 0}
                >
                  <summary className={lc.landingFaqQuestion}>
                    <h3 className={lc.landingFaqQuestionText}>{item.question}</h3>
                    <span className={lc.landingFaqIcon} aria-hidden>
                      <i className="bi bi-plus-lg"></i>
                    </span>
                  </summary>
                  <p className={lc.landingFaqAnswer}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section
          id="contact"
          className={`section ${lc.landingSectionWhite}`}
          aria-labelledby="contact-title"
        >
          <div className="container">
            <div className={`text-center ${lc.landingSectionIntroWide} ${lc.landingSectionIntro}`}>
              <span className={lc.landingEyebrow}>Contato</span>
              <h2 id="contact-title" className={lc.landingHeading2}>
                Solicite um orçamento de software personalizado
              </h2>
              <p className={lc.landingParagraphCenter}>
                Conte rapidamente o que precisa resolver. Respondemos em até um dia útil com
                próximos passos para o seu projeto de sistema sob medida.
              </p>
            </div>

            <div className="row gy-5 gx-lg-5">
              <div className="col-lg-4">
                <div className={lc.landingContactInfo}>
                  <div className={lc.landingContactBlock}>
                    <h3 className={lc.landingMiniHeadingSm}>E-mail comercial</h3>
                    <p className={lc.landingParagraphNoMargin}>
                      <a
                        href="mailto:contato@anterosistemas.com.br"
                        className={lc.landingContactLink}
                      >
                        contato@anterosistemas.com.br
                      </a>
                    </p>
                  </div>

                  <a
                    className={`${lc.landingContactBlock} ${lc.landingContactBlockClickable}`}
                    href={getWhatsAppOrcamentoHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Falar com a ANTERO Sistemas pelo WhatsApp"
                  >
                    <h3 className={lc.landingMiniHeadingSm}>WhatsApp para orçamento</h3>
                    <p className={lc.landingParagraphNoMargin}>
                      Para urgências ou agendar uma chamada rápida sobre seu projeto de software.
                      Atendimento em horário comercial.
                    </p>
                  </a>

                  <div className={lc.landingContactBlock}>
                    <h3 className={lc.landingMiniHeadingSm}>Atendimento</h3>
                    <p className={lc.landingParagraphNoMargin}>
                      Empresa de software baseada em <strong>Santa Catarina</strong>, atendendo
                      clientes em todo o <strong>Brasil</strong> de forma 100% remota.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-lg-8">
                <div className={lc.landingFormShell}>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className={`footer ${lc.landingFooter}`}>
        <div className="container">
          <p className={lc.landingFooterText}>
            <span suppressHydrationWarning className={lc.landingFooterStrong}>
              © {new Date().getFullYear()} ANTERO Sistemas
            </span>
            <span className={lc.landingFooterSep}> · </span>
            <span className={lc.landingFooterSep}>
              Desenvolvimento de software sob medida em Santa Catarina e todo o Brasil. Todos os
              direitos reservados.
            </span>
          </p>
        </div>
      </footer>

      <Script
        id="ld-json-organization"
        type="application/ld+json"
        strategy="beforeInteractive"
        // Schema.org JSON-LD: Organization + LocalBusiness + WebSite + Service + FAQPage
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }}
      />

      <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </>
  )
}
