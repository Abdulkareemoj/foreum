import { createFileRoute } from '@tanstack/react-router'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_client/embed')({
  head: () => ({
    meta: [...seo({ title: 'Embed - Foreum' })],
  }),
  component: EmbedPage,
})

function EmbedPage() {
  return 
  (
   <div>embed</div>
  )
}
