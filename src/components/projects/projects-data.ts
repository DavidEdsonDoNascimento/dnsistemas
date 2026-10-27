/**
 * Cases exibidos na seção "Projetos e soluções desenvolvidas" da landing.
 *
 * Para publicar um novo case, adicione um item em `PROJECTS` e, se ele tiver
 * representação visual própria, registre a chave em `ProjectVisual` e o
 * componente correspondente em `ProjectCaseCard.tsx`.
 *
 * Regras de conteúdo (ver .claude/rules/institutional-positioning.md):
 * - somente funcionalidades confirmadas pelo responsável do projeto;
 * - sem nome de cliente, valores, métricas ou resultados não verificados;
 * - visuais são ilustrações conceituais com dados fictícios, nunca capturas reais.
 */

export type ProjectVisual = 'orders-platform'

export type ProjectCase = {
  id: string
  title: string
  category: string
  description: string
  tags: string[]
  challenge: {
    intro: string
    items: string[]
  }
  solution: string
  highlights: string[]
  visual: ProjectVisual
  cta: {
    question: string
    text: string
    label: string
    href: string
    ariaLabel: string
  }
}

export const PROJECTS: ProjectCase[] = [
  {
    id: 'gestao-de-pedidos',
    title: 'Plataforma de Gestão de Pedidos',
    category: 'Automação de processos comerciais',
    description:
      'Desenvolvimento de uma plataforma personalizada para centralizar pedidos, organizar informações comerciais e simplificar a preparação de cobranças, substituindo fluxos fragmentados por uma experiência integrada.',
    tags: ['Aplicação web', 'Acesso privado', 'Sob medida'],
    challenge: {
      intro: 'O processo comercial dependia de etapas manuais e de controles desconectados:',
      items: [
        'Recebimento de informações por mensagens.',
        'Organização e conferência manual dos pedidos.',
        'Planilhas e controles paralelos.',
        'Agrupamento de lançamentos por cliente.',
        'Cálculo e preparação das cobranças.',
      ],
    },
    solution:
      'Uma aplicação web sob medida, de acesso privado, que reúne em um único fluxo a organização dos lançamentos, a revisão das informações, o agrupamento por cliente e a preparação das cobranças.',
    highlights: [
      'Organização centralizada dos lançamentos de pedidos',
      'Revisão e conferência das informações registradas',
      'Agrupamento de pedidos por cliente',
      'Apoio à preparação das cobranças',
    ],
    visual: 'orders-platform',
    cta: {
      question: 'Precisa de uma solução semelhante?',
      text: 'Conte como funciona a sua operação hoje. Avaliamos se um sistema sob medida faz sentido e em que formato.',
      label: 'Conversar sobre meu projeto',
      href: '#contact',
      ariaLabel: 'Conversar com a ANTERO Sistemas sobre um projeto semelhante',
    },
  },
]
