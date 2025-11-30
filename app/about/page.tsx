import Link from 'next/link';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quickrest.kreativekorna.com';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about QuickRest, the elegant API testing companion. Built by KreativeKorna Concepts for developers who want to test APIs without the bloat.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'About QuickRest',
    description: 'Learn more about QuickRest, the elegant API testing companion. Built by KreativeKorna Concepts for developers who want to test APIs without the bloat.',
    url: `${siteUrl}/about`,
    siteName: 'QuickRest',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'About QuickRest',
    description: 'Learn more about QuickRest, the elegant API testing companion.',
  },
};

export default function About() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">About</h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 max-w-2xl text-center">
        QuickRest is a modern API testing tool built for developers who want a fast, powerful, and straightforward way to test APIs without the bloat. Created by KreativeKorna Concepts.
      </p>
      <Link
        href="/"
        className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
      >
        Go Home
      </Link>
    </div>
  );
}

