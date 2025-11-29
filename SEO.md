# SEO Setup Guide for QuickRest

This document outlines the SEO optimizations implemented for the QuickRest Vite application.

## What's Implemented

### 1. **Dynamic Meta Tags** (react-helmet-async)

- Route-specific titles and descriptions
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs

### 2. **Base HTML Meta Tags** (index.html)

- Primary meta tags (title, description, keywords)
- Open Graph tags
- Twitter Card tags
- Theme colors
- Author information

### 3. **SEO Component** (`src/components/seo/seo-head.tsx`)

Reusable component for managing meta tags per route:

```tsx
<SEOHead
  title="Page Title"
  description="Page description"
  keywords="keyword1, keyword2"
  canonicalUrl="https://yourdomain.com/page"
/>
```

### 4. **robots.txt** (`public/robots.txt`)

- Allows all search engines
- Points to sitemap

### 5. **sitemap.xml** (`public/sitemap.xml`)

- Lists all important pages
- Update `yourdomain.com` with your actual domain

## Usage

### Adding SEO to a Route

```tsx
import { SEOHead } from "../components/seo/seo-head";

export const Route = createFileRoute("/your-route")({
  component: () => (
    <>
      <SEOHead
        title="Your Page Title"
        description="Your page description"
        canonicalUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
      <YourComponent />
    </>
  ),
});
```

## Next Steps for Better SEO

### 1. **Server-Side Rendering (SSR)**

For true SEO, consider SSR:

- **Vite SSR**: Use `vite-plugin-ssr` or similar
- **TanStack Start**: TanStack Router's SSR solution
- **Remix/Next.js**: Full-stack frameworks with built-in SSR

### 2. **Static Site Generation (SSG)**

For pre-rendering:

- Use `vite-plugin-ssg` or `vite-plugin-prerender`
- Pre-render landing pages and static routes

### 3. **Structured Data (JSON-LD)**

Add structured data for rich snippets:

```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "QuickRest",
    description: "API testing tool",
    // ...
  })}
</script>
```

### 4. **Update sitemap.xml**

- Replace `yourdomain.com` with your actual domain
- Add all important routes
- Set correct lastmod dates
- Consider dynamic sitemap generation

### 5. **Performance Optimization**

- Image optimization (WebP, lazy loading)
- Code splitting
- Preload critical resources
- Minimize JavaScript bundle size

### 6. **Analytics**

- Google Analytics
- Google Search Console
- Track page views and user behavior

### 7. **Social Media Images**

- Create `/public/og-image.png` (1200x630px)
- Add Twitter card image
- Ensure images are optimized

## Current Limitations

As a **Client-Side Rendered (CSR)** SPA:

- Search engines may have difficulty indexing dynamic content
- Initial page load shows minimal content
- JavaScript must execute for content to appear

## Recommendations

1. **For Production**: Consider SSR/SSG for better SEO
2. **For MVP**: Current setup is good for social sharing and basic SEO
3. **Monitor**: Use Google Search Console to track indexing
4. **Test**: Use tools like:
   - Google Rich Results Test
   - Facebook Sharing Debugger
   - Twitter Card Validator

## Files Modified/Created

- ✅ `src/routes/__root.tsx` - Added HelmetProvider
- ✅ `src/components/seo/seo-head.tsx` - SEO component
- ✅ `index.html` - Enhanced base meta tags
- ✅ `public/robots.txt` - Search engine directives
- ✅ `public/sitemap.xml` - Site structure
- ✅ Route components - Added SEOHead usage
