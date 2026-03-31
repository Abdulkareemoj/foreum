import { Link } from '@tanstack/react-router'
import {
  Bell,
  ChevronDown,
  Home,
  Menu,
  MessageSquare,
  Moon,
  PlusIcon,
  Search,
  Settings,
  Sun,
  TrendingUp,
  Users
} from 'lucide-react'
import { Button, buttonVariants } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '~/components/ui/sheet'
import { Switch } from '~/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import Logo from '~/components/shared/Logo'
import UserDropdown from '~/components/shared/UserDropdown'
import NotificationBell from '../shared/NotificationBell'
import { SearchCommand } from './SearchCommand'
import LeftMobile from './LeftMobile'
import RightMobile from './RightMobile'
import { useState, useEffect } from 'react'

interface NavbarProps {
  user: any
}

export default function Navbar({ user }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const navigationItems = [
    { href: '/threads', label: 'Home', icon: Home },
    { href: '/communities', label: 'Communities', icon: Users },
    { href: '/trending', label: 'Trending', icon: TrendingUp },
    { href: '/messages', label: 'Messages', icon: MessageSquare }
  ]

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="flex w-full items-center justify-between gap-6 font-medium">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Link to="/threads" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            {/* If Logo does not exist just use Foreum text */}
            <span className="font-bold text-xl">Foreum</span>
          </Link>
        </div>

        {/* Middle Section */}
        <div className="flex flex-1 justify-center">
          <div className="w-full max-w-md relative">
             <Button
                variant="outline"
                onClick={() => setSearchOpen(true)}
                className="w-full justify-start text-muted-foreground h-9 px-3"
              >
                <Search className="mr-2 h-4 w-4" />
                <span>Search...</span>
             </Button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Link to="/threads/new" className="hidden md:block">
            <Button variant="secondary" size="sm" className="rounded-lg">
              <PlusIcon className="h-5 w-5 mr-1" /> New Thread
            </Button>
          </Link>
          <NotificationBell />
          <Button variant="outline" size="icon" className="hidden md:inline-flex">
            <Settings className="h-5 w-5" />
          </Button>

          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link to="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader className="text-left">
              <SheetTitle className="flex items-center gap-2">
                 <span className="font-bold text-xl">Foreum</span>
              </SheetTitle>
            </SheetHeader>

            <div className="flex h-full flex-col overflow-y-auto mt-4">
              {/* User Profile Section */}
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                {user ? (
                  <Link
                    to="/profile/$username"
                    params={{ username: user.username || user.id }}
                    className="flex w-full items-center gap-3"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Avatar className="h-8 w-8 rounded-lg grayscale">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <Link to="/sign-in" className="text-sm font-medium text-primary">Sign in</Link>
                )}
              </div>

              <Separator className="my-4" />

              <nav className="flex flex-col gap-2 px-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              <Separator className="my-4" />
              
              <div className="px-4 py-2">
                <Link to="/notifications" className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent hover:text-accent-foreground">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </Link>
              </div>

              <Separator className="my-4" />

              <div className="flex flex-col gap-2 px-2">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex w-full items-center justify-between px-3 py-2">
                      <span className="text-base font-medium">Links</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 pl-4">
                    <LeftMobile user={user} />
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex w-full items-center justify-between px-3 py-2">
                      <span className="text-base font-medium">More</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 pl-4">
                    <RightMobile user={user} />
                  </CollapsibleContent>
                </Collapsible>
              </div>

              <Separator className="my-4" />

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span>Dark Mode</span>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>

              <Separator className="my-4" />

              <div className="mt-auto py-4">
                <p className="text-center text-xs text-muted-foreground">
                  © 2024 Foreum. All rights reserved.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}

