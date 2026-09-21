'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteWebsiteButton({ websiteId }: { websiteId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this website?')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/websites/${websiteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to delete website')
      }
    } catch {
      alert('Failed to delete website')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-xs text-rose-600 hover:text-rose-700 px-3 py-2 rounded-lg hover:bg-rose-50 font-medium transition-colors disabled:opacity-50"
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
