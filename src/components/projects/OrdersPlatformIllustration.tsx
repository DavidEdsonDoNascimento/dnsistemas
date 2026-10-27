import s from './projects.module.css'

const NAV_ITEMS = [60, 48, 56, 44, 52]

const KPIS = [
  { label: 'Recebidos', value: 52, progress: 74 },
  { label: 'Em revisão', value: 40, progress: 46 },
  { label: 'Agrupados', value: 46, progress: 62 },
]

type RowStatus = 'received' | 'review' | 'grouped' | 'billing'

const ROWS: Array<{ name: number; meta: number; entries: number; status: RowStatus }> = [
  { name: 84, meta: 52, entries: 3, status: 'received' },
  { name: 70, meta: 60, entries: 2, status: 'review' },
  { name: 92, meta: 44, entries: 4, status: 'grouped' },
  { name: 76, meta: 56, entries: 1, status: 'billing' },
]

const STATUS_LABEL: Record<RowStatus, string> = {
  received: 'Recebido',
  review: 'Em revisão',
  grouped: 'Agrupado',
  billing: 'Cobrança',
}

const FLOW_STEPS = ['Mensagens', 'Pedidos', 'Clientes', 'Cobranças']

/**
 * Ilustração conceitual de um sistema de gestão de pedidos.
 * Todos os elementos são fictícios e abstratos (barras no lugar de nomes e valores):
 * não representa telas reais nem dados da operação atendida.
 */
export default function OrdersPlatformIllustration() {
  return (
    <figure className={s.visualFigure}>
      <div className={s.visualFrame}>
        <svg
          className={s.svg}
          viewBox="0 0 560 404"
          role="img"
          aria-labelledby="orders-illustration-title"
        >
          <title id="orders-illustration-title">
            Ilustração conceitual de um sistema de gestão de pedidos, com barra lateral,
            indicadores e lista fictícia de pedidos em diferentes estados de processamento.
          </title>

          <rect className={s.svgCanvas} x="0" y="0" width="560" height="404" />

          {/* Barra da janela */}
          <rect className={s.svgPanel} x="0" y="0" width="560" height="36" />
          <circle className={s.svgLine} cx="20" cy="18" r="4" />
          <circle className={s.svgLine} cx="36" cy="18" r="4" />
          <circle className={s.svgLine} cx="52" cy="18" r="4" />
          <rect className={s.svgLine} x="180" y="11" width="200" height="14" rx="7" />
          <line className={s.svgStroke} x1="0" y1="36" x2="560" y2="36" />

          {/* Barra lateral */}
          <rect className={s.svgPanel} x="0" y="37" width="120" height="367" />
          <line className={s.svgStroke} x1="120" y1="36" x2="120" y2="404" />
          <rect className={s.svgAccent} x="16" y="54" width="18" height="18" rx="5" />
          <rect className={s.svgLineStrong} x="42" y="59" width="54" height="8" rx="4" />
          <rect className={s.svgAccentSoft} x="8" y="92" width="104" height="24" rx="6" />
          <rect className={s.svgAccent} x="8" y="92" width="3" height="24" />
          {NAV_ITEMS.map((width, index) => (
            <g key={index}>
              <rect
                className={index === 0 ? s.svgLineStrong : s.svgLine}
                x="20"
                y={99 + index * 28}
                width="10"
                height="10"
                rx="3"
              />
              <rect
                className={index === 0 ? s.svgLineStrong : s.svgLine}
                x="38"
                y={100 + index * 28}
                width={width}
                height="7"
                rx="3.5"
              />
            </g>
          ))}

          {/* Cabeçalho da área principal */}
          <text className={s.svgTitle} x="140" y="70">
            Pedidos
          </text>
          <rect className={s.svgLine} x="140" y="80" width="120" height="6" rx="3" />
          <rect className={s.svgOutlineAccent} x="436" y="56" width="108" height="26" rx="13" />
          <text className={s.svgAccentText} x="490" y="73" textAnchor="middle">
            + Lançamento
          </text>

          {/* Indicadores */}
          {KPIS.map((kpi, index) => {
            const x = 140 + index * 139
            return (
              <g key={kpi.label}>
                <rect className={s.svgCard} x={x} y="98" width="126" height="64" rx="10" />
                <text className={s.svgLabel} x={x + 12} y="118">
                  {kpi.label}
                </text>
                <rect className={s.svgLineStrong} x={x + 12} y="128" width={kpi.value} height="12" rx="3" />
                <rect className={s.svgLine} x={x + 12} y="150" width="102" height="4" rx="2" />
                <rect
                  className={index === 1 ? s.svgAccent : s.svgLineStrong}
                  x={x + 12}
                  y="150"
                  width={kpi.progress}
                  height="4"
                  rx="2"
                />
              </g>
            )
          })}

          {/* Lista fictícia */}
          <text className={s.svgLabel} x="152" y="190">
            Cliente
          </text>
          <text className={s.svgLabel} x="300" y="190">
            Lançamentos
          </text>
          <text className={s.svgLabel} x="440" y="190">
            Status
          </text>
          {ROWS.map((row, index) => {
            const y = 200 + index * 42
            return (
              <g key={index}>
                <rect className={s.svgCard} x="140" y={y} width="404" height="36" rx="8" />
                <circle className={s.svgLine} cx="162" cy={y + 18} r="9" />
                <rect className={s.svgLineStrong} x="178" y={y + 10} width={row.name} height="7" rx="3.5" />
                <rect className={s.svgLine} x="178" y={y + 22} width={row.meta} height="5" rx="2.5" />
                {Array.from({ length: row.entries }, (_, entry) => (
                  <rect
                    key={entry}
                    className={s.svgLine}
                    x={300 + entry * 20}
                    y={y + 14}
                    width="14"
                    height="8"
                    rx="2"
                  />
                ))}
                <StatusPill status={row.status} y={y + 9} />
              </g>
            )
          })}

          {/* Fluxo automatizado */}
          <line className={s.svgStroke} x1="140" y1="372" x2="544" y2="372" />
          <text className={s.svgFlow} x="140" y="394">
            {FLOW_STEPS.map((step, index) => (
              <tspan
                key={step}
                className={index === FLOW_STEPS.length - 1 ? s.svgFlowAccent : undefined}
              >
                {index > 0 ? (
                  <tspan className={s.svgFlowSep}>{'  →  '}</tspan>
                ) : null}
                {step}
              </tspan>
            ))}
          </text>
        </svg>
      </div>
      <figcaption className={s.visualCaption}>
        Ilustração conceitual · dados fictícios
      </figcaption>
    </figure>
  )
}

function StatusPill({ status, y }: { status: RowStatus; y: number }) {
  const x = 440
  const label = STATUS_LABEL[status]

  if (status === 'review') {
    return (
      <g>
        <rect className={s.svgPillReview} x={x} y={y} width="92" height="18" rx="9" />
        <circle className={`${s.svgAccent} ${s.svgPulse}`} cx={x + 11} cy={y + 9} r="3" />
        <text className={s.svgPillTextAccent} x={x + 52} y={y + 12.5} textAnchor="middle">
          {label}
        </text>
      </g>
    )
  }

  return (
    <g>
      <rect
        className={status === 'grouped' ? s.svgPillFilled : s.svgPillOutline}
        x={x}
        y={y}
        width="92"
        height="18"
        rx="9"
      />
      <text
        className={status === 'received' ? s.svgPillTextMuted : s.svgPillText}
        x={x + 46}
        y={y + 12.5}
        textAnchor="middle"
      >
        {status === 'billing' ? `✓ ${label}` : label}
      </text>
    </g>
  )
}
