'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import styles from '@/theme/landing.module.css'

const ABOUT_VIDEO_SRC = '/videos/office-1.mp4'
const VISIBLE_ENOUGH_RATIO = 0.35

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
 * Vídeo editorial da seção "about". Sob reduced-motion, saveData ou conexão 2G,
 * o <video> nunca é montado — só o painel de fallback (ícone) aparece.
 */
export default function AboutOfficeVideo() {
  const allowed = useSyncExternalStore(
    subscribeMotionPreference,
    getVideoAllowedSnapshot,
    getVideoAllowedServerSnapshot
  )
  const [hasError, setHasError] = useState(false)
  const [srcAssigned, setSrcAssigned] = useState(false)
  const [ready, setReady] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const showVideo = allowed && !hasError

  // Atribui o src apenas quando a área estiver perto da viewport.
  useEffect(() => {
    if (!showVideo || srcAssigned) return
    const frame = frameRef.current
    if (!frame) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSrcAssigned(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px 0px' }
    )
    observer.observe(frame)
    return () => observer.disconnect()
  }, [showVideo, srcAssigned])

  // Toca/pausa conforme a visibilidade real, sem reiniciar o vídeo do começo.
  useEffect(() => {
    if (!srcAssigned) return
    const frame = frameRef.current
    const video = videoRef.current
    if (!frame || !video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= VISIBLE_ENOUGH_RATIO) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, VISIBLE_ENOUGH_RATIO] }
    )
    observer.observe(frame)
    return () => observer.disconnect()
  }, [srcAssigned])

  return (
    <div ref={frameRef} className={styles.landingAboutVideoFrame}>
      <div className={styles.landingAboutVideoFallback} aria-hidden>
        <i className="bi bi-building" />
      </div>

      {showVideo && (
        <video
          ref={videoRef}
          className={`${styles.landingAboutVideoEl} ${ready ? styles.landingAboutVideoElReady : ''}`}
          src={srcAssigned ? ABOUT_VIDEO_SRC : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          onLoadedData={() => setReady(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  )
}
