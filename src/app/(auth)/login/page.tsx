import LoginCard from '@/features/auth/components/LoginCard'

const SAFE_NEXT = /^\/painel(?:\/.*)?$/

const ERROR_MESSAGES: Record<string, string> = {
  oauth: 'Não foi possível iniciar o login com Google. Tente novamente.',
  callback: 'Falha ao concluir o login. Tente novamente.',
  expired: 'Sua sessão expirou. Faça login novamente.',
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, error } = await searchParams
  const safeNext = next && SAFE_NEXT.test(next) ? next : '/painel'
  const initialError = error ? (ERROR_MESSAGES[error] ?? 'Erro no login.') : null

  return <LoginCard next={safeNext} initialError={initialError} />
}
