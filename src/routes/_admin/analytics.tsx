import { createFileRoute } from '@tanstack/react-router'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { CardContent, CardHeader, CardTitle, Card } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { BarChart3, Users } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart'

export const Route = createFileRoute('/_admin/analytics')({
  component: AdminAnalytics,
})

const userGrowthData = [
  { month: "Jan", users: 100 },
  { month: "Feb", users: 150 },
  { month: "Mar", users: 200 },
  { month: "Apr", users: 300 },
  { month: "May", users: 250 },
  { month: "Jun", users: 400 },
]

const categoryData = [
  { category: "Dev", activity: 300 },
  { category: "Design", activity: 500 },
  { category: "General", activity: 800 },
  { category: "Help", activity: 400 },
  { category: "Offtopic", activity: 950 },
]

const chartConfig = {
  users: {
    label: "New Users",
    color: "hsl(var(--primary))",
  },
  activity: {
    label: "Activity Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

function AdminAnalytics() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Community Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Track user growth, engagement, and content performance.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input className="w-full md:w-1/3" placeholder="Filter by date range..." />
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="users">New Users</SelectItem>
            <SelectItem value="threads">New Threads</SelectItem>
            <SelectItem value="replies">Total Replies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" /> User Growth Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-video max-h-[300px] w-full">
            <AreaChart data={userGrowthData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="var(--color-users)"
                fill="var(--color-users)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" /> Top Categories by Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-video max-h-[300px] w-full">
            <BarChart data={categoryData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="activity"
                fill="var(--color-activity)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
