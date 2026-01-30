import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SketchToCode - Transform Wireframes into Production Code',
  description: 'Upload a photo of your hand-drawn wireframe and get production-ready HTML, CSS, and JavaScript code instantly. Transform your designs into code.',
  keywords: ['wireframe', 'code generator', 'AI', 'web development', 'design to code'],
  openGraph: {
    title: 'SketchToCode - Transform Wireframes into Production Code',
    description: 'Upload a photo of your hand-drawn wireframe and get production-ready code instantly.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
