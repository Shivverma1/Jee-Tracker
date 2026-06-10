import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { Plus, Clock, Flame, BookOpen, Target } from 'lucide-react'
import { statsApi } from '../api/client.js'
import { SUBJECTS, SUBJECT_KEYS } from '../data/constants.js'
import { PageHeader, Card, Skeleton, ErrorState } from '../components/ui.jsx'

export default function Stats() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ subject: 'physics', minutes: 30, topic: '' })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await statsApi.dashboard())
    } catch (e) {
      setError(e.friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const logSession = async (e) => {
    e.preventDefault()
    try {
      await statsApi.logSession({ ...form, minutes: Number(form.minutes) })
      setForm({ ...form, topic: '' })
      load()
    } catch (err) {
      setError(err.friendlyMessage)
    }
  }

  const pieData = (data?.distribution || []).filter((d) => d.minutes > 0)
  const hasDistribution = pieData.length > 0

  return (
    <div>
      <PageHeader title="Study Stats" subtitle="Track your time, streaks and focus" />

      {error && <ErrorState message={error} onRetry={load} />}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat icon={Clock} label="Hours Today" value={data ? `${data.today_hours}h` : '—'} loading={loading} color="bg-blue-500" />
        <Stat icon={Flame} label="Day Streak" value={data ? data.streak : '—'} loading={loading} color="bg-orange-500" />
        <Stat icon={BookOpen} label="Topics / Week" value={data ? data.topics_this_week : '—'} loading={loading} color="bg-emerald-500" />
        <Stat icon={Target} label="Weekly Hours" value={data ? `${data.week_hours}h` : '—'} loading={loading} color="bg-purple-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subject distribution pie */}
        <Card>
          <h2 className="mb-4 font-semibold">Subject Time Distribution (this week)</h2>
          {loading ? (
            <Skeleton className="mx-auto h-56 w-56 rounded-full" />
          ) : hasDistribution ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="minutes" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => `${e.name}: ${e.minutes}m`}>
                  {pieData.map((entry) => <Cell key={entry.subject} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v} min`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-16 text-center text-sm text-slate-400">No study time logged this week yet.</p>
          )}
        </Card>

        {/* Weekly bar chart */}
        <Card>
          <h2 className="mb-4 font-semibold">Last 7 Days (minutes)</h2>
          {loading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data?.weekly || []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `${v} min`} />
                <Bar dataKey="minutes" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Log a session */}
      <Card className="mt-6">
        <h2 className="mb-4 font-semibold">Log a Study Session</h2>
        <form onSubmit={logSession} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1 text-sm">
            Subject
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            >
              {SUBJECT_KEYS.map((k) => <option key={k} value={k}>{SUBJECTS[k].name}</option>)}
            </select>
          </label>
          <label className="text-sm sm:w-32">
            Minutes
            <input
              type="number" min="1" value={form.minutes}
              onChange={(e) => setForm({ ...form, minutes: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <label className="flex-1 text-sm">
            Topic (optional)
            <input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              placeholder="e.g. Kinematics"
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
          </label>
          <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" /> Log
          </button>
        </form>
      </Card>
    </div>
  )
}

function Stat({ icon: Icon, label, value, color, loading }) {
  return (
    <Card className="flex items-center gap-3">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        {loading ? <Skeleton className="mt-1 h-6 w-12" /> : <p className="text-xl font-bold">{value}</p>}
      </div>
    </Card>
  )
}
