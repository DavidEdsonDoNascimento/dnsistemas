'use client'

import { useState, useSyncExternalStore } from 'react'
import styles from '@/theme/landing.module.css'

const HERO_VIDEO_SRC = '/videos/dark-tec.mp4'

type NetworkInformation = {
  saveData?: boolean
  effectiveType?: string
}

function isConnectionTooSlow() {
  if (typeof navigator === 'undefined') return false
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  if (!connection) return false
  if (connection.saveData) return true
  return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
}

function subscribeMotionPreference(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function getVideoAllowedSnapshot() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return !prefersReducedMotion && !isConnectionTooSlow()
}

function getVideoAllowedServerSnapshot() {
  return false
}

/**
 * Vídeo de fundo decorativo do Hero. Não é montado (nenhum byte é baixado) sob
 * reduced-motion, saveData ou conexão 2G — nesses casos o Hero mantém o gradiente atual.
 */
export default function HeroBackgroundVideo() {
  const allowed = useSyncExternalStore(
    subscribeMotionPreference,
    getVideoAllowedSnapshot,
    getVideoAllowedServerSnapshot
  )
  const [hasError, setHasError] = useState(false)
  const [ready, setReady] = useState(false)

  if (!allowed || hasError) return null

  return (
    <div className={styles.landingHeroVideoLayer} aria-hidden>
      <video
        className={`${styles.landingHeroVideoEl} ${ready ? styles.landingHeroVideoElReady : ''}`}
        src={HERO_VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        onLoadedData={() => setReady(true)}
        onError={() => setHasError(true)}
      />
      <div className={styles.landingHeroVideoOverlay} />
    </div>
  )
}
