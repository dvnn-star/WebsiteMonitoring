import { Metadata } from 'next'
import Link from 'next/link'
import { AddWebsiteForm } from '@/components/websites/AddWebsiteForm'
import { ArrowLeft, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Add Website - Website Monitor',
}

export default function NewWebsitePage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-7 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Add New Website</h1>
            <p className="text-xs text-slate-500">Configure target URL for technical & SEO monitoring.</p>
          </div>
        </div>

        <AddWebsiteForm />
      </div>
    </div>
  )
}
