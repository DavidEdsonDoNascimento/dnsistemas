'use client'

import { Container, Typography, Button } from '@mui/material'

export default function Home() {
  return (
    <Container sx={{ py: 10 }}>
      <Typography variant="h1" gutterBottom>
        DN Sistemas Corporativos
      </Typography>

      <Typography variant="h5" color="text.secondary" paragraph>
        Soluções Digitais Corporativas sob Medida
      </Typography>

      <Button variant="contained" color="primary">
        Solicitar Análise
      </Button>
    </Container>
  )
}