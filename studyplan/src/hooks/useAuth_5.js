// src/hooks/useAuth.js
import { useState, useEffect } from 'react'
import {
  onAuthStateChanged, signInWithPopup, signInWithRedirect,
  getRedirectResult, signOut, setPersistence, browserLocalPersistence
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

function isInAppBrowser() {
  const ua = navigator.userAgent || ''
  return /FBAN|FBAV|Instagram|ZaloApp|TikTok|Line\/|Twitter|Snapchat|MicroMessenger/i.test(ua)
}

function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {})

    // Check redirect result for Safari (which blocks popups)
    getRedirectResult(auth)
      .then(result => {
        if (result?.user) setUser(result.user)
      })
      .catch(() => {})

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
    return unsub
  }, [])

  const login = async () => {
    if (isInAppBrowser()) {
      alert('Vui lòng mở link trong Safari hoặc Chrome.\n\niOS: nhấn "..." → Open in Safari\nAndroid: nhấn "..." → Open in Chrome')
      return
    }
    await setPersistence(auth, browserLocalPersistence).catch(() => {})
    // Safari blocks popups → use redirect
    // Chrome mobile → use popup (more reliable than redirect on Chrome)
    if (isSafari()) {
      await signInWithRedirect(auth, googleProvider)
    } else {
      try {
        await signInWithPopup(auth, googleProvider)
      } catch (e) {
        if (e.code === 'auth/popup-blocked') {
          // Fallback to redirect if popup blocked
          await signInWithRedirect(auth, googleProvider)
        } else if (e.code !== 'auth/popup-closed-by-user') {
          console.error(e)
        }
      }
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return { user, authLoading, login, logout }
}
