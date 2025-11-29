import { createRootRoute, Outlet } from '@tanstack/react-router'
import { HelmetProvider } from 'react-helmet-async'

export const Route = createRootRoute({
  component: () => (
    <HelmetProvider>
      <Outlet />
    </HelmetProvider>
  ),
})

