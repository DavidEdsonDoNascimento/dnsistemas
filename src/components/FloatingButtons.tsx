import FloatingWhatsAppButton from './FloatingWhatsAppButton'
import ScrollToTopButton from './ScrollToTopButton'

/**
 * Floating Action Stack — agrupa botões flutuantes do canto inferior direito.
 *
 * Cada botão controla seu próprio posicionamento `fixed` para evitar acoplamento.
 * Para empilhar novos botões, ajuste o `bottom` do componente filho seguindo o
 * padrão: 20px (base) + n * (58px altura + 12px gap).
 */
export default function FloatingButtons() {
  return (
    <>
      <FloatingWhatsAppButton />
      <ScrollToTopButton />
    </>
  )
}
