import Script from 'next/script'
import '@coldsurfers/ocean-road/global.css'

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
        {/* <!-- Google tag (gtag.js) --> */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-VDP9GWZWGR" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-VDP9GWZWGR');
        `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
