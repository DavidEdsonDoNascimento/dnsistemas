'use client'

import Script from 'next/script'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <header id="header" className="header d-flex align-items-center fixed-top">
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <Link href="/" className="logo d-flex align-items-center">
            <h1 className="sitename">DN Sistemas</h1>
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
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

          <Link className="btn-getstarted" href="#contact">
            Solicitar contato
          </Link>
        </div>
      </header>

      <main className="main">
        <section id="hero" className="hero section">
          {/* <div className="container" data-aos="fade-up" data-aos-delay="100"> */}
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                {/* <div className="hero-content" data-aos="fade-up" data-aos-delay="200"> */}
                <div className="hero-content">
                  <div className="company-badge mb-4">
                    <i className="bi bi-gear-fill me-2"></i>
                    DN Sistemas Corporativos
                  </div>

                  <h1 className="mb-4">
                    Soluções em sistemas corporativos para empresas que precisam de
                    <span className="accent-text"> eficiência, controle e escala</span>
                  </h1>

                  <p className="mb-4 mb-md-5">
                    Desenvolvemos sistemas sob medida, sites institucionais e aplicações empresariais
                    com foco em produtividade, organização de processos e presença digital profissional.
                  </p>

                  <div className="hero-buttons">
                    <a href="#services" className="btn btn-primary me-0 me-sm-2 mx-1">
                      Nossos serviços
                    </a>
                    <a href="#contact" className="btn btn-link mt-2 mt-sm-0">
                      Fale com a DN
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                {/* <div className="hero-image" data-aos="zoom-out" data-aos-delay="300"> */}
                <div className="hero-image">
                  <img
                    src="/assets/img/illustration/illustration-14.webp"
                    alt="DN Sistemas Corporativos"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about section">
          {/* <div className="container section-title" data-aos="fade-up"> */}
          <div className="container section-title">
            <h2>Sobre</h2>
            <p>Conheça a DN Sistemas Corporativos</p>
          </div>

{/* <div className="container" data-aos="fade-up" data-aos-delay="100"> */}
          <div className="container">
            <div className="row gy-4 align-items-center">
              <div className="col-lg-6">
                <img
                  src="/assets/img/about/about-square-8.webp"
                  className="img-fluid rounded-4"
                  alt="Sobre a DN Sistemas"
                />
              </div>

              <div className="col-lg-6">
                <div className="content ps-0 ps-lg-5">
                  <h3>Tecnologia aplicada à operação real das empresas</h3>
                  <p>
                    A DN Sistemas Corporativos atua no desenvolvimento de soluções digitais para
                    empresas que precisam melhorar processos, estruturar sua presença online e ganhar
                    mais eficiência no dia a dia.
                  </p>
                  <p>
                    Nosso foco é entregar soluções sob medida com visual profissional, tecnologia
                    confiável e implementação prática para negócios que precisam evoluir com rapidez.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="services section">
          {/* <div className="container section-title" data-aos="fade-up"> */}
          <div className="container section-title">
            <h2>Serviços</h2>
            <p>Soluções desenvolvidas para fortalecer sua empresa</p>
          </div>

          <div className="container">
            <div className="row gy-4">
              {/* <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100"> */}
              <div className="col-lg-4 col-md-6">
                <div className="service-item item-cyan position-relative">
                  <div className="icon">
                    <i className="bi bi-pc-display"></i>
                  </div>
                  <h3>Sistemas Corporativos</h3>
                  <p>
                    Desenvolvimento de sistemas sob medida para organizar processos, centralizar
                    informações e aumentar a produtividade da empresa.
                  </p>
                </div>
              </div>

{/* <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200"> */}
              <div className="col-lg-4 col-md-6">
                <div className="service-item item-orange position-relative">
                  <div className="icon">
                    <i className="bi bi-globe2"></i>
                  </div>
                  <h3>Sites Institucionais</h3>
                  <p>
                    Criação de sites profissionais com foco em credibilidade, apresentação de serviços
                    e geração de oportunidades comerciais.
                  </p>
                </div>
              </div>

{/* <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300"> */}
              <div className="col-lg-4 col-md-6">
                <div className="service-item item-teal position-relative">
                  <div className="icon">
                    <i className="bi bi-phone"></i>
                  </div>
                  <h3>Aplicações Empresariais</h3>
                  <p>
                    Soluções web e mobile voltadas para operação, acompanhamento e integração de
                    atividades essenciais do negócio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="contact section">
          {/* <div className="container section-title" data-aos="fade-up"> */}
          <div className="container section-title">
            <h2>Contato</h2>
            <p>Fale com a DN Sistemas Corporativos</p>
          </div>

{/* <div className="container" data-aos="fade-up" data-aos-delay="100"> */}
          <div className="container">
            <div className="row gy-4">
              <div className="col-lg-5">
                <div className="info-wrap">
                  {/* <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="200"> */}
                  <div className="info-item d-flex">
                    <i className="bi bi-envelope flex-shrink-0"></i>
                    <div>
                      <h3>E-mail</h3>
                      <p>contato@dnsistemas.com.br</p>
                    </div>
                  </div>

{/* <div className="info-item d-flex" data-aos="fade-up" data-aos-delay="300"> */}
                  <div className="info-item d-flex">
                    <i className="bi bi-whatsapp flex-shrink-0"></i>
                    <div>
                      <h3>WhatsApp</h3>
                      <p>Solicite seu orçamento pelo WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="php-email-form">
                  <div className="row gy-4">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Seu nome" />
                    </div>

                    <div className="col-md-6">
                      <input type="email" className="form-control" placeholder="Seu e-mail" />
                    </div>

                    <div className="col-md-12">
                      <input type="text" className="form-control" placeholder="Assunto" />
                    </div>

                    <div className="col-md-12">
                      <textarea
                        className="form-control"
                        rows={6}
                        placeholder="Descreva o que sua empresa precisa"
                      ></textarea>
                    </div>

                    <div className="col-md-12 text-center">
                      <button type="button" className="btn btn-primary">
                        Enviar mensagem
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="footer">
        <div className="container copyright text-center mt-4">
          <p>
            © <span>Copyright</span>{' '}
            <strong className="px-1 sitename">DN Sistemas Corporativos</strong>{' '}
            <span>Todos os direitos reservados</span>
          </p>
        </div>
      </footer>

      <Script
        src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
      {/* <Script src="/assets/vendor/aos/aos.js" strategy="afterInteractive" /> */}
      <Script
        src="/assets/vendor/swiper/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="/assets/vendor/glightbox/js/glightbox.min.js"
        strategy="afterInteractive"
      />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </>
  )
}