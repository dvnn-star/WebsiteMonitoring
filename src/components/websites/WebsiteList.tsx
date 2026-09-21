import Link from 'next/link'
import { Website } from '@/types'
import { WebsiteCard } from './WebsiteCard'

export function WebsiteList({ websites }: { websites: Website[] }) {
  if (websites.length === 0) {
    return (
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
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {websites.map((website) => (
        <WebsiteCard key={website.id} website={website} />
      ))}
    </div>
  )
}
