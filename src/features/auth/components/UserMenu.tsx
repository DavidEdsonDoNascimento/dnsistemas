'use client'

import { useState, type MouseEvent } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { signOutAction } from '../actions/sign-out'
import type { AuthUser } from '../types'

export interface UserMenuProps {
  user: AuthUser | null
}

function initialsFrom(user: AuthUser | null): string {
  if (!user) return 'AS'
  const name =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    'AS'
  const parts = name.split(/[\s@.]+/).filter(Boolean)
  const first = parts[0]?.[0] ?? 'A'
  const second = parts[1]?.[0] ?? ''
  return (first + second).toUpperCase()
}

function displayNameFrom(user: AuthUser | null): string {
  if (!user) return 'Convidado'
  return (
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email ??
    'Usuário'
  )
}

export default function UserMenu({ user }: UserMenuProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const open = Boolean(anchor)

  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)
  const handleClose = () => setAnchor(null)

  const initials = initialsFrom(user)
  const name = displayNameFrom(user)
  const subtitle = user?.email ?? 'Equipe interna'

  return (
    <Box sx={{ pl: 1.25, ml: 0.5, borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <IconButton
          onClick={handleOpen}
          aria-label="Abrir menu do usuário"
          aria-haspopup="menu"
          aria-expanded={open}
          sx={{ p: 0.25 }}
        >
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
            {initials}
          </Avatar>
        </IconButton>
        <Box sx={{ display: { xs: 'none', md: 'block' }, lineHeight: 1.15 }}>
          <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }} noWrap>
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', maxWidth: 200, display: 'block' }}
            noWrap
          >
            {subtitle}
          </Typography>
        </Box>
      </Stack>

      <Menu
        anchorEl={anchor}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 240,
              bgcolor: 'rgba(11,15,20,0.96)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(14px)',
              color: '#E4E4E7',
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }} noWrap>
            {name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {subtitle}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
        <form action={signOutAction}>
          <MenuItem
            component="button"
            type="submit"
            sx={{
              width: '100%',
              py: 1.25,
              color: '#FCA5A5',
              fontSize: '0.9rem',
              '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' },
            }}
          >
            <LogoutRoundedIcon sx={{ fontSize: 18, mr: 1.25 }} />
            Sair
          </MenuItem>
        </form>
      </Menu>
    </Box>
  )
}
