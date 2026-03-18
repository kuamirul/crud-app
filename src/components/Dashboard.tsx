import { Application, ApplicationStatus } from '@/lib/supabase'

const statuses: ApplicationStatus[] = ['Applied', 'Interview', 'Offer', 'Rejected']

const colours: Record<ApplicationStatus, string> = {
  Applied: 'border-blue-400 text-blue-700',
  Interview: 'border-yellow-400 text-yellow-700',
  Offer: 'border-green-400 text-green-700',
  Rejected: 'border-red-400 text-red-700',
}

export default function Dashboard({ applications }: { applications: Application[] }) {
  const counts = statuses.reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s).length
    return acc
  }, {} as Record<ApplicationStatus, number>)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {statuses.map((s) => (
        <div key={s} className={`border-l-4 bg-white rounded-lg p-4 shadow-sm ${colours[s]}`}>
          <p className="text-2xl font-bold">{counts[s]}</p>
          <p className="text-sm text-gray-500 mt-1">{s}</p>
        </div>
      ))}
    </div>
  )
}
