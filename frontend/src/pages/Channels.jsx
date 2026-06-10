import { useEffect, useState } from 'react'
import { Users, Radio, ExternalLink, Flame, Clock } from 'lucide-react'
import { channelsApi } from '../api/client.js'
import { PageHeader, Card, CardSkeleton, ErrorState, Skeleton } from '../components/ui.jsx'

export default function Channels() {
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [active, setActive] = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      setChannels(await channelsApi.list())
    } catch (e) {
      setError(e.friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <PageHeader title="Top JEE Channels" subtitle="Track India’s most popular JEE educators" />

      {error && <ErrorState message={error} onRetry={load} />}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
          : channels.map((c) => (
              <Card key={c.id} className="flex flex-col">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                    {c.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{c.name}</h3>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <Users className="h-3 w-3" /> {c.subscribers} subscribers
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-slate-500">{c.description}</p>
                <button
                  onClick={() => setActive(active?.id === c.id ? null : c)}
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Radio className="h-4 w-4" /> {active?.id === c.id ? 'Hide Videos' : 'View Videos'}
                </button>
              </Card>
            ))}
      </div>

      {active && <ChannelVideos channel={active} />}
    </div>
  )
}

function ChannelVideos({ channel }) {
  const [latest, setLatest] = useState(null)
  const [popular, setPopular] = useState(null)

  useEffect(() => {
    setLatest(null)
    setPopular(null)
    channelsApi.videos(channel.id, 'date').then(setLatest).catch(() => setLatest([]))
    channelsApi.videos(channel.id, 'viewCount').then(setPopular).catch(() => setPopular([]))
  }, [channel.id])

  return (
    <div className="mt-8 animate-fade-in">
      <h2 className="mb-4 text-lg font-bold">{channel.name}</h2>
      <VideoRow title="Latest Videos" icon={Clock} videos={latest} />
      <VideoRow title="Most Viewed JEE Videos" icon={Flame} videos={popular} />
    </div>
  )
}

function VideoRow({ title, icon: Icon, videos }) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 flex items-center gap-2 font-semibold">
        <Icon className="h-4 w-4 text-blue-500" /> {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos === null
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i}><Skeleton className="aspect-video w-full rounded-xl" /><Skeleton className="mt-2 h-4 w-3/4" /></div>
            ))
          : videos.map((v) => (
              <a
                key={v.video_id}
                href={`https://www.youtube.com/watch?v=${v.video_id}`}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    loading="lazy"
                    className="aspect-video w-full object-cover"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/480x270?text=Video' }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
                    <ExternalLink className="h-7 w-7 text-white" />
                  </span>
                </div>
                <p className="line-clamp-2 p-3 text-sm font-medium">{v.title}</p>
              </a>
            ))}
      </div>
    </div>
  )
}
