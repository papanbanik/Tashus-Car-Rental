import siteMetadata from '@/utils/siteMetadata';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl;
  //   const blogRoutes = allBlogs.map((post) => ({
  //     url: `${siteUrl}/${post.path}`,
  //     lastModified: post.lastmod || post.date,
  //   }));

  const routes = [
    '',
    'about-us',
    'help',
    'help/photo-upload-guide',
    'legals/terms-and-conditions',
    'login',
    'car-listing',
    'help/all-topics',
    'legals/privacy',
    // 'au/en/car-share/sydney',
    // 'eco-friendly-car-share',
    'au/en/car-rental/sydney',
    'eco-friendly-car-rental',
  ].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes]; // ,...blogRoutes
}
