/** Fonte única de valores visuais da landing (consumida pelo MUI theme + CSS vars + estilos). */
const gradientHero =
  'linear-gradient(135deg, #0A0A0A 0%, #0B0F14 60%, #000000 100%)'

export const landingTokens = {
  palette: {
    primaryText: '#FFFFFF',
    accent: '#B08D57',
    muted: '#A1A1AA',
    bodyBg: '#0A0A0A',
    onLightSurface: '#0A0A0A',
    border: 'rgba(255,255,255,0.06)',
    footerBg: '#050505',
    navIcon: '#FFFFFF',
  
    headerBackdrop: 'rgba(10,10,10,0.88)',
  
    success: '#22C55E',
    error: '#EF4444',
  
    overlayWhiteStrong: 'rgba(255,255,255,0.95)',
    overlayWhiteMuted: 'rgba(255,255,255,0.7)',
    overlayWhiteMedium: 'rgba(255,255,255,0.6)',
  
    glassBorder: 'rgba(255,255,255,0.08)',
    glassBorderGhost: 'rgba(255,255,255,0.12)',
    glassBg: 'rgba(255,255,255,0.03)',
    glassBgStat: 'rgba(255,255,255,0.02)',
    glassBorderWeak: 'rgba(255,255,255,0.04)',
  
    chipBlueBg: 'transparent',
    iconBlueTint: 'rgba(255,255,255,0.04)',
  
    serviceCardBg: '#0B0F14',
  
    ctaMuted: 'rgba(255,255,255,0.7)',
  
    footerMuted: 'rgba(255,255,255,0.6)',
    footerDivider: 'rgba(255,255,255,0.08)',

    headerNavLink: '#E4E4E7',

    ctaBg: '#111111',
    ctaBgHover: '#1B1B1B',
    ctaBgActive: '#141414',
    ctaText: '#F5F5F5',
    ctaBorderHover: '#C7A26A',
  },

  gradients: {
    hero: gradientHero,
    ctaBanner: 'linear-gradient(135deg, #0B0F14 0%, #0A0A0A 55%, #050505 100%)',
    soft: 'linear-gradient(180deg, #0A0A0A 0%, #0B0F14 100%)',
    heroGlow:
      'radial-gradient(circle at 20% 20%, rgba(176,141,87,0.14), transparent 28%), radial-gradient(circle at 82% 30%, rgba(139,109,65,0.12), transparent 24%)',
    heroVideoScrim:
      'linear-gradient(120deg, rgba(6,6,6,0.82) 0%, rgba(7,7,6,0.66) 42%, rgba(9,8,7,0.5) 68%, rgba(10,9,8,0.4) 100%), radial-gradient(circle at 82% 36%, rgba(139,109,65,0.09), transparent 46%)',
    heroVideoScrimMobile:
      'linear-gradient(180deg, rgba(6,6,6,0.78) 0%, rgba(7,7,6,0.64) 45%, rgba(9,8,7,0.56) 100%), radial-gradient(circle at 50% 22%, rgba(139,109,65,0.08), transparent 50%)',
  },

  header: {
    backdropFilter: 'blur(14px)',
  },

  shadow: {
    headerCta: '0 14px 34px rgba(139, 109, 65, 0.28)',
    heroAside: '0 20px 50px rgba(0,0,0,0.5)',
    aboutImg: '0 20px 50px rgba(0,0,0,0.45)',
    card: '0 20px 50px rgba(0,0,0,0.5)',
    ctaRibbon: '0 20px 50px rgba(0,0,0,0.45)',
    carouselPanel: '0 20px 50px rgba(0,0,0,0.5)',
    carouselHeavy: '0 20px 50px rgba(0,0,0,0.55)',
    carouselHeavySm: '0 16px 38px rgba(0,0,0,0.5)',
    carouselSoft: '0 16px 36px rgba(0,0,0,0.4)',
    carouselBottom: '0 12px 30px rgba(0,0,0,0.35)',
  },

  radius: {
    sm: 12,
    md: 14,
    lg: 18,
    xl: 20,
    hero: 22,
    xxl: 24,
    pill: 999,
  },

  spacing: {
    sectionY: 124,
    heroTopPad: 186,
    heroBottomPad: 116,
  },

  carousel: {
    slideHeight: '85vh',
    gradientSlide1: 'linear-gradient(135deg, #0A0A0A 0%, #0B0F14 100%)',
    gradientSlide2: 'linear-gradient(135deg, #0B0F14 0%, #050505 100%)',
    gradientSlide3: 'linear-gradient(135deg, #0A0A0A 0%, #0B0F14 55%, #050505 100%)',
    textMuted: 'rgba(255, 255, 255, 0.85)',
  },
} as const

export type LandingTokens = typeof landingTokens
