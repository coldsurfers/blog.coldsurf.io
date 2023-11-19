import Head from 'next/head'
import Link from 'next/link'
import { getDatabase } from '../lib/notion'
import { Text } from './[id]'
import styles from './index.module.css'

export const databaseId = process.env.NOTION_DATABASE_ID

export default function Home({ posts }) {
  return (
    <div>
      <Head>
        <title>Blog | coldsurf.io</title>
        <link rel="icon" href="/favicon.ico" />
        {/* google search console */}
        <meta
          name="google-site-verification"
          content="t8pam4eI0ydfgF_W2Js3Q9bdfCsbvZA83PSE2JDh1ww"
        />
      </Head>

      <main className={styles.container}>
        <h2 className={styles.heading}>All Posts</h2>
        <ol className={styles.posts}>
          {posts.map((post) => {
            const date = new Date(post.last_edited_time).toLocaleString(
              'en-US',
              {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              }
            )
            return (
              <li key={post.id} className={styles.post}>
                <h3 className={styles.postTitle}>
                  <Link href={`/${post.id}`}>
                    <Text text={post.properties.Name.title} />
                  </Link>
                </h3>

                <p className={styles.postDescription}>{date}</p>
                <Link href={`/${post.id}`}>Read post →</Link>
              </li>
            )
          })}
        </ol>
      </main>
    </div>
  )
}

export const getStaticProps = async () => {
  const database = await getDatabase(databaseId)

  return {
    props: {
      posts: database,
    },
    revalidate: false,
  }
}
