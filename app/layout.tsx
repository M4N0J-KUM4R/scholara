import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Archivo_Black, Space_Grotesk } from 'next/font/google'
import './globals.css'

const display = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const body = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'CollegeCloud — Multi-tenant LMS',
  description:
    'CollegeCloud academic operations platform with authenticated, tenant-scoped Supabase data.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fffbef',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="antialiased">{children}</body>
      {process.env.NODE_ENV === 'production' && <Analytics />}
    </html>
  )
}
