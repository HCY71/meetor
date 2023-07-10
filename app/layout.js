'use client'
import './globals.scss'

import { Providers } from "../components/Providers"

import PageContainer from '@/components/PageContainer'
import { useProgress } from '@/hooks/useProgress'

export default function RootLayout({ children }) {
  useProgress()
  return (
    <html lang="en" suppressHydrationWarning={ true }>
      <head>
        <title>Meetor | The best alternative to when2meet</title>
        <meta name="description" content="Meetor aim to simplify your scheduling efforts. It's truly simple and completely free to use." />

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
      </body>
    </html>
  )
}