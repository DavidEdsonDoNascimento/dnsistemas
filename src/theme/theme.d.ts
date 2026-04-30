import type { LandingTokens } from './landingTokens'

declare module '@mui/material/styles' {
  interface Theme {
    landing: LandingTokens
  }
  interface ThemeOptions {
    landing?: LandingTokens
  }
}
