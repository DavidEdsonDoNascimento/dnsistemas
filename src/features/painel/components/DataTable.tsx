import type { ReactNode } from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'

export interface DataTableColumn<T> {
  id: string
  header: ReactNode
  /** Como renderizar a célula. Pode ser key da row ou função. */
  cell: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  width?: number | string
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  emptyMessage?: string
}

/**
 * Tabela mínima e tipada. Sem paginação/sort no client (fundação apenas).
 * Para evoluir, considerar TanStack Table ou MUI X DataGrid.
 */
export default function DataTable<T>({
  columns,
  rows,
  getRowKey,
  emptyMessage = 'Sem registros para exibir.',
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <Box sx={{ px: 3, py: 6, textAlign: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {emptyMessage}
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer>
      <Table size="medium" sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow
            sx={{
              '& th': {
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                fontSize: '0.72rem',
                fontWeight: 600,
                py: 1.5,
                bgcolor: 'transparent',
              },
            }}
          >
            {columns.map((c) => (
              <TableCell key={c.id} align={c.align ?? 'left'} sx={{ width: c.width }}>
                {c.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={getRowKey(row)}
              sx={{
                '& td': {
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  color: '#E4E4E7',
                  fontSize: '0.9rem',
                  py: 1.75,
                },
                '&:last-of-type td': { borderBottom: 'none' },
                transition: 'background-color 120ms ease',
                '&:hover td': { bgcolor: 'rgba(255,255,255,0.02)' },
              }}
            >
              {columns.map((c) => (
                <TableCell key={c.id} align={c.align ?? 'left'}>
                  {c.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
