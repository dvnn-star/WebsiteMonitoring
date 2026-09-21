import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { WebsiteList } from '@/components/websites/WebsiteList'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: websites } = await supabase
    .from('websites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-text-primary">My Websites</h1>
        <Link
          href="/dashboard/websites/new"
          className="bg-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Add Website
        </Link>
      </div>

      <WebsiteList websites={websites || []} />
    </div>
  )
}
