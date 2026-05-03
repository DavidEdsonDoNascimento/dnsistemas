import Script from 'next/script'
import Image from 'next/image'
import Link from 'next/link'
import ContactForm from '@/components/contact-form'
import { getWhatsAppOrcamentoHref } from '@/lib/whatsapp-orcamento'
import lc from '@/theme/landing.module.css'

export default function Home() {
  return (
    <>
      <header id="header" className={`header d-flex align-items-center fixed-top ${lc.landingHeader}`}>
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <Link href="/" className="logo d-flex align-items-center text-decoration-none">
            <Image
              src="/antero_logo_v1.png"
              alt="ANTERO"
              width={280}
              height={64}
              priority
              className={lc.landingLogoImg}
            />
          </Link>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li>
                <a href="#hero" className="active">
                  Início
                </a>
              </li>
              <li>
                <a href="#about">Sobre</a>
              </li>
              <li>
                <a href="#services">Serviços</a>
              </li>
              <li>
                <a href="#contact">Contato</a>
              </li>
            </ul>
            <i className={`mobile-nav-toggle d-xl-none bi bi-list ${lc.landingNavToggle}`}></i>
          </nav>

          <a className={`btn-getstarted ${lc.landingHeaderCta}`} href="#contact">
            Solicitar um orçamento
          </a>
        </div>
      </header>

      <main className="main">
        <section id="hero" className={`hero section ${lc.landingHero}`}>
          <div className={lc.landingHeroGlow} aria-hidden />

          <div className="container position-relative">
            <div className={`row align-items-center ${lc.landingHeroLayout}`}>
              <div className="col-lg-6">
                <div className={`hero-content ${lc.landingHeroContent}`}>
                  <span className={lc.landingEyebrow}>Software sob medida</span>

                  <h1 className={lc.landingHeroTitle}>Reduza custo operacional e escale com software sob medida.</h1>

                  <p className={lc.landingHeroLead}>
                    Da descoberta à produção, entregamos plataformas robustas para aumentar eficiência, desempenho e
                    previsibilidade do negócio.
                  </p>

                  <div className={`d-flex flex-wrap gap-2 ${lc.landingHeroActions}`}>
                    <a href="#contact" className={`btn ${lc.landingBtnPrimary}`}>
                      Solicitar um orçamento
                    </a>
                    <a href="#services" className={`btn ${lc.landingBtnGhost}`}>
                      Ver soluções
                    </a>
                  </div>

                  <p className={lc.landingHeroMeta}>
                    <strong>Engenharia e produto</strong> · Orçamentos enxutos · Entregas definidas por marcos
                  </p>

                  <div className="row mt-4 gx-3 gy-3">
                    <div className="col-sm-4">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Eficiência</h3>
                        <p className={lc.landingParagraphNoMargin}>Processos críticos com menos retrabalho.</p>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Escala</h3>
                        <p className={lc.landingParagraphNoMargin}>Arquitetura preparada para crescimento real.</p>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Controle</h3>
                        <p className={lc.landingParagraphNoMargin}>Dados rastreáveis para decisões melhores.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mt-4 mt-lg-0">
                <div className={lc.landingHeroVisualWrap}>
                  <div className={lc.landingHeroPanel}>
                    <span className={lc.landingHeroPanelLabel}>Visão do produto</span>
                    <strong className={lc.landingHeroPanelTitle}>Dashboard operacional em tempo real</strong>
                    <p className={lc.landingHeroPanelText}>KPIs críticos, alertas e fluxo de trabalho em um só lugar.</p>
                  </div>
                  <div className={lc.landingHeroVisual}>
                    <img
                      src="/assets/img/illustration/illustration-14.webp"
                      alt=""
                      className={`img-fluid ${lc.landingHeroVisualImg}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className={`section ${lc.landingSectionSoft}`}>
          <div className="container">
            <div className="row align-items-start gy-5 gx-lg-5">
              <div className="col-lg-6">
                <div className={lc.landingAboutFigure}>
                  <img
                    src="/assets/img/about/about-square-8.webp"
                    className={`img-fluid ${lc.landingAboutImg}`}
                    alt=""
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className={lc.landingAboutContent}>
                  <span className={lc.landingEyebrow}>Como trabalhamos</span>

                  <h2 className={lc.landingHeading2Tight}>Um time sênior, um escopo transparente.</h2>

                  <p className={lc.landingParagraph}>
                    Você precisa reduzir planilhas paralelas, eliminar erro manual ou dar traçabilidade a processos —
                    sem surpresas de escopo nem folhetos vagos sobre &quot;tudo que fazemos&quot;.
                  </p>

                  <p className={lc.landingParagraphLoose}>
                    Trabalhamos com hipótese, números quando existem e entregáveis revisáveis. O código sai documentado no
                    mínimo necessário para o seu time dar continuidade.
                  </p>

                  <div className="row gy-4 gx-3">
                    <div className="col-sm-6">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Clareza antes de implementar</h3>
                        <p className={lc.landingParagraphNoMargin}>
                          Objetivo de negócio primeiro. Só então arquitetura, stack e contrato de entrega.
                        </p>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Operação em produção</h3>
                        <p className={lc.landingParagraphNoMargin}>
                          Performance, segurança e manutenção não são adendo — entram no desenho desde o início.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className={`section ${lc.landingSectionWhite}`}>
          <div className="container">
            <div className={`text-center ${lc.landingSectionIntroWide} ${lc.landingSectionIntro}`}>
              <span className={lc.landingEyebrow}>Soluções</span>
              <h2 className={lc.landingHeading2}>O que entregamos — e o que isso muda no P&amp;L</h2>
              <p className={lc.landingParagraphCenter}>
                Três frentes. Cada uma atacando custo operacional, conversão ou tempo de ciclo.
              </p>
            </div>

            <div className="row gy-4 gx-lg-4">
              <div className="col-lg-4">
                <div className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon}>
                    <i className="bi bi-diagram-3"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>Plataformas internas</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Unifica dados, remove retrabalho e dá auditoria. Menos gente parada em processo manual — mais
                    throughput com o mesmo headcount.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon}>
                    <i className="bi bi-window-stack"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>Presença institucional</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Site e conteúdo pensados para autoridade e conversão B2B. Carrega rápido, comunica posicionamento e
                    suporta vendas longas.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon}>
                    <i className="bi bi-phone"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>Apps e omnicanal</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Mobile e pontos de contato conectados ao core. Para times em campo ou híbridos, com políticas de
                    acesso corporativas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`section ${lc.landingSectionPadBottom}`}>
          <div className="container">
            <div className={lc.landingRibbon}>
              <div className="row align-items-center gy-3 gx-lg-4">
                <div className="col-lg-8">
                  <h2 className={lc.landingRibbonTitle}>Próximo passo: 30 minutos de alinhamento.</h2>
                  <p className={lc.landingRibbonText}>
                    Conte o problema em uma frase. Devolvemos se faz sentido engajar e em que formato.
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

        <section id="contact" className={`section ${lc.landingSectionSoft}`}>
          <div className="container">
            <div className={`text-center ${lc.landingSectionIntroWide} ${lc.landingSectionIntro}`}>
              <span className={lc.landingEyebrow}>Contato</span>
              <h2 className={lc.landingHeading2}>Envie o contexto. Respondemos com próximos passos.</h2>
              <p className={lc.landingParagraphCenter}>
                Sem formulário interminável: nome, e-mail, assunto e o que precisa resolver.
              </p>
            </div>

            <div className="row gy-5 gx-lg-5">
              <div className="col-lg-4">
                <div className={lc.landingContactInfo}>
                  <div className={lc.landingContactBlock}>
                    <h3 className={lc.landingMiniHeadingSm}>E-mail</h3>
                    <p className={lc.landingParagraphNoMargin}>
                      <a href="mailto:contato@anterosistemas.com.br" className={lc.landingContactLink}>
                        contato@anterosistemas.com.br
                      </a>
                    </p>
                  </div>

                  <a
                    className={`${lc.landingContactBlock} ${lc.landingContactBlockClickable}`}
                    href={getWhatsAppOrcamentoHref()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className={lc.landingMiniHeadingSm}>WhatsApp</h3>
                    <p className={lc.landingParagraphNoMargin}>
                      Use para urgência ou agendar chamada rápida. O time responde no horário comercial.
                    </p>
                  </a>
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
              © {new Date().getFullYear()} ANTERO
            </span>
            <span className={lc.landingFooterSep}> · </span>
            <span className={lc.landingFooterSep}>Todos os direitos reservados.</span>
          </p>
        </div>
      </footer>

      <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </>
  )
}
