import { Star, Check, Bookmark, Trash2, ExternalLink } from 'lucide-react'
import { SUBJECTS } from '../data/constants.js'

export default function VideoCard({ video, saved, onSave, onToggleWatched, onRate, onRemove }) {
  const subjectMeta = SUBJECTS[video.subject]
  const url = `https://www.youtube.com/watch?v=${video.video_id}`

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <a href={url} target="_blank" rel="noreferrer" className="relative block">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="aspect-video w-full object-cover"
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/480x270?text=Video' }}
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
          <ExternalLink className="h-8 w-8 text-white" />
        </span>
        {video.watched && (
          <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-medium text-white">
            <Check className="h-3 w-3" /> Watched
          </span>
        )}
      </a>

      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold" title={video.title}>{video.title}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {video.channel}{video.view_count ? ` · ${video.view_count} views` : ''}
        </p>

        {subjectMeta && (
          <span className="mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: subjectMeta.color }}>
            {subjectMeta.name}
          </span>
        )}

        <div className="mt-3 flex items-center justify-between">
          {saved ? (
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => onRate(n)} aria-label={`Rate ${n}`}>
                    <Star className={`h-4 w-4 ${n <= (video.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                  </button>
                ))}
              </div>
            </div>
          ) : <span />}

          <div className="flex items-center gap-2">
            {saved ? (
              <>
                <button
                  onClick={onToggleWatched}
                  className={`rounded-lg p-1.5 ${video.watched ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}
                  title="Toggle watched"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button onClick={onRemove} className="rounded-lg bg-red-50 p-1.5 text-red-500 dark:bg-red-950/40" title="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onSave}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Bookmark className="h-3.5 w-3.5" /> Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
