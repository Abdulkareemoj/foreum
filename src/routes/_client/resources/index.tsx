import { createFileRoute } from '@tanstack/react-router'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_client/resources/')({
  head: () => ({
    meta: [...seo({ title: 'Resources - Foreum' })],
  }),
  component: ResourcesPage,
})

function ResourcesPage() {
  return 
  (
   <div>resources</div>    
  )
}
