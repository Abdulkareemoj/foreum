import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
import { Menu } from 'lucide-react';
import Logo from './Logo';
import { Link } from '@tanstack/react-router';


export default function Header() {
	return (
<nav className	="sticky top-0 z-50 border-b border-border bg-background">
	<div className	="Ssm:px-6 mx-auto max-w-7xl px-4 lg:px-8">
		<div className	="flex h-16 items-center justify-between">
			<Link to="/"><Logo /></Link>

		
			<div className	="hidden items-center space-x-8 md:flex">
				<Link to="/" className	="text-muted-foreground transition-colors hover:text-foreground"
					>Features</Link>
				<Link to="/" className	="text-muted-foreground transition-colors hover:text-foreground"
					>Pricing</Link>
				<Link to="/" className	="text-muted-foreground transition-colors hover:text-foreground"
					>Documentation</Link>
				<Link
					to="/threads"
					className	="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
				>
					<Button
						size="lg"
						variant="ghost"
					>
						Get Started
					</Button>
				</Link>
			</div>

		
			<div className	="md:hidden">
				<Sheet >
					<SheetTrigger>
						<Button variant="ghost" size="icon">
							<Menu className	="h-5 w-5" />
							<span className	="sr-only">Toggle menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className	="w-75 sm:w-100">
						<div className	="flex flex-col space-y-4">
							<Link
								to="/"
								className	="text-lg font-medium transition-colors hover:text-primary"
								
							>
								Features
							</Link>
							<Link
								to="/"
								className	="text-lg font-medium transition-colors hover:text-primary"
							>
								Pricing
							</Link>
							<Link
								to="/"
								className	="text-lg font-medium transition-colors hover:text-primary"
								
							>
								Documentation
							</Link>
							<div className	="pt-4">
								<Link
									to="/threads"
									className	="w-full rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90 block"
								>
									<Button>
										Get Started
									</Button>
								</Link>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</div>
</nav>)}
