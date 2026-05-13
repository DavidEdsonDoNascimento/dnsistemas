import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

export interface SectionCardProps {
  title?: string
  description?: string
  action?: ReactNode
  /** Remove o padding interno (útil para acomodar uma Table de borda-a-borda). */
  noPadding?: boolean
  children: ReactNode
}

/** Container visual padrão de seções do painel. Glass sutil, sem ruído. */
export default function SectionCard({
  title,
  description,
  action,
  noPadding,
  children,
}: SectionCardProps) {
  const hasHeader = Boolean(title || description || action)
  return (
    <Box
      sx={{
        bgcolor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 2.5,
        overflow: 'hidden',
      }}
    >
      {hasHeader ? (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{
            px: 3,
            py: 2.25,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Box>
            {title ? (
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#FFF' }}>
                {title}
              </Typography>
            ) : null}
            {description ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                {description}
              </Typography>
            ) : null}
          </Box>
          {action ? <Box>{action}</Box> : null}
        </Stack>
      ) : null}
      <Box sx={{ p: noPadding ? 0 : 3 }}>{children}</Box>
    </Box>
  )
}
