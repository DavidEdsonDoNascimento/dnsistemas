import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined'
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import type { SvgIconComponent } from '@mui/icons-material'

export interface NavItem {
  label: string
  href: string
  icon: SvgIconComponent
  /** Para futuro destaque de seções (ex.: "Operação", "Configurações"). */
  group?: string
}

/** Fonte única de itens da Sidebar. Adicionar novas rotas aqui. */
export const PAINEL_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/painel', icon: DashboardOutlinedIcon },
  { label: 'Projetos', href: '/painel/projetos', icon: FolderOutlinedIcon },
  { label: 'Financeiro', href: '/painel/financeiro', icon: PaidOutlinedIcon },
  { label: 'Clientes', href: '/painel/clientes', icon: PeopleAltOutlinedIcon },
]

export const PAINEL_BRAND = {
  name: 'ANTERO',
  suffix: 'Painel interno',
}
