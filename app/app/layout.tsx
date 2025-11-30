import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quickrest.kreativekorna.com';

export const metadata: Metadata = {
  title: 'API Testing Dashboard',
  description: 'Test and manage your API requests with QuickRest\'s powerful testing interface. Send requests, view responses, and organize your API testing workflow.',
  alternates: {
    canonical: `${siteUrl}/app`,
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'API Testing Dashboard | QuickRest',
    description: 'Test and manage your API requests with QuickRest\'s powerful testing interface.',
    url: `${siteUrl}/app`,
    siteName: 'QuickRest',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'API Testing Dashboard | QuickRest',
    description: 'Test and manage your API requests with QuickRest\'s powerful testing interface.',
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

