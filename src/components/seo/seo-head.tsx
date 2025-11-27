import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

export const SEOHead = ({
  title = "QuickRest - Your elegant API testing companion",
  description = "Test and analyze your APIs with AI-powered insights and a beautiful, intuitive interface. Fast, powerful, and organized API testing tool.",
  keywords = "API testing, REST API, HTTP client, API development, API testing tool, Postman alternative",
  ogImage = "/og-image.png",
  ogType = "website",
  canonicalUrl,
}: SEOHeadProps) => {
  const fullTitle = title.includes("QuickRest") ? title : `${title} | QuickRest`;
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";
  const canonical = canonicalUrl || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="QuickRest" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`} />

      <meta name="robots" content="index, follow" />
      <meta name="author" content="KreativeKorna Concepts" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Helmet>
  );
};

