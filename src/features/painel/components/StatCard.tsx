import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded'
import type { StatCardData } from '../types'

const DELTA_COLOR = {
  up: '#22C55E',
  down: '#EF4444',
  flat: '#A1A1AA',
} as const

const DELTA_ICON = {
  up: TrendingUpRoundedIcon,
  down: TrendingDownRoundedIcon,
  flat: TrendingFlatRoundedIcon,
} as const

export interface StatCardProps {
  data: StatCardData
}

export default function StatCard({ data }: StatCardProps) {
  const DeltaIcon = data.delta ? DELTA_ICON[data.delta.direction] : null
  const deltaColor = data.delta ? DELTA_COLOR[data.delta.direction] : undefined

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 2.5,
        transition: 'border-color 160ms ease, background-color 160ms ease',
        '&:hover': {
          borderColor: 'rgba(255,255,255,0.12)',
          bgcolor: 'rgba(255,255,255,0.035)',
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          fontWeight: 600,
        }}
      >
        {data.label}
      </Typography>

      <Typography
        variant="h4"
        sx={{
          mt: 1.25,
          fontWeight: 600,
          color: '#FFF',
          letterSpacing: '-0.02em',
          fontSize: { xs: '1.625rem', md: '1.875rem' },
        }}
      >
        {data.value}
      </Typography>

      {(data.delta || data.hint) && (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
          {data.delta && DeltaIcon ? (
            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ color: deltaColor }}
            >
              <DeltaIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: deltaColor }}>
                {data.delta.value}
              </Typography>
            </Stack>
          ) : null}
          {data.hint ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {data.hint}
            </Typography>
          ) : null}
        </Stack>
      )}
    </Box>
  )
}
