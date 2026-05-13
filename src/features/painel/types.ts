/** Tipos compartilhados pelo módulo do painel administrativo. */

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral'

export interface StatusItem {
  label: string
  tone: StatusTone
}

export interface StatCardData {
  id: string
  label: string
  value: string
  delta?: {
    value: string
    direction: 'up' | 'down' | 'flat'
  }
  hint?: string
}

export interface Projeto {
  id: string
  nome: string
  cliente: string
  responsavel: string
  prazo: string
  progresso: number
  status: StatusItem
}

export interface MovimentoFinanceiro {
  id: string
  descricao: string
  categoria: string
  data: string
  valor: number
  tipo: 'entrada' | 'saida'
  status: StatusItem
}

export interface Cliente {
  id: string
  nome: string
  segmento: string
  contato: string
  cidade: string
  projetosAtivos: number
  status: StatusItem
}

export interface AtividadeRecente {
  id: string
  titulo: string
  descricao: string
  quando: string
}
