import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react'
import { Card } from './ui.jsx'
import { statsApi } from '../api/client.js'

const FOCUS = 25 * 60
const BREAK = 5 * 60

export default function PomodoroTimer({ onSessionComplete }) {
  const [mode, setMode] = useState('focus') // 'focus' | 'break'
  const [seconds, setSeconds] = useState(FOCUS)
  const [running, setRunning] = useState(false)
  const [completed, setCompleted] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          handleComplete()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode])

  const handleComplete = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    if (mode === 'focus') {
      setCompleted((c) => c + 1)
      // Log a 25-minute study session (best-effort).
      statsApi.logSession({ subject: 'physics', minutes: 25, topic: 'Pomodoro focus' }).catch(() => {})
      onSessionComplete?.()
      switchMode('break')
    } else {
      switchMode('focus')
    }
  }

  const switchMode = (next) => {
    setMode(next)
    setSeconds(next === 'focus' ? FOCUS : BREAK)
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    setSeconds(mode === 'focus' ? FOCUS : BREAK)
  }

  const total = mode === 'focus' ? FOCUS : BREAK
  const pct = ((total - seconds) / total) * 100
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Pomodoro Timer</h3>
        <span className="text-xs text-slate-400">{completed} sessions today</span>
      </div>

      <div className="mb-4 flex gap-2">
        <ModeBtn active={mode === 'focus'} onClick={() => switchMode('focus')} icon={Brain} label="Focus" />
        <ModeBtn active={mode === 'break'} onClick={() => switchMode('break')} icon={Coffee} label="Break" />
      </div>

      <div className="relative mx-auto my-2 flex h-40 w-40 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="fill-none stroke-slate-200 dark:stroke-slate-800" strokeWidth="6" />
          <circle
            cx="50" cy="50" r="45"
            className={mode === 'focus' ? 'fill-none stroke-blue-500' : 'fill-none stroke-emerald-500'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - pct / 100)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className="text-4xl font-bold tabular-nums">{mm}:{ss}</span>
      </div>

      <div className="mt-4 flex justify-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}

function ModeBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  )
}
