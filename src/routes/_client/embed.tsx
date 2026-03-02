import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_client/embed')({
  component: EmbedPage,
})

function EmbedPage() {
  return 
  (
   <div>embed</div>
  )
}
