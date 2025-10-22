# 🚗 Panduan Menjalankan Sistem Manajemen Kendaraan dengan XAMPP

## 📋 Persyaratan Sistem

### Software yang Dibutuhkan:
1. **Node.js** (v18 atau lebih tinggi) - [Download di sini](https://nodejs.org/)
2. **XAMPP** (versi terbaru) - [Download di sini](https://www.apachefriends.org/)
3. **Git** (opsional) - [Download di sini](https://git-scm.com/)

### Spesifikasi Minimum:
- RAM: 4GB
- Storage: 2GB ruang kosong
- OS: Windows 10/11, macOS, atau Linux

---

## 🔧 Langkah 1: Instalasi XAMPP

1. **Download XAMPP** dari website resmi
2. **Install XAMPP** dengan pengaturan default:
   - Pilih Apache dan MySQL (tidak perlu PostgreSQL)
   - Biarkan direktori instalasi default (`C:\xampp`)
3. **Start XAMPP Control Panel**
4. **Start Apache** (klik tombol Start pada Apache)

> 💡 **Catatan**: Kita hanya menggunakan Apache untuk web server, database menggunakan SQLite (built-in)

---

## 📁 Langkah 2: Setup Proyek

### 1. Buka Terminal/Command Prompt
```bash
# Buka Command Prompt sebagai Administrator (Windows)
# atau Terminal biasa (macOS/Linux)
```

### 2. Pindah ke Direktori Proyek
```bash
# Jika menggunakan Command Prompt
cd C:\Users\[Username]\Desktop\nextjs_tailwind_shadcn_ts

# Atau sesuaikan dengan lokasi Anda menyimpan proyek
```

### 3. Install Dependencies
```bash
npm install
```

---

## 🗄️ Langkah 3: Setup Database

### 1. Generate Prisma Client
```bash
npm run db:generate
```

### 2. Push Schema ke Database
```bash
npm run db:push
```

### 3. (Opsional) Generate Sample Data
```bash
# Akses endpoint ini setelah server berjalan
# http://127.0.0.1:3000/api/seed
```

---

## 🚀 Langkah 4: Menjalankan Aplikasi

### Opsi 1: Mode Development (Recommended)
```bash
npm run dev
```

### Opsi 2: Mode Production
```bash
npm run build
npm start
```

### Akses Aplikasi:
- **URL**: http://127.0.0.1:3000
- **Socket.IO**: ws://127.0.0.1:3000/api/socketio

---

## 🌐 Konfigurasi XAMPP

### 1. Konfigurasi Apache
Buka file: `C:\xampp\apache\conf\httpd.conf`

Pastikan module berikut aktif (tidak di-comment):
```apache
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
```

### 2. Virtual Host (Opsional)
Jika ingin menggunakan custom domain:

Edit file: `C:\xampp\apache\conf\extra\httpd-vhosts.conf`
```apache
<VirtualHost *:80>
    ServerName kendaraan.local
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
```

Tambahkan ke `C:\Windows\System32\drivers\etc\hosts`:
```
127.0.0.1 kendaraan.local
```

---

## 🔍 Troubleshooting

### Masalah Umum & Solusi:

#### 1. Port 3000 Sudah Digunakan
```bash
# Cari proses yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill proses (ganti PID dengan nomor proses)
taskkill /PID [PID] /F
```

#### 2. Error Database Connection
```bash
# Hapus database lama dan buat ulang
rm db/custom.db
npm run db:push
```

#### 3. Module Not Found
```bash
# Install ulang semua dependencies
npm install --force
```

#### 4. Permission Error (Windows)
```bash
# Run Command Prompt sebagai Administrator
# Atau jalankan:
icacls . /grant Users:(OI)(CI)F /T
```

#### 5. Apache Tidak Start di XAMPP
- Cek apakah port 80/443 sudah digunakan
- Stop Skype atau aplikasi lain yang menggunakan port 80
- Atau ubah port Apache di XAMPP Control Panel

---

## 📱 Testing Aplikasi

### 1. Dashboard Test
- Buka http://127.0.0.1:3000
- Pastikan dashboard muncul dengan statistik

### 2. API Test
```bash
# Test health endpoint
curl http://127.0.0.1:3000/api/health

# Test seed data
curl http://127.0.0.1:3000/api/seed
```

### 3. Socket.IO Test
- Buka browser developer tools
- Cek koneksi WebSocket di Network tab
- Harus ada koneksi ke `/api/socketio`

---

## 🛠️ Development Workflow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Buka Browser
- Chrome/Edge/Firefox: http://127.0.0.1:3000

### 3. Developer Tools
- **Frontend**: React DevTools
- **Network**: Chrome DevTools
- **Database**: Prisma Studio
```bash
npx prisma studio
```

---

## 📦 Build untuk Production

### 1. Build Application
```bash
npm run build
```

### 2. Start Production Server
```bash
npm start
```

### 3. Verify Production
- Akses http://127.0.0.1:3000
- Cek semua fitur berfungsi

---

## 🔐 Konfigurasi Environment

### File `.env`:
```env
# Database
DATABASE_URL="file:./db/custom.db"

# Next.js
NEXTAUTH_URL="http://127.0.0.1:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Environment
NODE_ENV="development"
```

### Production Environment:
```env
NODE_ENV="production"
NEXTAUTH_URL="http://your-domain.com"
```

---

## 📚 Dokumentasi API

### Endpoints Utama:
- `GET /api/health` - Health check
- `GET /api/dashboard` - Dashboard data
- `GET /api/kendaraan` - List kendaraan
- `POST /api/kendaraan` - Tambah kendaraan
- `GET /api/peminjaman` - List peminjaman
- `POST /api/peminjaman` - Ajukan peminjaman
- `GET /api/laporan` - Generate laporan

### Socket.IO Events:
- `kendaraan:update` - Update status kendaraan
- `peminjaman:new` - Peminjaman baru
- `peminjaman:approve` - Peminjaman disetujui

---

## 🎯 Fitur Sistem

### ✅ Yang Sudah Tersedia:
1. **Dashboard** - Statistik real-time
2. **Manajemen Kendaraan** - CRUD kendaraan
3. **Sistem Peminjaman** - Ajukan & approve
4. **Sistem Pengembalian** - Proses pengembalian
5. **Laporan** - Export CSV
6. **Real-time Updates** - Socket.IO

### 🔄 Cara Penggunaan:
1. **Admin**: Tambah kendaraan dan peminjam
2. **User**: Ajukan peminjaman kendaraan
3. **Admin**: Approve/reject peminjaman
4. **User**: Kembalikan kendaraan
5. **Admin**: Generate laporan

---

## 🆘 Bantuan

### Jika Mengalami Masalah:
1. **Cek Log**: Lihat file `dev.log` atau `server.log`
2. **Restart Server**: Stop dan start ulang
3. **Clear Cache**: Hapus folder `.next`
4. **Reinstall**: `npm install --force`

### Kontak Support:
- **Documentation**: Lihat file README.md
- **Issues**: Report di GitHub repository
- **Community**: Join Discord/Telegram group

---

## 🎉 Selamat Menggunakan!

Sistem manajemen kendaraan pemerintah siap digunakan! 🚗📋

**Quick Start Commands:**
```bash
npm install
npm run db:push
npm run dev
```

Akses aplikasi di: **http://127.0.0.1:3000**