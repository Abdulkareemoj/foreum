import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { trpc } from '~/lib/trpc';
import { BarChart3, MessageSquare, Reply, Users } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '~/components/ui/chart'
import { adminMiddleware } from '~/server/auth-actions';
import { seo } from '~/utils/seo'

export const Route = createFileRoute('/_admin/admin-analytics')({
  head: () => ({
    meta: [...seo({ title: 'Analytics - Foreum' })],
  }),
	component: AdminAnalytics,
	server: {
		middleware: [adminMiddleware],
	},
})

const userGrowthConfig = {
	users: {
		label: "New Users",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig

const contentVolumeConfig = {
	threads: {
		label: "Threads",
		color: "hsl(var(--chart-1))",
	},
	replies: {
		label: "Replies",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig

const categoryConfig = {
	threads: {
		label: "Threads",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig

function StatCard({ title, value, icon: Icon, description }: { title: string; value: string; icon: any; description?: string }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<div className="flex size-8 items-center justify-center rounded-md bg-muted">
					<Icon className="size-4 text-muted-foreground" />
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				{description && (
					<p className="text-xs text-muted-foreground">{description}</p>
				)}
			</CardContent>
		</Card>
	)
}

function AdminAnalytics() {
	const { data: overview, isLoading: overviewLoading } = trpc.analytics.getOverview.useQuery();
	const { data: userGrowth, isLoading: userGrowthLoading } = trpc.analytics.getUserGrowth.useQuery();
	const { data: contentVolume, isLoading: contentVolumeLoading } = trpc.analytics.getContentVolume.useQuery();
	const { data: categoryData, isLoading: categoryLoading } = trpc.analytics.getCategoryDistribution.useQuery();
	const { data: engagement, isLoading: engagementLoading } = trpc.analytics.getEngagement.useQuery();
	const { data: topContributors, isLoading: contributorsLoading } = trpc.analytics.getTopContributors.useQuery({ limit: 10 });

	const isLoading = overviewLoading || userGrowthLoading || contentVolumeLoading || categoryLoading || engagementLoading || contributorsLoading;

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold">Community Analytics</h1>
				<p className="text-sm text-muted-foreground">
					Track user growth, engagement, and content performance.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Users"
					value={overview ? overview.totalUsers.toLocaleString() : '—'}
					icon={Users}
					description={overview ? `${overview.activeUsers} active` : undefined}
				/>
				<StatCard
					title="Total Threads"
					value={overview ? overview.totalThreads.toLocaleString() : '—'}
					icon={MessageSquare}
				/>
				<StatCard
					title="Total Replies"
					value={overview ? overview.totalReplies.toLocaleString() : '—'}
					icon={Reply}
				/>
				<StatCard
					title="Total Reactions"
					value={overview ? overview.totalReactions.toLocaleString() : '—'}
					icon={BarChart3}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="size-5" /> User Growth
						</CardTitle>
						<CardDescription>New users per month (last 12 months)</CardDescription>
					</CardHeader>
					<CardContent>
						{userGrowthLoading ? (
							<Skeleton className="aspect-video w-full" />
						) : userGrowth && userGrowth.length > 0 ? (
							<ChartContainer config={userGrowthConfig} className="aspect-video max-h-[300px] w-full">
								<AreaChart data={userGrowth}>
									<CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
									<XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
									<YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
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
						) : (
							<div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
								No user data yet
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<MessageSquare className="size-5" /> Content Volume
						</CardTitle>
						<CardDescription>Threads and replies per month (last 12 months)</CardDescription>
					</CardHeader>
					<CardContent>
						{contentVolumeLoading ? (
							<Skeleton className="aspect-video w-full" />
						) : contentVolume && contentVolume.length > 0 ? (
							<ChartContainer config={contentVolumeConfig} className="aspect-video max-h-[300px] w-full">
								<AreaChart data={contentVolume}>
									<CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
									<XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
									<YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Area
										type="monotone"
										dataKey="threads"
										stroke="var(--color-threads)"
										fill="var(--color-threads)"
										fillOpacity={0.2}
										strokeWidth={2}
									/>
									<Area
										type="monotone"
										dataKey="replies"
										stroke="var(--color-replies)"
										fill="var(--color-replies)"
										fillOpacity={0.2}
										strokeWidth={2}
									/>
								</AreaChart>
							</ChartContainer>
						) : (
							<div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
								No content data yet
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="size-5" /> Category Distribution
						</CardTitle>
						<CardDescription>Threads per category</CardDescription>
					</CardHeader>
					<CardContent>
						{categoryLoading ? (
							<Skeleton className="aspect-video w-full" />
						) : categoryData && categoryData.length > 0 ? (
							<ChartContainer config={categoryConfig} className="aspect-video max-h-[300px] w-full">
								<BarChart data={categoryData}>
									<CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
									<XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
									<YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar
										dataKey="threads"
										fill="var(--color-threads)"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ChartContainer>
						) : (
							<div className="flex aspect-video items-center justify-center text-sm text-muted-foreground">
								No categories yet
							</div>
						)}
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<BarChart3 className="size-5" /> Engagement
						</CardTitle>
						<CardDescription>Community interaction metrics</CardDescription>
					</CardHeader>
					<CardContent>
						{engagementLoading ? (
							<div className="flex flex-col gap-4">
								<Skeleton className="h-16 w-full" />
								<Skeleton className="h-16 w-full" />
								<Skeleton className="h-16 w-full" />
							</div>
						) : engagement ? (
							<div className="grid gap-4">
								<div className="flex items-center justify-between rounded-lg border p-3">
									<span className="text-sm text-muted-foreground">Avg Replies / Thread</span>
									<span className="text-lg font-semibold">{engagement.avgRepliesPerThread}</span>
								</div>
								<div className="flex items-center justify-between rounded-lg border p-3">
									<span className="text-sm text-muted-foreground">Total Reactions</span>
									<span className="text-lg font-semibold">{engagement.totalReactions.toLocaleString()}</span>
								</div>
								<div className="flex items-center justify-between rounded-lg border p-3">
									<span className="text-sm text-muted-foreground">Threads with Reactions</span>
									<span className="text-lg font-semibold">{engagement.threadsWithReactions} / {engagement.totalThreads}</span>
								</div>
								<div className="flex items-center justify-between rounded-lg border p-3">
									<span className="text-sm text-muted-foreground">Reaction Rate</span>
									<span className="text-lg font-semibold">{engagement.reactionRate}%</span>
								</div>
							</div>
						) : null}
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="size-5" /> Top Contributors
					</CardTitle>
					<CardDescription>Most active community members by content created</CardDescription>
				</CardHeader>
				<CardContent>
					{contributorsLoading ? (
						<div className="flex flex-col gap-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<Skeleton key={i} className="h-12 w-full" />
							))}
						</div>
					) : topContributors && topContributors.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>User</TableHead>
									<TableHead className="text-right">Threads</TableHead>
									<TableHead className="text-right">Replies</TableHead>
									<TableHead className="text-right">Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{topContributors.map((contributor: any, index: number) => (
									<TableRow key={contributor.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<span className="text-sm text-muted-foreground w-5">#{index + 1}</span>
												<Avatar className="size-8">
													<AvatarImage src={contributor.image} />
													<AvatarFallback>{contributor.name?.charAt(0) ?? '?'}</AvatarFallback>
												</Avatar>
												<div className="flex flex-col">
													<span className="text-sm font-medium">{contributor.name}</span>
													{contributor.username && (
														<span className="text-xs text-muted-foreground">@{contributor.username}</span>
													)}
												</div>
											</div>
										</TableCell>
										<TableCell className="text-right">
											<Badge variant="secondary">{contributor.threadCount}</Badge>
										</TableCell>
										<TableCell className="text-right">
											<Badge variant="secondary">{contributor.replyCount}</Badge>
										</TableCell>
										<TableCell className="text-right font-medium">{contributor.total}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
							No contributors yet
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
