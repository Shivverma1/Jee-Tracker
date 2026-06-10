import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

const api = axios.create({ baseURL, timeout: 20000 })

// Normalise errors into a readable message for the UI.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const detail = error.response?.data?.detail
    error.friendlyMessage =
      detail || error.message || 'Something went wrong. Please try again.'
    return Promise.reject(error)
  },
)

export const videosApi = {
  search: (q, subject, maxResults = 12) =>
    api.get('/api/videos/search', { params: { q, subject, max_results: maxResults } }).then((r) => r.data),
  listSaved: (subject) => api.get('/api/videos', { params: { subject } }).then((r) => r.data),
  save: (video) => api.post('/api/videos', video).then((r) => r.data),
  update: (id, data) => api.patch(`/api/videos/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/api/videos/${id}`),
}

export const channelsApi = {
  list: () => api.get('/api/channels').then((r) => r.data),
  videos: (id, order = 'date') =>
    api.get(`/api/channels/${id}/videos`, { params: { order } }).then((r) => r.data),
}

export const progressApi = {
  chapters: () => api.get('/api/progress/chapters').then((r) => r.data),
  setChapter: (subject, chapter, status) =>
    api.put('/api/progress/chapters', { subject, chapter, status }).then((r) => r.data),
  summary: () => api.get('/api/progress/summary').then((r) => r.data),
}

export const notesApi = {
  list: (subject, search) => api.get('/api/notes', { params: { subject, search } }).then((r) => r.data),
  create: (note) => api.post('/api/notes', note).then((r) => r.data),
  update: (id, note) => api.put(`/api/notes/${id}`, note).then((r) => r.data),
  remove: (id) => api.delete(`/api/notes/${id}`),
}

export const statsApi = {
  dashboard: () => api.get('/api/stats/dashboard').then((r) => r.data),
  logSession: (session) => api.post('/api/stats/sessions', session).then((r) => r.data),
}

export const metaApi = {
  quote: () => api.get('/api/meta/quote').then((r) => r.data),
  health: () => api.get('/api/health').then((r) => r.data),
}

export default api
