import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import PageHeader from '@/features/painel/components/PageHeader'
import SectionCard from '@/features/painel/components/SectionCard'
import StatusBadge from '@/features/painel/components/StatusBadge'
import DataTable, {
  type DataTableColumn,
} from '@/features/painel/components/DataTable'
import { PROJETOS_MOCK } from '@/features/painel/mocks/projetos'
import type { Projeto } from '@/features/painel/types'

export default function ProjetosPage() {
  const columns: DataTableColumn<Projeto>[] = [
    {
      id: 'nome',
      header: 'Projeto',
      cell: (r) => (
        <Stack>
          <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
            {r.nome}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {r.id.toUpperCase()}
          </Typography>
        </Stack>
      ),
    },
    { id: 'cliente', header: 'Cliente', cell: (r) => r.cliente },
    { id: 'responsavel', header: 'Responsável', cell: (r) => r.responsavel },
    { id: 'prazo', header: 'Prazo', cell: (r) => r.prazo, width: 130 },
    {
      id: 'progresso',
      header: 'Progresso',
      width: 180,
      cell: (r) => (
        <Stack spacing={0.75}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {r.progresso}%
          </Typography>
          <Box
            sx={{
              height: 6,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: `${r.progresso}%`,
                height: '100%',
                bgcolor: '#2563EB',
              }}
            />
          </Box>
        </Stack>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      width: 140,
      cell: (r) => <StatusBadge label={r.status.label} tone={r.status.tone} />,
    },
  ]

  return (
    <>
      <PageHeader
        title="Projetos"
        description="Acompanhamento de entregas em andamento, descoberta e homologação."
        actions={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            sx={{
              bgcolor: '#2563EB',
              fontWeight: 600,
              '&:hover': { bgcolor: '#1D4ED8' },
            }}
          >
            Novo projeto
          </Button>
        }
      />

      <SectionCard
        title={`${PROJETOS_MOCK.length} projetos`}
        description="Lista completa — dados mockados."
        noPadding
      >
        <DataTable columns={columns} rows={PROJETOS_MOCK} getRowKey={(r) => r.id} />
      </SectionCard>
    </>
  )
}
