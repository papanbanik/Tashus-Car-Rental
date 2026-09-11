import siteMetadata from '@/utils/siteMetadata';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/profile'],
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  };
}

//sitemap.ts
// import { MetadataRoute } from 'next'
// import { allBlogs } from 'contentlayer/generated'
// import siteMetadata from '@/data/siteMetadata'

// export default function sitemap(): MetadataRoute.Sitemap {
//   const siteUrl = siteMetadata.siteUrl
//   const blogRoutes = allBlogs.map((post) => ({
//     url: `${siteUrl}/${post.path}`,
//     lastModified: post.lastmod || post.date,
//   }))

//   const routes = ['', 'blog', 'projects', 'tags'].map((route) => ({
//     url: `${siteUrl}/${route}`,
//     lastModified: new Date().toISOString().split('T')[0],
//   }))

//   return [...routes, ...blogRoutes]
// }
