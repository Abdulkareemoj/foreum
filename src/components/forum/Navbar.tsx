import { Link } from '@tanstack/react-router'
import { Menu, Search } from 'lucide-react'
import { Button } from '~/components/ui/button'
import UserDropdown from '~/components/shared/UserDropdown'
import NotificationBell from '../shared/NotificationBell'
import { SearchCommand } from './SearchCommand'
import { useState } from 'react'

interface NavbarProps {
  user: any // Replace with your user type
}

export default function Navbar({ user }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Menu Toggle */}
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 mr-6">
          <span className="font-bold text-xl">Foreum</span>
        </Link>
  
   {/* Search - Click to open command */}
          <div className="flex-1 flex items-center space-x-4 max-w-md">
            <Button
              onClick={() => setSearchOpen(true)}
              className="relative w-full group"
            >
              <div className="flex items-center w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground transition-colors">
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Search...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </Button>
          </div>
        {/* Right Actions */}
        <div className="flex items-center space-x-4 ml-auto">
          <Button variant="ghost" size="icon">
       <NotificationBell />  </Button>
          
          {user ? (
            <UserDropdown user={user} />
          ) : (
            <Link to="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
             {/* Command Dialog */}
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
      </div>
    </header>
  )
}