import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import VideoSearch from './pages/VideoSearch.jsx'
import Channels from './pages/Channels.jsx'
import Stats from './pages/Stats.jsx'
import Checklist from './pages/Checklist.jsx'
import Notes from './pages/Notes.jsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/videos" element={<VideoSearch />} />
        <Route path="/channels" element={<Channels />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/checklist" element={<Checklist />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </Layout>
  )
}
