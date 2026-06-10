import { jsPDF } from 'jspdf'

/** Export the study progress summary to a downloadable PDF. */
export function exportProgressPDF({ summary, stats }) {
  const doc = new jsPDF()
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  doc.setFontSize(20)
  doc.text('JEE Study Progress Report', 14, 20)
  doc.setFontSize(10)
  doc.setTextColor(120)
  doc.text(`Generated on ${today}`, 14, 27)

  let y = 40
  doc.setTextColor(0)
  doc.setFontSize(14)
  doc.text('Study Stats', 14, y)
  y += 8
  doc.setFontSize(11)
  if (stats) {
    doc.text(`Hours studied today: ${stats.today_hours} hrs`, 14, y); y += 7
    doc.text(`Study streak: ${stats.streak} days`, 14, y); y += 7
    doc.text(`Topics covered this week: ${stats.topics_this_week}`, 14, y); y += 7
    doc.text(`Total hours this week: ${stats.week_hours} hrs`, 14, y); y += 12
  }

  doc.setFontSize(14)
  doc.text('Subject Progress', 14, y)
  y += 8
  doc.setFontSize(11)
  ;(summary || []).forEach((s) => {
    doc.text(`${s.name}: ${s.completed}/${s.total} chapters (${s.percentage}%)`, 14, y)
    y += 7
  })

  doc.save('jee-progress.pdf')
}

/** Build a WhatsApp share link with the progress summary text. */
export function shareOnWhatsApp({ summary, stats }) {
  const lines = ['*My JEE Study Progress* 📚\n']
  if (stats) {
    lines.push(`⏱️ Today: ${stats.today_hours} hrs`)
    lines.push(`🔥 Streak: ${stats.streak} days`)
    lines.push(`📖 Topics this week: ${stats.topics_this_week}\n`)
  }
  ;(summary || []).forEach((s) => {
    lines.push(`${s.name}: ${s.percentage}% (${s.completed}/${s.total})`)
  })
  lines.push('\n#JEE2027 #StudyTracker')
  const text = encodeURIComponent(lines.join('\n'))
  window.open(`https://wa.me/?text=${text}`, '_blank')
}
