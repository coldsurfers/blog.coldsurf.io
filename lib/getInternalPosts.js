import { getDatabase } from './notion'

export async function getInternalPosts() {
  try {
    const rawPosts = await getDatabase()
    const posts = rawPosts.map((post) => {
      const date = new Date(post.last_edited_time)
      const slug = post.properties?.Slug?.rich_text?.at(0)?.text.content
      const title = post.properties?.Name?.title
      return {
        id: post.id,
        date,
        dateLocale: date.toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
        }),
        slug,
        title,
      }
    })

    return posts
  } catch (e) {
    console.error(e)
    return null
  }
}
