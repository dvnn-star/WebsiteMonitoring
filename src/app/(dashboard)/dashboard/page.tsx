import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dashboard - Website Monitor',
  description: 'Manage your websites',
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <header className="bg-bg-primary border-b border-border-light">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-semibold text-text-primary">
            Website Monitor
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-text-secondary text-sm">user@example.com</span>
            <Link
              href="/login"
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-text-primary">My Websites</h1>
          <Link
            href="/dashboard/websites/new"
            className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Add Website
          </Link>
        </div>

        {/* Empty State */}
        <div className="bg-bg-primary border border-border-light rounded-lg p-12 text-center">
          <div className="text-text-secondary mb-4">
            <svg
              className="mx-auto h-12 w-12 text-text-tertiary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">
            No websites yet
          </h3>
          <p className="text-text-secondary mb-4">
            Add your first website to start monitoring.
          </p>
          <Link
            href="/dashboard/websites/new"
            className="inline-flex items-center bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            Add Website
          </Link>
        </div>
      </main>
    </div>
  )
}
