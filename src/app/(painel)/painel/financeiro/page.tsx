import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PageHeader from '@/features/painel/components/PageHeader'
import SectionCard from '@/features/painel/components/SectionCard'
import StatusBadge from '@/features/painel/components/StatusBadge'
import DataTable, {
  type DataTableColumn,
} from '@/features/painel/components/DataTable'
import { FINANCEIRO_MOCK } from '@/features/painel/mocks/financeiro'
import type { MovimentoFinanceiro } from '@/features/painel/types'

const brl = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function FinanceiroPage() {
  const columns: DataTableColumn<MovimentoFinanceiro>[] = [
    {
      id: 'descricao',
      header: 'Descrição',
      cell: (r) => (
        <Stack>
          <Typography variant="body2" sx={{ color: '#FFF', fontWeight: 600 }}>
            {r.descricao}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {r.categoria}
          </Typography>
        </Stack>
      ),
    },
    { id: 'data', header: 'Data', width: 120, cell: (r) => r.data },
    {
      id: 'tipo',
      header: 'Tipo',
      width: 110,
      cell: (r) => (
        <StatusBadge
          label={r.tipo === 'entrada' ? 'Entrada' : 'Saída'}
          tone={r.tipo === 'entrada' ? 'success' : 'neutral'}
        />
      ),
    },
    {
      id: 'valor',
      header: 'Valor',
      align: 'right',
      width: 160,
      cell: (r) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: r.tipo === 'entrada' ? '#86EFAC' : '#FCA5A5',
          }}
        >
          {r.tipo === 'entrada' ? '+' : '−'} {brl(r.valor)}
        </Typography>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      width: 140,
      cell: (r) => <StatusBadge label={r.status.label} tone={r.status.tone} />,
    },
  ]

  const totalEntradas = FINANCEIRO_MOCK.filter((m) => m.tipo === 'entrada').reduce(
    (acc, m) => acc + m.valor,
    0,
  )
  const totalSaidas = FINANCEIRO_MOCK.filter((m) => m.tipo === 'saida').reduce(
    (acc, m) => acc + m.valor,
    0,
  )

  return (
    <>
      <PageHeader
        title="Financeiro"
        description="Movimentações recentes — entradas, saídas e status de cobrança."
      />

      <SectionCard
        title="Movimentações"
        description={`Entradas: ${brl(totalEntradas)} · Saídas: ${brl(totalSaidas)} · Saldo: ${brl(
          totalEntradas - totalSaidas,
        )}`}
        noPadding
      >
        <DataTable columns={columns} rows={FINANCEIRO_MOCK} getRowKey={(r) => r.id} />
      </SectionCard>
    </>
  )
}
