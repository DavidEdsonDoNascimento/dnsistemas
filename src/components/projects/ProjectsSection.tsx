import lc from '@/theme/landing.module.css'
import ProjectCaseCard from './ProjectCaseCard'
import { PROJECTS } from './projects-data'
import s from './projects.module.css'

export default function ProjectsSection() {
  return (
    <section
      id="projetos"
      className={`section ${lc.landingSectionWhite} ${s.projectsSection}`}
      aria-labelledby="projects-title"
    >
      <div className="container">
        <div className={`text-center ${lc.landingSectionIntroWide} ${lc.landingSectionIntro}`}>
          <span className={lc.landingEyebrow}>Projetos</span>
          <h2 id="projects-title" className={lc.landingHeading2}>
            Projetos e soluções desenvolvidas
          </h2>
          <p className={s.projectsLead}>Tecnologia aplicada a problemas reais de negócio.</p>
          <p className={lc.landingParagraphCenter}>
            Conheça exemplos de soluções desenvolvidas para organizar operações, automatizar
            processos e transformar necessidades específicas em software sob medida.
          </p>
        </div>

        <div className={s.caseList}>
          {PROJECTS.map((project) => (
            <ProjectCaseCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
