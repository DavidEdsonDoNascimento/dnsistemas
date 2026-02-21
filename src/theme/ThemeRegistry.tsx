'use client'

import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './index'
import { ReactNode } from 'react'

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}