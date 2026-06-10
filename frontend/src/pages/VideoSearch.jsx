import { useEffect, useState } from 'react'
import { Search, Youtube } from 'lucide-react'
import { videosApi } from '../api/client.js'
import { SUBJECTS, SUBJECT_KEYS } from '../data/constants.js'
import { PageHeader, CardSkeleton, EmptyState, ErrorState } from '../components/ui.jsx'
import VideoCard from '../components/VideoCard.jsx'

export default function VideoSearch() {
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('physics')
  const [results, setResults] = useState([])
  const [saved, setSaved] = useState([])
  const [tab, setTab] = useState('search') // 'search' | 'saved'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadSaved = async () => {
    try {
      setSaved(await videosApi.listSaved())
    } catch { /* ignore */ }
  }

  useEffect(() => { loadSaved() }, [])

  const search = async (e) => {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setTab('search')
    try {
      setResults(await videosApi.search(query, subject))
    } catch (err) {
      setError(err.friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  const savedIds = new Set(saved.map((v) => v.video_id))

  const handleSave = async (video) => {
    try {
      await videosApi.save({ ...video, subject })
      loadSaved()
    } catch { /* ignore */ }
  }

  const updateSaved = async (id, data) => {
    try {
      await videosApi.update(id, data)
      loadSaved()
    } catch { /* ignore */ }
  }

  const removeSaved = async (id) => {
    try {
      await videosApi.remove(id)
      loadSaved()
    } catch { /* ignore */ }
  }

  return (
    <div>
      <PageHeader title="Video Search" subtitle="Find and save JEE lectures from YouTube" />

      <form onSubmit={search} className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Rotational Motion, Thermodynamics, Integration…"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 outline-none dark:border-slate-700 dark:bg-slate-900"
        >
          {SUBJECT_KEYS.map((k) => (
            <option key={k} value={k}>{SUBJECTS[k].name}</option>
          ))}
        </select>
        <button type="submit" className="rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700">
          Search
        </button>
      </form>

      <div className="mb-5 flex gap-2">
        <Tab active={tab === 'search'} onClick={() => setTab('search')}>Results</Tab>
        <Tab active={tab === 'saved'} onClick={() => setTab('saved')}>My Playlist ({saved.length})</Tab>
      </div>

      {error && <ErrorState message={error} onRetry={search} />}

      {tab === 'search' && (
        loading ? (
          <Grid>{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</Grid>
        ) : results.length ? (
          <Grid>
            {results.map((v) => (
              <VideoCard
                key={v.video_id}
                video={{ ...v, subject }}
                saved={savedIds.has(v.video_id)}
                onSave={() => handleSave(v)}
              />
            ))}
          </Grid>
        ) : (
          <EmptyState icon={Youtube} title="Search for JEE videos" subtitle="Try a topic name and pick a subject above." />
        )
      )}

      {tab === 'saved' && (
        saved.length ? (
          <Grid>
            {saved.map((v) => (
              <VideoCard
                key={v.id}
                video={v}
                saved
                onToggleWatched={() => updateSaved(v.id, { watched: !v.watched })}
                onRate={(n) => updateSaved(v.id, { rating: n })}
                onRemove={() => removeSaved(v.id)}
              />
            ))}
          </Grid>
        ) : (
          <EmptyState icon={Youtube} title="No saved videos yet" subtitle="Save videos from the Results tab to build your playlist." />
        )
      )}
    </div>
  )
}

function Grid({ children }) {
  return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
}

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      {children}
    </button>
  )
}
