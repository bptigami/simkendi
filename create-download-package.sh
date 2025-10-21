#!/bin/bash

echo "🚗 Membuat Package Download Sistem Manajemen Kendaraan"
echo "======================================================="

# Nama package
PACKAGE_NAME="sistem-manajemen-kendaraan"
PACKAGE_DIR="$PACKAGE_NAME"

# Buat direktori package
rm -rf "$PACKAGE_DIR"
mkdir -p "$PACKAGE_DIR"

echo "📁 Membuat struktur folder..."

# Buat struktur folder lengkap
mkdir -p "$PACKAGE_DIR/prisma"
mkdir -p "$PACKAGE_DIR/db"
mkdir -p "$PACKAGE_DIR/public"
mkdir -p "$PACKAGE_DIR/src/app/api/health"
mkdir -p "$PACKAGE_DIR/src/app/api/dashboard"
mkdir -p "$PACKAGE_DIR/src/app/api/kendaraan/[id]"
mkdir -p "$PACKAGE_DIR/src/app/api/peminjam"
mkdir -p "$PACKAGE_DIR/src/app/api/peminjaman/[id]"
mkdir -p "$PACKAGE_DIR/src/app/api/pengembalian"
mkdir -p "$PACKAGE_DIR/src/app/api/laporan"
mkdir -p "$PACKAGE_DIR/src/app/api/seed"
mkdir -p "$PACKAGE_DIR/src/components/ui"
mkdir -p "$PACKAGE_DIR/src/components/dashboard"
mkdir -p "$PACKAGE_DIR/src/components/kendaraan"
mkdir -p "$PACKAGE_DIR/src/components/peminjaman"
mkdir -p "$PACKAGE_DIR/src/components/laporan"
mkdir -p "$PACKAGE_DIR/src/lib"
mkdir -p "$PACKAGE_DIR/src/hooks"
mkdir -p "$PACKAGE_DIR/src/examples/websocket"

echo "📄 Menyalin file konfigurasi..."

# Copy file konfigurasi root
cp package.json "$PACKAGE_DIR/"
cp package-lock.json "$PACKAGE_DIR/"
cp tsconfig.json "$PACKAGE_DIR/"
cp next.config.ts "$PACKAGE_DIR/"
cp tailwind.config.ts "$PACKAGE_DIR/"
cp postcss.config.mjs "$PACKAGE_DIR/"
cp eslint.config.mjs "$PACKAGE_DIR/"
cp components.json "$PACKAGE_DIR/"
cp server.ts "$PACKAGE_DIR/"
cp .env.example "$PACKAGE_DIR/"
cp .env "$PACKAGE_DIR/"
cp start-xampp.bat "$PACKAGE_DIR/"
cp start-xampp.sh "$PACKAGE_DIR/"
cp README-XAMPP.md "$PACKAGE_DIR/"
cp PANDUAN-XAMPP.md "$PACKAGE_DIR/"
cp DOWNLOAD-GUIDE.md "$PACKAGE_DIR/"

echo "🗄️ Menyalin database schema..."
cp prisma/schema.prisma "$PACKAGE_DIR/prisma/"

echo "🎨 Menyalin public assets..."
cp public/robots.txt "$PACKAGE_DIR/public/"
cp public/logo.svg "$PACKAGE_DIR/public/"
cp public/favicon.ico "$PACKAGE_DIR/public/"

echo "💻 Menyalin source code..."

# Copy app files
cp src/app/page.tsx "$PACKAGE_DIR/src/app/"
cp src/app/layout.tsx "$PACKAGE_DIR/src/app/"
cp src/app/globals.css "$PACKAGE_DIR/src/app/"

# Copy API routes
cp src/app/api/health/route.ts "$PACKAGE_DIR/src/app/api/health/"
cp src/app/api/dashboard/route.ts "$PACKAGE_DIR/src/app/api/dashboard/"
cp src/app/api/kendaraan/route.ts "$PACKAGE_DIR/src/app/api/kendaraan/"
cp src/app/api/kendaraan/[id]/route.ts "$PACKAGE_DIR/src/app/api/kendaraan/[id]/"
cp src/app/api/peminjam/route.ts "$PACKAGE_DIR/src/app/api/peminjam/"
cp src/app/api/peminjaman/route.ts "$PACKAGE_DIR/src/app/api/peminjaman/"
cp src/app/api/peminjaman/[id]/route.ts "$PACKAGE_DIR/src/app/api/peminjaman/[id]/"
cp src/app/api/pengembalian/route.ts "$PACKAGE_DIR/src/app/api/pengembalian/"
cp src/app/api/laporan/route.ts "$PACKAGE_DIR/src/app/api/laporan/"
cp src/app/api/seed/route.ts "$PACKAGE_DIR/src/app/api/seed/"

# Copy components
cp src/components/dashboard/DashboardStats.tsx "$PACKAGE_DIR/src/components/dashboard/"
cp src/components/kendaraan/KendaraanManagement.tsx "$PACKAGE_DIR/src/components/kendaraan/"
cp src/components/peminjaman/PeminjamanSystem.tsx "$PACKAGE_DIR/src/components/peminjaman/"
cp src/components/peminjaman/ApprovalSystem.tsx "$PACKAGE_DIR/src/components/peminjaman/"
cp src/components/peminjaman/PengembalianSystem.tsx "$PACKAGE_DIR/src/components/peminjaman/"
cp src/components/laporan/LaporanSystem.tsx "$PACKAGE_DIR/src/components/laporan/"

# Copy UI components
cp src/components/ui/*.tsx "$PACKAGE_DIR/src/components/ui/"

# Copy lib files
cp src/lib/db.ts "$PACKAGE_DIR/src/lib/"
cp src/lib/socket.ts "$PACKAGE_DIR/src/lib/"
cp src/lib/utils.ts "$PACKAGE_DIR/src/lib/"

# Copy hooks
cp src/hooks/use-mobile.ts "$PACKAGE_DIR/src/hooks/"
cp src/hooks/use-toast.ts "$PACKAGE_DIR/src/hooks/"

# Copy examples
cp src/examples/websocket/page.tsx "$PACKAGE_DIR/src/examples/websocket/"

echo "📦 Membuat package ZIP..."

# Buat ZIP package
zip -r "$PACKAGE_DIR.zip" "$PACKAGE_DIR"

echo "✅ Package selesai dibuat!"
echo ""
echo "📁 Package folder: $PACKAGE_DIR/"
echo "📦 Package ZIP: $PACKAGE_DIR.zip"
echo ""
echo "🚀 Cara instalasi:"
echo "1. Extract $PACKAGE_DIR.zip"
echo "2. cd $PACKAGE_DIR"
echo "3. npm install"
echo "4. npm run db:push"
echo "5. npm run dev"
echo ""
echo "🌐 Akses: http://127.0.0.1:3000"