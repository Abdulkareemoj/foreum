import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { ArrowRight, MessageSquare, TrendingUp, Users } from 'lucide-react'

export const Route = createFileRoute('/_client/join')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="container max-w-4xl py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Foreum</h1>
        <p className="text-xl text-muted-foreground">
          Join discussions, share knowledge, and connect with your community
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/thread">
            <Button size="lg">
              Browse Threads
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" onClick={() => {
            const { openThreadModal } = require('~/stores/ui-store').useUIStore.getState()
            openThreadModal()
          }}>
            Create Thread
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="text-center space-y-2">
          <MessageSquare className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-lg font-semibold">Rich Discussions</h3>
          <p className="text-sm text-muted-foreground">
            Engage in meaningful conversations with threaded replies
          </p>
        </div>
        <div className="text-center space-y-2">
          <TrendingUp className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-lg font-semibold">Trending Topics</h3>
          <p className="text-sm text-muted-foreground">
            Discover what's popular in the community
          </p>
        </div>
        <div className="text-center space-y-2">
          <Users className="h-12 w-12 mx-auto text-primary" />
          <h3 className="text-lg font-semibold">Active Community</h3>
          <p className="text-sm text-muted-foreground">
            Connect with like-minded people
          </p>
        </div>
      </div>

      {/* Recent Threads Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Discussions</h2>
          <Link to="/thread">
            <Button variant="ghost">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        {/* You can add a preview of recent threads here */}
      </div>
    </div>
  )
}


// import { createFileRoute, redirect } from '@tanstack/react-router'

// export const Route = createFileRoute('/(client-area)/')({
//   beforeLoad: () => {
//     throw redirect({ to: '/thread' })
//   },
// })