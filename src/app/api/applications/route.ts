import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = () => getSupabase() as any

// GET /api/applications — fetch all, optionally filter by status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let query = db().from('applications').select('*').order('applied_date', { ascending: false })

  if (status && status !== 'All') {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/applications — create a new application
export async function POST(request: Request) {
  const body = await request.json()
  const { company, role, status, applied_date, url, notes } = body

  if (!company || !role || !status || !applied_date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await db()
    .from('applications')
    .insert([{ company, role, status, applied_date, url: url || null, notes: notes || null }])
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
