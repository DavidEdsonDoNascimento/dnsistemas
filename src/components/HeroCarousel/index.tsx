'use client'

import { Box, Typography, Button, Container } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Image from 'next/image'

export function HeroCarousel() {
  return (
    <Box sx={{ height: '85vh' }}>
      <Swiper loop slidesPerView={1}>
        
        {/* Slide 1 */}
        <SwiperSlide>
        <Box
            sx={{
            height: '85vh',
            background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)',
            display: 'flex',
            alignItems: 'center'
            }}
        >
            <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                {/* TEXTO */}
                <Box sx={{ flex: 1, color: '#FFF' }}>
                <Typography
                    variant="overline"
                    sx={{ color: 'secondary.main', letterSpacing: 2 }}
                >
                    Engenharia de Software Corporativa
                </Typography>

                <Typography
                    variant="h2"
                    sx={{ fontWeight: 700, mb: 3 }}
                >
                    Sistemas Corporativos Sob Medida
                </Typography>

                <Typography
                    variant="h6"
                    sx={{ mb: 4, color: 'rgba(255,255,255,0.85)' }}
                >
                    Plataformas empresariais desenvolvidas para controle operacional,
                    gestão de ativos e automação de processos internos.
                </Typography>

                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                >
                    Solicitar Análise Técnica
                </Button>
                </Box>

                {/* COLAGEM */}
                <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    height: '520px'
                }}
                >

                {/* Tela principal */}
                <Box
                    sx={{
                    position: 'absolute',
                    top: '60px',
                    left: '140px',
                    width: '420px',
                    zIndex: 3,
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                    }}
                >
                    <img
                    src="/images/sistema/mapeamento-detalhes.png"
                    style={{ width: '100%', display: 'block' }}
                    alt="Detalhes do ativo"
                    />
                </Box>

                {/* Tela esquerda */}
                <Box
                    sx={{
                    position: 'absolute',
                    top: '100px',
                    left: '0px',
                    width: '360px',
                    transform: 'rotate(-3deg)',
                    zIndex: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                    }}
                >
                    <img
                    src="/images/sistema/pendentes-aprovacao.png"
                    style={{ width: '100%', display: 'block' }}
                    alt="Pendentes de aprovação"
                    />
                </Box>

                {/* Tela direita */}
                <Box
                    sx={{
                    position: 'absolute',
                    top: '110px',
                    right: '0px',
                    width: '360px',
                    transform: 'rotate(3deg)',
                    zIndex: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                    }}
                >
                    <img
                    src="/images/sistema/visao-ativo.png"
                    style={{ width: '100%', display: 'block' }}
                    alt="Visão por ativo"
                    />
                </Box>

                </Box>

            </Box>
            </Container>
        </Box>
        </SwiperSlide>
        {/* Slide 2 */}
        <SwiperSlide>
        <Box
            sx={{
            height: '85vh',
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            display: 'flex',
            alignItems: 'center'
            }}
        >
            <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                {/* TEXTO */}
                <Box sx={{ flex: 1, color: '#FFF' }}>
                <Typography
                    variant="overline"
                    sx={{ color: 'secondary.main', letterSpacing: 2 }}
                >
                    Desenvolvimento Institucional Corporativo
                </Typography>

                <Typography
                    variant="h2"
                    sx={{ fontWeight: 700, mb: 3 }}
                >
                    Sites Institucionais Estruturados
                </Typography>

                <Typography
                    variant="h6"
                    sx={{ mb: 4, color: 'rgba(255,255,255,0.85)' }}
                >
                    Projetos desenvolvidos com foco em apresentação estratégica,
                    organização de conteúdo e geração de oportunidades comerciais.
                </Typography>

                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                >
                    Conhecer Projetos
                </Button>
                </Box>

                {/* COLAGEM */}
                <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    height: '520px'
                }}
                >

                {/* Tela principal */}
                <Box
                    sx={{
                    position: 'absolute',
                    top: '60px',
                    left: '140px',
                    width: '420px',
                    zIndex: 3,
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                    }}
                >
                    <img
                    src="/images/site/home.png"
                    style={{ width: '100%', display: 'block' }}
                    alt="Homepage institucional"
                    />
                </Box>

                {/* Tela esquerda */}
                <Box
                    sx={{
                    position: 'absolute',
                    top: '100px',
                    left: '0px',
                    width: '360px',
                    transform: 'rotate(-3deg)',
                    zIndex: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                    }}
                >
                    <img
                    src="/images/site/acomodacoes.png"
                    style={{ width: '100%', display: 'block' }}
                    alt="Página de acomodações"
                    />
                </Box>

                {/* Tela direita */}
                <Box
                    sx={{
                    position: 'absolute',
                    top: '110px',
                    right: '0px',
                    width: '360px',
                    transform: 'rotate(3deg)',
                    zIndex: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    borderRadius: '12px',
                    overflow: 'hidden'
                    }}
                >
                    <img
                    src="/images/site/contato.png"
                    style={{ width: '100%', display: 'block' }}
                    alt="Página de contato"
                    />
                </Box>

                </Box>

            </Box>
            </Container>
        </Box>
        </SwiperSlide>
        {/* Slide 3 */}
        <SwiperSlide>
            <Box
                sx={{
                height: '85vh',
                background: 'linear-gradient(135deg, #0B1F3A 0%, #111C2D 100%)',
                display: 'flex',
                alignItems: 'center'
                }}
            >
                <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>

                    {/* TEXTO */}
                    <Box sx={{ flex: 1, color: '#FFF' }}>
                    <Typography
                        variant="overline"
                        sx={{ color: 'secondary.main', letterSpacing: 2 }}
                    >
                        Desenvolvimento Mobile Corporativo
                    </Typography>

                    <Typography
                        variant="h2"
                        sx={{ fontWeight: 700, mb: 3 }}
                    >
                        Aplicativos Empresariais Integrados
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{ mb: 4, color: 'rgba(255,255,255,0.85)' }}
                    >
                        Aplicações móveis conectadas a sistemas e equipamentos,
                        desenvolvidas com arquitetura robusta e foco em controle operacional.
                    </Typography>

                    <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                    >
                        Conhecer Soluções Mobile
                    </Button>
                    </Box>

                    {/* COLAGEM */}
                    <Box
                    sx={{
                        flex: 1,
                        position: 'relative',
                        height: '500px'
                    }}
                    >

                    {/* Tela Principal */}
                    <Box
                        sx={{
                        position: 'absolute',
                        top: '40px',
                        left: '120px',
                        width: '260px',
                        zIndex: 3,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        borderRadius: '20px',
                        overflow: 'hidden'
                        }}
                    >
                        <img
                        src="/images/app/teste-andamento.png"
                        style={{ width: '100%', display: 'block' }}
                        alt="App Teste em Andamento"
                        />
                    </Box>

                    {/* Tela Esquerda */}
                    <Box
                        sx={{
                        position: 'absolute',
                        top: '80px',
                        left: '0px',
                        width: '220px',
                        transform: 'rotate(-6deg)',
                        zIndex: 2,
                        boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                        borderRadius: '20px',
                        overflow: 'hidden'
                        }}
                    >
                        <img
                        src="/images/app/lista-testes.png"
                        style={{ width: '100%', display: 'block' }}
                        alt="Lista de Testes"
                        />
                    </Box>

                    {/* Tela Direita */}
                    <Box
                        sx={{
                        position: 'absolute',
                        top: '90px',
                        right: '0px',
                        width: '220px',
                        transform: 'rotate(6deg)',
                        zIndex: 2,
                        boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
                        borderRadius: '20px',
                        overflow: 'hidden'
                        }}
                    >
                        <img
                        src="/images/app/identificacao.png"
                        style={{ width: '100%', display: 'block' }}
                        alt="Identificação das Amostras"
                        />
                    </Box>

                    {/* Tela Inferior (Login) */}
                    <Box
                        sx={{
                        position: 'absolute',
                        bottom: '0px',
                        left: '200px',
                        width: '200px',
                        zIndex: 1,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
                        borderRadius: '20px',
                        overflow: 'hidden'
                        }}
                    >
                        <img
                        src="/images/app/login.png"
                        style={{ width: '100%', display: 'block' }}
                        alt="Login"
                        />
                    </Box>

                    </Box>

                </Box>
                </Container>
            </Box>
        </SwiperSlide>

      </Swiper>
    </Box>
  )
}