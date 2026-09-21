import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { websiteIdSchema } from '@/lib/validation/schemas'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  
  const idValidation = websiteIdSchema.safeParse(id)
  if (!idValidation.success) {
    return NextResponse.json({ error: 'Invalid website ID format' }, { status: 400 })
  }

  const { error } = await supabase
    .from('websites')
    .delete()
    .eq('id', idValidation.data)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

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
  
  const idValidation = websiteIdSchema.safeParse(id)
  if (!idValidation.success) {
    return NextResponse.json({ error: 'Invalid website ID format' }, { status: 400 })
  }

  const { data: website, error } = await supabase
    .from('websites')
    .select('id, url, domain, name, created_at, is_active, last_audit_at')
    .eq('id', idValidation.data)
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json({ website })
}
