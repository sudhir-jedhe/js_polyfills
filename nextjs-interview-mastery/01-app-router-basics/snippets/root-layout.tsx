// app/layout.tsx
// The mandatory root layout. Must define <html> and <body>.
// Runs once per app load and persists across every navigation.
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Interview Mastery App',
  description: 'Demo app for App Router basics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>Global Nav</header>
        {children}
        <footer>Global Footer</footer>
      </body>
    </html>
  )
}
