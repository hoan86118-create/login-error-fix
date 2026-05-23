// src/components/SchedulePanel.jsx
import React, { useState } from 'react'
import { Card, CardTitle, FormRow, Btn, Dot, EmptyState, Banner } from './UI'
import { DAYS_SHORT, DAYS_FULL, t2m, m2t, getMondayOfWeek, todayStr } from '../lib/utils'
import toast from 'react-hot-toast'

export default function SchedulePanel({ data, save }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const s = data.settings

  function updateSetting(k, v) {
    save({ ...data, settings: { ...s, [k]: v } })
  }
  function toggleDay(i) {
    const days = s.days.includes(i)
      ? (s.days.length === 1 ? s.days : s.days.filter(d => d !== i))
      : [...s.days, i].sort()
    updateSetting('days', days)
  }

  function generate() {
    if (!data.subjects.length) { toast.error('Thêm môn học trước!'); return }
    const newSchedule = {}
    const mon = getMondayOfWeek(weekOffset)
    s.days.forEach((di, idx) => {
      const dt = new Date(mon); dt.setDate(mon.getDate() + di)
      const ds = dt.toISOString().split('T')[0]
      newSchedule[ds] = { slots: [] }
      let cur = t2m(s.start), placed = 0, safe = 0
      const ln1 = t2m(s.lunch1), ln2 = t2m(s.lunch2)
      while (cur < t2m(s.end) && safe++ < 30) {
        if (cur < ln2 && cur + 45 > ln1) { cur = ln2; continue }
        const subj = data.subjects[(idx + placed) % data.subjects.length]
        if (cur + subj.duration > t2m(s.end)) break
        newSchedule[ds].slots.push({ start: cur, end: cur + subj.duration, sid: subj.id, done: false })
        cur += subj.duration + s.brk
        if (++placed >= Math.min(4, data.subjects.length)) break
      }
    })
    // auto reminders
    const autoReminders = data.reminders.filter(r => r.source !== 'auto')
    Object.entries(newSchedule).forEach(([ds, day]) => {
      if (day.slots.length) {
        const sl = day.slots[0]
        const subj = data.subjects.find(s => s.id === sl.sid)
        if (subj) {
          const notifM = sl.start >= 15 ? sl.start - 15 : 0
          autoReminders.push({
            id: 'auto_' + ds, title: `Sắp học ${subj.name}`,
            date: ds, time: m2t(notifM),
            type: 'study', sid: subj.id,
            note: `Buổi học lúc ${m2t(sl.start)}`, source: 'auto', fired: false,
          })
        }
      }
    })
    save({ ...data, schedule: { ...data.schedule, ...newSchedule }, reminders: autoReminders })
    toast.success('Đã tạo lịch học thành công!')
  }

  function toggleDone(ds, si) {
    const newData = { ...data, schedule: { ...data.schedule } }
    const sl = newData.schedule[ds].slots[si]
    sl.done = !sl.done
    const subj = newData.subjects.find(s => s.id === sl.sid)
    if (subj) {
      if (sl.done) subj.completed = (subj.completed || 0) + 1
      else if (subj.completed > 0) subj.completed--
    }
    save(newData)
  }

  function clearWeek() {
    if (!confirm('Xóa lịch tuần này?')) return
    const mon = getMondayOfWeek(weekOffset)
    const newSchedule = { ...data.schedule }
    s.days.forEach(di => {
      const dt = new Date(mon); dt.setDate(mon.getDate() + di)
      delete newSchedule[dt.toISOString().split('T')[0]]
    })
    save({ ...data, schedule: newSchedule })
    toast.success('Đã xóa lịch tuần')
  }

  const mon = getMondayOfWeek(weekOffset)
  const dates = s.days.map(di => { const dt = new Date(mon); dt.setDate(mon.getDate() + di); return dt })
  const wLabel = dates.length
    ? `${dates[0].getDate()}/${dates[0].getMonth()+1} – ${dates[dates.length-1].getDate()}/${dates[dates.length-1].getMonth()+1}/${dates[dates.length-1].getFullYear()}`
    : ''
  const td = todayStr()

  return (
    <div>
      {/* Settings */}
      <Card>
        <CardTitle icon="⚙️">Cài đặt lịch học</CardTitle>
        <FormRow label="Bắt đầu">
          <input type="time" value={s.start} onChange={e => updateSetting('start', e.target.value)} style={{ maxWidth: 120 }} />
        </FormRow>
        <FormRow label="Kết thúc">
          <input type="time" value={s.end} onChange={e => updateSetting('end', e.target.value)} style={{ maxWidth: 120 }} />
        </FormRow>
        <FormRow label="Giải lao">
          <input type="number" value={s.brk} min={5} max={60}
            onChange={e => updateSetting('brk', Number(e.target.value))}
            style={{ maxWidth: 60 }} />
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>phút</span>
        </FormRow>
        <FormRow label="Nghỉ trưa">
          <input type="time" value={s.lunch1} onChange={e => updateSetting('lunch1', e.target.value)} style={{ maxWidth: 110 }} />
          <span style={{ color: 'var(--text3)', fontSize: 12 }}>→</span>
          <input type="time" value={s.lunch2} onChange={e => updateSetting('lunch2', e.target.value)} style={{ maxWidth: 110 }} />
        </FormRow>
        <FormRow label="Ngày học">
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {DAYS_SHORT.map((d, i) => (
              <button key={i} onClick={() => toggleDay(i)} style={{
                width: 34, height: 34, borderRadius: '50%',
                border: '1px solid ' + (s.days.includes(i) ? 'var(--accent)' : 'var(--border2)'),
                background: s.days.includes(i) ? 'var(--accent)' : 'transparent',
                color: s.days.includes(i) ? '#fff' : 'var(--text2)',
                fontSize: 11, fontWeight: 600, cursor: 'pointer',
                transition: 'all .15s',
              }}>{d}</button>
            ))}
          </div>
        </FormRow>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <Btn variant="primary" onClick={generate}>✨ Tạo lịch tự động</Btn>
          <Btn variant="default" onClick={clearWeek}>🗑 Xóa tuần này</Btn>
        </div>
      </Card>

      {/* Week view */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Btn size="sm" onClick={() => setWeekOffset(o => o - 1)}>← Tuần trước</Btn>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{wLabel}</span>
        <Btn size="sm" onClick={() => setWeekOffset(o => o + 1)}>Tuần sau →</Btn>
      </div>

      {!Object.keys(data.schedule).length ? (
        <EmptyState icon="🗓" title="Chưa có lịch học" sub="Cài đặt ở trên và nhấn 'Tạo lịch tự động'" />
      ) : dates.map(dt => {
        const ds = dt.toISOString().split('T')[0]
        const day = data.schedule[ds]
        const isToday = ds === td
        const dn = DAYS_FULL[dt.getDay() === 0 ? 6 : dt.getDay() - 1]
        const doneCnt = day?.slots?.filter(s => s.done).length || 0
        const total = day?.slots?.length || 0
        return (
          <Card key={ds} highlight={isToday}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              {isToday && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'var(--accent)', color: '#fff' }}>HÔM NAY</span>}
              <span style={{ fontSize: 13, fontWeight: 600 }}>{dn} · {dt.getDate()}/{dt.getMonth()+1}</span>
              {total > 0 && <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)' }}>{doneCnt}/{total} hoàn thành</span>}
            </div>
            {day?.slots?.length ? day.slots.map((sl, si) => {
              const subj = data.subjects.find(s => s.id === sl.sid)
              if (!subj) return null
              return (
                <div key={si} style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 10px', borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)', marginBottom: 5,
                  background: sl.done ? 'var(--surface2)' : 'var(--surface)',
                  opacity: sl.done ? 0.55 : 1,
                }}>
                  <Dot color={subj.color} />
                  <div style={{ fontSize: 11, color: 'var(--text3)', minWidth: 88, flexShrink: 0 }}>
                    {m2t(sl.start)}–{m2t(sl.end)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>
                      {subj.name}
                      {si === 0 && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 8, background: subj.color + '20', color: subj.color }}>Chính</span>}
                    </div>
                    {subj.room && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{subj.room}</div>}
                  </div>
                  <button onClick={() => toggleDone(ds, si)} style={{
                    width: 26, height: 26, borderRadius: '50%',
                    border: `1.5px solid ${sl.done ? 'var(--green)' : 'var(--border2)'}`,
                    background: sl.done ? 'var(--green)' : 'transparent',
                    color: sl.done ? '#fff' : 'var(--text3)',
                    fontSize: 13, cursor: 'pointer', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{sl.done ? '✓' : '○'}</button>
                </div>
              )
            }) : (
              <div style={{ fontSize: 12, color: 'var(--text3)', padding: '8px 0', textAlign: 'center' }}>
                Không có lịch
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
