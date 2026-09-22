export const metadata = {
  title: 'Page Not Found | Meetor',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{ children }</body>
    </html>
  )
}
