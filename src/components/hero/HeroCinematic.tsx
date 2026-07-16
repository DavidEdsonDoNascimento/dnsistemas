/**
 * ⚠ TEMPORARIAMENTE DESATIVADO — Hero Cinemático.
 *
 * Este componente NÃO faz parte da versão atual do site e está excluído do build
 * via "exclude" no tsconfig.json (depende de `framer-motion`, que não está instalada).
 *
 * Para reativar:
 * 1. Instalar a dependência: `npm install framer-motion`
 * 2. Remover "src/components/hero/HeroCinematic.tsx" do "exclude" em tsconfig.json
 * 3. Importar e renderizar `HeroCinematic` onde desejado.
 */
'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'

import lc from '@/theme/landing.module.css'
import styles from './hero-cinematic.module.css'

/**
 * Hero cinematográfica: vídeo em tela cheia ao fundo, conteúdo por cima.
 *
 * O vídeo é decorativo. A legibilidade do texto NÃO depende do frame exibido: vem dos três
 * overlays (gradiente vertical + escurecimento radial central + vinheta), que garantem
 * contraste mesmo nos quadros mais claros do vídeo.
 *
 * Fontes do vídeo em ordem de preferência. As versões otimizadas (WebM/MP4 reduzido) e o
 * poster entram aqui depois, sem mexer no restante do componente.
 */
const VIDEO_SOURCES: Array<{ src: string; type: string }> = [
  // { src: '/videos/hero-experience.webm', type: 'video/webm' },
  { src: '/videos/hero-experience.mp4', type: 'video/mp4' },
]

const POSTER_SRC: string | null = null

/** Entrada em cascata — mesma curva usada nas seções do site de referência. */
const EASE_CINEMATIC = [0.25, 0.46, 0.45, 0.94] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_CINEMATIC } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: EASE_CINEMATIC } },
}

export function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  // O vídeo se desloca mais devagar que a página. O contêiner é maior que a seção
  // (ver .videoLayer no CSS) para que o parallax nunca revele borda vazia.
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-60, 60])

  // Sem autoplay, o browser não pinta quadro nenhum até decodificar um. Um seek mínimo
  // força o primeiro quadro a aparecer — é o "poster" do caso reduced-motion.
  const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    if (!prefersReducedMotion) return
    const video = event.currentTarget
    video.pause()
    if (video.currentTime === 0) video.currentTime = 0.05
  }

  const animation = prefersReducedMotion
    ? undefined
    : { initial: 'hidden' as const, animate: 'visible' as const }

  return (
    // Sem as classes globais `hero`/`section` do template (assets/css/main.css): elas trazem
    // background-color opaco e padding próprios, que cobriam o vídeo.
    <section id="hero" ref={sectionRef} className={styles.hero} aria-labelledby="hero-title">
      {/* Camada 1 — vídeo de fundo (decorativo: não é anunciado por leitores de tela) */}
      <motion.div
        className={styles.videoLayer}
        style={prefersReducedMotion ? undefined : { y: parallaxY }}
        aria-hidden="true"
      >
        {videoFailed ? (
          // Só some de fato quando a reprodução falha. Sem poster ainda: fica o fundo
          // estático da Hero, sem layout shift.
          <div className={styles.videoFallback} />
        ) : (
          <video
            className={styles.video}
            // Com prefers-reduced-motion o vídeo NÃO toca — mas continua montado, exibindo
            // o primeiro quadro como imagem estática. Desmontá-lo deixava a Hero sem imagem
            // nenhuma para quem desliga animações (no Windows isso é um clique em
            // "Mostrar animações", e é bem comum).
            autoPlay={!prefersReducedMotion}
            loop={!prefersReducedMotion}
            muted
            playsInline
            preload="auto"
            tabIndex={-1}
            {...(POSTER_SRC ? { poster: POSTER_SRC } : {})}
            onLoadedMetadata={handleLoadedMetadata}
            onError={() => setVideoFailed(true)}
          >
            {VIDEO_SOURCES.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
        )}
      </motion.div>

      {/* Camada 2 — legibilidade: gradiente vertical, escurecimento central e vinheta */}
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.spotlight} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      {/* Camada 3 — conteúdo */}
      <div className="container position-relative">
        <div className={styles.content}>
          <motion.span {...animation} variants={fadeIn} transition={{ delay: 0.3 }}>
            <span className={`${lc.landingEyebrow} ${styles.eyebrow}`}>
              Desenvolvimento de software sob medida
            </span>
          </motion.span>

          <motion.h1
            {...animation}
            variants={fadeUp}
            transition={{ delay: 0.5 }}
            id="hero-title"
            className={`${lc.landingHeroTitle} ${styles.title}`}
          >
            Desenvolvimento de software personalizado para empresas em Santa Catarina e
            todo o Brasil.
          </motion.h1>

          <motion.p
            {...animation}
            variants={fadeUp}
            transition={{ delay: 0.8 }}
            className={`${lc.landingHeroLead} ${styles.lead}`}
          >
            Criamos sistemas sob medida, automação de processos empresariais e aplicativos
            personalizados para reduzir custo operacional, eliminar planilhas e escalar a
            operação com previsibilidade.
          </motion.p>

          <motion.div
            {...animation}
            variants={fadeUp}
            transition={{ delay: 1 }}
            className={`d-flex flex-wrap gap-2 ${lc.landingHeroActions} ${styles.actions}`}
          >
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
          </motion.div>

          <motion.p
            {...animation}
            variants={fadeUp}
            transition={{ delay: 1.3 }}
            className={`${lc.landingHeroMeta} ${styles.meta}`}
          >
            <strong>Engenharia e produto</strong> · Orçamento claro · Entregas por marcos
            quinzenais
          </motion.p>
        </div>
      </div>

      {/* Seta de rolagem */}
      <motion.a
        href="#about"
        aria-label="Descer para o conteúdo"
        className={styles.scrollCue}
        initial={prefersReducedMotion ? undefined : { opacity: 0 }}
        animate={
          prefersReducedMotion ? undefined : { opacity: 1, y: [0, 10, 0] }
        }
        transition={{
          opacity: { delay: 1.8, duration: 1 },
          y: { delay: 1.8, duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <i className="bi bi-chevron-down" aria-hidden="true" />
      </motion.a>
    </section>
  )
}
