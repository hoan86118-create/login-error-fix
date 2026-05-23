// src/components/SubjectsPanel.jsx
import React, { useState } from 'react'
import { Card, CardTitle, FormRow, Btn, Badge, Dot, EmptyState } from './UI'
import { COLORS } from '../lib/utils'
import toast from 'react-hot-toast'

export default function SubjectsPanel({ data, save }) {
  const [form, setForm] = useState({
    name: '', teacher: '', room: '', note: '',
    sessions: 3, duration: 90, color: COLORS[0],
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function addSubj() {
    const name = form.name.trim()
    if (!name) { toast.error('Nhập tên môn học!'); return }
    if (data.subjects.find(s => s.name === name)) { toast.error('Môn này đã có!'); return }
    const newData = {
      ...data,
      subjects: [...data.subjects, {
        id: Date.now(),
        name,
        teacher: form.teacher.trim(),
        room: form.room.trim(),
        color: form.color,
        sessions: Number(form.sessions) || 3,
        duration: Number(form.duration) || 90,
        note: form.note.trim(),
        completed: 0,
      }],
    }
    save(newData)
    setForm(f => ({ ...f, name: '', teacher: '', room: '', note: '' }))
    toast.success(`Đã thêm môn ${name}`)
  }

  function delSubj(id) {
    if (!confirm('Xóa môn này?')) return
    save({ ...data, subjects: data.subjects.filter(s => s.id !== id) })
  }

  return (
    <div>
      <Card>
        <CardTitle icon="➕">Thêm môn học</CardTitle>
        <FormRow label="Tên môn">
          <input value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Toán, Văn, Anh, Lý..." maxLength={25}
            onKeyDown={e => e.key === 'Enter' && addSubj()} />
        </FormRow>
        <FormRow label="Giáo viên">
          <input value={form.teacher} onChange={e => set('teacher', e.target.value)}
            placeholder="Tùy chọn" maxLength={25} />
        </FormRow>
        <FormRow label="Phòng/Lớp">
          <input value={form.room} onChange={e => set('room', e.target.value)}
            placeholder="B2.01, Online..." maxLength={20} />
        </FormRow>
        <FormRow label="Màu sắc">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {COLORS.map(c => (
              <div key={c} onClick={() => set('color', c)} style={{
                width: 22, height: 22, borderRadius: '50%', background: c, cursor: 'pointer',
                border: form.color === c ? '2.5px solid var(--text)' : '2px solid transparent',
                transform: form.color === c ? 'scale(1.2)' : 'none',
                transition: 'all .15s',
              }} />
            ))}
          </div>
        </FormRow>
        <FormRow label="Buổi/tuần">
          <input type="number" value={form.sessions} min={1} max={7}
            onChange={e => set('sessions', e.target.value)} style={{ maxWidth: 64 }} />
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>buổi</span>
          <label style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 500, marginLeft: 8 }}>Thời lượng</label>
          <select value={form.duration} onChange={e => set('duration', e.target.value)} style={{ maxWidth: 100 }}>
            {[45,60,90,120,150,180].map(d => <option key={d} value={d}>{d} phút</option>)}
          </select>
        </FormRow>
        <FormRow label="Ghi chú">
          <textarea value={form.note} onChange={e => set('note', e.target.value)}
            placeholder="Mục tiêu, tài liệu tham khảo..." rows={2} />
        </FormRow>
        <Btn variant="primary" onClick={addSubj}>➕ Thêm môn học</Btn>
      </Card>

      <Card>
        <CardTitle icon="📋">Danh sách môn ({data.subjects.length})</CardTitle>
        {!data.subjects.length ? (
          <EmptyState icon="📚" title="Chưa có môn học nào" sub="Thêm môn học ở trên để bắt đầu!" />
        ) : data.subjects.map(s => (
          <div key={s.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)', marginBottom: 7,
            background: 'var(--surface2)',
          }}>
            <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: s.color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>
                {[s.teacher, s.room, s.note].filter(Boolean).join(' · ') || '—'}
              </div>
            </div>
            <Badge color={s.color}>{s.sessions}×/tuần · {s.duration}ph</Badge>
            <Btn size="sm" variant="danger" onClick={() => delSubj(s.id)}>🗑</Btn>
          </div>
        ))}
      </Card>
    </div>
  )
}
