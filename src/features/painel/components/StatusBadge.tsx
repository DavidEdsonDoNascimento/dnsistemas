import Chip from '@mui/material/Chip'
import { alpha } from '@mui/material/styles'
import type { StatusTone } from '../types'

const TONE_COLORS: Record<StatusTone, { fg: string; bg: string; border: string }> = {
  success: { fg: '#86EFAC', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.28)' },
  warning: { fg: '#FCD34D', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.28)' },
  error: { fg: '#FCA5A5', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.30)' },
  info: { fg: '#93C5FD', bg: 'rgba(37,99,235,0.14)', border: 'rgba(37,99,235,0.32)' },
  neutral: { fg: '#D4D4D8', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' },
}

export interface StatusBadgeProps {
  label: string
  tone?: StatusTone
}

export default function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  const c = TONE_COLORS[tone]
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 24,
        px: 0.5,
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        color: c.fg,
        bgcolor: c.bg,
        border: '1px solid',
        borderColor: c.border,
        '& .MuiChip-label': { px: 1 },
        '&:hover': { bgcolor: alpha(c.fg, 0.12) },
      }}
    />
  )
}
