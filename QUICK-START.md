# 🚀 Quick Start - Sistem Manajemen Kendaraan

## 📥 **Cara Paling Mudah Download & Install**

### **⚡ Super Quick (2 Menit):**

#### **1. Download Package**
```bash
# Option 1: GitHub (Recommended)
git clone https://github.com/your-username/sistem-manajemen-kendaraan.git

# Option 2: Download ZIP
# https://github.com/your-username/sistem-manajemen-kendaraan/archive/refs/heads/main.zip
```

#### **2. Install & Run**
```bash
cd sistem-manajemen-kendaraan

# Windows
start-xampp.bat

# Linux/macOS
./start-xampp.sh

# Atau manual
npm install && npm run db:push && npm run dev
```

#### **3. Akses Aplikasi**
🌐 **http://127.0.0.1:3000**

---

## 🎯 **Link Download Resmi**

### **📦 Primary Download:**
```
🔗 GitHub Repository: https://github.com/your-username/sistem-manajemen-kendaraan

📥 Direct ZIP: https://github.com/your-username/sistem-manajemen-kendaraan/archive/refs/heads/main.zip

🌐 Browse Files: https://github.com/your-username/sistem-manajemen-kendaraan/tree/main
```

### **📱 Alternative Links:**
```
🔗 GitLab: https://gitlab.com/your-username/sistem-manajemen-kendaraan

🔗 Bitbucket: https://bitbucket.org/your-username/sistem-manajemen-kendaraan

🔗 Google Drive: https://drive.google.com/file/d/[FILE_ID]/view?usp=sharing
```

---

## 🚀 **3 Cara Install**

### **Cara 1: Clone Repository (Recommended)**
```bash
git clone https://github.com/your-username/sistem-manajemen-kendaraan.git
cd sistem-manajemen-kendaraan
start-xampp.bat
```

### **Cara 2: Download ZIP**
1. Download: https://github.com/your-username/sistem-manajemen-kendaraan/archive/refs/heads/main.zip
2. Extract ZIP
3. Rename folder: `sistem-manajemen-kendaraan`
4. Run: `start-xampp.bat`

### **Cara 3: Manual Setup**
```bash
mkdir sistem-manajemen-kendaraan
cd sistem-manajemen-kendaraan
npm init -y
# Copy semua file manual
npm install
npm run db:push
npm run dev
```

---

## 📋 **System Requirements**

### **Minimum Requirements:**
- ✅ **Node.js** v18+ (https://nodejs.org/)
- ✅ **npm** v8+ (included with Node.js)
- ✅ **RAM** 4GB
- ✅ **Storage** 2GB
- ✅ **OS** Windows 10/11, macOS, Linux

### **Optional:**
- 🔧 **XAMPP** (for local web server)
- 📱 **Git** (for version control)

---

## 🎯 **Setup Instructions**

### **Step 1: Prerequisites**
```bash
# Cek Node.js
node --version

# Cek npm
npm --version

# Install Node.js jika belum ada
# https://nodejs.org/
```

### **Step 2: Download & Extract**
```bash
# Download ZIP atau clone repository
# Extract ke folder: sistem-manajemen-kendaraan
cd sistem-manajemen-kendaraan
```

### **Step 3: Automatic Setup**
```bash
# Windows
start-xampp.bat

# Linux/macOS
./start-xampp.sh
```

### **Step 4: Manual Setup (jika automatic gagal)**
```bash
# Install dependencies
npm install

# Setup database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

### **Step 5: Access Application**
🌐 **http://127.0.0.1:3000**

---

## 🎨 **Features Overview**

### ✅ **Core Features:**
- 🚗 **Vehicle Management** - CRUD operations
- 📝 **Borrowing System** - Online applications
- 🔍 **Approval Workflow** - Multi-step approval
- 📊 **Dashboard Analytics** - Real-time statistics
- 📋 **Reporting System** - CSV export
- 🔄 **Real-time Updates** - Socket.IO integration

### 🎯 **UI/UX Features:**
- 📱 **Responsive Design** - Mobile & desktop
- 🌙 **Dark/Light Mode** - Theme switching
- 🎨 **Modern UI** - shadcn/ui components
- ⚡ **Smooth Animations** - Framer Motion
- 🔄 **Loading States** - Skeleton screens
- 📊 **Interactive Charts** - Data visualization

---

## 🧪 **Testing & Validation**

### **Health Check:**
```bash
curl http://127.0.0.1:3000/api/health
```

### **Generate Sample Data:**
```bash
curl http://127.0.0.1:3000/api/seed
```

### **Test API Endpoints:**
```bash
# Dashboard data
curl http://127.0.0.1:3000/api/dashboard

# Vehicle list
curl http://127.0.0.1:3000/api/kendaraan

# Borrowing records
curl http://127.0.0.1:3000/api/peminjaman
```

---

## 🆘 **Troubleshooting**

### **Common Issues & Solutions:**

#### **Port 3000 Already Used:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Linux/macOS
lsof -ti:3000 | xargs kill -9
```

#### **Module Not Found:**
```bash
npm install --force
```

#### **Database Connection Error:**
```bash
npm run db:push
```

#### **Permission Error (Linux/macOS):**
```bash
chmod +x start-xampp.sh
sudo chown -R $USER:$USER .
```

#### **Build Error:**
```bash
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📞 **Support & Help**

### **Documentation:**
- 📖 **Full Guide**: `README-XAMPP.md`
- 🔧 **Setup Guide**: `PANDUAN-XAMPP.md`
- 📋 **File List**: `FILE-LIST-COMPLETE.md`
- 📥 **Download Help**: `DOWNLOAD-GUIDE.md`

### **Community Support:**
- 💬 **Discord**: https://discord.gg/invite-code
- 📧 **Email**: support@example.com
- 🐛 **Issues**: https://github.com/your-username/sistem-manajemen-kendaraan/issues

### **Video Tutorials:**
- 🎥 **Installation**: https://youtube.com/watch?v=install-video
- 🎥 **Features Demo**: https://youtube.com/watch?v=features-video
- 🎥 **Troubleshooting**: https://youtube.com/watch?v=troubleshoot-video

---

## 🎉 **Success!**

### ✅ **You're Ready to Go!**

Setelah mengikuti langkah-langkah di atas, Anda sekarang memiliki:

🚗 **Sistem Manajemen Kendaraan Lengkap**
- Dashboard real-time dengan statistik
- Manajemen kendaraan CRUD
- Sistem peminjaman online
- Approval workflow
- Pengembalian system
- Laporan & export
- Real-time notifications

### 🌐 **Access Your Application:**
```
URL: http://127.0.0.1:3000
API: http://127.0.0.1:3000/api/
Socket: ws://127.0.0.1:3000/api/socketio
```

### 🎯 **Next Steps:**
1. **Generate sample data** dengan `/api/seed`
2. **Add your first vehicle** di menu Kendaraan
3. **Create user accounts** di menu Peminjam
4. **Test borrowing workflow** 
5. **Explore reports & analytics**

---

## 🚀 **Production Deployment**

### **Build for Production:**
```bash
npm run build
npm start
```

### **Environment Setup:**
```env
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL="file:./db/custom.db"
```

---

## 📊 **System Information**

- **Framework**: Next.js 15
- **Language**: TypeScript 5
- **Database**: SQLite + Prisma
- **UI**: Tailwind CSS + shadcn/ui
- **Real-time**: Socket.IO
- **Total Files**: 92
- **Size**: ~50MB (with node_modules)

---

**🎉 Selamat menggunakan Sistem Manajemen Kendaraan!**

**Download sekarang dan jalankan dalam 5 menit!** ⏱️🚗📋