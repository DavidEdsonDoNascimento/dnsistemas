import { createTheme, type Shadows } from '@mui/material/styles'

const baseShadow = '0 16px 40px rgba(15, 23, 42, 0.10)'

const shadows: Shadows = [
  'none',
  '0 2px 8px rgba(15, 23, 42, 0.04)',
  '0 8px 24px rgba(15, 23, 42, 0.06)',
  '0 12px 32px rgba(15, 23, 42, 0.08)',
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
  baseShadow,
]

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0A2342',
      light: '#123765',
      dark: '#07182F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1D4ED8',
      light: '#3B82F6',
      dark: '#1E3A8A',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F7FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
    },
    divider: 'rgba(15, 23, 42, 0.08)',
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
      fontSize: 'clamp(2.4rem, 5vw, 4.4rem)',
      lineHeight: 1.08,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 700,
      fontSize: 'clamp(1.9rem, 3vw, 3rem)',
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.75,
    },
    body2: {
      fontSize: '0.96rem',
      lineHeight: 1.7,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 18,
  },
  shadows,
})