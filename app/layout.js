'use client'
import './globals.scss'

import { Providers } from "./providers"
import Navbar from '../components/Navbar'
import Content from '../components/Content'
import { Toaster } from 'react-hot-toast'

// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// }

export default function RootLayout({ children }) {

  return (
    <html lang="en" suppressHydrationWarning={ true }>
      <body suppressHydrationWarning={ true }>
        <Toaster />
        <Providers>
          <Navbar />
          <Content>
            { children }
          </Content>
        </Providers>
      </body>
    </html>
  )
}