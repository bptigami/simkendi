# 🚗 Sistem Manajemen Kendaraan Pemerintah

## 🎯 Overview

Sistem manajemen kendaraan pemerintah yang dibangun dengan **Next.js 15**, **TypeScript**, dan **Tailwind CSS**. Sistem ini mengelola seluruh siklus hidup kendaraan dari inventarisasi hingga pengembalian.

## ✨ Fitur Utama

- 🚗 **Manajemen Kendaraan** - Inventarisasi lengkap dengan status real-time
- 📝 **Sistem Peminjaman** - Pengajuan online dengan approval workflow
- 🔍 **Sistem Approval** - Proses persetujuan yang transparan
- 📊 **Dashboard Analytics** - Statistik dan visualisasi data
- 📋 **Laporan & Export** - Generate laporan dalam format CSV
- 🔄 **Real-time Updates** - Update status langsung dengan Socket.IO

## 🛠️ Teknologi Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: SQLite dengan Prisma ORM
- **Real-time**: Socket.IO
- **UI Components**: Radix UI + Lucide Icons

## 🚀 Quick Start dengan XAMPP

### Prerequisites:
1. **Node.js** v18+ [Download](https://nodejs.org/)
2. **XAMPP** [Download](https://www.apachefriends.org/)

### Installation:

#### Windows:
```bash
# Download dan extract proyek
# Buka Command Prompt sebagai Administrator
cd path/to/project

# Run otomatis
start-xampp.bat
```

#### macOS/Linux:
```bash
# Download dan extract proyek
cd path/to/project

# Make executable dan run
chmod +x start-xampp.sh
./start-xampp.sh
```

#### Manual Setup:
```bash
# Install dependencies
npm install

# Setup database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

### Akses Aplikasi:
🌐 **URL**: http://127.0.0.1:3000

## 📁 Struktur Proyek

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Dashboard page
│   ├── components/         # React Components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── kendaraan/     # Vehicle management
│   │   ├── peminjaman/    # Borrowing system
│   │   └── laporan/       # Reporting system
│   ├── lib/               # Utilities
│   │   ├── db.ts         # Database connection
│   │   ├── socket.ts     # Socket.IO setup
│   │   └── utils.ts      # Helper functions
│   └── hooks/             # Custom React hooks
├── prisma/
│   └── schema.prisma      # Database schema
├── db/
│   └── custom.db          # SQLite database
├── public/               # Static assets
└── server.ts            # Custom server with Socket.IO
```

## 🗄️ Database Schema

### Kendaraan (Vehicles)
- Informasi lengkap kendaraan (plat, merek, tahun)
- Status real-time (Tersedia/Dipinjam/Dalam Perawatan)
- Kondisi fisik dan kebersihan
- Tracking bensin

### Peminjam (Borrowers)
- Data peminjam (nama, NIP, instansi)
- Informasi kontak
- Histori peminjaman

### Peminjaman (Borrowing Records)
- Pengajuan peminjaman dengan tanggal
- Tujuan penggunaan dan lokasi
- Status approval (Diproses/Disetujui/Ditolak/Selesai)
- Kondisi awal kendaraan

### Pengembalian (Returns)
- Proses pengembalian kendaraan
- Kondisi akhir kendaraan
- Catatan petugas

## 📊 API Endpoints

### Dashboard
- `GET /api/dashboard` - Statistik dashboard
- `GET /api/health` - Health check

### Kendaraan
- `GET /api/kendaraan` - List semua kendaraan
- `POST /api/kendaraan` - Tambah kendaraan baru
- `PUT /api/kendaraan/[id]` - Update kendaraan
- `DELETE /api/kendaraan/[id]` - Hapus kendaraan

### Peminjaman
- `GET /api/peminjaman` - List peminjaman
- `POST /api/peminjaman` - Ajukan peminjaman
- `PUT /api/peminjaman/[id]` - Update status peminjaman

### Laporan
- `GET /api/laporan` - Generate laporan dengan filter

### Utilities
- `POST /api/seed` - Generate sample data
- `POST /api/pengembalian` - Proses pengembalian

## 🔧 Development

### Available Scripts:
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run db:push     # Push schema to database
npm run db:generate # Generate Prisma client
```

### Environment Variables:
```env
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_URL="http://127.0.0.1:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

## 🎨 UI Components

Sistem menggunakan **shadcn/ui** components:
- Card, Button, Input, Select
- Table, Badge, Alert
- Dialog, Sheet, Popover
- Calendar, Date Picker
- Charts & Visualizations

## 🔄 Real-time Features

Dengan **Socket.IO**, sistem mendukung:
- Live update status kendaraan
- Notifikasi peminjaman baru
- Update approval status
- Real-time dashboard statistics

## 📱 Responsive Design

- **Mobile-first** approach
- **Responsive** sidebar navigation
- **Touch-friendly** interface
- **Adaptive** layouts untuk semua device

## 🔒 Security Features

- Input validation dengan Zod
- SQL injection prevention dengan Prisma
- XSS protection
- CORS configuration
- Environment variable security

## 🚀 Deployment

### Development:
```bash
npm run dev
```

### Production:
```bash
npm run build
npm start
```

### Database Management:
```bash
npx prisma studio  # Database GUI
npm run db:reset   # Reset database
```

## 🐛 Troubleshooting

### Common Issues:

1. **Port 3000 occupied**
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID [PID] /F
   ```

2. **Database connection error**
   ```bash
   rm db/custom.db
   npm run db:push
   ```

3. **Module not found**
   ```bash
   npm install --force
   ```

## 📞 Support

Untuk bantuan teknis:
1. Cek file `PANDUAN-XAMPP.md` untuk panduan lengkap
2. Lihat log di `dev.log` atau `server.log`
3. Restart server jika mengalami masalah

## 📄 License

Proyek ini dikembangkan untuk keperluan internal manajemen kendaraan pemerintah.

---

## 🎉 Selamat Menggunakan!

Sistem manajemen kendaraan pemerintah siap digunakan! 🚗📋

**Quick Start**: `npm run dev` → Akses http://127.0.0.1:3000