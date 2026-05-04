'use client'

import { useEffect, useState } from 'react'
import styles from './ScrollToTopButton.module.css'

const SHOW_THRESHOLD_PX = 300

function ArrowUpGlyph() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        d="M12 4a1 1 0 0 1 .707.293l7 7a1 1 0 1 1-1.414 1.414L13 7.414V19a1 1 0 1 1-2 0V7.414l-5.293 5.293a1 1 0 1 1-1.414-1.414l7-7A1 1 0 0 1 12 4Z"
      />
    </svg>
  )
}

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > SHOW_THRESHOLD_PX)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleClick() {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <button
      type="button"
      className={`${styles.fab} ${visible ? styles.visible : ''}`}
      onClick={handleClick}
      aria-label="Voltar ao topo da página"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUpGlyph />
    </button>
  )
}
