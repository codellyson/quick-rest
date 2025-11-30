import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getBlogPost, getBlogPostWithHtml, getAllBlogSlugs } from '@/src/utils/blog';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quickrest.kreativekorna.com';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${siteUrl}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${slug}`,
      siteName: 'QuickRest',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostWithHtml(slug);

  if (!post) {
    notFound();
  }

  const publishDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.date}>{publishDate}</time>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div
          className="prose prose-zinc dark:prose-invert max-w-none prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-p:text-zinc-700 dark:prose-p:text-zinc-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100 prose-ul:text-zinc-700 dark:prose-ul:text-zinc-300 prose-li:text-zinc-700 dark:prose-li:text-zinc-300"
          dangerouslySetInnerHTML={{ __html: post.contentHtml || '' }}
        />

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Link href="/app">
              <Button variant="primary" size="lg">
                Try QuickRest Now
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="secondary" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

