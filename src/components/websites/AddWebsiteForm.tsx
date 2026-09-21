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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-text-primary mb-1">
          Website URL
        </label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          disabled={loading}
          className="w-full px-3 py-2 border border-border-medium rounded-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-bg-secondary disabled:cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
          Website Name (optional)
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Portfolio"
          disabled={loading}
          className="w-full px-3 py-2 border border-border-medium rounded-md text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent disabled:bg-bg-secondary disabled:cursor-not-allowed"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-status-error text-status-error text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-border-light rounded-md text-text-primary hover:bg-bg-secondary disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-accent text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Website'}
        </button>
      </div>
    </form>
  )
}
