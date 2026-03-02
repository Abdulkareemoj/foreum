import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/_landing/features')({
  component: FeaturesPage,
})

function FeaturesPage() {
  return (
    <><section className="bg-background py-20">
	<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div className="mx-auto max-w-3xl text-center">
			<h1 className="font-heading mb-6 text-5xl font-bold text-foreground">
				Everything You Need to Build Amazing Communities
			</h1>
			<p className="text-xl leading-relaxed text-muted-foreground">
				Powerful features designed to help you create, manage, and grow thriving online communities
				with ease.
			</p>
		</div>
	</div>
</section>

<section className="bg-muted/30 py-20">
	<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div className="mb-16 text-center">
			<h2 className="font-heading mb-4 text-4xl font-bold text-foreground">Core Features</h2>
			<p className="text-xl text-muted-foreground">The foundation of a great forum experience</p>
		</div>

		<div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
			<div className="flex gap-6">
				<div className="flex-shrink-0">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
							/>
						</svg>
					</div>
				</div>
				<div>
					<h3 className="font-heading mb-3 text-xl font-semibold text-foreground">Rich Text Editor</h3>
					<p className="mb-4 leading-relaxed text-muted-foreground">
						Powerful WYSIWYG editor with markdown support, code syntax highlighting, image uploads,
						and emoji picker. Make your posts beautiful and engaging.
					</p>
					<ul className="space-y-2 text-muted-foreground">
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Markdown & WYSIWYG modes
						</li>
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Code syntax highlighting
						</li>
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Drag & drop image uploads
						</li>
					</ul>
				</div>
			</div>

			<div className="flex gap-6">
				<div className="flex-shrink-0">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
					</div>
				</div>
				<div>
					<h3 className="font-heading mb-3 text-xl font-semibold text-foreground">Advanced Search</h3>
					<p className="mb-4 leading-relaxed text-muted-foreground">
						Lightning-fast full-text search with filters, sorting, and relevance ranking. Help users
						find exactly what they're looking for.
					</p>
					<ul className="space-y-2 text-muted-foreground">
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Full-text search
						</li>
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Advanced filters & sorting
						</li>
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Search suggestions
						</li>
					</ul>
				</div>
			</div>

			<div className="flex gap-6">
				<div className="flex-shrink-0">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					</div>
				</div>
				<div>
					<h3 className="font-heading mb-3 text-xl font-semibold text-foreground">
						User Profiles & Reputation
					</h3>
					<p className="mb-4 leading-relaxed text-muted-foreground">
						Customizable user profiles with avatars, badges, and reputation systems. Reward active
						contributors and build trust.
					</p>
					<ul className="space-y-2 text-muted-foreground">
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Custom profile fields
						</li>
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Badges & achievements
						</li>
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Reputation scoring
						</li>
					</ul>
				</div>
			</div>

			<div className="flex gap-6">
				<div className="flex-shrink-0">
					<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
						<svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								stroke-width='2'
								d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							/>
						</svg>
					</div>
				</div>
				<div>
					<h3 className="font-heading mb-3 text-xl font-semibold text-foreground">
						Smart Notifications
					</h3>
					<p className="mb-4 leading-relaxed text-muted-foreground">
						Keep users engaged with real-time notifications for mentions, replies, and updates.
						Email and in-app notifications included.
					</p>
					<ul className="space-y-2 text-muted-foreground">
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Real-time notifications
						</li>
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Email digests
						</li>
						<li className="flex items-center gap-2">
							<svg
								className="h-4 w-4 text-primary"
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									stroke-linecap='round'
									stroke-linejoin='round'
									stroke-width='2'
									d='M5 13l4 4L19 7'
								/>
							</svg>
							Customizable preferences
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>

<section className="bg-background py-20">
	<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div className="mb-16 text-center">
			<h2 className="font-heading mb-4 text-4xl font-bold text-foreground">Moderation & Safety</h2>
			<p className="text-xl text-muted-foreground">Keep your community safe and healthy</p>
		</div>

		<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div className="rounded-xl border border-border bg-card p-8">
				<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
					<svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width='2'
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						/>
					</svg>
				</div>
				<h3 className="font-heading mb-3 text-xl font-semibold text-card-foreground">
					AI Content Filtering
				</h3>
				<p className="leading-relaxed text-muted-foreground">
					Automatically detect and filter spam, toxic content, and inappropriate material with
					advanced AI moderation.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-8">
				<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
					<svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width='2'
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>
				<h3 className="font-heading mb-3 text-xl font-semibold text-card-foreground">Report System</h3>
				<p className="leading-relaxed text-muted-foreground">
					Empower your community to report issues. Comprehensive moderation queue with action
					history and appeals.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-8">
				<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
					<svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width='2'
							d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
						/>
					</svg>
				</div>
				<h3 className="font-heading mb-3 text-xl font-semibold text-card-foreground">
					User Management
				</h3>
				<p className="leading-relaxed text-muted-foreground">
					Ban, suspend, or warn users. Set up automatic rules and custom moderation workflows for
					your team.
				</p>
			</div>
		</div>
	</div>
</section>

<section className="bg-muted/30 py-20">
	<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div className="mb-16 text-center">
			<h2 className="font-heading mb-4 text-4xl font-bold text-foreground">
				Integrations & Customization
			</h2>
			<p className="text-xl text-muted-foreground">Make Foreum work exactly how you need it</p>
		</div>

		<div className="grid grid-cols-1 gap-8 md:grid-cols-2">
			<div className="rounded-xl border border-border bg-card p-8">
				<h3 className="font-heading mb-4 text-2xl font-semibold text-card-foreground">
					Easy Integration
				</h3>
				<p className="mb-6 leading-relaxed text-muted-foreground">
					Add Foreum to your website with a simple embed code. Works with any platform - WordPress,
					Webflow, custom sites, and more.
				</p>
				<div className="rounded-lg bg-muted p-4 font-mono text-sm text-muted-foreground">
					&lt;script src="foreum.js"&gt;&lt;/script&gt;
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-8">
				<h3 className="font-heading mb-4 text-2xl font-semibold text-card-foreground">Custom Themes</h3>
				<p className="mb-6 leading-relaxed text-muted-foreground">
					Match your brand perfectly with custom CSS, color schemes, and layout options. Full design
					control.
				</p>
				<div className="flex gap-2">
					<div className="h-12 w-12 rounded-lg bg-primary"></div>
					<div className="h-12 w-12 rounded-lg bg-secondary"></div>
					<div className="h-12 w-12 rounded-lg bg-accent"></div>
					<div className="h-12 w-12 rounded-lg bg-muted"></div>
				</div>
			</div>

			<div className="rounded-xl border border-border bg-card p-8">
				<h3 className="font-heading mb-4 text-2xl font-semibold text-card-foreground">
					SSO & Authentication
				</h3>
				<p className="leading-relaxed text-muted-foreground">
					Seamless single sign-on with your existing user system. Support for OAuth, SAML, and
					custom authentication.
				</p>
			</div>

			<div className="rounded-xl border border-border bg-card p-8">
				<h3 className="font-heading mb-4 text-2xl font-semibold text-card-foreground">API Access</h3>
				<p className="leading-relaxed text-muted-foreground">
					Full REST API and webhooks for custom integrations. Build exactly what you need with
					comprehensive documentation.
				</p>
			</div>
		</div>
	</div>
</section>

<section className="bg-primary py-20">
	<div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
		<h2 className="font-heading mb-6 text-4xl font-bold text-primary-foreground">
			Ready to See It in Action?
		</h2>
		<p className="mb-8 text-xl text-primary-foreground/80">
			Start your free trial and experience all these features yourself.
		</p>
		<button
			className="rounded-lg bg-background px-8 py-4 text-lg font-medium text-foreground shadow-lg transition-colors hover:bg-muted"
		>
			Start Free Trial
		</button>
	</div>
</section></>
  )
}
