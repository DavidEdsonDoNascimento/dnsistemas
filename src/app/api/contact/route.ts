import { Resend } from 'resend'
import { NextResponse } from 'next/server'

type ContactPayload = {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const requiredEnvVars = ['RESEND_API_KEY', 'MAIL_FROM', 'MAIL_TO'] as const

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

export async function POST(request: Request) {
  const body = (await request.json()) as ContactPayload
  const name = body.name?.trim()
  const email = body.email?.trim()
  const subject = body.subject?.trim()
  const message = body.message?.trim()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ message: 'Preencha todos os campos.' }, { status: 400 })
  }

  const missingEnv = requiredEnvVars.filter((key) => !process.env[key])
  if (missingEnv.length > 0) {
    return NextResponse.json(
      { message: `Configuracao de email incompleta: ${missingEnv.join(', ')}` },
      { status: 500 },
    )
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM!,
    to: [process.env.MAIL_TO!],
    replyTo: email,
    subject: `[ANTERO Site] ${subject}`,
    text: `Novo contato — site ANTERO\n\nNome: ${name}\nE-mail: ${email}\nAssunto: ${subject}\n\nMensagem:\n${message}`,
    html: `
        <h2>Novo contato — site ANTERO</h2>
        <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
        <p><strong>Assunto:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${escapeHtml(message).replaceAll('\n', '<br/>')}</p>
      `,
  })

  if (error) {
    console.error('Erro ao enviar e-mail de contato (Resend):', error)
    return NextResponse.json(
      { message: 'Nao foi possivel enviar a mensagem. Tente novamente em instantes.' },
      { status: 500 },
    )
  }

  return NextResponse.json({ message: 'Mensagem enviada com sucesso.' })
}
