import { useEffect, useState } from 'react'
import { CalendarClock, Pencil } from 'lucide-react'
import useLocalStorage from '../hooks/useLocalStorage.js'
import { DEFAULT_EXAM_DATE } from '../data/constants.js'

export default function ExamCountdown() {
  const [examDate, setExamDate] = useLocalStorage('jee-exam-date', DEFAULT_EXAM_DATE)
  const [editing, setEditing] = useState(false)
  const [left, setLeft] = useState(diff(examDate))

  useEffect(() => {
    setLeft(diff(examDate))
    const id = setInterval(() => setLeft(diff(examDate)), 1000)
    return () => clearInterval(id)
  }, [examDate])

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-5 text-white shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          <h3 className="font-semibold">JEE Countdown</h3>
        </div>
        <button onClick={() => setEditing((e) => !e)} className="opacity-80 hover:opacity-100">
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {editing ? (
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="mt-3 w-full rounded-lg bg-white/20 px-3 py-2 text-white placeholder-white/70 outline-none"
        />
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          <Unit value={left.days} label="Days" />
          <Unit value={left.hours} label="Hrs" />
          <Unit value={left.minutes} label="Min" />
          <Unit value={left.seconds} label="Sec" />
        </div>
      )}
      <p className="mt-3 text-xs text-white/80">
        Exam date: {new Date(examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
  )
}

function Unit({ value, label }) {
  return (
    <div className="rounded-xl bg-white/15 py-2">
      <p className="text-2xl font-bold tabular-nums">{String(value).padStart(2, '0')}</p>
      <p className="text-[10px] uppercase tracking-wide opacity-80">{label}</p>
    </div>
  )
}

function diff(dateStr) {
  const target = new Date(dateStr).getTime()
  const now = Date.now()
  let delta = Math.max(0, Math.floor((target - now) / 1000))
  const days = Math.floor(delta / 86400)
  delta -= days * 86400
  const hours = Math.floor(delta / 3600)
  delta -= hours * 3600
  const minutes = Math.floor(delta / 60)
  const seconds = delta - minutes * 60
  return { days, hours, minutes, seconds }
}
