// src/components/TodayPanel.jsx
import React, { useState, useEffect } from 'react'
import { Card, Banner, Dot, Btn } from './UI'
import { todayStr, m2t, t2m, getDayName, RTYPE_COLOR, RTYPE_LABEL } from '../lib/utils'

export default function TodayPanel({ data, save, onGoSchedule }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  const td = todayStr()
  const nowM = now.getHours() * 60 + now.getMinutes()
  const day = data.schedule[td]
  const todayReminders = data.reminders
    .filter(r => r.date === td)
    .sort((a, b) => a.time.localeCompare(b.time))
  const upcoming = data.reminders
    .filter(r => r.date > td)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 4)

  function toggleSlot(si) {
    const newData = { ...data }
    const sl = newData.schedule[td].slots[si]
    sl.done = !sl.done
    const subj = newData.subjects.find(s => s.id === sl.sid)
    if (subj) {
      if (sl.done) subj.completed = (subj.completed || 0) + 1
      else if (subj.completed > 0) subj.completed--
    }
    save(newData)
  }

  const dn = getDayName(now)
  const dateDisp = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
  const timeDisp = now.toLocaleTimeString('vi', { hour: '2-digit', minute: '2-digit' })

  const activeSlot = day?.slots?.find(s => nowM >= s.start && nowM < s.end)
  const nextSlot   = day?.slots?.find(s => s.start > nowM && !s.done)

  return (
    <div>
      {/* Header */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.02em' }}>{dn}, {dateDisp}</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>{timeDisp}</div>
          </div>
          {day?.slots && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.02em' }}>
                {day.slots.filter(s => s.done).length}/{day.slots.length}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)' }}>buổi xong</div>
            </div>
          )}
        </div>
      </Card>

      {/* Active slot banner */}
      {activeSlot && (() => {
        const subj = data.subjects.find(s => s.id === activeSlot.sid)
        return subj ? (
          <Banner type="success" icon="▶️">
            <strong>Đang học: {subj.name}</strong>
            <div style={{ fontSize: 12, marginTop: 2 }}>
              {m2t(activeSlot.start)} – {m2t(activeSlot.end)} · Còn {activeSlot.end - nowM} phút
            </div>
          </Banner>
        ) : null
      })()}

      {/* Next slot banner */}
      {!activeSlot && nextSlot && (() => {
        const subj = data.subjects.find(s => s.id === nextSlot.sid)
        return subj ? (
          <Banner type="info" icon="⏰">
            <strong>Tiếp theo: {subj.name}</strong>
            <div style={{ fontSize: 12, marginTop: 2 }}>
              {m2t(nextSlot.start)} – {m2t(nextSlot.end)} · Còn {nextSlot.start - nowM} phút
            </div>
          </Banner>
        ) : null
      })()}

      {/* Reminder alerts for today */}
      {todayReminders.filter(r => {
        const diff = t2m(r.time) - nowM
        return diff >= -60 && diff <= 90
      }).map(r => {
        const diff = t2m(r.time) - nowM
        const msg = diff > 0 ? `Còn ${diff} phút` : 'Đã đến giờ!'
        return (
          <Banner key={r.id} type="warn" icon="🔔">
            <strong>{r.title}</strong> · {msg}
          </Banner>
        )
      })}

      {/* Today schedule */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>
          Lịch học hôm nay
        </div>
        {day?.slots?.length ? day.slots.map((sl, si) => {
          const subj = data.subjects.find(s => s.id === sl.sid)
          if (!subj) return null
          const isNow = nowM >= sl.start && nowM < sl.end
          const isPast = nowM > sl.end
          return (
            <div key={si} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 'var(--radius)',
              border: `1px solid ${isNow ? 'var(--accent)' : 'var(--border)'}`,
              background: isNow ? 'var(--accent-light)' : sl.done ? 'var(--surface2)' : 'var(--surface)',
              marginBottom: 6,
              opacity: sl.done ? 0.55 : 1,
              boxShadow: isNow ? '0 0 0 2px rgba(99,102,241,0.1)' : 'none',
            }}>
              <Dot color={subj.color} />
              <div style={{ fontSize: 11, color: 'var(--text3)', minWidth: 90, flexShrink: 0 }}>
                {m2t(sl.start)}–{m2t(sl.end)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{subj.name}</div>
                {subj.room && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{subj.room}</div>}
              </div>
              {si === 0 && <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10, background: subj.color + '20', color: subj.color }}>Chính</span>}
              <button
                onClick={() => toggleSlot(si)}
                style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  border: `1.5px solid ${sl.done ? 'var(--green)' : 'var(--border2)'}`,
                  background: sl.done ? 'var(--green)' : 'transparent',
                  color: sl.done ? '#fff' : 'var(--text3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, cursor: 'pointer', flexShrink: 0,
                }}
              >{sl.done ? '✓' : '○'}</button>
            </div>
          )
        }) : (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text3)', fontSize: 13 }}>
            Hôm nay không có lịch học
            <div style={{ marginTop: 10 }}>
              <Btn size="sm" variant="primary" onClick={onGoSchedule}>Tạo lịch ngay →</Btn>
            </div>
          </div>
        )}
      </Card>

      {/* Today reminders */}
      {todayReminders.length > 0 && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>🔔 Nhắc nhở hôm nay</div>
          {todayReminders.map(r => (
            <ReminderRow key={r.id} r={r} subj={data.subjects.find(s => s.id == r.sid)} />
          ))}
        </Card>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>📅 Sắp tới</div>
          {upcoming.map(r => {
            const diffDays = Math.round((new Date(r.date) - new Date(td)) / 86400000)
            const subj = data.subjects.find(s => s.id == r.sid)
            return <ReminderRow key={r.id} r={r} subj={subj} extra={diffDays === 1 ? 'Ngày mai' : `Còn ${diffDays} ngày`} />
          })}
        </Card>
      )}
    </div>
  )
}

function ReminderRow({ r, subj, extra }) {
  const c = RTYPE_COLOR[r.type] || '#888'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', marginBottom: 6,
      background: 'var(--surface2)',
    }}>
      <div style={{ width: 3, height: 36, borderRadius: 2, background: c, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
          {r.time}{subj ? ` · ${subj.name}` : ''}{extra ? ` · ${extra}` : ''}
        </div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 10, background: c + '20', color: c }}>
        {RTYPE_LABEL[r.type]}
      </span>
    </div>
  )
}
