// src/components/StatsPanel.jsx
import React from 'react'
import { Card, CardTitle, Dot } from './UI'

export default function StatsPanel({ data }) {
  const totalSubj = data.subjects.length
  const allSlots = Object.values(data.schedule).flatMap(d => d.slots || [])
  const totalSlots = allSlots.length
  const doneSlots = allSlots.filter(s => s.done).length
  const totalHrs = data.subjects.reduce((a, s) => a + s.sessions * s.duration / 60, 0)
  const pct = totalSlots ? Math.round(doneSlots / totalSlots * 100) : 0

  const stats = [
    { n: totalSubj, l: 'Môn học', icon: '📚' },
    { n: Object.keys(data.schedule).length, l: 'Ngày có lịch', icon: '📅' },
    { n: `${doneSlots}/${totalSlots}`, l: 'Buổi hoàn thành', icon: '✅' },
    { n: totalHrs.toFixed(1) + 'h', l: 'Giờ học/tuần', icon: '⏱' },
  ]

  const maxHrs = data.subjects.length ? Math.max(...data.subjects.map(s => s.sessions * s.duration / 60)) : 1

  return (
    <div>
      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 10 }}>
        {stats.map(s => (
          <div key={s.l} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>{s.n}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Overall progress */}
      {totalSlots > 0 && (
        <Card>
          <CardTitle icon="🎯">Tiến độ tổng thể</CardTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ flex: 1, height: 10, borderRadius: 5, background: 'var(--bg2)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: pct + '%', background: 'var(--accent)', borderRadius: 5, transition: 'width .5s' }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', minWidth: 36 }}>{pct}%</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>
            {doneSlots} buổi hoàn thành / {totalSlots} buổi tổng cộng
          </div>
        </Card>
      )}

      {/* Per-subject progress */}
      {data.subjects.length > 0 && (
        <Card>
          <CardTitle icon="📈">Tiến độ từng môn</CardTitle>
          {data.subjects.map(s => {
            const p = s.sessions ? Math.min(100, Math.round((s.completed || 0) / s.sessions * 100)) : 0
            return (
              <div key={s.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                  <Dot color={s.color} />
                  <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{s.name}</span>
                  {s.teacher && <span style={{ fontSize: 11, color: 'var(--text3)' }}>{s.teacher}</span>}
                  <span style={{ fontSize: 11, color: 'var(--text3)' }}>{s.completed || 0}/{s.sessions} · {p}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--bg2)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: p + '%', background: s.color, borderRadius: 3, transition: 'width .5s' }} />
                </div>
              </div>
            )
          })}
        </Card>
      )}

      {/* Time distribution */}
      {data.subjects.length > 0 && (
        <Card>
          <CardTitle icon="⏰">Phân bổ thời gian/tuần</CardTitle>
          {[...data.subjects].sort((a, b) => b.sessions * b.duration - a.sessions * a.duration).map(s => {
            const hrs = (s.sessions * s.duration / 60)
            const barW = Math.round(hrs / maxHrs * 100)
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9 }}>
                <div style={{ width: 68, fontSize: 12, color: 'var(--text2)', textAlign: 'right', flexShrink: 0, fontWeight: 500 }}>{s.name}</div>
                <div style={{ flex: 1, height: 18, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: barW + '%', background: s.color, borderRadius: 4, transition: 'width .5s' }} />
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', minWidth: 34 }}>{hrs.toFixed(1)}h</div>
              </div>
            )
          })}
        </Card>
      )}

      {/* Reminders summary */}
      {data.reminders.length > 0 && (
        <Card>
          <CardTitle icon="🔔">Tóm tắt nhắc nhở</CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            {['deadline','exam','study','other'].map(type => {
              const cnt = data.reminders.filter(r => r.type === type && r.date >= new Date().toISOString().split('T')[0]).length
              const labels = { deadline:'Deadline', exam:'Thi/KT', study:'Tự học', other:'Khác' }
              const colors = { deadline:'#ef4444', exam:'#8b5cf6', study:'#22c55e', other:'#0ea5e9' }
              return (
                <div key={type} style={{ background: colors[type] + '12', border: '1px solid ' + colors[type] + '30', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: colors[type] }}>{cnt}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 1 }}>{labels[type]} sắp tới</div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
