import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Flame, BookOpen, Target, Download, Share2, ArrowRight } from 'lucide-react'
import { progressApi, statsApi } from '../api/client.js'
import { Card, ProgressBar, Skeleton, ErrorState } from '../components/ui.jsx'
import ExamCountdown from '../components/ExamCountdown.jsx'
import PomodoroTimer from '../components/PomodoroTimer.jsx'
import MotivationalQuote from '../components/MotivationalQuote.jsx'
import useLocalStorage from '../hooks/useLocalStorage.js'
import { exportProgressPDF, shareOnWhatsApp } from '../utils/share.js'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [goal, setGoal] = useLocalStorage('jee-daily-goal', 360) // minutes

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, st] = await Promise.all([progressApi.summary(), statsApi.dashboard()])
      setSummary(s)
      setStats(st)
      // Cache for offline access.
      localStorage.setItem('jee-cache-summary', JSON.stringify(s))
      localStorage.setItem('jee-cache-stats', JSON.stringify(st))
    } catch (e) {
      const cs = localStorage.getItem('jee-cache-summary')
      const cst = localStorage.getItem('jee-cache-stats')
      if (cs && cst) {
        setSummary(JSON.parse(cs))
        setStats(JSON.parse(cst))
      } else {
        setError(e.friendlyMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const goalPct = stats ? Math.min(100, Math.round((stats.today_minutes / goal) * 100)) : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back 👋</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Here’s your study overview for today.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportProgressPDF({ summary, stats })}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium dark:border-slate-700"
          >
            <Download className="h-4 w-4" /> PDF
          </button>
          <button
            onClick={() => shareOnWhatsApp({ summary, stats })}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={load} />}

      <MotivationalQuote />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard loading={loading} icon={Clock} label="Hours Today" value={stats ? `${stats.today_hours}h` : '—'} color="bg-blue-500" />
        <StatCard loading={loading} icon={Flame} label="Day Streak" value={stats ? `${stats.streak}` : '—'} color="bg-orange-500" />
        <StatCard loading={loading} icon={BookOpen} label="Topics / Week" value={stats ? `${stats.topics_this_week}` : '—'} color="bg-emerald-500" />
        <StatCard loading={loading} icon={Target} label="Weekly Hours" value={stats ? `${stats.week_hours}h` : '—'} color="bg-purple-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Subject progress */}
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Subject Progress</h2>
            <Link to="/checklist" className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline">
              Chapters <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-5">
            {loading && !summary
              ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-12 w-full" />)
              : summary?.map((s) => (
                  <div key={s.subject}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-slate-500">{s.completed}/{s.total} · {s.percentage}%</span>
                    </div>
                    <ProgressBar value={s.percentage} color={s.color} />
                  </div>
                ))}
          </div>

          {/* Daily goal tracker */}
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium">Daily Study Goal</span>
              <span className="text-slate-500">{stats?.today_minutes || 0} / {goal} min · {goalPct}%</span>
            </div>
            <ProgressBar value={goalPct} color="#8B5CF6" />
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              Goal:
              <input
                type="range" min="60" max="720" step="30" value={goal}
                onChange={(e) => setGoal(Number(e.target.value))}
                className="flex-1 accent-purple-500"
              />
              {Math.round(goal / 60)}h
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <ExamCountdown />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PomodoroTimer onSessionComplete={load} />
        </div>
        <Card className="lg:col-span-2">
          <h2 className="mb-4 font-semibold">Quick Links</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <QuickLink to="/videos" label="Find Videos" />
            <QuickLink to="/channels" label="Top Channels" />
            <QuickLink to="/stats" label="View Stats" />
            <QuickLink to="/checklist" label="Chapters" />
            <QuickLink to="/notes" label="My Notes" />
          </div>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <Card className="flex items-center gap-3">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        {loading ? <Skeleton className="mt-1 h-6 w-12" /> : <p className="text-xl font-bold">{value}</p>}
      </div>
    </Card>
  )
}

function QuickLink({ to, label }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-slate-800"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  )
}
