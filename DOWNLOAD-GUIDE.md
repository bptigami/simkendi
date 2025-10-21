# 📥 Panduan Download Sistem Manajemen Kendaraan

## 🎯 Cara Mendownload Semua File dengan Struktur Sama Persis

### 📁 **Opsi 1: Download Manual (File by File)**

Berikut daftar semua file yang perlu Anda download dengan struktur folder yang sama:

```
nextjs_tailwind_shadcn_ts/
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 tsconfig.json
├── 📄 next.config.ts
├── 📄 tailwind.config.ts
├── 📄 postcss.config.mjs
├── 📄 eslint.config.mjs
├── 📄 components.json
├── 📄 server.ts
├── 📄 .env.example
├── 📄 .env
├── 📄 README-XAMPP.md
├── 📄 PANDUAN-XAMPP.md
├── 📄 DOWNLOAD-GUIDE.md
├── 📄 start-xampp.bat
├── 📄 start-xampp.sh
├── 📄 prisma/
│   └── 📄 schema.prisma
├── 📄 db/
│   └── 📄 custom.db (akan dibuat otomatis)
├── 📄 public/
│   ├── 📄 robots.txt
│   ├── 📄 logo.svg
│   └── 📄 favicon.ico
└── 📄 src/
    ├── 📄 app/
    │   ├── 📄 page.tsx
    │   ├── 📄 layout.tsx
    │   ├── 📄 globals.css
    │   └── 📄 api/
    │       ├── 📄 health/
    │       │   └── 📄 route.ts
    │       ├── 📄 dashboard/
    │       │   └── 📄 route.ts
    │       ├── 📄 kendaraan/
    │       │   ├── 📄 route.ts
    │       │   └── 📄 [id]/
    │       │       └── 📄 route.ts
    │       ├── 📄 peminjam/
    │       │   └── 📄 route.ts
    │       ├── 📄 peminjaman/
    │       │   ├── 📄 route.ts
    │       │   └── 📄 [id]/
    │       │       └── 📄 route.ts
    │       ├── 📄 pengembalian/
    │       │   └── 📄 route.ts
    │       ├── 📄 laporan/
    │       │   └── 📄 route.ts
    │       └── 📄 seed/
    │           └── 📄 route.ts
    ├── 📄 components/
    │   ├── 📄 ui/
    │   │   ├── 📄 accordion.tsx
    │   │   ├── 📄 alert-dialog.tsx
    │   │   ├── 📄 alert.tsx
    │   │   ├── 📄 aspect-ratio.tsx
    │   │   ├── 📄 avatar.tsx
    │   │   ├── 📄 badge.tsx
    │   │   ├── 📄 breadcrumb.tsx
    │   │   ├── 📄 button.tsx
    │   │   ├── 📄 calendar.tsx
    │   │   ├── 📄 card.tsx
    │   │   ├── 📄 carousel.tsx
    │   │   ├── 📄 chart.tsx
    │   │   ├── 📄 checkbox.tsx
    │   │   ├── 📄 collapsible.tsx
    │   │   ├── 📄 command.tsx
    │   │   ├── 📄 context-menu.tsx
    │   │   ├── 📄 dialog.tsx
    │   │   ├── 📄 drawer.tsx
    │   │   ├── 📄 dropdown-menu.tsx
    │   │   ├── 📄 form.tsx
    │   │   ├── 📄 hover-card.tsx
    │   │   ├── 📄 input-otp.tsx
    │   │   ├── 📄 input.tsx
    │   │   ├── 📄 label.tsx
    │   │   ├── 📄 menubar.tsx
    │   │   ├── 📄 navigation-menu.tsx
    │   │   ├── 📄 pagination.tsx
    │   │   ├── 📄 popover.tsx
    │   │   ├── 📄 progress.tsx
    │   │   ├── 📄 radio-group.tsx
    │   │   ├── 📄 resizable.tsx
    │   │   ├── 📄 scroll-area.tsx
    │   │   ├── 📄 select.tsx
    │   │   ├── 📄 separator.tsx
    │   │   ├── 📄 sheet.tsx
    │   │   ├── 📄 skeleton.tsx
    │   │   ├── 📄 slider.tsx
    │   │   ├── 📄 sonner.tsx
    │   │   ├── 📄 switch.tsx
    │   │   ├── 📄 table.tsx
    │   │   ├── 📄 tabs.tsx
    │   │   ├── 📄 textarea.tsx
    │   │   ├── 📄 toast.tsx
    │   │   ├── 📄 toggle-group.tsx
    │   │   ├── 📄 toggle.tsx
    │   │   ├── 📄 tooltip.tsx
    │   │   └── 📄 sidebar.tsx
    │   ├── 📄 dashboard/
    │   │   └── 📄 DashboardStats.tsx
    │   ├── 📄 kendaraan/
    │   │   └── 📄 KendaraanManagement.tsx
    │   ├── 📄 peminjaman/
    │   │   ├── 📄 PeminjamanSystem.tsx
    │   │   ├── 📄 ApprovalSystem.tsx
    │   │   └── 📄 PengembalianSystem.tsx
    │   └── 📄 laporan/
    │       └── 📄 LaporanSystem.tsx
    ├── 📄 lib/
    │   ├── 📄 db.ts
    │   ├── 📄 socket.ts
    │   └── 📄 utils.ts
    ├── 📄 hooks/
    │   ├── 📄 use-mobile.ts
    │   └── 📄 use-toast.ts
    └── 📄 examples/
        └── 📄 websocket/
            └── 📄 page.tsx
```

---

## 📦 **Opsi 2: Download dengan Git (Recommended)**

### **Cara 1: Jika Anda memiliki Git**
```bash
# Clone repository (jika ada di Git)
git clone [repository-url] nextjs_tailwind_shadcn_ts
cd nextjs_tailwind_shadcn_ts

# Install dependencies
npm install

# Setup database
npm run db:generate
npm run db:push

# Start server
npm run dev
```

### **Cara 2: Download sebagai ZIP**
1. Download semua file sebagai ZIP
2. Extract ke folder `nextjs_tailwind_shadcn_ts`
3. Ikuti langkah setup di atas

---

## 🎯 **Opsi 3: Copy-Paste Manual (Step by Step)**

### **Step 1: Buat Struktur Folder**
```bash
# Buat folder utama
mkdir nextjs_tailwind_shadcn_ts
cd nextjs_tailwind_shadcn_ts

# Buat subfolder
mkdir prisma
mkdir db
mkdir public
mkdir src
mkdir src/app
mkdir src/app/api
mkdir src/components
mkdir src/components/ui
mkdir src/components/dashboard
mkdir src/components/kendaraan
mkdir src/components/peminjaman
mkdir src/components/laporan
mkdir src/lib
mkdir src/hooks
mkdir src/examples
mkdir src/examples/websocket
```

### **Step 2: Download File Konfigurasi**
Download file-file berikut dan paste di folder root:

1. **package.json**
2. **package-lock.json**
3. **tsconfig.json**
4. **next.config.ts**
5. **tailwind.config.ts**
6. **postcss.config.mjs**
7. **eslint.config.mjs**
8. **components.json**
9. **server.ts**
10. **.env.example**
11. **.env**
12. **start-xampp.bat**
13. **start-xampp.sh**

### **Step 3: Download Database Schema**
- **prisma/schema.prisma**

### **Step 4: Download Source Code**
Download semua file di dalam folder `src/` dengan struktur yang sama.

---

## 🔧 **Setup Setelah Download**

### **1. Install Dependencies**
```bash
cd nextjs_tailwind_shadcn_ts
npm install
```

### **2. Setup Database**
```bash
npm run db:generate
npm run db:push
```

### **Step 3: Start Server**
```bash
# Windows
start-xampp.bat

# Atau manual
npm run dev
```

### **Step 4: Akses Aplikasi**
🌐 **http://127.0.0.1:3000**

---

## 📋 **Checklist Download**

### ✅ **File Konfigurasi Root:**
- [ ] package.json
- [ ] package-lock.json
- [ ] tsconfig.json
- [ ] next.config.ts
- [ ] tailwind.config.ts
- [ ] postcss.config.mjs
- [ ] eslint.config.mjs
- [ ] components.json
- [ ] server.ts
- [ ] .env.example
- [ ] .env
- [ ] start-xampp.bat
- [ ] start-xampp.sh

### ✅ **Database:**
- [ ] prisma/schema.prisma

### ✅ **Public Assets:**
- [ ] public/robots.txt
- [ ] public/logo.svg
- [ ] public/favicon.ico

### ✅ **Source Code (src/):**
- [ ] src/app/page.tsx
- [ ] src/app/layout.tsx
- [ ] src/app/globals.css
- [ ] Semua API routes di src/app/api/
- [ ] Semua components di src/components/
- [ ] src/lib/db.ts
- [ ] src/lib/socket.ts
- [ ] src/lib/utils.ts
- [ ] src/hooks/use-mobile.ts
- [ ] src/hooks/use-toast.ts
- [ ] src/examples/websocket/page.tsx

---

## 🚨 **Penting: Struktur Harus Sama Persis!**

Pastikan struktur folder dan file sama persis seperti di atas. Jika ada perbedaan:
1. Cek nama file (case-sensitive)
2. Cek struktur folder
3. Pastikan tidak ada file yang terlewat

---

## 🎯 **Test Setelah Download**

### **1. Test Dependencies:**
```bash
npm list --depth=0
```

### **2. Test Database:**
```bash
npx prisma db pull
```

### **3. Test Server:**
```bash
npm run dev
```

### **4. Test API:**
```bash
curl http://127.0.0.1:3000/api/health
```

---

## 🆘 **Troubleshooting Download**

### **Error: Module not found**
```bash
npm install --force
```

### **Error: Database connection**
```bash
npm run db:push
```

### **Error: Port 3000 used**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 📞 **Bantuan**

Jika mengalami masalah saat download:
1. Pastikan semua file terdownload dengan benar
2. Cek struktur folder sama persis
3. Run `npm install` untuk install dependencies
4. Run `npm run db:push` untuk setup database
5. Run `npm run dev` untuk start server

---

## 🎉 **Selamat Menggunakan!**

Setelah semua file terdownload dengan struktur yang benar, sistem manajemen kendaraan siap digunakan! 🚗📋

**Quick Start:**
```bash
cd nextjs_tailwind_shadcn_ts
npm install
npm run db:push
npm run dev
```

Akses di: **http://127.0.0.1:3000**