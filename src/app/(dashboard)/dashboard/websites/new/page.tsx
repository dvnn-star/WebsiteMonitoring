import { Metadata } from 'next'
import Link from 'next/link'
import { AddWebsiteForm } from '@/components/websites/AddWebsiteForm'

export const metadata: Metadata = {
  title: 'Add Website - Website Monitor',
}

export default function NewWebsitePage() {
  return (
    <div className="w-full px-6 sm:px-10 lg:px-14 py-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6 pb-4 border-b border-slate-100">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Add New Website</h1>
            <p className="text-xs text-slate-500 mt-1">
              Add a target website to monitor availability, SEO on-page, SSL, and performance.
            </p>
          </div>

          <AddWebsiteForm />
        </div>
      </div>
    </div>
  )
}
