import { createClient } from '@supabase/supabase-js'

export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected'

export interface Application {
  id: string
  company: string
  role: string
  status: ApplicationStatus
  applied_date: string
  url: string | null
  notes: string | null
  created_at: string
}

// Lazily create the client so the build doesn't fail without env vars
let _client: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return _client
}
