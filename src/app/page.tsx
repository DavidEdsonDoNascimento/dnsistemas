import Script from 'next/script'
import Image from 'next/image'
import Link from 'next/link'
import ContactForm from '@/components/contact-form'
import lc from '@/theme/landing.module.css'

export default function Home() {
  return (
    <>
      <header id="header" className={`header d-flex align-items-center fixed-top ${lc.landingHeader}`}>
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <Link href="/" className="logo d-flex align-items-center text-decoration-none">
            <Image
              src="/antero_logo_header_cropped.png"
              alt="ANTERO — software sob medida"
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
            Falar com especialista
          </a>
        </div>
      </header>

      <main className="main">
        <section id="hero" className={`hero section ${lc.landingHero}`}>
          <div className={lc.landingHeroGlow} />

          <div className="container position-relative">
            <div className="row align-items-center gy-5 gx-lg-5">
              <div className="col-lg-6">
                <div className="hero-content">
                  <div className={`mb-4 ${lc.landingBadge}`}>
                    <i className="bi bi-shield-check"></i>
                    Engenharia de produto orientada a resultado
                  </div>

                  <h1 className={lc.landingHeroTitle}>
                    Software sob medida que corta custo, acelera a operação e escala com o seu negócio.
                  </h1>

                  <p className={lc.landingHeroLead}>
                    A ANTERO projeta soluções tecnológicas alinhadas às necessidades reais do seu negócio —
                    menos retrabalho, mais previsibilidade e performance para líderes que precisam de governança
                    digital sólida.
                  </p>

                  <div className="d-flex flex-wrap gap-3">
                    <a href="#contact" className={`btn ${lc.landingBtnPrimary}`}>
                      Solicitar proposta
                    </a>

                    <a href="#services" className={`btn ${lc.landingBtnGhost}`}>
                      Ver como entregamos
                    </a>
                  </div>

                  <div className="row mt-5 gx-3 gy-3">
                    <div className="col-sm-4">
                      <div className={lc.landingStatCard}>
                        <strong className={lc.landingStatTitle}>Eficiência</strong>
                        <span className={lc.landingStatDesc}>Processos automatizados, menos erro manual</span>
                      </div>
                    </div>

                    <div className="col-sm-4">
                      <div className={lc.landingStatCard}>
                        <strong className={lc.landingStatTitle}>Escalável</strong>
                        <span className={lc.landingStatDesc}>Arquitetura preparada para crescer</span>
                      </div>
                    </div>

                    <div className="col-sm-4">
                      <div className={lc.landingStatCard}>
                        <strong className={lc.landingStatTitle}>Impacto</strong>
                        <span className={lc.landingStatDesc}>Métricas e ROI no centro do projeto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mt-4 mt-lg-0">
                <div className={lc.landingHeroVisual}>
                  <img
                    src="/assets/img/illustration/illustration-14.webp"
                    alt="Soluções de software ANTERO"
                    className={`img-fluid ${lc.landingHeroVisualImg}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className={`section ${lc.landingSectionSoft}`}>
          <div className="container">
            <div className="row align-items-center gy-5 gx-lg-5">
              <div className="col-lg-6">
                <div className={lc.landingAboutFigure}>
                  <img
                    src="/assets/img/about/about-square-8.webp"
                    className={`img-fluid ${lc.landingAboutImg}`}
                    alt="Sobre a ANTERO"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className={lc.landingAboutContent}>
                  <span className={`d-inline-block ${lc.landingEyebrow}`}>Por que ANTERO</span>

                  <h2 className={lc.landingHeading2Tight}>
                    Produto digital pensado como ativo estratégico — não apenas entrega pontual.
                  </h2>

                  <p className={lc.landingParagraph}>
                    Trabalhamos com empresas que exigem clareza, performance e segurança. Da descoberta à entrega,
                    priorizamos o que reduz atrito na operação, melhora decisões e mantém sua stack preparada para
                    evolução contínua.
                  </p>

                  <p className={lc.landingParagraphLoose}>
                    Você ganha ritmo de projeto enxuto, comunicação objetiva com o time técnico e código em padrões
                    profissionais — pronto para time interno ou parceiros trabalharem no futuro.
                  </p>

                  <div className="row gy-4 gx-3">
                    <div className="col-sm-6">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Disciplina de negócio</h3>
                        <p className={lc.landingParagraphNoMargin}>
                          Soluções ancoradas em fluxo real, KPIs e governança — sem promessas genéricas.
                        </p>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Execução senior</h3>
                        <p className={lc.landingParagraphNoMargin}>
                          Do desenho da experiência à infraestrutura: menos ruído, mais previsibilidade no prazo e no
                          investimento.
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
              <span className={`d-inline-block ${lc.landingEyebrow}`}>O que fazemos</span>
              <h2 className={lc.landingHeading2}>
                Tecnologia sob medida com foco em resultado financeiro e operacional
              </h2>
              <p className={`${lc.landingParagraphCenter}`}>
                Cada linha de código existe para responder a uma pergunta de negócio: como ganhar velocidade,
                reduzir custo de erro e sustentar crescimento com sistemas estáveis?
              </p>
            </div>

            <div className="row gy-5 gx-lg-4">
              <div className="col-lg-4">
                <div className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon}>
                    <i className="bi bi-diagram-3"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>Software corporativo sob medida</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Plataformas internas que unificam dados, eliminam gargalos e dão traçabilidade à operação —
                    menos planilhas paralelas, mais uma fonte única da verdade.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon}>
                    <i className="bi bi-window-stack"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>Presença institucional de alta conversão</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Sites e portais pensados como canal comercial sério — narrativa clara, performance e autoridade de
                    marca para fechar ciclo com clientes enterprise e decisores exigentes.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon}>
                    <i className="bi bi-phone"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>Produtos mobile e omnicanalidade</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Aplicações conectadas ao seu ecossistema: times no campo ou remotos ganham velocidade sem abrir mão
                    de segurança, políticas e auditoria corporativa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`section ${lc.landingSectionPadBottom}`}>
          <div className="container">
            <div className={lc.landingRibbon}>
              <div className="row align-items-center gy-4 gx-lg-4">
                <div className="col-lg-8">
                  <h2 className={lc.landingRibbonTitle}>Pronto para transformar tecnologia em vantagem competitiva?</h2>
                  <p className={lc.landingRibbonText}>
                    Agenda uma conversa objetiva para mapearmos cenário atual, pontos de alavanca e próximo passo
                    viável para o seu time.
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
              <span className={`d-inline-block ${lc.landingEyebrow}`}>Contato</span>
              <h2 className={lc.landingHeading2}>Fale diretamente com quem vai conduzir o seu projeto</h2>
              <p className={lc.landingParagraphCenter}>
                Descreva o contexto da empresa e o problema que você precisa resolver. Retornamos com próximos passos
                e formato de trabalho mais adequados.
              </p>
            </div>

            <div className="row gy-5 gx-lg-5">
              <div className="col-lg-5">
                <div className={lc.landingContactInfo}>
                  <div className="d-flex align-items-start mb-5">
                    <div className={lc.landingContactIcon}>
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div>
                      <h3 className={lc.landingMiniHeadingSm}>E-mail</h3>
                      <p className={lc.landingParagraphNoMargin}>contato@antero.tech</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div className={lc.landingContactIcon}>
                      <i className="bi bi-whatsapp"></i>
                    </div>
                    <div>
                      <h3 className={lc.landingMiniHeadingSm}>WhatsApp</h3>
                      <p className={lc.landingParagraphNoMargin}>
                        Canal rápido para alinhar urgência de negócio, escopo inicial e formato de engajamento da ANTERO.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div className={lc.landingFormShell}>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className={`footer ${lc.landingFooter}`}>
        <div className="container text-center">
          <p className={lc.landingFooterText}>
            © {new Date().getFullYear()}{' '}
            <strong className={lc.landingFooterStrong}>ANTERO</strong>. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </>
  )
}
