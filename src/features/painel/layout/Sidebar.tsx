'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { PAINEL_BRAND, PAINEL_NAV_ITEMS } from '../config/navigation'

export interface SidebarProps {
  /** Largura fixa do sidebar (alinhada ao PainelShell). */
  width: number
  /** Em mobile, o sidebar vive dentro de um Drawer e fecha ao clicar num item. */
  onNavigate?: () => void
}

export const SIDEBAR_WIDTH = 264

function isActive(pathname: string, href: string): boolean {
  if (href === '/painel') return pathname === '/painel'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Sidebar({ width, onNavigate }: SidebarProps) {
  const pathname = usePathname() ?? ''

  return (
    <Box
      component="aside"
      sx={{
        width,
        flexShrink: 0,
        height: '100%',
        bgcolor: '#0B0F14',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: '#FFF',
            fontWeight: 700,
            letterSpacing: '0.18em',
            fontSize: '0.875rem',
          }}
        >
          {PAINEL_BRAND.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: 'text.secondary',
            mt: 0.25,
            fontSize: '0.72rem',
            letterSpacing: '0.02em',
          }}
        >
          {PAINEL_BRAND.suffix}
        </Typography>
      </Box>

      <Stack
        component="nav"
        aria-label="Navegação do painel"
        spacing={0.5}
        sx={{ px: 1.5, py: 2, flex: 1, overflowY: 'auto' }}
      >
        {PAINEL_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(pathname, item.href)
          return (
            <Box
              key={item.href}
              component={Link}
              href={item.href}
              onClick={onNavigate}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 1.75,
                py: 1.1,
                borderRadius: 1.5,
                textDecoration: 'none',
                color: active ? '#FFF' : '#A1A1AA',
                bgcolor: active ? 'rgba(37,99,235,0.14)' : 'transparent',
                border: '1px solid',
                borderColor: active ? 'rgba(37,99,235,0.32)' : 'transparent',
                fontSize: '0.9rem',
                fontWeight: active ? 600 : 500,
                transition:
                  'background-color 140ms ease, color 140ms ease, border-color 140ms ease',
                '&:hover': {
                  color: '#FFF',
                  bgcolor: active ? 'rgba(37,99,235,0.18)' : 'rgba(255,255,255,0.04)',
                },
              }}
            >
              <Icon sx={{ fontSize: 20, color: active ? '#93C5FD' : 'inherit' }} />
              <span>{item.label}</span>
            </Box>
          )
        })}
      </Stack>

      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
          Versão fundacional · dados mockados
        </Typography>
      </Box>
    </Box>
  )
}
