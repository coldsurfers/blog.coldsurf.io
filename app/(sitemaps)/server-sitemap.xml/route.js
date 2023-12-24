import { getServerSideSitemap } from 'next-sitemap'
import { getInternalPosts } from '../../../lib/utils'

export async function GET() {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const posts = await getInternalPosts()
  const sitemaps = [
    {
      loc: `${process.env.SITE_URL}`,
      lastmod: new Date().toISOString(),
    },
    ...posts.map((post) => ({
      loc: `${process.env.SITE_URL}/article/${post.slug}`,
      lastmod: post.lastEditedTime.toISOString(),
    })),
  ]

  return getServerSideSitemap(sitemaps)

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
