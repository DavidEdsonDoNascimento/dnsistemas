'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AppBar, Toolbar, Button, Box } from '@mui/material'
import lc from '@/theme/landing.module.css'

export function Header() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={(theme) => ({
        backgroundColor: theme.landing.palette.headerBackdrop,
        backdropFilter: theme.landing.header.backdropFilter,
        borderBottom: `1px solid ${theme.landing.palette.border}`,
      })}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link href="/" className={lc.landingPlainLink}>
          <Image
            src="/antero_logo_header_croppezd.png"
            alt="ANTERO — software sob medida"
            width={280}
            height={64}
            priority
            className={lc.landingLogoImg}
          />
        </Link>

        <Box sx={{ display: 'flex', gap: 4 }}>
          <Link href="/" className={lc.landingMuiNavLink}>
            Início
          </Link>
          <Link href="#solucoes" className={lc.landingMuiNavLink}>
            Soluções
          </Link>
          <Link href="#metodologia" className={lc.landingMuiNavLink}>
            Metodologia
          </Link>
          <Link href="#projetos" className={lc.landingMuiNavLink}>
            Projetos
          </Link>
          <Link href="/orcamento" className={lc.landingMuiNavLink}>
            Contato
          </Link>
        </Box>

        <Button variant="contained" color="primary" sx={{ fontWeight: 600 }}>
          Solicitar proposta
        </Button>
      </Toolbar>
    </AppBar>
  )
}
