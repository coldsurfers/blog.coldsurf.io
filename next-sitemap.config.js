/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://example.com',
  generateRobotsTxt: true,
  sitemapSize: 1000,
  // optional
  robotsTxtOptions: {
    additionalSitemaps: ['https://blog.coldsurf.io/server-sitemap.xml'],
  },
}
