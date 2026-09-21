import Link from 'next/link'
import { Website } from '@/types'
import { WebsiteCard } from './WebsiteCard'
import { Globe, Plus } from 'lucide-react'

export function WebsiteList({ websites }: { websites: Website[] }) {
  if (websites.length === 0) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm max-w-lg mx-auto my-6">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
          <Globe className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1.5">
          No websites yet
        </h3>
        <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
          Add your first website to start monitoring. You can run automated audits and track SEO, SSL, and performance.
        </p>
        <Link
          href="/dashboard/websites/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Website</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {websites.map((website) => (
        <WebsiteCard key={website.id} website={website} />
      ))}
    </div>
  )
}
