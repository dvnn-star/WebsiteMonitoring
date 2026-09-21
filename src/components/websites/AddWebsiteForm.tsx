'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AddWebsiteForm() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    let normalizedUrl = url.trim()
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    try {
      new URL(normalizedUrl)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl, name: name.trim() || undefined }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to add website')
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Failed to add website')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label htmlFor="url" className="block text-sm font-medium text-slate-800">
          Website URL <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          disabled={loading}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-slate-500">
          Enter the full domain or URL to audit (e.g. example.com or https://mywebsite.org).
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-slate-800">
          Website Name (optional)
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Company Portal"
          disabled={loading}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 disabled:bg-slate-50 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-slate-500">
          An optional friendly display name for your dashboard.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-lg">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Website'}
        </button>
      </div>
    </form>
  )
}
