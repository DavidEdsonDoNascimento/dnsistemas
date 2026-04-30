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
              alt="Antero software sob medida"
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
            Solicitar contato
          </a>
        </div>
      </header>

      <main className="main">
        <section id="hero" className={`hero section ${lc.landingHero}`}>
          <div className={lc.landingHeroGlow} />

          <div className="container position-relative">
            <div className="row align-items-center gy-5">
              <div className="col-lg-6">
                <div className="hero-content">
                  <div className={`mb-4 ${lc.landingBadge}`}>
                    <i className="bi bi-shield-check"></i>
                    Soluções empresariais com foco em operação real
                  </div>

                  <h1 className={lc.landingHeroTitle}>
                    Tecnologia corporativa para empresas que precisam de mais controle, eficiência e presença
                    digital.
                  </h1>

                  <p className={lc.landingHeroLead}>
                    A DN Sistemas Corporativos desenvolve sistemas sob medida, sites institucionais e aplicações
                    empresariais para negócios que querem profissionalizar processos, integrar operações e crescer com
                    uma base digital sólida.
                  </p>

                  <div className="d-flex flex-wrap gap-3">
                    <a href="#services" className={`btn ${lc.landingBtnPrimary}`}>
                      Conhecer serviços
                    </a>

                    <a href="#contact" className={`btn ${lc.landingBtnGhost}`}>
                      Falar com a DN
                    </a>
                  </div>

                  <div className="row mt-5 gy-3">
                    <div className="col-sm-4">
                      <div className={lc.landingStatCard}>
                        <strong className={lc.landingStatTitle}>Sob medida</strong>
                        <span className={lc.landingStatDesc}>Projetos adaptados ao negócio</span>
                      </div>
                    </div>

                    <div className="col-sm-4">
                      <div className={lc.landingStatCard}>
                        <strong className={lc.landingStatTitle}>Corporativo</strong>
                        <span className={lc.landingStatDesc}>Visual sério e profissional</span>
                      </div>
                    </div>

                    <div className="col-sm-4">
                      <div className={lc.landingStatCard}>
                        <strong className={lc.landingStatTitle}>Tecnologia</strong>
                        <span className={lc.landingStatDesc}>Soluções modernas e escaláveis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className={lc.landingHeroVisual}>
                  <img
                    src="/assets/img/illustration/illustration-14.webp"
                    alt="DN Sistemas Corporativos"
                    className={`img-fluid ${lc.landingHeroVisualImg}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className={`section ${lc.landingSectionSoft}`}>
          <div className="container">
            <div className="row align-items-center gy-5">
              <div className="col-lg-6">
                <div className={lc.landingAboutFigure}>
                  <img
                    src="/assets/img/about/about-square-8.webp"
                    className={`img-fluid ${lc.landingAboutImg}`}
                    alt="Sobre a DN Sistemas"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className={lc.landingAboutContent}>
                  <span className={`d-inline-block ${lc.landingEyebrow}`}>Sobre a DN</span>

                  <h2 className={lc.landingHeading2Tight}>Tecnologia aplicada à rotina real das empresas.</h2>

                  <p className={lc.landingParagraph}>
                    A DN Sistemas Corporativos atua no desenvolvimento de soluções digitais com foco em estrutura,
                    operação e presença profissional. Nosso trabalho é transformar necessidades reais em ferramentas
                    úteis, estáveis e alinhadas ao negócio.
                  </p>

                  <p className={lc.landingParagraphLoose}>
                    Em vez de soluções genéricas, buscamos construir sistemas, interfaces e sites que transmitam
                    confiança, agilizem processos e apoiem o crescimento da empresa com clareza e consistência.
                  </p>

                  <div className="row gy-3">
                    <div className="col-sm-6">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Visão corporativa</h3>
                        <p className={lc.landingParagraphNoMargin}>
                          Soluções pensadas para empresas que precisam de organização, imagem forte e processos
                          confiáveis.
                        </p>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className={lc.landingCardWhite}>
                        <h3 className={lc.landingMiniHeading}>Execução prática</h3>
                        <p className={lc.landingParagraphNoMargin}>
                          Projetos orientados à implementação real, com foco em entrega, clareza e resultado.
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
            <div className="text-center mb-5">
              <span className={`d-inline-block ${lc.landingEyebrow}`}>Serviços</span>
              <h2 className={lc.landingHeading2}>
                Soluções desenvolvidas para fortalecer a base digital da sua empresa
              </h2>
              <p className={`${lc.landingParagraphCenter}`}>
                Atuamos em frentes essenciais para empresas que precisam de mais eficiência, melhor apresentação
                institucional e ferramentas alinhadas ao seu fluxo de trabalho.
              </p>
            </div>

            <div className="row gy-4">
              <div className="col-lg-4">
                <div className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon}>
                    <i className="bi bi-diagram-3"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>Sistemas Corporativos</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Desenvolvimento de sistemas sob medida para organizar processos, centralizar informações, reduzir
                    retrabalho e apoiar a tomada de decisão.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon}>
                    <i className="bi bi-window-stack"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>Sites Institucionais</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Criação de sites profissionais com identidade sólida, navegação clara e apresentação confiável dos
                    serviços e diferenciais da empresa.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div className={lc.landingServiceCard}>
                  <div className={lc.landingServiceIcon}>
                    <i className="bi bi-phone"></i>
                  </div>
                  <h3 className={lc.landingServiceTitle}>Aplicações Empresariais</h3>
                  <p className={lc.landingParagraphNoMargin}>
                    Soluções web e mobile voltadas à operação, acompanhamento de atividades, integração entre setores e
                    expansão digital do negócio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`section ${lc.landingSectionPadBottom}`}>
          <div className="container">
            <div className={lc.landingRibbon}>
              <div className="row align-items-center gy-4">
                <div className="col-lg-8">
                  <h2 className={lc.landingRibbonTitle}>Sua empresa precisa de uma base digital mais forte?</h2>
                  <p className={lc.landingRibbonText}>
                    Podemos estruturar uma solução institucional ou corporativa alinhada ao momento do seu negócio.
                  </p>
                </div>
                <div className="col-lg-4 text-lg-end">
                  <a href="#contact" className={`btn ${lc.landingRibbonBtn}`}>
                    Solicitar orçamento
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className={`section ${lc.landingSectionSoft}`}>
          <div className="container">
            <div className="text-center mb-5">
              <span className={`d-inline-block ${lc.landingEyebrow}`}>Contato</span>
              <h2 className={lc.landingHeading2}>Vamos conversar sobre o que sua empresa precisa</h2>
              <p className={lc.landingParagraphCenter}>
                Entre em contato para apresentar seu cenário, suas metas e o tipo de solução que você busca.
              </p>
            </div>

            <div className="row gy-4">
              <div className="col-lg-5">
                <div className={lc.landingContactInfo}>
                  <div className="d-flex align-items-start mb-4">
                    <div className={lc.landingContactIcon}>
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div>
                      <h3 className={lc.landingMiniHeadingSm}>E-mail</h3>
                      <p className={lc.landingParagraphNoMargin}>contato@dnsistemas.com.br</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div className={lc.landingContactIcon}>
                      <i className="bi bi-whatsapp"></i>
                    </div>
                    <div>
                      <h3 className={lc.landingMiniHeadingSm}>WhatsApp</h3>
                      <p className={lc.landingParagraphNoMargin}>
                        Atendimento direto para orçamento e alinhamento inicial do projeto.
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
            © <strong className={lc.landingFooterStrong}>DN Sistemas Corporativos</strong>. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <Script src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </>
  )
}
