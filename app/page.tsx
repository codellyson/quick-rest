import { LandingPage } from '@/src/components/layout/landing-page';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quickrest.kreativekorna.com';

export const metadata: Metadata = {
  title: 'QuickRest - Your elegant API testing companion',
  description: 'Test and analyze your APIs with AI-powered insights and a beautiful, intuitive interface. Fast, powerful, and organized API testing tool.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'QuickRest - Your elegant API testing companion',
    description: 'Test and analyze your APIs with AI-powered insights and a beautiful, intuitive interface. Fast, powerful, and organized API testing tool.',
    url: siteUrl,
    siteName: 'QuickRest',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'QuickRest - API Testing Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickRest - Your elegant API testing companion',
    description: 'Test and analyze your APIs with AI-powered insights and a beautiful, intuitive interface.',
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'QuickRest',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Test and analyze your APIs with AI-powered insights and a beautiful, intuitive interface. Fast, powerful, and organized API testing tool.',
    url: siteUrl,
    author: {
      '@type': 'Organization',
      name: 'KreativeKorna Concepts',
      url: 'https://kreativekorna.com',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
    featureList: [
      'Fast API testing',
      'Organized collections',
      'Environment variables',
      'Request history',
      'Beautiful interface',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LandingPage />
    </>
  );
}

