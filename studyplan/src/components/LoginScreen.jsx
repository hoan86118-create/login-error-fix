// src/components/LoginScreen.jsx
import React, { useState } from 'react'

export default function LoginScreen({ onLogin, onContinueGuest }) {
  const [debugInfo, setDebugInfo] = useState('')

  async function handleLogin() {
    setDebugInfo('Đang chuyển sang Google...')
    await onLogin()
  }

  function showDebug() {
    const keys = Object.keys(localStorage)
    const firebaseKeys = keys.filter(k => k.includes('firebase'))
    setDebugInfo(
      'localStorage keys: ' + keys.length + '\n' +
      'Firebase keys: ' + firebaseKeys.join(', ') + '\n' +
      'UA: ' + navigator.userAgent.slice(0, 80)
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: 20,
    }}>
      <div style={{ maxWidth: 400, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36, fontWeight: 400,
            color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6,
          }}>StudyPlan</h1>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>
            Lịch học thông minh cho học sinh & sinh viên
          </p>
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 24px',
          boxShadow: 'var(--shadow-md)',
        }}>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20, textAlign: 'center', lineHeight: 1.6 }}>
            Đăng nhập để <strong style={{ color: 'var(--text)' }}>đồng bộ lịch học</strong> trên mọi thiết bị.
          </p>

          <button
            onClick={handleLogin}
            style={{
              width: '100%', padding: '12px 16px',
              background: 'var(--surface)',
              border: '1.5px solid var(--border2)',
              borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              fontSize: 14, fontWeight: 600, color: 'var(--text)',
              cursor: 'pointer', fontFamily: 'var(--font)', marginBottom: 12,
              boxShadow: 'var(--shadow)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            Tiếp tục với Google
          </button>

          <div style={{ position: 'relative', margin: '16px 0', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border)' }} />
            <span style={{ position: 'relative', background: 'var(--surface)', padding: '0 10px', fontSize: 11, color: 'var(--text3)' }}>hoặc</span>
          </div>

          <button
            onClick={onContinueGuest}
            style={{
              width: '100%', padding: '10px',
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', fontSize: 13, color: 'var(--text2)',
              cursor: 'pointer', fontFamily: 'var(--font)',
            }}
          >
            Dùng không đăng nhập (lưu offline)
          </button>
        </div>

        {/* Debug info */}
        {debugInfo && (
          <div style={{
            marginTop: 12, padding: '10px 12px',
            background: '#1e1e1e', borderRadius: 8,
            fontSize: 11, color: '#00ff00',
            fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
          }}>
            {debugInfo}
          </div>
        )}

        {/* Debug button - nhỏ ở dưới */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={showDebug} style={{
            background: 'transparent', border: 'none',
            fontSize: 11, color: 'var(--text3)', cursor: 'pointer'
          }}>
            🔍 Debug info
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 16 }}>
          {[['☁️','Đồng bộ đám mây'],['🔔','Nhắc nhở thông minh'],['📊','Thống kê tiến độ']].map(([ic, lb]) => (
            <div key={lb} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '12px 8px',
              textAlign: 'center', fontSize: 11, color: 'var(--text2)',
            }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{ic}</div>{lb}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
