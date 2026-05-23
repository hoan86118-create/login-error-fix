// src/components/UI.jsx
import React from 'react'

export function Card({ children, style, highlight }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${highlight ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      marginBottom: '10px',
      boxShadow: highlight ? '0 0 0 3px rgba(99,102,241,0.1)' : 'var(--shadow)',
      ...style
    }}>
      {children}
    </div>
  )
}

export function CardTitle({ children, icon }) {
  return (
    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '-0.01em' }}>
      {icon && <span style={{ fontSize: 15 }}>{icon}</span>}
      {children}
    </div>
  )
}

export function Btn({ children, onClick, variant = 'default', size = 'md', style, disabled }) {
  const base = {
    border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    whiteSpace: 'nowrap',
    fontSize: size === 'sm' ? 11 : 13,
    padding: size === 'sm' ? '4px 10px' : '8px 14px',
    background: 'transparent',
    color: 'var(--text)',
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  }
  const variants = {
    primary: { background: 'var(--accent)', color: '#fff', borderColor: 'var(--accent)' },
    success: { background: 'var(--green)', color: '#fff', borderColor: 'var(--green)' },
    danger:  { background: 'var(--red)',   color: '#fff', borderColor: 'var(--red)' },
    ghost:   { background: 'transparent', borderColor: 'transparent', color: 'var(--text2)' },
    default: { background: 'var(--surface2)' },
  }
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  )
}

export function Badge({ children, color = '#6366f1' }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      background: color + '20',
      color,
      letterSpacing: '0.01em',
    }}>
      {children}
    </span>
  )
}

export function FormRow({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9, flexWrap: 'wrap' }}>
      <label style={{ fontSize: 12, color: 'var(--text2)', minWidth: 76, flexShrink: 0, fontWeight: 500 }}>
        {label}
      </label>
      <div style={{ flex: 1, minWidth: 120, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        {children}
      </div>
    </div>
  )
}

export function Dot({ color, size = 10 }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: color, flexShrink: 0 }} />
}

export function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '12px 0' }} />
}

export function EmptyState({ icon, title, sub, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--text3)' }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)', marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 12, marginBottom: 12 }}>{sub}</div>}
      {action}
    </div>
  )
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <div style={{
        width: 28, height: 28,
        border: '2.5px solid var(--border2)',
        borderTopColor: 'var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export function Banner({ type = 'info', icon, children }) {
  const colors = {
    info:    ['var(--accent-light)',   'var(--accent)',      'var(--accent-text)'],
    success: ['var(--green-light)',    'var(--green)',       'var(--green-text)'],
    warn:    ['var(--amber-light)',    'var(--amber)',       'var(--amber-text)'],
    danger:  ['var(--red-light)',      'var(--red)',         'var(--red-text)'],
  }
  const [bg, border, text] = colors[type] || colors.info
  return (
    <div style={{
      background: bg,
      border: `1px solid ${border}40`,
      borderRadius: 'var(--radius)',
      padding: '10px 12px',
      marginBottom: 10,
      display: 'flex',
      gap: 8,
      fontSize: 13,
      color: text,
      alignItems: 'flex-start',
    }}>
      {icon && <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <div>{children}</div>
    </div>
  )
}
