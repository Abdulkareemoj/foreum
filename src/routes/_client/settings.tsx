import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_client/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return 
  (
   <div>settings</div> 
  )
}
