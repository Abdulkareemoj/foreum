import { createFileRoute } from '@tanstack/react-router'
import { LifeBuoy, BookOpen, MessageCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_admin/help')({
  head: () => ({
    meta: [...seo({ title: 'Help - Foreum' })],
  }),
  component: AdminHelp,
})

function AdminHelp() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Help & Support</h1>
        <p className="text-sm text-muted-foreground">
          Resources for managing and troubleshooting your forum.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" /> Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-muted-foreground text-sm">Access detailed guides and API documentation to help you manage your community.</p>
            <Button variant="outline" asChild className="w-fit">
              <a href="/docs">Go to Docs →</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="size-5 text-primary" /> Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-muted-foreground text-sm">Submit a ticket for technical assistance or custom feature requests.</p>
            <Button variant="outline" asChild className="w-fit">
              <a href="mailto:support@foreum.com">Email Support →</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="flex items-center gap-2">
            <LifeBuoy className="size-5 text-primary" /> System Status
          </CardTitle>
          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
            Operational
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-500" />
            <p className="font-medium">All systems operational.</p>
          </div>
          <p className="text-xs text-muted-foreground">Last checked: {new Date().toLocaleTimeString()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
