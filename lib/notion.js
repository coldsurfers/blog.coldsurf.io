import { Client } from '@notionhq/client'
import { cache } from 'react'
import fs from 'fs'
import sha1 from 'sha1'
import axios from 'axios'
import util from 'util'
import FormData from 'form-data'
import stream from 'stream'

const pipeline = util.promisify(stream.pipeline)

export const revalidate = 3600 // revalidate the data at most every hour

export const databaseId = process.env.NOTION_DATABASE_ID

function generateUUID() {
  // Public Domain/MIT
  let d = new Date().getTime() // Timestamp
  let d2 =
    (typeof performance !== 'undefined' &&
      performance.now &&
      performance.now() * 1000) ||
    0 // Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16 // random number between 0 and 16
    if (d > 0) {
      // Use timestamp until depleted
      r = (d + r) % 16 | 0
      d = Math.floor(d / 16)
    } else {
      // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0
      d2 = Math.floor(d2 / 16)
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}
export const generateCloudinaryUploadSignature = (filename) => {
  const timestamp = Date.now()
  const directory = 'blog-assets'
  const public_id = `${directory}/${filename}`
  const payload_to_sign = `public_id=${public_id}&timestamp=${timestamp}`
  const api_secret = process.env.CLOUDINARY_API_SECRET
  const signature = sha1(payload_to_sign + api_secret)
  return {
    signature,
    public_id,
    timestamp,
  }
}

export const uploadCloudinary = async (url) => {
  const request = await axios.get(url, {
    responseType: 'stream',
  })
  if (!fs.existsSync('temps')) {
    fs.mkdirSync('temps')
  }
  const filepath = `temps/${generateUUID()}`
  await pipeline(request.data, fs.createWriteStream(filepath))
  const { signature, public_id, timestamp } = generateCloudinaryUploadSignature(
    generateUUID()
  )

  const cloudinarySignedUploadAPI =
    'https://api.cloudinary.com/v1_1/druidbphk/image/upload'
  const formdata = new FormData()

  formdata.append('file', fs.createReadStream(filepath))
  formdata.append('public_id', public_id)
  formdata.append('signature', signature)
  formdata.append('api_key', process.env.CLOUDINARY_API_KEY)
  formdata.append('timestamp', timestamp)

  const { data } = await axios({
    method: 'post',
    url: cloudinarySignedUploadAPI,
    headers: formdata.getHeaders(),
    data: formdata,
  })
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }
  return data
}

/**
 * Returns a random integer between the specified values, inclusive.
 * The value is no lower than `min`, and is less than or equal to `max`.
 *
 * @param {number} minimum - The smallest integer value that can be returned, inclusive.
 * @param {number} maximum - The largest integer value that can be returned, inclusive.
 * @returns {number} - A random integer between `min` and `max`, inclusive.
 */
function getRandomInt(minimum, maximum) {
  const min = Math.ceil(minimum)
  const max = Math.floor(maximum)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export const getDatabase = cache(async () => {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        timestamp: 'created_time',
        direction: 'descending',
      },
    ],
  })
  return response.results
})

export const getPage = cache(async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId })
  return response
})

export const getPageFromSlug = cache(async (slug) => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Slug',
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  })
  if (response?.results?.length) {
    return response?.results?.[0]
  }
  return {}
})

export const getBlocks = cache(async (blockID) => {
  const blockId = blockID.replaceAll('-', '')

  let next = ''
  const list = []
  while (typeof next === 'string') {
    const { results, has_more, next_cursor } =
      await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: next || undefined,
      })
    if (has_more && next_cursor) {
      next = next_cursor
    } else {
      next = undefined
    }
    list.push(...results)
  }

  // Fetches all child blocks recursively
  // be mindful of rate limits if you have large amounts of nested blocks
  // See https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks = list.map(async (block) => {
    const generated = {
      ...block,
    }
    if (generated.has_children) {
      const children = await getBlocks(block.id)
      generated.children = children
    }
    if (process.env.NODE_ENV === 'production' && generated.type === 'image') {
      if (generated.image.type === 'file') {
        const cloudinary = await uploadCloudinary(generated.image.file.url)
        generated.image.file.url = cloudinary.secure_url
      }
    }
    return generated
  })
  return Promise.all(childBlocks).then((blocks) =>
    blocks.reduce((acc, curr) => {
      if (curr.type === 'bulleted_list_item') {
        if (acc[acc.length - 1]?.type === 'bulleted_list') {
          acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr)
        } else {
          acc.push({
            id: getRandomInt(10 ** 99, 10 ** 100).toString(),
            type: 'bulleted_list',
            bulleted_list: { children: [curr] },
          })
        }
      } else if (curr.type === 'numbered_list_item') {
        if (acc[acc.length - 1]?.type === 'numbered_list') {
          acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr)
        } else {
          acc.push({
            id: getRandomInt(10 ** 99, 10 ** 100).toString(),
            type: 'numbered_list',
            numbered_list: { children: [curr] },
          })
        }
      } else {
        acc.push(curr)
      }
      return acc
    }, [])
  )
})
