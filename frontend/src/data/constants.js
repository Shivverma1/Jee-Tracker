export const SUBJECTS = {
  physics: { name: 'Physics', color: '#3B82F6', bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
  chemistry: { name: 'Chemistry', color: '#10B981', bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500' },
  mathematics: { name: 'Mathematics', color: '#F59E0B', bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' },
}

export const SUBJECT_KEYS = Object.keys(SUBJECTS)

export const CHAPTER_STATUS = {
  not_started: { label: 'Not Started', color: 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300' },
  in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  need_revision: { label: 'Need Revision', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
}

export const STATUS_ORDER = ['not_started', 'in_progress', 'completed', 'need_revision']

// Default JEE exam date — editable in the UI (persisted to localStorage).
export const DEFAULT_EXAM_DATE = '2027-01-24'
