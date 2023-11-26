import { getServerSideSitemap } from 'next-sitemap'
import { getInternalPosts } from '../../../lib/getInternalPosts'

export async function GET() {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const posts = await getInternalPosts()

  return getServerSideSitemap(
    posts.map((post) => ({
      loc: `${process.env.SITE_URL}/article/${post.slug}`,
      lastmod: post.date.toISOString(),
    }))
  )

  // return getServerSideSitemap([
  //   {
  //     loc: 'https://example.com',
  //     lastmod: new Date().toISOString(),
  //     // changefreq
  //     // priority
  //   },
  //   {
  //     loc: 'https://example.com/dynamic-path-2',
  //     lastmod: new Date().toISOString(),
  //     // changefreq
  //     // priority
  //   },
  // ])
}
