// src/lib/utils.js
export const COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#ef4444',
  '#f97316','#eab308','#22c55e','#14b8a6',
  '#0ea5e9','#3b82f6','#a855f7','#10b981',
]

export const DAYS_SHORT = ['T2','T3','T4','T5','T6','T7','CN']
export const DAYS_FULL  = ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','Chủ nhật']

export const RTYPE_LABEL = { deadline:'Deadline', exam:'Thi/KT', study:'Tự học', other:'Khác' }
export const RTYPE_COLOR = { deadline:'#ef4444', exam:'#8b5cf6', study:'#22c55e', other:'#0ea5e9' }

export function t2m(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
export function m2t(m) {
  return String(Math.floor(m / 60)).padStart(2,'0') + ':' + String(m % 60).padStart(2,'0')
}
export function todayStr() {
  return new Date().toISOString().split('T')[0]
}
export function formatDate(ds) {
  return ds.split('-').reverse().join('/')
}
export function getDayName(dt) {
  return DAYS_FULL[dt.getDay() === 0 ? 6 : dt.getDay() - 1]
}
export function getMondayOfWeek(offset = 0) {
  const today = new Date()
  const mon = new Date(today)
  mon.setDate(today.getDate() - (today.getDay() || 7) + 1 + offset * 7)
  return mon
}
