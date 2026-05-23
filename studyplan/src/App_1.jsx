// src/App.jsx
import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { useFirestore } from './hooks/useFirestore'
import LoginScreen from './components/LoginScreen'
import TodayPanel from './components/TodayPanel'
import SubjectsPanel from './components/SubjectsPanel'
import SchedulePanel from './components/SchedulePanel'
import RemindersPanel from './components/RemindersPanel'
import StatsPanel from './components/StatsPanel'
import { Spinner } from './components/UI'

const TABS = [
  { id: 'today',     icon: '☀️', label: 'Hôm nay'  },
  { id: 'subjects',  icon: '📚', label: 'Môn học'  },
  { id: 'schedule',  icon: '📅', label: 'Lịch học' },
  { id: 'reminders', icon: '🔔', label: 'Nhắc nhở' },
  { id: 'stats',     icon: '📊', label: 'Thống kê' },
]

export default function App() {
  const { user, authLoading, login, logout } = useAuth()
  const [guestMode, setGuestMode] = useState(() => !!localStorage.getItem('studyplan_guest'))
  const [activeTab, setActiveTab] = useState('today')

  const uid = user?.uid || null
  const { data, save, loading, syncing } = useFirestore(guestMode || user ? uid : null)

  useEffect(() => {
    const check = () => {
      if (Notification?.permission !== 'granted') return
      const now = new Date()
      const td = now.toISOString().split('T')[0]
      const nowStr = now.toTimeString().slice(0, 5)
      data.reminders.forEach(r => {
        if (!r.fired && r.date === td && r.time === nowStr) {
          r.fired = true
          new Notification('StudyPlan — ' + r.title, { body: r.note || '' })
          save({ ...data })
        }
      })
    }
    const id = setInterval(check, 60000)
    return () => clearInterval(id)
  }, [data, save])

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: 'var(--bg)' }}>
      <Spinner />
      <div style={{ fontSize: 13, color: 'var(--text2)' }}>Đang kiểm tra đăng nhập...</div>
    </div>
  )

  if (!user && !guestMode) return (
    <LoginScreen
      onLogin={login}
      onContinueGuest={() => {
        localStorage.setItem('studyplan_guest', '1')
        setGuestMode(true)
      }}
    />
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <Spinner />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'var(--font)', fontSize: 13 } }} />

      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0 16px',
        display: 'flex', alignItems: 'center', gap: 10, height: 52,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)', letterSpacing: '-0.02em', flex: 1 }}>
          StudyPlan
        </div>

        {syncing && (
          <span style={{ fontSize: 11, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1s infinite' }} />
            Đang lưu...
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
          </span>
        )}

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={user.photoURL} alt="" style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--border2)' }} />
            <button onClick={logout} style={{
              padding: '4px 10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
              background: 'transparent', color: 'var(--text3)', fontSize: 11, cursor: 'pointer',
            }}>Đăng xuất</button>
          </div>
        ) : (
          <button onClick={login} style={{
            padding: '5px 12px', borderRadius: 'var(--radius)',
            border: '1px solid var(--border2)', background: 'var(--accent)',
            color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            Đăng nhập
          </button>
        )}
      </header>

      <main style={{ flex: 1, maxWidth: 640, width: '100%', margin: '0 auto', padding: '14px 14px 80px' }}>
        {activeTab === 'today'     && <TodayPanel     data={data} save={save} onGoSchedule={() => setActiveTab('schedule')} />}
        {activeTab === 'subjects'  && <SubjectsPanel  data={data} save={save} />}
        {activeTab === 'schedule'  && <SchedulePanel  data={data} save={save} />}
        {activeTab === 'reminders' && <RemindersPanel data={data} save={save} />}
        {activeTab === 'stats'     && <StatsPanel     data={data} />}
      </main>

      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--surface)', borderTop: '1px solid var(--border)',
        display: 'flex', zIndex: 100, padding: '4px 0 env(safe-area-inset-bottom)',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '6px 4px', gap: 2,
            color: activeTab === t.id ? 'var(--accent)' : 'var(--text3)',
            transition: 'color .15s', position: 'relative',
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: activeTab === t.id ? 700 : 400 }}>{t.label}</span>
            {activeTab === t.id && (
              <div style={{ position: 'absolute', bottom: 0, width: 20, height: 2, borderRadius: 1, background: 'var(--accent)' }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
