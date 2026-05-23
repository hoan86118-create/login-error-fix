# 📚 StudyPlan — Hướng dẫn cài đặt & Deploy

## Tính năng
- ✅ Đăng nhập Google, đồng bộ Firestore
- ✅ Dùng offline (localStorage) không cần đăng nhập
- ✅ Lịch học mỗi ngày 1 môn chính, phân bổ tự động
- ✅ Nhắc nhở với thông báo trình duyệt
- ✅ Thống kê tiến độ từng môn
- ✅ Dark mode tự động

---

## BƯỚC 1 — Tạo Firebase Project

1. Vào https://console.firebase.google.com → **Add project**
2. Đặt tên (VD: `studyplan-app`) → Continue → Continue → Create project
3. Vào **Project Settings** (⚙️) → tab **General** → **Your apps** → click icon **Web** (`</>`)
4. Đặt tên app → Register → Copy đoạn `firebaseConfig`

## BƯỚC 2 — Bật Authentication

1. Sidebar → **Build** → **Authentication** → **Get started**
2. Tab **Sign-in method** → **Google** → Enable → **Save**
3. Thêm domain nếu dùng Vercel: **Authorized domains** → Add domain → `your-app.vercel.app`

## BƯỚC 3 — Bật Firestore

1. Sidebar → **Build** → **Firestore Database** → **Create database**
2. Chọn **Start in production mode** → chọn region gần nhất (singapore)
3. Vào tab **Rules** → paste nội dung file `firestore.rules` → **Publish**

## BƯỚC 4 — Cài đặt & Chạy local

```bash
# Clone hoặc giải nén project
cd studyplan

# Tạo file .env từ mẫu
cp .env.example .env

# Điền config Firebase vào .env:
# VITE_FIREBASE_API_KEY=...
# VITE_FIREBASE_AUTH_DOMAIN=...
# VITE_FIREBASE_PROJECT_ID=...
# VITE_FIREBASE_STORAGE_BUCKET=...
# VITE_FIREBASE_MESSAGING_SENDER_ID=...
# VITE_FIREBASE_APP_ID=...

# Cài dependencies
npm install

# Chạy thử local
npm run dev
# → Mở http://localhost:5173
```

## BƯỚC 5 — Deploy lên Vercel (miễn phí, không giới hạn)

### Cách 1: Deploy bằng CLI (nhanh nhất)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Cách 2: Deploy qua GitHub
1. Push code lên GitHub
2. Vào https://vercel.com → **New Project** → Import repo
3. Vercel tự detect Vite → không cần config gì
4. Vào **Settings** → **Environment Variables** → thêm 6 biến từ file `.env`
5. **Redeploy** → Done!

### Thêm domain Vercel vào Firebase:
- Firebase Console → Authentication → Settings → **Authorized domains** → Add → `your-app.vercel.app`

---

## Cấu trúc project

```
studyplan/
├── src/
│   ├── components/
│   │   ├── UI.jsx           # Reusable components
│   │   ├── LoginScreen.jsx  # Màn hình đăng nhập
│   │   ├── TodayPanel.jsx   # Tab Hôm nay
│   │   ├── SubjectsPanel.jsx# Tab Môn học
│   │   ├── SchedulePanel.jsx# Tab Lịch học
│   │   ├── RemindersPanel.jsx# Tab Nhắc nhở
│   │   └── StatsPanel.jsx   # Tab Thống kê
│   ├── hooks/
│   │   ├── useAuth.js       # Google Auth
│   │   └── useFirestore.js  # Firestore sync
│   ├── lib/
│   │   ├── firebase.js      # Firebase config
│   │   └── utils.js         # Helpers
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env.example             # Mẫu biến môi trường
├── firestore.rules          # Security rules
├── index.html
├── package.json
└── vite.config.js
```

## Hỗ trợ
Nếu gặp lỗi, kiểm tra:
1. Các biến VITE_ trong `.env` đã điền đủ chưa
2. Domain đã thêm vào Authorized domains chưa
3. Firestore rules đã publish chưa
