import { useEffect, useState } from 'react'
import { Quote, RefreshCw } from 'lucide-react'
import { metaApi } from '../api/client.js'

const FALLBACK = [
  'Success is the sum of small efforts repeated day in and day out.',
  'One chapter a day keeps the backlog away.',
  'Hard work beats talent when talent doesn’t work hard.',
]

export default function MotivationalQuote() {
  const [quote, setQuote] = useState(FALLBACK[0])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const { quote } = await metaApi.quote()
      setQuote(quote)
    } catch {
      setQuote(FALLBACK[Math.floor(Math.random() * FALLBACK.length)])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/30">
      <Quote className="h-6 w-6 shrink-0 text-amber-500" />
      <p className="flex-1 text-sm font-medium italic text-amber-900 dark:text-amber-200">“{quote}”</p>
      <button onClick={load} className="text-amber-500 hover:text-amber-600" aria-label="New quote">
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  )
}
