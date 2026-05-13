'use client'

import { useCallback, useState, type ReactNode } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar'
import Topbar from './Topbar'

export interface PainelShellProps {
  children: ReactNode
}

/**
 * Estrutura visual do painel: Sidebar (fixa em ≥ lg, drawer em < lg) + Topbar + main.
 * Componente client por carregar estado do drawer mobile.
 */
export default function PainelShell({ children }: PainelShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const openMobile = useCallback(() => setMobileOpen(true), [])

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: '#0A0A0A',
        color: 'text.primary',
        display: 'flex',
      }}
    >
      {/* Sidebar fixa em desktop */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'block' },
          position: 'sticky',
          top: 0,
          height: '100dvh',
        }}
      >
        <Sidebar width={SIDEBAR_WIDTH} />
      </Box>

      {/* Sidebar como drawer em mobile/tablet */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeMobile}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            border: 'none',
            bgcolor: 'transparent',
          },
        }}
      >
        <Sidebar width={SIDEBAR_WIDTH} onNavigate={closeMobile} />
      </Drawer>

      {/* Conteúdo */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar onOpenSidebar={openMobile} />
        <Box
          component="main"
          sx={{
            flex: 1,
            px: { xs: 2.5, md: 4 },
            py: { xs: 3, md: 4 },
            maxWidth: 1440,
            width: '100%',
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
