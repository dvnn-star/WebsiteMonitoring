import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { executeAudit } from '@/lib/audit/engine'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const { data: audit, error } = await supabase
    .from('audits')
    .select(`
      *,
      results:audit_results(*),
      websites(id, url)
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !audit) {
    return NextResponse.json({ error: error?.message || 'Audit not found' }, { status: 404 })
  }

  // If audit is still in queued status when requested, run it on-demand to guarantee it finishes
  if (audit.status === 'queued') {
    const websiteData = audit.websites as unknown as { id: string; url: string } | { id: string; url: string }[] | null
    const websiteObj = Array.isArray(websiteData) ? websiteData[0] : websiteData
    const websiteUrl = websiteObj?.url

    if (websiteUrl) {
      try {
        await executeAudit(supabase, audit.id, websiteUrl, audit.website_id)

        const { data: updatedAudit } = await supabase
          .from('audits')
          .select(`
            *,
            results:audit_results(*)
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single()

        if (updatedAudit) {
          return NextResponse.json({ audit: updatedAudit })
        }
      } catch (err) {
        console.error('On-demand audit execution failed:', err)
      }
    }
  }

  return NextResponse.json({ audit })
}
