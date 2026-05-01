'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { theme } from './index'
import { getLandingCssVariables } from './landingCssVars'

/** Variáveis do template Clarity / Bootstrap compatíveis (`--accent-color`, etc.). */
function getLegacyTemplateCssVariables(t: Theme): Record<string, string> {
  return {
    '--background-color': 'var(--dn-body-bg)',
    '--default-color': 'var(--dn-muted)',
    '--heading-color': 'var(--dn-primary)',
    '--accent-color': 'var(--dn-secondary)',
    '--surface-color': 'var(--dn-service-card-bg)',
    '--contrast-color': 'var(--dn-primary)',
    '--nav-color': 'var(--dn-header-nav)',
    '--nav-hover-color': 'var(--dn-primary)',
    '--nav-mobile-background-color': 'var(--dn-body-bg)',
    '--nav-dropdown-background-color': 'var(--dn-service-card-bg)',
    '--nav-dropdown-color': 'var(--dn-muted)',
    '--nav-dropdown-hover-color': 'var(--dn-primary)',
  }
}

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={(t) => ({
            ':root': {
              ...getLandingCssVariables(t),
              ...getLegacyTemplateCssVariables(t),
            },
            body: {
              fontFamily: theme.typography.fontFamily,
              backgroundColor: t.landing.palette.bodyBg,
              color: t.landing.palette.muted,
            },
            'textarea.form-control': {
              minHeight: 120,
            },
          })}
        />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
