import { ApplicationStatus } from '@/lib/supabase'

const colours: Record<ApplicationStatus, string> = {
  Applied: 'bg-blue-100 text-blue-800',
  Interview: 'bg-yellow-100 text-yellow-800',
  Offer: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
}

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colours[status]}`}>
      {status}
    </span>
  )
}
