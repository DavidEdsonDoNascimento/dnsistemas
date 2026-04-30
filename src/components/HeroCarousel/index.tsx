'use client'

import type { Theme } from '@mui/material/styles'
import { Box, Typography, Button, Container } from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import lc from '@/theme/landing.module.css'

const slideBackdrop =
  (gradient: 'gradientSlide1' | 'gradientSlide2' | 'gradientSlide3') => (t: Theme) => ({
    height: t.landing.carousel.slideHeight,
    background: t.landing.carousel[gradient],
    display: 'flex',
    alignItems: 'center',
  })

export function HeroCarousel() {
  return (
    <Box sx={(t) => ({ height: t.landing.carousel.slideHeight })}>
      <Swiper loop slidesPerView={1}>
        <SwiperSlide>
          <Box sx={slideBackdrop('gradientSlide1')}>
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Box sx={{ flex: 1, color: 'text.primary' }}>
                  <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 2 }}>
                    Plataforma &amp; dados
                  </Typography>

                  <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
                    Sistemas internos sob medida com traçabilidade e performance
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={(t) => ({
                      mb: 4,
                      color: t.landing.carousel.textMuted,
                    })}
                  >
                    Desenvolvimento orientado à redução de custo oculto, automação inteligente e escalabilidade real —
                    infraestrutura pronta para exigências enterprise.
                  </Typography>

                  <Button variant="contained" color="secondary" size="large">
                    Solicitar proposta
                  </Button>
                </Box>

                <Box sx={{ flex: 1, position: 'relative', height: '520px' }}>
                  <Box
                    sx={(t) => ({
                      position: 'absolute',
                      top: '60px',
                      left: '140px',
                      width: '420px',
                      zIndex: 3,
                      boxShadow: t.landing.shadow.carouselHeavy,
                      borderRadius: '12px',
                      overflow: 'hidden',
                    })}
                  >
                    <img className={lc.carouselImgFluid} src="/images/sistema/mapeamento-detalhes.png" alt="Detalhes do ativo" />
                  </Box>

                  <Box
                    sx={(t) => ({
                      position: 'absolute',
                      top: '100px',
                      left: 0,
                      width: '360px',
                      transform: 'rotate(-3deg)',
                      zIndex: 2,
                      boxShadow: t.landing.shadow.carouselPanel,
                      borderRadius: '12px',
                      overflow: 'hidden',
                    })}
                  >
                    <img className={lc.carouselImgFluid} src="/images/sistema/pendentes-aprovacao.png" alt="Pendentes de aprovação" />
                  </Box>

                  <Box
                    sx={(t) => ({
                      position: 'absolute',
                      top: '110px',
                      right: 0,
                      width: '360px',
                      transform: 'rotate(3deg)',
                      zIndex: 2,
                      boxShadow: t.landing.shadow.carouselPanel,
                      borderRadius: '12px',
                      overflow: 'hidden',
                    })}
                  >
                    <img className={lc.carouselImgFluid} src="/images/sistema/visao-ativo.png" alt="Visão por ativo" />
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
        </SwiperSlide>

        <SwiperSlide>
          <Box sx={slideBackdrop('gradientSlide2')}>
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Box sx={{ flex: 1, color: 'text.primary' }}>
                  <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 2 }}>
                    Marca institucional
                  </Typography>

                  <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
                    Narrativa digital séria para fechar ciclo com clientes exigentes
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={(t) => ({
                      mb: 4,
                      color: t.landing.carousel.textMuted,
                    })}
                  >
                    Arquitetura de conteúdo, velocidade técnica e posicionamento alinhados à conversão e à credibilidade
                    em cenários high-ticket e B2B.
                  </Typography>

                  <Button variant="contained" color="secondary" size="large">
                    Agendar análise
                  </Button>
                </Box>

                <Box sx={{ flex: 1, position: 'relative', height: '520px' }}>
                  <Box
                    sx={(t) => ({
                      position: 'absolute',
                      top: '60px',
                      left: '140px',
                      width: '420px',
                      zIndex: 3,
                      boxShadow: t.landing.shadow.carouselHeavy,
                      borderRadius: '12px',
                      overflow: 'hidden',
                    })}
                  >
                    <img className={lc.carouselImgFluid} src="/images/site/home.png" alt="Homepage institucional" />
                  </Box>

                  <Box
                    sx={(t) => ({
                      position: 'absolute',
                      top: '100px',
                      left: 0,
                      width: '360px',
                      transform: 'rotate(-3deg)',
                      zIndex: 2,
                      boxShadow: t.landing.shadow.carouselPanel,
                      borderRadius: '12px',
                      overflow: 'hidden',
                    })}
                  >
                    <img className={lc.carouselImgFluid} src="/images/site/acomodacoes.png" alt="Página de acomodações" />
                  </Box>

                  <Box
                    sx={(t) => ({
                      position: 'absolute',
                      top: '110px',
                      right: 0,
                      width: '360px',
                      transform: 'rotate(3deg)',
                      zIndex: 2,
                      boxShadow: t.landing.shadow.carouselPanel,
                      borderRadius: '12px',
                      overflow: 'hidden',
                    })}
                  >
                    <img className={lc.carouselImgFluid} src="/images/site/contato.png" alt="Página de contato" />
                  </Box>
                </Box>
              </Box>
            </Container>
          </Box>
        </SwiperSlide>

        <SwiperSlide>
          <Box sx={slideBackdrop('gradientSlide3')}>
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Box sx={{ flex: 1, color: 'text.primary' }}>
                  <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 2 }}>
                    Mobile &amp; operações
                  </Typography>

                  <Typography variant="h2" sx={{ fontWeight: 700, mb: 3 }}>
                    Apps conectados ao core do negócio — rapidez com governança
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={(t) => ({
                      mb: 4,
                      color: t.landing.carousel.textMuted,
                    })}
                  >
                    Interfaces móveis em continuidade com seu backend corporativo; foco em experiência sob pressão real,
                    sync seguro e manutenibilidade ao longo do tempo.
                  </Typography>

                  <Button variant="contained" color="secondary" size="large">
                    Falar com especialista
                  </Button>
                </Box>

                <Box sx={{ flex: 1, position: 'relative', height: '500px' }}>
                  <Box
                    sx={(t) => ({
                      position: 'absolute',
                      top: '40px',
                      left: '120px',
                      width: '260px',
                      zIndex: 3,
                      boxShadow: t.landing.shadow.carouselHeavySm,
                      borderRadius: '20px',
                      overflow: 'hidden',
                    })}
                  >
                    <img className={lc.carouselImgFluid} src="/images/app/teste-andamento.png" alt="App Teste em Andamento" />
                  </Box>

                  <Box
                    sx={(t) => ({
                      position: 'absolute',
                      top: '80px',
                      left: 0,
                      width: '220px',
                      transform: 'rotate(-6deg)',
                      zIndex: 2,
                      boxShadow: t.landing.shadow.carouselSoft,
                      borderRadius: '20px',
                      overflow: 'hidden',
                    })}
                  >
                    <img className={lc.carouselImgFluid} src="/images/app/lista-testes.png" alt="Lista de Testes" />
                  </Box>

                  <Box
                    sx={(t) => ({
                      position: 'absolute',
                      top: '90px',
                      right: 0,
                      width: '220px',
                      transform: 'rotate(6deg)',
                      zIndex: 2,
                      boxShadow: t.landing.shadow.carouselSoft,
                      borderRadius: '20px',
                      overflow: 'hidden',
                    })}
                  >
                    <img className={lc.carouselImgFluid} src="/images/app/identificacao.png" alt="Identificação das Amostras" />
                  </Box>

                  <Box
                    sx={(t) => ({
                      position: 'absolute',
                      bottom: 0,
                      left: '200px',
                      width: '200px',
                      zIndex: 1,
                      boxShadow: t.landing.shadow.carouselBottom,
                      borderRadius: '20px',
                      overflow: 'hidden',
                    })}
                  >
                    <img className={lc.carouselImgFluid} src="/images/app/login.png" alt="Login" />
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
