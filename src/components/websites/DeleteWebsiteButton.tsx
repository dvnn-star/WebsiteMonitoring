'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

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
      className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg text-xs px-2.5 py-2 font-medium transition-colors disabled:opacity-50"
      title="Delete Website"
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span>{deleting ? 'Deleting...' : 'Delete'}</span>
    </button>
  )
}
