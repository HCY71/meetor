export const metadata = {
  title: 'Page Not Found | Meetor',
}

// The root layout already renders <html> and <body>; this layout only exists
// to give unknown paths their own title, since the root is a client component
// and cannot export metadata.
export default function NotFoundLayout({ children }) {
  return children
}
