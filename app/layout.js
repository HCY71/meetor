'use client'
import './globals.scss'
import { useEffect } from 'react'

import { Providers } from "../components/Providers"

import PageContainer from '@/components/PageContainer'
import { useProgress } from '@/hooks/useProgress'

import { Analytics } from '@vercel/analytics/react'
import { initGA, logPageView } from '@/public/utils/GA'

export default function RootLayout({ children }) {
  useProgress()

  useEffect(() => {
    initGA()
    logPageView()
  }, [])

  // disable swipe to go back on iOS
  useEffect(() => {
    window.addEventListener('touchstart', (e) => e.preventDefault())
  }, [])

  return (
    <html lang="en" suppressHydrationWarning={ true }>
      <head>
        <title>Meetor | The Best Alternative to When2meet</title>
        <meta name="description" content="Meetor is the Effortless and Secure When2Meet Alternative - Simplify scheduling without the need for sign-ups, with our free and user-friendly interface." />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        <meta name="msapplication-TileColor" content="#000" />
        <meta name="theme-color" content="#ffffff" />

        <meta property="og:image" content="https://www.meetor.app/thumbnail.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        <meta property="twitter:image" content="https://www.meetor.app/thumbnail.png" />
        <meta property="twitter:image:type" content="image/png" />
        <meta property="twitter:image:width" content="1200" />
        <meta property="twitter:image:height" content="630" />

      </head>

      <body suppressHydrationWarning={ true }>
        <Providers>
          <PageContainer>
            { children }
          </PageContainer>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}