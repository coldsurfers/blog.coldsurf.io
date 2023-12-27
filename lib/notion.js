import { cache } from 'react'
import { blog } from '@coldsurfers/notion-utils'

export const revalidate = 3600 // revalidate the data at most every hour

export const databaseId = process.env.NOTION_DATABASE_ID

export const getAllPosts = cache(
  async () => await blog.getAllPosts({ platform: 'all' })
)

export const getPage = cache(
  async (pageId) => await blog.getPostDetailByPageId(pageId)
)

export const getPageFromSlug = cache(
  async (slug) => await blog.getPostDetailBySlug(slug)
)

export const getBlocks = cache(async (blockID) => await blog.getBlocks(blockID))
