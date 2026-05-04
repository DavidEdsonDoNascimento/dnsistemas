'use client'

import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import lc from '@/theme/landing.module.css'

const NAV_LINKS = [
  { href: '#hero', label: 'Início' },
  { href: '#about', label: 'Sobre' },
  { href: '#services', label: 'Serviços' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#investimento', label: 'Investimento' },
  { href: '#faq', label: 'Dúvidas' },
  { href: '#contact', label: 'Contato' },
]

const DESKTOP_BREAKPOINT_PX = 1200

export default function SiteHeader() {
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), [])

  // Sincroniza body.mobile-nav-active (compat com CSS legado: bloqueio de scroll, etc.).
  useEffect(() => {
    if (!mounted) return
    document.body.classList.toggle('mobile-nav-active', mobileOpen)
    return () => {
      document.body.classList.remove('mobile-nav-active')
    }
  }, [mounted, mobileOpen])

  // Fecha automaticamente ao passar para desktop e ao apertar Esc.
  useEffect(() => {
    if (!mounted) return
    const onResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT_PX) closeMobile()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMobile()
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
    }
  }, [mounted, closeMobile])

  return (
    <>
      <header
        id="header"
        className={`header d-flex align-items-center fixed-top ${lc.landingHeader}`}
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <Link
            href="/"
            className="logo d-flex align-items-center text-decoration-none"
            aria-label="ANTERO Sistemas — Desenvolvimento de software sob medida"
          >
            <Image
              src="/antero_logo_v1.png"
              alt="ANTERO Sistemas — Desenvolvimento de software sob medida"
              width={280}
              height={64}
              priority
              className={lc.landingLogoImg}
            />
          </Link>

          <nav id="navmenu" className={`navmenu ${lc.landingDesktopNav}`}>
            <ul>
              {NAV_LINKS.map((link, index) => (
                <li key={link.href}>
                  <a href={link.href} className={index === 0 ? 'active' : undefined}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            type="button"
            className={`d-xl-none bi ${mobileOpen ? 'bi-x' : 'bi-list'} ${lc.landingMobileToggle}`}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="navmenu-mobile"
            onClick={toggleMobile}
          />

          <a
            className={`btn-getstarted ${lc.landingHeaderCta}`}
            href="#contact"
            aria-label="Solicitar orçamento de software personalizado"
          >
            Solicitar um orçamento
          </a>
        </div>
      </header>

      {mounted && mobileOpen
        ? createPortal(
            <div
              id="navmenu-mobile"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              className={lc.landingMobileNav}
              onClick={closeMobile}
            >
              <button
                type="button"
                className={`bi bi-x ${lc.landingMobileNavClose}`}
                aria-label="Fechar menu"
                onClick={closeMobile}
              />
              <ul
                className={lc.landingMobileNavList}
                onClick={(event) => event.stopPropagation()}
              >
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} onClick={closeMobile}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
