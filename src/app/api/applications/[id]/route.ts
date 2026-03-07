import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => getSupabase() as any

// PUT /api/applications/:id — update an application
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const { company, role, status, applied_date, url, notes } = body

  const { data, error } = await db()
    .from('applications')
    .update({ company, role, status, applied_date, url: url || null, notes: notes || null })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE /api/applications/:id — delete an application
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { error } = await db()
    .from('applications')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
