'use client'

import { usePathname } from 'next/navigation'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { PAINEL_NAV_ITEMS } from '../config/navigation'

export interface TopbarProps {
  onOpenSidebar: () => void
}

function currentSectionLabel(pathname: string): string {
  const exact = PAINEL_NAV_ITEMS.find((i) => i.href === pathname)
  if (exact) return exact.label
  const startsWith = PAINEL_NAV_ITEMS.find(
    (i) => i.href !== '/painel' && pathname.startsWith(`${i.href}/`),
  )
  return startsWith?.label ?? 'Painel'
}

export default function Topbar({ onOpenSidebar }: TopbarProps) {
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

          <Box sx={{ pl: 1.25, ml: 0.5, borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: 'rgba(37,99,235,0.18)',
                  color: '#93C5FD',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid rgba(37,99,235,0.28)',
                }}
              >
                AS
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' }, lineHeight: 1.15 }}>
                <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                  Antero Admin
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Equipe interna
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
