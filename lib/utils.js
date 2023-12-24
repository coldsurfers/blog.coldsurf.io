import { getDatabase } from './notion'

export async function getInternalPosts(
  options = {
    status: 'Published',
  }
) {
  const { status = 'Published' } = options
  try {
    const rawPosts = await getDatabase()
    const posts = rawPosts.map((post) => {
      const date = new Date(post.created_time)
      const slug = post.properties?.Slug?.rich_text?.at(0)?.text.content
      const title = post.properties?.Name?.title
      const postStatus = post.properties.Status.status.name
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
        status: postStatus,
      }
    })

    return posts.filter((post) => post.status === status)
  } catch (e) {
    console.error(e)
    return null
  }
}
