import '../styles/globals.css'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blog | Coldsurf',
  description: 'ColdSurf blog',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* google search console */}
        <meta
          name="google-site-verification"
          content="t8pam4eI0ydfgF_W2Js3Q9bdfCsbvZA83PSE2JDh1ww"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
