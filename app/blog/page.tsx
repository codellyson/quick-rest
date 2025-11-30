import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllBlogPosts } from '@/src/utils/blog';
import { Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quickrest.kreativekorna.com';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Learn about API testing, development best practices, and how to get the most out of QuickRest.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'QuickRest Blog',
    description: 'Learn about API testing, development best practices, and how to get the most out of QuickRest.',
    url: `${siteUrl}/blog`,
    siteName: 'QuickRest',
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              ← Back to Home
            </Button>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Blog
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Learn about API testing, development best practices, and how to get the most out of QuickRest.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-zinc-600 dark:text-zinc-400">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  {post.readTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  )}
                </div>

                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
                  {post.description}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link href={`/blog/${post.slug}`}>
                  <Button variant="secondary" size="sm">
                    Read more
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

