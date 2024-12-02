import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { NavBar } from '@/components/nav-bar'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/session-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Flicker',
  description: 'Ephemeral social platform where posts live through engagement',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              <NavBar />
              <div className="container mx-auto max-w-2xl pt-16">
                {children}
              </div>
              <Toaster />
            </div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
