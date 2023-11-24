import { getServerSideSitemap } from 'next-sitemap'
import { getDatabase } from '../../../lib/notion'

export async function GET() {
  // Method to source urls from cms
  // const urls = await fetch('https//example.com/api')
  const posts = await getDatabase()

  return getServerSideSitemap(
    posts.map((post) => {
      const slug = post.properties?.Slug?.rich_text?.at(0)?.text.content
      const date = new Date(post.last_edited_time)
      return {
        loc: `${process.env.SITE_URL}/article/${slug}`,
        lastmod: date.toISOString(),
      }
    })
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
