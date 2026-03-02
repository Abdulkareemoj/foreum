import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import ThemeToggle from './ModeToggle';
import { Link } from '@tanstack/react-router';

	const links = [
		{
			group: 'Product',
			items: [
				{
					title: 'Features',
					href: '/features'
				},
				{
					title: 'Solution',
					href: '/solution'
				},
				{
					title: 'Pricing',
					href: '/pricing'
				},
				{
					title: 'Help',
					href: '#'
				},
				{
					title: 'About',
					href: '#'
				}
			]
		},
		{
			group: 'Solution',
			items: [
				{
					title: 'Startups',
					href: '/solution/startups'
				},
				{
					title: 'Freelancers',
					href: '/solution/freelancers'
				},
				{
					title: 'Organizations',
					href: '/solution/organizations'
				},
				{
					title: 'Students',
					href: '/solution/students'
				},
				{
					title: 'Collaboration',
					href: '/solution/collaboration'
				},
				{
					title: 'Design',
					href: '/solution/design'
				},
				{
					title: 'Management',
					href: '/solution/management'
				}
			]
		},
		// {
		// 	group: 'Company',
		// 	items: [
		// 		{
		// 			title: 'About',
		// 			href: '#'
		// 		},
		// 		{
		// 			title: 'Careers',
		// 			href: '#'
		// 		},
		// 		{
		// 			title: 'Blog',
		// 			href: '#'
		// 		},
		// 		{
		// 			title: 'Press',
		// 			href: '#'
		// 		},
		// 		{
		// 			title: 'Contact',
		// 			href: '#'
		// 		},
		// 		{
		// 			title: 'Help',
		// 			href: '#'
		// 		}
		// 	]
		// },
		{
			group: 'Legal',
			items: [
				{
					title: 'Lisence',
					href: '#'
				},
				{
					title: 'Privacy',
					href: '/privacy'
				},
				{
					title: 'Cookies',
					href: '/cookies'
				},
				{
					title: 'Security',
					href: '#'
				}
			]
		}
	];

export default function Footer(){
	return(
<footer className="border-b bg-white pt-10 dark:bg-transparent">
	<div className="mb-8 border-b md:mb-12">
		<div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6 pb-6">
			<div className="space-y-4">
				<div className="flex items-center space-x-2">
					<div className="flex size-8 items-center justify-center rounded-lg bg-primary">
						<span className="text-lg font-bold text-primary-foreground">F</span>
					</div>
					<span className="font-heading text-xl font-bold text-card-foreground">Foreum</span>
				</div>
				<p className="text-muted-foreground">
					The modern forum platform for building thriving online communities.
				</p>
			</div>

			<div className="flex flex-wrap justify-center gap-6 text-sm">
				<a
					href="https://x.com"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="X/Twitter"
					className="block text-muted-foreground hover:text-primary"
				>
					<svg
						className="size-6"
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M10.488 14.651L15.25 21h7l-7.858-10.478L20.93 3h-2.65l-5.117 5.886L8.75 3h-7l7.51 10.015L2.32 21h2.65zM16.25 19L5.75 5h2l10.5 14z"
						></path>
					</svg>
				</a>

				<a
					href="https://facebook.com"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Facebook"
					className="block text-muted-foreground hover:text-primary"
				>
					<svg
						className="size-6"
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"
						></path>
					</svg>
				</a>

				<a
					href="https://instagram.com"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Instagram"
					className="block text-muted-foreground hover:text-primary"
				>
					<svg
						className="size-6"
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"
						></path>
					</svg>
				</a>
				<a
					href="https://tiktok.com"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="TikTok"
					className="block text-muted-foreground hover:text-primary"
				>
					<svg
						className="size-6"
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
					>
						<path
							fill="currentColor"
							d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"
						></path>
					</svg>
				</a>
			</div>
		</div>
	</div>
	<div className="mx-auto max-w-6xl px-6">
		<div className="grid gap-12 md:grid-cols-5 md:gap-0 lg:grid-cols-4">
			<div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-5 md:row-start-1 lg:col-span-3">
				{links.map(link => (
					<div className="space-y-4 text-sm">
						<span className="block font-semibold">{link.group} </span>
						{link.items.map(item => (
							<Link  key={link.group}
								to={item.href}
								className="block text-muted-foreground duration-150 hover:text-primary"
							>
								<span >{item.title}</span>
							</Link>
						))}
					</div>
				))}
			</div>
			<form className="row-start-1 border-b pb-8 text-sm md:col-span-2 md:border-none lg:col-span-1">
				<div className="space-y-4">
					<Label htmlFor="mail" className="block font-medium">Newsletter</Label>
					<div className="flex gap-2">
						<Input
							type="email"
							id="mail"
							name="mail"
							placeholder="Your email"
							className="h-8 text-sm"
						/>
						<Button size="sm">Submit</Button>
					</div>
					<span className="block text-sm text-muted-foreground">Don't miss any update!</span>
				</div>
			</form>
		</div>
		<div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
			<small className="order-last block text-center text-sm text-muted-foreground md:order-first"
				>© {new Date().getFullYear()} Foreum. All rights reserved</small>
			<ThemeToggle />
		</div>
	</div>
</footer>
)
}