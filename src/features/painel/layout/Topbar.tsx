'use client'

import { usePathname } from 'next/navigation'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import UserMenu from '@/features/auth/components/UserMenu'
import type { AuthUser } from '@/features/auth/types'
import { PAINEL_NAV_ITEMS } from '../config/navigation'

export interface TopbarProps {
  onOpenSidebar: () => void
  user?: AuthUser | null
}

function currentSectionLabel(pathname: string): string {
  const exact = PAINEL_NAV_ITEMS.find((i) => i.href === pathname)
  if (exact) return exact.label
  const startsWith = PAINEL_NAV_ITEMS.find(
    (i) => i.href !== '/painel' && pathname.startsWith(`${i.href}/`),
  )
  return startsWith?.label ?? 'Painel'
}

export default function Topbar({ onOpenSidebar, user = null }: TopbarProps) {
  const pathname = usePathname() ?? '/painel'
  const section = currentSectionLabel(pathname)

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(10,10,10,0.72)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        color: '#FFF',
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 60, md: 68 },
          px: { xs: 2, md: 3 },
          gap: 2,
        }}
      >
        <IconButton
          aria-label="Abrir menu lateral"
          onClick={onOpenSidebar}
          sx={{
            display: { xs: 'inline-flex', lg: 'none' },
            color: '#E4E4E7',
            mr: 0.5,
          }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              color: 'text.secondary',
              fontSize: '0.7rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Painel interno
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: '#FFF',
              lineHeight: 1.2,
              fontSize: '0.95rem',
            }}
          >
            {section}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Tooltip title="Busca (em breve)">
            <IconButton sx={{ color: '#A1A1AA' }} aria-label="Buscar">
              <SearchRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notificações (em breve)">
            <IconButton sx={{ color: '#A1A1AA' }} aria-label="Notificações">
              <NotificationsNoneRoundedIcon />
            </IconButton>
          </Tooltip>

          <UserMenu user={user} />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
