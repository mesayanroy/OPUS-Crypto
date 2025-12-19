import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Web3Provider } from '@/lib/web3/context'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'OPUS AI Trading Platform',
  description: 'AI-powered Web3 trading platform with wallet-only authentication',
  generator: 'v0.app',
  icons: {
    icon: '/icon.svg',
  },
}

// Disable static generation to avoid prerender issues in error routes
export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Web3Provider>
            {children}
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}
