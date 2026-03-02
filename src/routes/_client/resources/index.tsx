import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_client/resources/')({
  component: ResourcesPage,
})

function ResourcesPage() {
  return 
  (
   <div>resources</div>    
  )
}
