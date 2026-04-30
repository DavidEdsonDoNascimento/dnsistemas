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
        throw new Error(payload.message ?? 'Não foi possível enviar sua mensagem agora.')
      }

      setStatus({
        type: 'success',
        message: 'Recebido. Respondemos em até um dia útil com próximos passos.',
      })
      setFormData(initialFormData)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao enviar. Tente novamente ou use outro canal.'
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
          placeholder="Nome completo"
          value={formData.name}
          onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
      </div>

      <div className="col-md-6">
        <input
          type="email"
          className={`form-control ${lc.formControlLanding}`}
          placeholder="E-mail corporativo"
          value={formData.email}
          onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
      </div>

      <div className="col-md-12">
        <input
          type="text"
          className={`form-control ${lc.formControlLanding}`}
          placeholder="Ex.: plataforma interna, site institucional, integração"
          value={formData.subject}
          onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))}
          required
        />
      </div>

      <div className="col-md-12">
        <textarea
          className={`form-control ${lc.textareaLanding}`}
          rows={6}
          placeholder="O que precisa mudar, para quem impacta, prazo alvo, sistemas que integram."
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
          {isSubmitting ? 'Enviando...' : 'Solicitar proposta'}
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
