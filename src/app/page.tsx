import Script from 'next/script'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <header
        id="header"
        className="header d-flex align-items-center fixed-top"
        style={{
          background: 'rgba(7, 24, 47, 0.82)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--dn-border)',
        }}
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <Link href="/" className="logo d-flex align-items-center text-decoration-none">
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'linear-gradient(135deg, var(--dn-secondary), var(--dn-primary))',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 16,
                marginRight: 12,
                boxShadow: '0 12px 30px rgba(29, 78, 216, 0.28)',
              }}
            >
              DN
            </div>
            <div>
              <div
                className="sitename"
                style={{
                  color: '#fff',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                DN Sistemas
              </div>
              <small style={{ color: 'rgba(255,255,255,0.68)' }}>Corporativos</small>
            </div>
          </Link>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li><a href="#hero" className="active">Início</a></li>
              <li><a href="#about">Sobre</a></li>
              <li><a href="#services">Serviços</a></li>
              <li><a href="#contact">Contato</a></li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list" style={{ color: '#fff' }}></i>
          </nav>

          <a
            className="btn-getstarted"
            href="#contact"
            style={{
              background: 'var(--dn-secondary)',
              color: '#fff',
              borderRadius: 14,
              padding: '12px 18px',
              fontWeight: 700,
              boxShadow: '0 14px 30px rgba(29, 78, 216, 0.24)',
            }}
          >
            Solicitar contato
          </a>
        </div>
      </header>

      <main className="main">
        <section
          id="hero"
          className="hero section"
          style={{
            background: 'var(--dn-gradient)',
            paddingTop: 170,
            paddingBottom: 110,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.16), transparent 25%), radial-gradient(circle at 80% 30%, rgba(29,78,216,0.18), transparent 22%)',
              pointerEvents: 'none',
            }}
          />

          <div className="container position-relative">
            <div className="row align-items-center gy-5">
              <div className="col-lg-6">
                <div className="hero-content">
                  <div
                    className="mb-4"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 600,
                    }}
                  >
                    <i className="bi bi-shield-check"></i>
                    Soluções empresariais com foco em operação real
                  </div>

                  <h1
                    style={{
                      color: '#fff',
                      maxWidth: 760,
                      marginBottom: 24,
                    }}
                  >
                    Tecnologia corporativa para empresas que precisam de mais controle, eficiência e presença digital.
                  </h1>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.78)',
                      fontSize: '1.08rem',
                      maxWidth: 640,
                      marginBottom: 34,
                    }}
                  >
                    A DN Sistemas Corporativos desenvolve sistemas sob medida, sites institucionais
                    e aplicações empresariais para negócios que querem profissionalizar processos,
                    integrar operações e crescer com uma base digital sólida.
                  </p>

                  <div className="d-flex flex-wrap gap-3">
                    <a
                      href="#services"
                      className="btn"
                      style={{
                        background: '#fff',
                        color: 'var(--dn-primary)',
                        borderRadius: 14,
                        padding: '14px 22px',
                        fontWeight: 800,
                      }}
                    >
                      Conhecer serviços
                    </a>

                    <a
                      href="#contact"
                      className="btn"
                      style={{
                        background: 'transparent',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: 14,
                        padding: '14px 22px',
                        fontWeight: 700,
                      }}
                    >
                      Falar com a DN
                    </a>
                  </div>

                  <div className="row mt-5 gy-3">
                    <div className="col-sm-4">
                      <div
                        style={{
                          padding: '18px 20px',
                          borderRadius: 18,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.10)',
                        }}
                      >
                        <strong style={{ color: '#fff', display: 'block', fontSize: 22 }}>Sob medida</strong>
                        <span style={{ color: 'rgba(255,255,255,0.72)' }}>Projetos adaptados ao negócio</span>
                      </div>
                    </div>

                    <div className="col-sm-4">
                      <div
                        style={{
                          padding: '18px 20px',
                          borderRadius: 18,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.10)',
                        }}
                      >
                        <strong style={{ color: '#fff', display: 'block', fontSize: 22 }}>Corporativo</strong>
                        <span style={{ color: 'rgba(255,255,255,0.72)' }}>Visual sério e profissional</span>
                      </div>
                    </div>

                    <div className="col-sm-4">
                      <div
                        style={{
                          padding: '18px 20px',
                          borderRadius: 18,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.10)',
                        }}
                      >
                        <strong style={{ color: '#fff', display: 'block', fontSize: 22 }}>Tecnologia</strong>
                        <span style={{ color: 'rgba(255,255,255,0.72)' }}>Soluções modernas e escaláveis</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 28,
                    padding: 22,
                    boxShadow: '0 30px 80px rgba(2, 8, 23, 0.34)',
                  }}
                >
                  <img
                    src="/assets/img/illustration/illustration-14.webp"
                    alt="DN Sistemas Corporativos"
                    className="img-fluid"
                    style={{ borderRadius: 20 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="section"
          style={{
            padding: '96px 0',
            background: 'var(--dn-gradient-soft)',
          }}
        >
          <div className="container">
            <div className="row align-items-center gy-5">
              <div className="col-lg-6">
                <div style={{ position: 'relative' }}>
                  <img
                    src="/assets/img/about/about-square-8.webp"
                    className="img-fluid"
                    alt="Sobre a DN Sistemas"
                    style={{
                      borderRadius: 26,
                      boxShadow: '0 24px 70px rgba(15,23,42,0.14)',
                    }}
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div style={{ maxWidth: 620 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      marginBottom: 18,
                      padding: '8px 14px',
                      borderRadius: 999,
                      background: 'rgba(29, 78, 216, 0.08)',
                      color: 'var(--dn-secondary)',
                      fontWeight: 700,
                    }}
                  >
                    Sobre a DN
                  </span>

                  <h2 style={{ color: 'var(--dn-primary)', marginBottom: 20 }}>
                    Tecnologia aplicada à rotina real das empresas.
                  </h2>

                  <p style={{ color: 'var(--dn-muted)', marginBottom: 18 }}>
                    A DN Sistemas Corporativos atua no desenvolvimento de soluções digitais com foco
                    em estrutura, operação e presença profissional. Nosso trabalho é transformar
                    necessidades reais em ferramentas úteis, estáveis e alinhadas ao negócio.
                  </p>

                  <p style={{ color: 'var(--dn-muted)', marginBottom: 28 }}>
                    Em vez de soluções genéricas, buscamos construir sistemas, interfaces e sites que
                    transmitam confiança, agilizem processos e apoiem o crescimento da empresa com
                    clareza e consistência.
                  </p>

                  <div className="row gy-3">
                    <div className="col-sm-6">
                      <div
                        style={{
                          background: '#fff',
                          border: '1px solid var(--dn-border)',
                          borderRadius: 20,
                          padding: 22,
                          height: '100%',
                        }}
                      >
                        <h3 style={{ fontSize: 20, color: 'var(--dn-primary)', marginBottom: 10 }}>
                          Visão corporativa
                        </h3>
                        <p style={{ margin: 0, color: 'var(--dn-muted)' }}>
                          Soluções pensadas para empresas que precisam de organização, imagem forte e processos confiáveis.
                        </p>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div
                        style={{
                          background: '#fff',
                          border: '1px solid var(--dn-border)',
                          borderRadius: 20,
                          padding: 22,
                          height: '100%',
                        }}
                      >
                        <h3 style={{ fontSize: 20, color: 'var(--dn-primary)', marginBottom: 10 }}>
                          Execução prática
                        </h3>
                        <p style={{ margin: 0, color: 'var(--dn-muted)' }}>
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

        <section id="services" className="section" style={{ padding: '96px 0', background: '#fff' }}>
          <div className="container">
            <div className="text-center mb-5">
              <span
                style={{
                  display: 'inline-block',
                  marginBottom: 18,
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'rgba(29, 78, 216, 0.08)',
                  color: 'var(--dn-secondary)',
                  fontWeight: 700,
                }}
              >
                Serviços
              </span>
              <h2 style={{ color: 'var(--dn-primary)', marginBottom: 16 }}>
                Soluções desenvolvidas para fortalecer a base digital da sua empresa
              </h2>
              <p style={{ color: 'var(--dn-muted)', maxWidth: 760, margin: '0 auto' }}>
                Atuamos em frentes essenciais para empresas que precisam de mais eficiência, melhor apresentação institucional e ferramentas alinhadas ao seu fluxo de trabalho.
              </p>
            </div>

            <div className="row gy-4">
              <div className="col-lg-4">
                <div
                  style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)',
                    border: '1px solid var(--dn-border)',
                    borderRadius: 24,
                    padding: 28,
                    height: '100%',
                    boxShadow: '0 18px 50px rgba(15,23,42,0.06)',
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 16,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'rgba(29, 78, 216, 0.10)',
                      color: 'var(--dn-secondary)',
                      fontSize: 24,
                      marginBottom: 20,
                    }}
                  >
                    <i className="bi bi-diagram-3"></i>
                  </div>
                  <h3 style={{ color: 'var(--dn-primary)', marginBottom: 14 }}>Sistemas Corporativos</h3>
                  <p style={{ color: 'var(--dn-muted)', marginBottom: 0 }}>
                    Desenvolvimento de sistemas sob medida para organizar processos, centralizar informações, reduzir retrabalho e apoiar a tomada de decisão.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div
                  style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)',
                    border: '1px solid var(--dn-border)',
                    borderRadius: 24,
                    padding: 28,
                    height: '100%',
                    boxShadow: '0 18px 50px rgba(15,23,42,0.06)',
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 16,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'rgba(29, 78, 216, 0.10)',
                      color: 'var(--dn-secondary)',
                      fontSize: 24,
                      marginBottom: 20,
                    }}
                  >
                    <i className="bi bi-window-stack"></i>
                  </div>
                  <h3 style={{ color: 'var(--dn-primary)', marginBottom: 14 }}>Sites Institucionais</h3>
                  <p style={{ color: 'var(--dn-muted)', marginBottom: 0 }}>
                    Criação de sites profissionais com identidade sólida, navegação clara e apresentação confiável dos serviços e diferenciais da empresa.
                  </p>
                </div>
              </div>

              <div className="col-lg-4">
                <div
                  style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)',
                    border: '1px solid var(--dn-border)',
                    borderRadius: 24,
                    padding: 28,
                    height: '100%',
                    boxShadow: '0 18px 50px rgba(15,23,42,0.06)',
                  }}
                >
                  <div
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 16,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'rgba(29, 78, 216, 0.10)',
                      color: 'var(--dn-secondary)',
                      fontSize: 24,
                      marginBottom: 20,
                    }}
                  >
                    <i className="bi bi-phone"></i>
                  </div>
                  <h3 style={{ color: 'var(--dn-primary)', marginBottom: 14 }}>Aplicações Empresariais</h3>
                  <p style={{ color: 'var(--dn-muted)', marginBottom: 0 }}>
                    Soluções web e mobile voltadas à operação, acompanhamento de atividades, integração entre setores e expansão digital do negócio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section"
          style={{
            padding: '0 0 96px',
            background: '#fff',
          }}
        >
          <div className="container">
            <div
              style={{
                background: 'var(--dn-gradient)',
                borderRadius: 30,
                padding: '42px 36px',
                color: '#fff',
                boxShadow: '0 30px 80px rgba(7,24,47,0.18)',
              }}
            >
              <div className="row align-items-center gy-4">
                <div className="col-lg-8">
                  <h2 style={{ color: '#fff', marginBottom: 12 }}>
                    Sua empresa precisa de uma base digital mais forte?
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                    Podemos estruturar uma solução institucional ou corporativa alinhada ao momento do seu negócio.
                  </p>
                </div>
                <div className="col-lg-4 text-lg-end">
                  <a
                    href="#contact"
                    className="btn"
                    style={{
                      background: '#fff',
                      color: 'var(--dn-primary)',
                      borderRadius: 14,
                      padding: '14px 22px',
                      fontWeight: 800,
                    }}
                  >
                    Solicitar orçamento
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="section"
          style={{
            padding: '96px 0',
            background: 'var(--dn-gradient-soft)',
          }}
        >
          <div className="container">
            <div className="text-center mb-5">
              <span
                style={{
                  display: 'inline-block',
                  marginBottom: 18,
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'rgba(29, 78, 216, 0.08)',
                  color: 'var(--dn-secondary)',
                  fontWeight: 700,
                }}
              >
                Contato
              </span>
              <h2 style={{ color: 'var(--dn-primary)', marginBottom: 16 }}>
                Vamos conversar sobre o que sua empresa precisa
              </h2>
              <p style={{ color: 'var(--dn-muted)', maxWidth: 760, margin: '0 auto' }}>
                Entre em contato para apresentar seu cenário, suas metas e o tipo de solução que você busca.
              </p>
            </div>

            <div className="row gy-4">
              <div className="col-lg-5">
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 24,
                    padding: 28,
                    border: '1px solid var(--dn-border)',
                    height: '100%',
                    boxShadow: '0 18px 50px rgba(15,23,42,0.06)',
                  }}
                >
                  <div className="d-flex align-items-start mb-4">
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        background: 'rgba(29, 78, 216, 0.10)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--dn-secondary)',
                        fontSize: 22,
                        marginRight: 16,
                        flexShrink: 0,
                      }}
                    >
                      <i className="bi bi-envelope"></i>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 20, color: 'var(--dn-primary)', marginBottom: 6 }}>E-mail</h3>
                      <p style={{ margin: 0, color: 'var(--dn-muted)' }}>contato@dnsistemas.com.br</p>
                    </div>
                  </div>

                  <div className="d-flex align-items-start">
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        background: 'rgba(29, 78, 216, 0.10)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--dn-secondary)',
                        fontSize: 22,
                        marginRight: 16,
                        flexShrink: 0,
                      }}
                    >
                      <i className="bi bi-whatsapp"></i>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 20, color: 'var(--dn-primary)', marginBottom: 6 }}>WhatsApp</h3>
                      <p style={{ margin: 0, color: 'var(--dn-muted)' }}>
                        Atendimento direto para orçamento e alinhamento inicial do projeto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div
                  style={{
                    background: '#fff',
                    borderRadius: 24,
                    padding: 28,
                    border: '1px solid var(--dn-border)',
                    boxShadow: '0 18px 50px rgba(15,23,42,0.06)',
                  }}
                >
                  <div className="row gy-4">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Seu nome"
                        style={{ minHeight: 54, borderRadius: 14 }}
                      />
                    </div>

                    <div className="col-md-6">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Seu e-mail"
                        style={{ minHeight: 54, borderRadius: 14 }}
                      />
                    </div>

                    <div className="col-md-12">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Assunto"
                        style={{ minHeight: 54, borderRadius: 14 }}
                      />
                    </div>

                    <div className="col-md-12">
                      <textarea
                        className="form-control"
                        rows={6}
                        placeholder="Descreva o que sua empresa precisa"
                        style={{ borderRadius: 14 }}
                      ></textarea>
                    </div>

                    <div className="col-md-12">
                      <button
                        type="button"
                        className="btn"
                        style={{
                          background: 'var(--dn-secondary)',
                          color: '#fff',
                          borderRadius: 14,
                          padding: '14px 22px',
                          fontWeight: 800,
                        }}
                      >
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

      <footer
        id="footer"
        className="footer"
        style={{
          background: 'var(--dn-primary-dark)',
          color: 'rgba(255,255,255,0.72)',
          padding: '28px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="container text-center">
          <p style={{ margin: 0 }}>
            © <strong style={{ color: '#fff' }}>DN Sistemas Corporativos</strong>. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <Script
        src="/assets/vendor/bootstrap/js/bootstrap.bundle.min.js"
        strategy="afterInteractive"
      />
      <Script src="/assets/js/main.js" strategy="afterInteractive" />
    </>
  )
}