'use client'

import { useEffect, useState } from 'react'
import { Application, ApplicationStatus } from '@/lib/supabase'
import Dashboard from '@/components/Dashboard'
import StatusBadge from '@/components/StatusBadge'
import ApplicationForm from '@/components/ApplicationForm'

const STATUSES: (ApplicationStatus | 'All')[] = ['All', 'Applied', 'Interview', 'Offer', 'Rejected']

export default function Home() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filtered, setFiltered] = useState<Application[]>([])
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchApplications = async () => {
    setLoading(true)
    const res = await fetch('/api/applications')
    const data = await res.json()
    setApplications(data)
    setLoading(false)
  }

  useEffect(() => { fetchApplications() }, [])

  useEffect(() => {
    setFiltered(
      statusFilter === 'All'
        ? applications
        : applications.filter((a) => a.status === statusFilter)
    )
  }, [applications, statusFilter])

  const handleSave = async (form: Omit<Application, 'id' | 'created_at'>) => {
    const url = editing ? `/api/applications/${editing.id}` : '/api/applications'
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to save')
    }

    setShowForm(false)
    setEditing(null)
    fetchApplications()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/applications/${id}`, { method: 'DELETE' })
    setDeleteId(null)
    fetchApplications()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
            <p className="text-sm text-gray-500 mt-1">Track your job search in one place</p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Application
          </button>
        </div>

        {/* Dashboard */}
        <Dashboard applications={applications} />

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border hover:bg-gray-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <p className="text-center text-gray-400 py-12">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No applications yet. Add one!</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {['Company', 'Role', 'Status', 'Date Applied', 'Notes', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {app.url ? (
                        <a href={app.url} target="_blank" rel="noopener noreferrer"
                          className="hover:text-blue-600 hover:underline">{app.company}</a>
                      ) : app.company}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{app.role}</td>
                    <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(app.applied_date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{app.notes ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setEditing(app); setShowForm(true) }}
                          className="text-xs px-2 py-1 rounded border hover:bg-gray-100 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(app.id)}
                          className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {showForm && (
        <ApplicationForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold mb-2">Delete application?</h2>
            <p className="text-sm text-gray-500 mb-4">This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50 transition-colors"
              >Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
