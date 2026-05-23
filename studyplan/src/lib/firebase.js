// src/lib/firebase.js
// ================================================================
// HƯỚNG DẪN: Thay thế các giá trị bên dưới bằng config Firebase của bạn
// 1. Vào https://console.firebase.google.com
// 2. Tạo project mới → Add app → Web
// 3. Copy firebaseConfig và dán vào đây
// 4. Bật Authentication → Google provider
// 5. Bật Firestore Database
// ================================================================

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
