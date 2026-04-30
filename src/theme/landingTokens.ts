/** Fonte única de valores visuais da landing (consumida pelo MUI theme + CSS vars + estilos). */
const gradientHero =
  'linear-gradient(135deg, #0A0A0A 0%, #0B0F14 60%, #000000 100%)'

export const landingTokens = {
  palette: {
    primaryText: '#FFFFFF',
    accent: '#2563EB',
    muted: '#A1A1AA',
    bodyBg: '#0A0A0A',
    onLightSurface: '#0A0A0A',
    border: 'rgba(255,255,255,0.08)',
    footerBg: '#050505',
    navIcon: '#FFFFFF',
  
    headerBackdrop: 'rgba(10,10,10,0.75)',
  
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
  
    chipBlueBg: 'rgba(37,99,235,0.12)',
    iconBlueTint: 'rgba(37,99,235,0.18)',
  
    serviceCardBg: '#0B0F14',
  
    ctaMuted: 'rgba(255,255,255,0.7)',
  
    footerMuted: 'rgba(255,255,255,0.6)',
    footerDivider: 'rgba(255,255,255,0.08)',
  
    headerNavLink: '#E4E4E7',

    starAccent: '#FBBF24',
  },

  gradients: {
    hero: gradientHero,
    ctaBanner: gradientHero,
    soft: 'linear-gradient(180deg, #0A0A0A 0%, #0B0F14 100%)',
    heroGlow:
  'radial-gradient(circle at 20% 20%, rgba(37,99,235,0.15), transparent 25%), radial-gradient(circle at 80% 30%, rgba(37,99,235,0.12), transparent 22%)',
  },

  header: {
    backdropFilter: 'blur(14px)',
  },

  shadow: {
    headerCta: '0 14px 30px rgba(29, 78, 216, 0.24)',
    heroAside: '0 30px 80px rgba(2, 8, 23, 0.34)',
    aboutImg: '0 24px 70px rgba(15, 23, 42, 0.14)',
    card: '0 20px 60px rgba(0,0,0,0.6)',
    ctaRibbon: '0 30px 80px rgba(7, 24, 47, 0.18)',
    carouselPanel: '0 20px 40px rgba(0,0,0,0.4)',
    carouselHeavy: '0 30px 60px rgba(0,0,0,0.5)',
    carouselHeavySm: '0 20px 40px rgba(0,0,0,0.5)',
    carouselSoft: '0 15px 35px rgba(0,0,0,0.4)',
    carouselBottom: '0 10px 25px rgba(0,0,0,0.35)',
  },

  radius: {
    sm: 14,
    md: 18,
    lg: 20,
    xl: 24,
    hero: 26,
    xxl: 28,
    pill: 999,
  },

  spacing: {
    sectionY: 96,
    heroTopPad: 170,
    heroBottomPad: 110,
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
