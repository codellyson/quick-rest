import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '../components/layout/landing-page'

export const Route = createFileRoute('/')({
  component: () => <LandingPage />,
})

