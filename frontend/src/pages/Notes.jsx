import { useEffect, useState } from 'react'
import { Plus, Search, Trash2, StickyNote, X } from 'lucide-react'
import { notesApi } from '../api/client.js'
import { SUBJECTS, SUBJECT_KEYS } from '../data/constants.js'
import { PageHeader, Card, EmptyState, ErrorState, Skeleton } from '../components/ui.jsx'

export default function Notes() {
  const [notes, setNotes] = useState(null)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject: 'physics', chapter: '', title: '', content: '' })

  const load = async () => {
    setError(null)
    try {
      setNotes(await notesApi.list(filter || undefined, search || undefined))
    } catch (e) {
      setError(e.friendlyMessage)
    }
  }

  useEffect(() => {
    const t = setTimeout(load, 250) // debounce search
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filter])

  const create = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    try {
      await notesApi.create(form)
      setForm({ subject: 'physics', chapter: '', title: '', content: '' })
      setShowForm(false)
      load()
    } catch (err) {
      setError(err.friendlyMessage)
    }
  }

  const remove = async (id) => {
    try {
      await notesApi.remove(id)
      load()
    } catch { /* ignore */ }
  }

  return (
    <div>
      <PageHeader
        title="Quick Revision Notes"
        subtitle="Jot down key formulas and concepts"
        action={
          <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Close' : 'New Note'}
          </button>
        }
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {showForm && (
        <Card className="mb-6 animate-fade-in">
          <form onSubmit={create} className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              >
                {SUBJECT_KEYS.map((k) => <option key={k} value={k}>{SUBJECTS[k].name}</option>)}
              </select>
              <input
                value={form.chapter}
                onChange={(e) => setForm({ ...form, chapter: e.target.value })}
                placeholder="Chapter / tag"
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
              />
            </div>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Note title"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Write your note…"
              rows={4}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900"
            />
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700">Save Note</button>
          </form>
        </Card>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="">All subjects</option>
          {SUBJECT_KEYS.map((k) => <option key={k} value={k}>{SUBJECTS[k].name}</option>)}
        </select>
      </div>

      {notes === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      ) : notes.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n) => {
            const meta = SUBJECTS[n.subject]
            return (
              <div
                key={n.id}
                className="group relative rounded-2xl border-l-4 bg-white p-4 shadow-sm dark:bg-slate-900"
                style={{ borderColor: meta?.color }}
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: meta?.color }}>
                    {meta?.name}{n.chapter ? ` · ${n.chapter}` : ''}
                  </span>
                  <button onClick={() => remove(n.id)} className="text-slate-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="mt-2 font-semibold">{n.title}</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{n.content}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <EmptyState icon={StickyNote} title="No notes found" subtitle="Create your first revision note above." />
      )}
    </div>
  )
}
