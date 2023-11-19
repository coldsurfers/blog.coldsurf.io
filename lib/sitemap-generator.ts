const sitemap = require("nextjs-sitemap-generator");
const fs = require("fs");
const path = require('path')
const BUILD_ID_PATH = path.resolve(__dirname, '../.next/BUILD_ID')
const BUILD_ID = fs.readFileSync(BUILD_ID_PATH).toString();
const PAGES_DIRECTORY_PATH = path.resolve(__dirname, "../.next/server/pages")
const BASE_URL = 'https://blog.coldsurf.io'

sitemap({
  baseUrl: BASE_URL,
  // If you are using Vercel platform to deploy change the route to /.next/serverless/pages
  pagesDirectory: PAGES_DIRECTORY_PATH,
  targetDirectory: "public/",
  ignoredExtensions: ["js", "map"],
  ignoredPaths: ["assets", '[id]', 'index.js.nft'], // Exclude everything that isn't static page
});