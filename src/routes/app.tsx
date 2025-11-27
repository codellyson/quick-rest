import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../components/layout/app-layout'
import { SEOHead } from '../components/seo/seo-head'

export const Route = createFileRoute('/app')({
  component: () => (
    <>
      <SEOHead
        title="API Testing Dashboard"
        description="Test and manage your API requests with QuickRest's powerful testing interface."
        canonicalUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
      <AppLayout />
    </>
  ),
})
