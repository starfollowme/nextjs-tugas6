import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ReduxProvider from '@/providers/ReduxProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal Notes Manager - Redux Demo',
  description: 'Aplikasi catatan sederhana menggunakan Redux untuk state management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  )
}