import { MetadataRoute } from 'next';
import { getAllBlogSlugs } from '@/src/utils/blog';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quickrest.kreativekorna.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl;
  const currentDate = new Date().toISOString();

  const blogSlugs = getAllBlogSlugs();
  const blogUrls = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/app`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
  ];
}

