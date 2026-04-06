import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Separator } from '~/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '~/components/ui/sidebar'
import { AdminSidebar } from '~/components/admin/admin-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '~/components/ui/breadcrumb'
import UserDropdown from '~/components/shared/UserDropdown'
import { adminMiddleware } from '~/server/auth-actions'

export const Route = createFileRoute('/_admin')({
  component: AdminLayout,
  server: {
    middleware: [adminMiddleware], 
  },
})

function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-4">
            <UserDropdown />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet /> {/* Admin pages render here */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}