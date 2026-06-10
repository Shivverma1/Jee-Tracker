import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Youtube, Radio, BarChart3, ListChecks,
  StickyNote, Moon, Sun, Menu, X, GraduationCap,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/videos', label: 'Video Search', icon: Youtube },
  { to: '/channels', label: 'Channels', icon: Radio },
  { to: '/stats', label: 'Study Stats', icon: BarChart3 },
  { to: '/checklist', label: 'Chapters', icon: ListChecks },
  { to: '/notes', label: 'Notes', icon: StickyNote },
]

export default function Layout({ children }) {
  const { dark, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const NavItems = ({ onClick }) =>
    NAV.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`
        }
      >
        <Icon className="h-5 w-5" />
        {label}
      </NavLink>
    ))

  return (
    <div className="min-h-screen lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:flex">
        <Brand />
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          <NavItems />
        </nav>
        <ThemeToggle dark={dark} toggle={toggle} />
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
        <Brand />
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white p-4 dark:bg-slate-900 lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween' }}
            >
              <div className="flex items-center justify-between">
                <Brand />
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="mt-6 flex flex-1 flex-col gap-1">
                <NavItems onClick={() => setOpen(false)} />
              </nav>
              <ThemeToggle dark={dark} toggle={toggle} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-x-hidden">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-emerald-500 to-amber-500 text-white">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-bold leading-tight">JEE Tracker</p>
        <p className="text-[10px] text-slate-400">Study smart, crack JEE</p>
      </div>
    </div>
  )
}

function ThemeToggle({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      className="mt-4 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      {dark ? 'Light Mode' : 'Dark Mode'}
    </button>
  )
}
