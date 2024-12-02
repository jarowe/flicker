'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { UserNav } from '@/components/user-nav'
import { cn } from '@/lib/utils'
import {
  Home,
  Search,
  Bell,
  Mail,
  Trophy,
  Sparkles,
} from 'lucide-react'

const navItems = [
  {
    title: 'Home',
    href: '/',
    icon: Home,
  },
  {
    title: 'Explore',
    href: '/explore',
    icon: Search,
  },
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {
    title: 'Messages',
    href: '/messages',
    icon: Mail,
  },
  {
    title: 'Leaderboard',
    href: '/leaderboard',
    icon: Trophy,
  },
]

export function NavBar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black">
      <div className="container flex h-16 max-w-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-xl"
          >
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Flicker
            </span>
          </Link>
        </div>

        <nav className="flex flex-1 items-center justify-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative rounded-md px-3 py-2 hover:bg-zinc-900',
                  isActive && 'text-primary'
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="h-5 w-5" />
                  <span className="hidden text-sm font-medium lg:inline-block">
                    {item.title}
                  </span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <UserNav />
          ) : (
            <Button
              onClick={() => signIn()}
              className="bg-primary font-semibold hover:bg-primary/90"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
