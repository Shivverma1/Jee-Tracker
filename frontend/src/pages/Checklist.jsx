import { useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { progressApi } from '../api/client.js'
import { SUBJECTS, SUBJECT_KEYS, CHAPTER_STATUS, STATUS_ORDER } from '../data/constants.js'
import { PageHeader, Card, Skeleton, ErrorState, ProgressBar } from '../components/ui.jsx'

export default function Checklist() {
  const [chapters, setChapters] = useState(null)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState('physics')

  const load = async () => {
    setError(null)
    try {
      setChapters(await progressApi.chapters())
    } catch (e) {
      setError(e.friendlyMessage)
    }
  }

  useEffect(() => { load() }, [])

  const setStatus = async (subject, chapter, status) => {
    // Optimistic update.
    setChapters((prev) => ({
      ...prev,
      [subject]: prev[subject].map((c) => (c.chapter === chapter ? { ...c, status } : c)),
    }))
    try {
      await progressApi.setChapter(subject, chapter, status)
    } catch {
      load() // revert on failure
    }
  }

  return (
    <div>
      <PageHeader title="Chapter Checklist" subtitle="Track every JEE chapter across all subjects" />

      {error && <ErrorState message={error} onRetry={load} />}

      <div className="mb-5 flex flex-wrap gap-3 text-xs">
        {STATUS_ORDER.map((s) => (
          <span key={s} className={`rounded-full px-2.5 py-1 font-medium ${CHAPTER_STATUS[s].color}`}>
            {CHAPTER_STATUS[s].label}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {SUBJECT_KEYS.map((subject) => (
          <SubjectGroup
            key={subject}
            subject={subject}
            chapters={chapters?.[subject]}
            open={open === subject}
            onToggle={() => setOpen(open === subject ? null : subject)}
            onSetStatus={setStatus}
          />
        ))}
      </div>
    </div>
  )
}

function SubjectGroup({ subject, chapters, open, onToggle, onSetStatus }) {
  const meta = SUBJECTS[subject]
  const pct = useMemo(() => {
    if (!chapters?.length) return 0
    const done = chapters.filter((c) => c.status === 'completed').length
    return Math.round((done / chapters.length) * 100)
  }, [chapters])

  return (
    <Card className="p-0">
      <button onClick={onToggle} className="flex w-full items-center gap-4 p-5 text-left">
        <span className="h-10 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{meta.name}</h2>
            <span className="text-sm text-slate-500">
              {chapters ? `${chapters.filter((c) => c.status === 'completed').length}/${chapters.length}` : ''} · {pct}%
            </span>
          </div>
          <div className="mt-2"><ProgressBar value={pct} color={meta.color} /></div>
        </div>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          {!chapters ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <ul className="space-y-2">
              {chapters.map((c) => (
                <li key={c.chapter} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-2.5 dark:bg-slate-800/50">
                  <span className="text-sm font-medium">{c.chapter}</span>
                  <select
                    value={c.status}
                    onChange={(e) => onSetStatus(subject, c.chapter, e.target.value)}
                    className={`rounded-lg border-none px-2.5 py-1 text-xs font-medium outline-none ${CHAPTER_STATUS[c.status].color}`}
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                        {CHAPTER_STATUS[s].label}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  )
}
