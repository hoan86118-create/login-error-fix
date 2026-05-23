// src/components/RemindersPanel.jsx
import React, { useState, useEffect } from 'react'
import { Card, CardTitle, FormRow, Btn, EmptyState } from './UI'
import { RTYPE_LABEL, RTYPE_COLOR, todayStr, formatDate } from '../lib/utils'
import toast from 'react-hot-toast'

export default function RemindersPanel({ data, save }) {
  const [form, setForm] = useState({
    title: '', sid: '', date: todayStr(), time: '07:00', type: 'deadline', note: '',
  })
  const [notifPerm, setNotifPerm] = useState(Notification?.permission || 'default')

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function addReminder() {
    if (!form.title.trim()) { toast.error('Nhập tiêu đề nhắc nhở!'); return }
    if (!form.date) { toast.error('Chọn ngày!'); return }
    const newR = {
      id: Date.now(), title: form.title.trim(),
      date: form.date, time: form.time,
      type: form.type, sid: form.sid || null,
      note: form.note.trim(), source: 'manual', fired: false,
    }
    save({ ...data, reminders: [...data.reminders, newR] })
    setForm(f => ({ ...f, title: '', note: '' }))
    toast.success('Đã thêm nhắc nhở!')
  }

  function delReminder(id) {
    save({ ...data, reminders: data.reminders.filter(r => r.id != id) })
  }

  async function reqNotif() {
    if (!('Notification' in window)) { toast.error('Trình duyệt không hỗ trợ!'); return }
    const perm = await Notification.requestPermission()
    setNotifPerm(perm)
    if (perm === 'granted') toast.success('Đã bật thông báo!')
    else toast.error('Thông báo bị từ chối')
  }

  const td = todayStr()
  const sorted = [...data.reminders].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const upcoming = sorted.filter(r => r.date >= td)
  const past = sorted.filter(r => r.date < td)

  return (
    <div>
      {/* Notification permission */}
      {notifPerm !== 'granted' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🔔</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Bật thông báo</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                {notifPerm === 'denied' ? 'Thông báo bị chặn. Vào cài đặt trình duyệt để bật lại.' : 'Nhận thông báo khi đến giờ học và deadline.'}
              </div>
            </div>
            {notifPerm !== 'denied' && (
              <Btn variant="primary" size="sm" onClick={reqNotif}>Bật ngay</Btn>
            )}
          </div>
        </Card>
      )}

      {/* Add form */}
      <Card>
        <CardTitle icon="➕">Thêm nhắc nhở</CardTitle>
        <FormRow label="Tiêu đề">
          <input value={form.title} onChange={e => set('title', e.target.value)}
            placeholder="VD: Nộp bài tập Toán" maxLength={50}
            onKeyDown={e => e.key === 'Enter' && addReminder()} />
        </FormRow>
        <FormRow label="Môn học">
          <select value={form.sid} onChange={e => set('sid', e.target.value)}>
            <option value="">— Không chọn —</option>
            {data.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </FormRow>
        <FormRow label="Ngày">
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} style={{ maxWidth: 160 }} />
          <input type="time" value={form.time} onChange={e => set('time', e.target.value)} style={{ maxWidth: 120 }} />
        </FormRow>
        <FormRow label="Loại">
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            <option value="deadline">📌 Deadline / Nộp bài</option>
            <option value="exam">📝 Thi / Kiểm tra</option>
            <option value="study">📖 Giờ tự học</option>
            <option value="other">🔖 Khác</option>
          </select>
        </FormRow>
        <FormRow label="Ghi chú">
          <input value={form.note} onChange={e => set('note', e.target.value)}
            placeholder="Chi tiết thêm..." maxLength={60} />
        </FormRow>
        <Btn variant="primary" onClick={addReminder}>➕ Thêm nhắc nhở</Btn>
      </Card>

      {/* List */}
      <Card>
        <CardTitle icon="🔔">Danh sách nhắc nhở ({data.reminders.length})</CardTitle>
        {!data.reminders.length ? (
          <EmptyState icon="🔕" title="Chưa có nhắc nhở" sub="Thêm nhắc nhở để không bỏ lỡ deadline!" />
        ) : (
          <>
            {upcoming.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.05em', marginBottom: 8 }}>
                  SẮP TỚI ({upcoming.length})
                </div>
                {upcoming.map(r => <RCard key={r.id} r={r} subj={data.subjects.find(s => s.id == r.sid)} onDel={() => delReminder(r.id)} />)}
              </>
            )}
            {past.length > 0 && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.05em', margin: '12px 0 8px' }}>
                  ĐÃ QUA ({past.length})
                </div>
                {past.map(r => <RCard key={r.id} r={r} subj={data.subjects.find(s => s.id == r.sid)} onDel={() => delReminder(r.id)} faded />)}
              </>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

function RCard({ r, subj, onDel, faded }) {
  const c = RTYPE_COLOR[r.type] || '#888'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 11px', borderRadius: 'var(--radius)',
      border: '1px solid var(--border)', marginBottom: 6,
      background: 'var(--surface2)', opacity: faded ? 0.55 : 1,
    }}>
      <div style={{ width: 3, height: 40, borderRadius: 2, background: c, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
          {formatDate(r.date)} · {r.time}
          {subj ? ` · ${subj.name}` : ''}
          {r.note ? ` · ${r.note}` : ''}
        </div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: c + '20', color: c, flexShrink: 0 }}>
        {RTYPE_LABEL[r.type]}
      </span>
      {r.source !== 'auto'
        ? <Btn size="sm" variant="danger" onClick={onDel}>🗑</Btn>
        : <span style={{ fontSize: 10, color: 'var(--text3)', padding: '0 4px' }}>auto</span>
      }
    </div>
  )
}
