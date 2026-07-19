import Image from 'next/image'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LoginForm from './LoginForm'

export interface LoginCardProps {
  next?: string
  initialError?: string | null
}

/**
 * Shell visual da página de login. Server Component — apenas markup.
 * O estado e a submissão ficam no LoginForm (client).
 */
export default function LoginCard({ next, initialError }: LoginCardProps) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: '#0A0A0A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(176,141,87,0.12), transparent 28%), radial-gradient(circle at 82% 30%, rgba(139,109,65,0.10), transparent 24%)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          bgcolor: 'rgba(11,15,20,0.85)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 3,
          backdropFilter: 'blur(14px)',
          p: { xs: 3, sm: 4.5 },
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}
      >
        <Stack spacing={1} sx={{ mb: 3.5, alignItems: 'flex-start' }}>
          <Box
            sx={{
              position: 'relative',
              width: 160,
              height: 36,
              mb: 1,
            }}
          >
            <Image
              src="/antero_logo_v1.png"
              alt="ANTERO Sistemas"
              fill
              priority
              sizes="160px"
              style={{ objectFit: 'contain', objectPosition: 'left' }}
            />
          </Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              color: '#FFF',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.375rem', sm: '1.5rem' },
            }}
          >
            Acesse o painel interno
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Entre com sua conta corporativa para continuar.
          </Typography>
        </Stack>

        <LoginForm next={next} initialError={initialError} />

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 3.5,
            color: 'text.secondary',
            fontSize: '0.72rem',
            textAlign: 'center',
          }}
        >
          Acesso restrito · ANTERO Sistemas
        </Typography>
      </Box>
    </Box>
  )
}
