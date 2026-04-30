import { createTheme, type Shadows } from '@mui/material/styles'
import { landingTokens } from './landingTokens'

const baseShadow = '0 20px 50px rgba(0, 0, 0, 0.5)'

const shadows = [
  'none',
  '0 2px 8px rgba(0,0,0,0.2)',
  '0 8px 24px rgba(0,0,0,0.3)',
  '0 12px 32px rgba(0,0,0,0.4)',
  ...Array.from({ length: 21 }, () => baseShadow),
] as Shadows

export const theme = createTheme({
  landing: landingTokens,

  palette: {
    mode: 'dark',

    primary: {
      main: landingTokens.palette.accent,
      contrastText: landingTokens.palette.navIcon,
    },

    secondary: {
      main: landingTokens.palette.muted,
      contrastText: landingTokens.palette.primaryText,
    },

    background: {
      default: landingTokens.palette.footerBg,
      paper: landingTokens.palette.serviceCardBg,
    },

    text: {
      primary: landingTokens.palette.primaryText,
      secondary: landingTokens.palette.muted,
    },

    divider: 'rgba(255,255,255,0.08)',
  },

  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
    ].join(','),

    h1: {
      fontWeight: 800,
      fontSize: 'clamp(2.6rem, 5vw, 4.6rem)',
      lineHeight: 1.05,
      letterSpacing: '-0.03em',
    },

    h2: {
      fontWeight: 700,
      fontSize: 'clamp(2rem, 3vw, 3.2rem)',
      lineHeight: 1.1,
    },

    body1: {
      fontSize: '1rem',
      lineHeight: 1.8,
    },

    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },

  shape: {
    borderRadius: landingTokens.radius.sm,
  },

  shadows,
})
