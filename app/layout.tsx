import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quickrest.kreativekorna.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'QuickRest - Your elegant API testing companion',
    template: '%s | QuickRest',
  },
  description: 'Test and analyze your APIs with AI-powered insights and a beautiful, intuitive interface. Fast, powerful, and organized API testing tool.',
  keywords: ['API testing', 'REST API', 'HTTP client', 'API development', 'API testing tool', 'Postman alternative', 'API client', 'HTTP request', 'API debugger'],
  authors: [{ name: 'KreativeKorna Concepts', url: 'https://kreativekorna.com' }],
  creator: 'KreativeKorna Concepts',
  publisher: 'KreativeKorna Concepts',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'QuickRest',
    title: 'QuickRest - Your elegant API testing companion',
    description: 'Test and analyze your APIs with AI-powered insights and a beautiful, intuitive interface. Fast, powerful, and organized API testing tool.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'QuickRest - API Testing Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickRest - Your elegant API testing companion',
    description: 'Test and analyze your APIs with AI-powered insights and a beautiful, intuitive interface.',
    creator: '@kreativekorna',
    images: [`${siteUrl}/og-image.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'developer tools',
  classification: 'API Testing Tool',
  themeColor: '#18181b',
  colorScheme: 'dark light',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="QuickRest" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="QuickRest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function (c, l, a, r, i, t, y) {
                c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
                t = l.createElement(r);
                t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
              })(window, document, "clarity", "script", "ucjjekgxtr");
            `,
          }}
        />
      </body>
    </html>
  );
}

