import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { BookOpen, Shield, MessageCircle, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/_moderator/help-docs')({
  component: ModeratorHelp,
})

function ModeratorHelp() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Moderator Help Center</h1>
        <p className="text-sm text-muted-foreground">
          Find guidance on your moderation tools and community policies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" /> Guidelines
              </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Review the community guidelines and best practices for moderators.</p>
            <Button variant="outline" size="sm" className="w-fit">
              Read More <ArrowRight className="size-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-5 text-primary" /> Tool Guides
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Learn how to use the reports system, logs, and other moderation tools.</p>
            <Button variant="outline" size="sm" className="w-fit">
              Read More <ArrowRight className="size-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="size-5 text-primary" /> Contact Admin
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Need help or clarification? Contact the site administrators.</p>
            <Button variant="outline" size="sm" className="w-fit" asChild>
              <a href="mailto:admin@foreum.com">Email Admin <ArrowRight className="size-4 ml-2" /></a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
