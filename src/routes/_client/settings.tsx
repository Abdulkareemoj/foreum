import { createFileRoute } from '@tanstack/react-router'
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_client/settings')({
  head: () => ({
    meta: [...seo({ title: 'Settings - Foreum' })],
  }),
  component: SettingsPage,
})

function SettingsPage() {
  return 
  (
   <div>settings</div> 
  )
}
