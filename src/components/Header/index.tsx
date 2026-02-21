'use client'

import Link from 'next/link'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'

export function Header() {
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'primary.main', 
            fontWeight: 700 
          }}
        >
          DN Sistemas Corporativos
        </Typography>

        {/* Menu */}
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#1F2937' }}>
            Início
          </Link>
          <Link href="#solucoes" style={{ textDecoration: 'none', color: '#1F2937' }}>
            Soluções
          </Link>
          <Link href="#metodologia" style={{ textDecoration: 'none', color: '#1F2937' }}>
            Metodologia
          </Link>
          <Link href="#projetos" style={{ textDecoration: 'none', color: '#1F2937' }}>
            Projetos
          </Link>
          <Link href="/orcamento" style={{ textDecoration: 'none', color: '#1F2937' }}>
            Contato
          </Link>
        </Box>

        {/* CTA */}
        <Button 
          variant="contained" 
          color="primary"
        >
          Solicitar Análise
        </Button>

      </Toolbar>
    </AppBar>
  )
}