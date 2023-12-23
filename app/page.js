import Link from 'next/link'
import Text from '../components/text'
import styles from './index.module.css'
import { getInternalPosts } from '../lib/utils'

export default async function Page() {
  const posts = await getInternalPosts()
  return (
    <div>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1>SurfLog</h1>
          <h2>One Man Corporation Blog</h2>
          <p>
            {`ColdSurf is one man corporation.\nI write some inspirations to this blog.\nBecause I am easily inspired by films and music.`}
          </p>
        </header>

        <h2 className={styles.heading}>All Posts</h2>
        <ol className={styles.posts}>
          {posts.map((post) => (
            <li key={post.id} className={styles.post}>
              <h3 className={styles.postTitle}>
                <Link href={`/article/${post.slug}`}>
                  <Text title={post.title} />
                </Link>
              </h3>

              <p className={styles.postDescription}>{post.dateLocale}</p>
              <Link href={`/article/${post.slug}`}>Read post →</Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  )
}
