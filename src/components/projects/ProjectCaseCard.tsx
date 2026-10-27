import type { ComponentType } from 'react'
import lc from '@/theme/landing.module.css'
import OrdersPlatformIllustration from './OrdersPlatformIllustration'
import type { ProjectCase, ProjectVisual } from './projects-data'
import s from './projects.module.css'

const PROJECT_VISUALS: Record<ProjectVisual, ComponentType> = {
  'orders-platform': OrdersPlatformIllustration,
}

export default function ProjectCaseCard({ project }: { project: ProjectCase }) {
  const Visual = PROJECT_VISUALS[project.visual]
  const titleId = `project-${project.id}-title`

  return (
    <article className={s.caseCard} aria-labelledby={titleId}>
      <header className={s.caseHead}>
        <p className={s.caseCategory}>{project.category}</p>
        <h3 id={titleId} className={s.caseTitle}>
          {project.title}
        </h3>
        <p className={s.caseDescription}>{project.description}</p>
        <ul className={s.caseTags} aria-label="Características do projeto">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </header>

      <div className={s.caseVisual}>
        <Visual />
      </div>

      <div className={s.caseDetails}>
        <div>
          <h4 className={s.caseBlockTitle}>Desafio</h4>
          <p className={s.caseText}>{project.challenge.intro}</p>
          <ul className={s.caseChallengeList}>
            {project.challenge.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={s.caseBlockTitle}>Solução</h4>
          <p className={s.caseText}>{project.solution}</p>
        </div>

        <div className={s.caseHighlightsBlock}>
          <h4 className={s.caseBlockTitle}>Principais funcionalidades</h4>
          <ul className={s.caseHighlights}>
            {project.highlights.map((highlight) => (
              <li key={highlight}>
                <i className="bi bi-check2" aria-hidden></i>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.caseCta}>
        <div>
          <p className={s.caseCtaQuestion}>{project.cta.question}</p>
          <p className={s.caseCtaText}>{project.cta.text}</p>
        </div>
        <a
          href={project.cta.href}
          className={`btn ${lc.landingBtnPrimary}`}
          aria-label={project.cta.ariaLabel}
        >
          {project.cta.label}
        </a>
      </div>
    </article>
  )
}
