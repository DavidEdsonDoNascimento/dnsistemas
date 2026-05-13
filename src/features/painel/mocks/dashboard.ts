import type { AtividadeRecente, StatCardData } from '../types'

export const DASHBOARD_STATS: StatCardData[] = [
  {
    id: 'mrr',
    label: 'Receita mensal',
    value: 'R$ 184.320',
    delta: { value: '+12,4%', direction: 'up' },
    hint: 'vs. mês anterior',
  },
  {
    id: 'projetos-ativos',
    label: 'Projetos ativos',
    value: '12',
    delta: { value: '+2', direction: 'up' },
    hint: '3 entram em homologação',
  },
  {
    id: 'clientes',
    label: 'Clientes ativos',
    value: '38',
    delta: { value: '+4', direction: 'up' },
    hint: 'últimos 30 dias',
  },
  {
    id: 'churn',
    label: 'Inadimplência',
    value: '2,1%',
    delta: { value: '-0,4 p.p.', direction: 'down' },
    hint: 'meta: < 3%',
  },
]

export const DASHBOARD_ATIVIDADES: AtividadeRecente[] = [
  {
    id: 'a1',
    titulo: 'Marco entregue — ERP Confecção Vega',
    descricao: 'Módulo de produção homologado pelo cliente.',
    quando: 'há 2 horas',
  },
  {
    id: 'a2',
    titulo: 'Nova proposta enviada',
    descricao: 'Indústria Ferraz — automação de PCP.',
    quando: 'há 5 horas',
  },
  {
    id: 'a3',
    titulo: 'Fatura recebida',
    descricao: 'NorthLog Logística — R$ 28.500.',
    quando: 'ontem',
  },
  {
    id: 'a4',
    titulo: 'Reunião de descoberta agendada',
    descricao: 'Clínica Saúde+ — quinta, 14h.',
    quando: 'ontem',
  },
]
