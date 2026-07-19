'use client'

import { useActionState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import GoogleIcon from '@mui/icons-material/Google'
import { signInWithGoogleAction } from '../actions/sign-in-google'
import { signInWithPasswordAction } from '../actions/sign-in-password'
import type { LoginFormState } from '../types'

const INITIAL_STATE: LoginFormState = { error: null }

export interface LoginFormProps {
  /** Caminho seguro para redirecionar após login. */
  next?: string
  /** Mensagem inicial (ex.: ?error=oauth). */
  initialError?: string | null
}

export default function LoginForm({ next = '/painel', initialError = null }: LoginFormProps) {
  const [state, action, pending] = useActionState(
    signInWithPasswordAction,
    initialError ? { error: initialError } : INITIAL_STATE,
  )

  return (
    <Stack spacing={2.5}>
      {state.error ? (
        <Alert
          severity="error"
          variant="outlined"
          sx={{
            bgcolor: 'rgba(239,68,68,0.06)',
            borderColor: 'rgba(239,68,68,0.32)',
            color: '#FCA5A5',
            '& .MuiAlert-icon': { color: '#FCA5A5' },
          }}
        >
          {state.error}
        </Alert>
      ) : null}

      <Box component="form" action={signInWithGoogleAction}>
        <input type="hidden" name="next" value={next} />
        <Button
          type="submit"
          variant="outlined"
          fullWidth
          size="large"
          startIcon={<GoogleIcon />}
          sx={{
            color: '#FFF',
            borderColor: 'rgba(255,255,255,0.16)',
            bgcolor: 'rgba(255,255,255,0.02)',
            fontWeight: 600,
            py: 1.25,
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.32)',
              bgcolor: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          Continuar com Google
        </Button>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            px: 1.5,
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          ou
        </Typography>
      </Divider>

      <Box component="form" action={action} noValidate>
        <input type="hidden" name="next" value={next} />
        <Stack spacing={2}>
          <TextField
            name="email"
            label="Email"
            type="email"
            required
            fullWidth
            autoComplete="email"
            disabled={pending}
            slotProps={{ inputLabel: { sx: { color: 'text.secondary' } } }}
            sx={textFieldSx}
          />
          <TextField
            name="password"
            label="Senha"
            type="password"
            required
            fullWidth
            autoComplete="current-password"
            disabled={pending}
            slotProps={{ inputLabel: { sx: { color: 'text.secondary' } } }}
            sx={textFieldSx}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={pending}
            sx={{
              mt: 0.5,
              py: 1.25,
              bgcolor: '#B08D57',
              color: '#0A0A0A',
              fontWeight: 600,
              '&:hover': { bgcolor: '#8B6D41' },
              '&.Mui-disabled': {
                bgcolor: 'rgba(176,141,87,0.4)',
                color: 'rgba(10,10,10,0.7)',
              },
            }}
            startIcon={
              pending ? <CircularProgress size={18} sx={{ color: '#FFF' }} /> : null
            }
          >
            {pending ? 'Entrando...' : 'Entrar'}
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    color: '#FFF',
    bgcolor: 'rgba(255,255,255,0.02)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.24)' },
    '&.Mui-focused fieldset': { borderColor: '#B08D57' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#B08D57' },
}
