import Image from 'next/image'
import lc from '@/theme/landing.module.css'
import s from './technical-lead.module.css'

const PORTFOLIO_URL = 'https://davidnascimento.io'

const SPECIALTIES = [
  'Aplicações web e mobile',
  'Sistemas empresariais',
  'Engenharia backend',
  'Arquitetura de software',
  'Integrações entre sistemas',
  'Aplicações em tempo real',
  'Automação de processos',
  'Soluções personalizadas para negócios',
]

const PROFILE_FACTS = [
  { label: 'Experiência', value: 'Mais de 10 anos em desenvolvimento de software' },
  { label: 'Atuação', value: 'Full stack: web, mobile e backend' },
  { label: 'Segmentos', value: 'Varejo, logística, sistemas geoespaciais e SaaS' },
  { label: 'Liderança', value: 'Liderança técnica de squad e equipes multidisciplinares' },
]

export default function TechnicalLeadSection() {
  return (
    <section
      id="responsavel-tecnico"
      className={`section ${lc.landingSectionWhite} ${s.leadSection}`}
      aria-labelledby="lead-title"
    >
      <div className="container">
        <div className={s.leadGrid}>
          <div className={s.leadContent}>
            <span className={lc.landingEyebrow}>Responsável técnico</span>
            <h2 id="lead-title" className={lc.landingHeading2Tight}>
              Experiência de engenharia por trás de cada solução.
            </h2>

            <p className={lc.landingParagraph}>
              A engenharia das soluções da ANTERO Sistemas está sob a responsabilidade técnica de
              David Nascimento, Engenheiro de Software Full Stack Sênior com mais de 10 anos de
              experiência no desenvolvimento de aplicações, plataformas empresariais e integrações
              entre sistemas.
            </p>
            <p className={lc.landingParagraphLoose}>
              A atuação combina arquitetura de software, desenvolvimento full stack e uma abordagem
              prática para transformar desafios operacionais em soluções digitais — com passagem
              por empresas de tecnologia e projetos nos segmentos de varejo, logística, sistemas
              geoespaciais e SaaS.
            </p>

            <h3 className={s.specialtiesTitle}>Especialidades</h3>
            <ul className={s.specialties}>
              {SPECIALTIES.map((specialty) => (
                <li key={specialty}>{specialty}</li>
              ))}
            </ul>

            <div className={s.leadActions}>
              <a
                href="#contact"
                className={`btn ${lc.landingBtnPrimary}`}
                aria-label="Conversar com a ANTERO Sistemas sobre o seu projeto"
              >
                Conversar sobre meu projeto
              </a>
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn ${lc.landingBtnGhost} ${s.portfolioLink}`}
              >
                Conhecer o portfólio técnico
                <i className="bi bi-arrow-up-right" aria-hidden></i>
                <span className="visually-hidden"> (abre em nova aba)</span>
              </a>
            </div>
          </div>

          <aside className={s.profileCard} aria-label="Perfil do responsável técnico">
            <div className={s.profileHead}>
              <div className={s.portrait}>
                <Image
                  src="/eu.jpeg"
                  alt="Retrato de David Nascimento"
                  width={1024}
                  height={1536}
                  sizes="160px"
                  className={s.portraitImage}
                />
              </div>
              <div>
                <p className={s.profileName}>David Nascimento</p>
                <p className={s.profileRole}>Engenheiro de Software Full Stack Sênior</p>
              </div>
            </div>

            <dl className={s.profileFacts}>
              {PROFILE_FACTS.map((fact) => (
                <div key={fact.label} className={s.profileFact}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  )
}
