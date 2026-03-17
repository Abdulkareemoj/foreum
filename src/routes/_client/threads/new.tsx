import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_client/threads/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_client/threads/new"!</div>
}
