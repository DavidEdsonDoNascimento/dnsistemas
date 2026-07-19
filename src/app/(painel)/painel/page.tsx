import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PageHeader from '@/features/painel/components/PageHeader'
import SectionCard from '@/features/painel/components/SectionCard'
import StatCard from '@/features/painel/components/StatCard'
import StatusBadge from '@/features/painel/components/StatusBadge'
import DataTable, {
  type DataTableColumn,
} from '@/features/painel/components/DataTable'
import { DASHBOARD_ATIVIDADES, DASHBOARD_STATS } from '@/features/painel/mocks/dashboard'
import { PROJETOS_MOCK } from '@/features/painel/mocks/projetos'
import type { AtividadeRecente, Projeto } from '@/features/painel/types'

export default function DashboardPage() {
  const projetosColumns: DataTableColumn<Projeto>[] = [
    { id: 'nome', header: 'Projeto', cell: (r) => r.nome },
    { id: 'cliente', header: 'Cliente', cell: (r) => r.cliente },
    { id: 'responsavel', header: 'Responsável', cell: (r) => r.responsavel },
    {
      id: 'progresso',
      header: 'Progresso',
      align: 'left',
      width: 160,
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
                bgcolor: '#B08D57',
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

  const ultimos = PROJETOS_MOCK.slice(0, 4)

  return (
    <>
      <PageHeader
        title="Visão geral"
        description="Resumo operacional e financeiro consolidado da ANTERO Sistemas."
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          mb: 4,
        }}
      >
        {DASHBOARD_STATS.map((s) => (
          <StatCard key={s.id} data={s} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        }}
      >
        <SectionCard
          title="Projetos em destaque"
          description="Top 4 entregas em andamento — clique em Projetos para a visão completa."
          noPadding
        >
          <DataTable
            columns={projetosColumns}
            rows={ultimos}
            getRowKey={(r) => r.id}
          />
        </SectionCard>

        <SectionCard title="Atividades recentes" description="Últimos eventos do time.">
          <Stack spacing={2.25} divider={<Box sx={{ borderTop: '1px solid rgba(255,255,255,0.04)' }} />}>
            {DASHBOARD_ATIVIDADES.map((a: AtividadeRecente) => (
              <Box key={a.id}>
                <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
                  {a.titulo}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
                  {a.descricao}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}
                >
                  {a.quando}
                </Typography>
              </Box>
            ))}
          </Stack>
        </SectionCard>
      </Box>
    </>
  )
}
