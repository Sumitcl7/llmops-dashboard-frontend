import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'LLMOps Dashboard — Drift-Aware Monitoring',
  description: 'Production ML Operations dashboard for monitoring model drift, retraining lifecycle, and system health.',
  keywords: ['LLMOps', 'ML Monitoring', 'Drift Detection', 'Model Retraining'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
