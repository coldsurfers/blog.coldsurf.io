import { NextApiRequest, NextApiResponse } from 'next'
import { databaseId } from '..'
import { getDatabase } from '../../lib/notion'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  try {
    const database = await getDatabase(databaseId)
    const postIds = database.map(({ id }) => id)
    const revalidate = async (revalidateId) =>
      await res.revalidate(`/${revalidateId}`)

    await Promise.all(postIds.map((id) => revalidate(id)))
    await revalidate('/')
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    // await res.revalidate('/4b3851bc-2d5c-4c61-bc94-a4cf19ceb090')
    return res.json({ revalidated: true })
  } catch (err) {
    console.error(err)
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
