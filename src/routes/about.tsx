import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: () => (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">About</h1>
      <p className="mb-8 text-lg text-gray-600">
        This is an example about page.
      </p>
      <Link
        to="/"
        className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
      >
        Go Home
      </Link>
    </div>
  ),
})

