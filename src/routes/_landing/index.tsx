import { createFileRoute } from '@tanstack/react-router'
	import { Button } from '~/components/ui/button';
	import { Badge } from '~/components/ui/badge';
	import { BarChart3, Globe, MessageSquare, Shield, Users, Zap } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export const Route = createFileRoute('/_landing/')({
  component: LandingPage,
})

function LandingPage() {
  const stats = {
		communities: 0,
		discussions: 0,
		members: 0
	}
  return (
    
    <><section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge
                className="rounded-full border-none bg-green-600/10 text-green-600 focus-visible:ring-green-600/20 focus-visible:outline-none dark:bg-green-400/10 dark:text-green-400 dark:focus-visible:ring-green-400/40 [a&]:hover:bg-green-600/5 dark:[a&]:hover:bg-green-400/5"
              >
                <span className="size-1.5 rounded-full bg-green-600 dark:bg-green-400" aria-hidden="true"
                ></span>
                Modern Forum Platform
              </Badge>
              <h1 className="font-heading text-4xl leading-tight font-bold text-foreground lg:text-6xl">
                Build Your Community with <span className="text-primary">Seamless Discussions</span>
              </h1>
              <p className="text-xl leading-relaxed text-muted-foreground">
                Embed powerful discussion features into any website. Easy integration, robust moderation
                tools, and engaging community features that grow with your audience.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-border bg-transparent hover:bg-muted">
                View Demo
              </Button>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="size-2 rounded-full bg-primary"></div>
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="size-2 rounded-full bg-primary"></div>
                <span>No coding required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="size-2 rounded-full bg-primary"></div>
                <span>Free 14-day trial</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-lg border border-border bg-card p-6 shadow-lg">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="Foreum Forum Interface"
                className="h-auto w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </section><section id="features" className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Everything You Need for Community Building
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Powerful features designed to foster engagement and maintain healthy discussions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="size-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-card-foreground">Easy Integration</CardTitle>
                <CardDescription>
                  Embed discussions anywhere with a simple code snippet. Works with any website or CMS.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="size-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-card-foreground">Advanced Moderation</CardTitle>
                <CardDescription>
                  Comprehensive moderation tools with automated spam detection and custom rules.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-card-foreground">User Management</CardTitle>
                <CardDescription>
                  Role-based permissions, user profiles, and reputation systems to build trust.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="size-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-card-foreground">Multi-Site Support</CardTitle>
                <CardDescription>
                  Manage multiple communities from one dashboard with unified analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="size-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-card-foreground">Analytics & Insights</CardTitle>
                <CardDescription>
                  Track engagement, popular topics, and community growth with detailed analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <CardTitle className="font-heading text-card-foreground">Rich Discussions</CardTitle>
                <CardDescription>
                  Threaded conversations, reactions, file uploads, and real-time notifications.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section><section id="community" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Join Thousands of Growing Communities
            </h2>
            <p className="text-xl text-muted-foreground">
              Trusted by websites worldwide to power their discussions
            </p>
          </div>

          <div className="grid gap-8 text-center md:grid-cols-4">
            <div className="space-y-2">
              <div className="font-heading text-4xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Active Communities</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading text-4xl font-bold text-primary">2M+</div>
              <div className="text-muted-foreground">Monthly Discussions</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading text-4xl font-bold text-primary">500K+</div>
              <div className="text-muted-foreground">Registered Users</div>
            </div>
            <div className="space-y-2">
              <div className="font-heading text-4xl font-bold text-primary">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section><section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
              Ready to Build Your Community?
            </h2>
            <p className="text-xl text-muted-foreground">
              Start your free trial today and see how easy it is to add engaging discussions to your
              website.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-border bg-transparent hover:bg-muted">
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section></>

  )
}
