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
import { CLIENTES_MOCK } from '@/features/painel/mocks/clientes'
import type { Cliente } from '@/features/painel/types'

export default function ClientesPage() {
  const columns: DataTableColumn<Cliente>[] = [
    {
      id: 'nome',
      header: 'Cliente',
      cell: (r) => (
        <Stack>
          <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
            {r.nome}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {r.segmento}
          </Typography>
        </Stack>
      ),
    },
    { id: 'contato', header: 'Contato', cell: (r) => r.contato },
    { id: 'cidade', header: 'Localização', cell: (r) => r.cidade, width: 180 },
    {
      id: 'projetos',
      header: 'Projetos ativos',
      align: 'center',
      width: 140,
      cell: (r) => (
        <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
          {r.projetosAtivos}
        </Typography>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      width: 130,
      cell: (r) => <StatusBadge label={r.status.label} tone={r.status.tone} />,
    },
  ]

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Base de clientes da ANTERO Sistemas — contas ativas, prospects e inativos."
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
            Novo cliente
          </Button>
        }
      />

      <SectionCard
        title={`${CLIENTES_MOCK.length} clientes`}
        description="Lista completa — dados mockados."
        noPadding
      >
        <DataTable columns={columns} rows={CLIENTES_MOCK} getRowKey={(r) => r.id} />
      </SectionCard>
    </>
  )
}
