// src/hooks/useFirestore.js
import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../lib/firebase'

const DEFAULT_DATA = {
  subjects: [],
  schedule: {},
  reminders: [],
  settings: {
    start: '07:00',
    end: '21:00',
    brk: 15,
    lunch1: '11:30',
    lunch2: '13:30',
    days: [0, 1, 2, 3, 4],
  },
}

export function useFirestore(uid) {
  const [data, setData] = useState(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (!uid) {
      // Not logged in: use localStorage
      try {
        const saved = localStorage.getItem('studyplan_local')
        if (saved) setData(JSON.parse(saved))
      } catch {}
      setLoading(false)
      return
    }

    const ref = doc(db, 'users', uid)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData({ ...DEFAULT_DATA, ...snap.data() })
      }
      setLoading(false)
    })
    return unsub
  }, [uid])

  const save = useCallback(
    async (newData) => {
      setData(newData)
      if (!uid) {
        localStorage.setItem('studyplan_local', JSON.stringify(newData))
        return
      }
      setSyncing(true)
      try {
        await setDoc(doc(db, 'users', uid), newData, { merge: true })
      } finally {
        setSyncing(false)
      }
    },
    [uid]
  )

  return { data, save, loading, syncing }
}
