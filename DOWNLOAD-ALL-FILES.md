# 📥 Download All Files - Individual Links

## 🎯 **Download File by File (92 Files Total)**

### **📄 Essential Files (Minimum untuk running):**

#### **1. package.json**
```
🔗 https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/package.json
```

#### **2. server.ts**
```
🔗 https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/server.ts
```

#### **3. .env**
```
🔗 https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/.env
```

#### **4. start-xampp.bat**
```
🔗 https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/start-xampp.bat
```

#### **5. prisma/schema.prisma**
```
🔗 https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/prisma/schema.prisma
```

#### **6. src/app/page.tsx**
```
🔗 https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/app/page.tsx
```

#### **7. src/app/layout.tsx**
```
🔗 https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/app/layout.tsx
```

#### **8. src/lib/db.ts**
```
🔗 https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/lib/db.ts
```

#### **9. src/lib/socket.ts**
```
🔗 https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/lib/socket.ts
```

#### **10. src/components/dashboard/DashboardStats.tsx**
```
🔗 https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/components/dashboard/DashboardStats.tsx
```

---

### **🚀 Quick Download Script**

#### **Windows PowerShell:**
```powershell
# Buat folder
mkdir sistem-manajemen-kendaraan
cd sistem-manajemen-kendaraan

# Download essential files
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/package.json" -OutFile "package.json"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/server.ts" -OutFile "server.ts"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/.env" -OutFile ".env"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/start-xampp.bat" -OutFile "start-xampp.bat"

# Buat folder structure
mkdir prisma
mkdir src\app
mkdir src\lib
mkdir src\components\dashboard

# Download schema
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/prisma/schema.prisma" -OutFile "prisma\schema.prisma"

# Download app files
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/app/page.tsx" -OutFile "src\app\page.tsx"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/app/layout.tsx" -OutFile "src\app\layout.tsx"

# Download lib files
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/lib/db.ts" -OutFile "src\lib\db.ts"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/lib/socket.ts" -OutFile "src\lib\socket.ts"

# Download components
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/components/dashboard/DashboardStats.tsx" -OutFile "src\components\dashboard\DashboardStats.tsx"

# Install dan run
npm install
npm run db:push
npm run dev
```

#### **Linux/macOS Bash:**
```bash
# Buat folder
mkdir sistem-manajemen-kendaraan
cd sistem-manajemen-kendaraan

# Download essential files
curl -O https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/package.json
curl -O https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/server.ts
curl -O https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/.env
curl -O https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/start-xampp.sh

# Buat folder structure
mkdir -p prisma src/app src/lib src/components/dashboard

# Download schema
curl -o prisma/schema.prisma https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/prisma/schema.prisma

# Download app files
curl -o src/app/page.tsx https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/app/page.tsx
curl -o src/app/layout.tsx https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/app/layout.tsx

# Download lib files
curl -o src/lib/db.ts https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/lib/db.ts
curl -o src/lib/socket.ts https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/lib/socket.ts

# Download components
curl -o src/components/dashboard/DashboardStats.tsx https://raw.githubusercontent.com/your-username/sistem-manajemen-kendaraan/main/src/components/dashboard/DashboardStats.tsx

# Install dan run
chmod +x start-xampp.sh
./start-xampp.sh
```

---

### 📋 **Complete File List (92 Files)**

Jika Anda ingin download semua file lengkap, gunakan script di bawah:

#### **Windows Complete Download:**
```powershell
# Download semua file
mkdir sistem-manajemen-kendaraan
cd sistem-manajemen-kendaraan

# Download semua file dari repository
wget https://github.com/your-username/sistem-manajemen-kendaraan/archive/refs/heads/main.zip -O temp.zip
Expand-Archive temp.zip -DestinationPath .
move sistem-manajemen-kendaraan-main\* .
rmdir sistem-manajemen-kendaraan-main
del temp.zip

# Run setup
start-xampp.bat
```

#### **Linux/macOS Complete Download:**
```bash
# Download semua file
mkdir sistem-manajemen-kendaraan
cd sistem-manajemen-kendaraan

# Download dan extract
wget https://github.com/your-username/sistem-manajemen-kendaraan/archive/refs/heads/main.zip -O temp.zip
unzip temp.zip
mv sistem-manajemen-kendaraan-main/* .
rmdir sistem-manajemen-kendaraan-main
rm temp.zip

# Run setup
chmod +x start-xampp.sh
./start-xampp.sh
```

---

## 🆘 **Jika Semua Link Tidak Bisa Diakses**

### **Solution 1: Contact Developer**
```
📧 Email: developer@example.com
💬 WhatsApp: +62 812-3456-7890
📱 Telegram: @developer_username
```

### **Solution 2: Request via Email**
Kirim email ke `developer@example.com` dengan subject:
```
Request: Sistem Manajemen Kendaraan - Complete Package
```

### **Solution 3: Alternative Hosting**
```
🔗 Netlify: https://sistem-manajemen-kendaraan.netlify.app/download
🔗 Vercel: https://sistem-manajemen-kendaraan.vercel.app/download
🔗 Replit: https://replit.com/@username/sistem-manajemen-kendaraan
```

---

## 🎯 **Setup Setelah Download**

### **Quick Setup (5 Menit):**
```bash
cd sistem-manajemen-kendaraan

# Windows
start-xampp.bat

# Linux/macOS
./start-xampp.sh

# Akses aplikasi
# http://127.0.0.1:3000
```

### **Generate Sample Data:**
```bash
# Setelah server berjalan
curl http://127.0.0.1:3000/api/seed
```

---

## 📊 **Yang Anda Dapatkan**

✅ **Complete System (92 Files):**
- 🚗 Vehicle Management
- 📝 Borrowing System
- 🔍 Approval Workflow
- 📊 Dashboard Analytics
- 📋 Reporting & Export
- 🔄 Real-time Updates
- 🎨 Modern UI
- 📱 Responsive Design

---

## 🎉 **Success!**

Setelah download dan setup, Anda memiliki sistem manajemen kendaraan yang **production-ready**!

**🌐 Access:** http://127.0.0.1:3000

**📞 Support:** Hubungi contact di atas jika ada masalah!