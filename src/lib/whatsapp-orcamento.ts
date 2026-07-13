/**
 * Configuração única do WhatsApp para orçamento (site → wa.me).
 * Edite número e mensagem apenas aqui. Componentes e links importam deste módulo.
 *
 * Futuro (chat interno): altere `openWhatsAppOrcamentoContact` para abrir o widget
 * em vez de redirecionar, mantendo `getWhatsAppOrcamentoHref` para fallback ou deep links.
 */

/** Apenas dígitos, com DDI (ex.: Brasil 55 + DDD + número). */
export const WHATSAPP_BUSINESS_NUMBER = '5547996824402'

export const WHATSAPP_PREFILL_MESSAGE =
  'Oi, vim pelo site da Antero sistemas e gostaria de solicitar um orçamento.'

export function getWhatsAppOrcamentoHref(): string {
  return `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodeURIComponent(WHATSAPP_PREFILL_MESSAGE)}`
}

/**
 * Abre o fluxo atual de contato (WhatsApp Web/App em nova aba).
 * Ponto único para evoluir para chat interno sem duplicar URL ou mensagem.
 */
export function openWhatsAppOrcamentoContact(): void {
  if (typeof window === 'undefined') return
  window.open(getWhatsAppOrcamentoHref(), '_blank', 'noopener,noreferrer')
}
