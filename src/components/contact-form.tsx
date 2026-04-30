'use client'

import { FormEvent, useState } from 'react'
import lc from '@/theme/landing.module.css'

type FormData = {
  name: string
  email: string
  subject: string
  message: string
}

const initialFormData: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const payload = (await response.json()) as { message?: string }

      if (!response.ok) {
        throw new Error(payload.message ?? 'Nao foi possivel enviar sua mensagem agora.')
      }

      setStatus({
        type: 'success',
        message: 'Mensagem enviada com sucesso. Em breve entraremos em contato.',
      })
      setFormData(initialFormData)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ocorreu um erro ao enviar a mensagem.'
      setStatus({ type: 'error', message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="row gy-4" onSubmit={handleSubmit}>
      <div className="col-md-6">
        <input
          type="text"
          className={`form-control ${lc.formControlLanding}`}
          placeholder="Seu nome"
          value={formData.name}
          onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
      </div>

      <div className="col-md-6">
        <input
          type="email"
          className={`form-control ${lc.formControlLanding}`}
          placeholder="Seu e-mail"
          value={formData.email}
          onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
      </div>

      <div className="col-md-12">
        <input
          type="text"
          className={`form-control ${lc.formControlLanding}`}
          placeholder="Assunto"
          value={formData.subject}
          onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))}
          required
        />
      </div>

      <div className="col-md-12">
        <textarea
          className={`form-control ${lc.textareaLanding}`}
          rows={6}
          placeholder="Descreva o que sua empresa precisa"
          value={formData.message}
          onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
          required
        />
      </div>

      <div className="col-md-12">
        <button
          type="submit"
          className={`btn ${lc.formSubmitLanding}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
        </button>
      </div>

      {status ? (
        <div className="col-md-12">
          <p className={status.type === 'success' ? lc.formStatusOk : lc.formStatusErr}>
            {status.message}
          </p>
        </div>
      ) : null}
    </form>
  )
}
