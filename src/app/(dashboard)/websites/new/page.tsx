import { Metadata } from 'next'
import Link from 'next/link'
import { AddWebsiteForm } from '@/components/websites/AddWebsiteForm'

export const metadata: Metadata = {
  title: 'Add Website - Website Monitor',
}

export default function NewWebsitePage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-text-secondary hover:text-text-primary mb-6"
      >
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </Link>

      <div className="bg-bg-primary border border-border-light rounded-lg p-6">
        <h1 className="text-xl font-semibold text-text-primary mb-6">Add New Website</h1>
        <AddWebsiteForm />
      </div>
    </div>
  )
}
