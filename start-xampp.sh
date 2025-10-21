#!/bin/bash

echo "========================================"
echo "   SISTEM MANAJEMEN KENDARAAN"
echo "   Starting with XAMPP Support"
echo "========================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js tidak terinstall!"
    echo "Silakan install Node.js dari https://nodejs.org/"
    exit 1
fi

echo "[✓] Node.js terdeteksi"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm tidak tersedia!"
    exit 1
fi

echo "[✓] npm terdeteksi"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo
    echo "[INFO] Menginstall dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Gagal install dependencies!"
        exit 1
    fi
    echo "[✓] Dependencies terinstall"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo
    echo "[INFO] Membuat file .env..."
    cat > .env << EOF
# Database
DATABASE_URL="file:./db/custom.db"

# Next.js
NEXTAUTH_URL="http://127.0.0.1:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Environment
NODE_ENV="development"
EOF
    echo "[✓] File .env dibuat"
fi

# Setup database
echo
echo "[INFO] Setup database..."
npm run db:generate
if [ $? -ne 0 ]; then
    echo "[ERROR] Gagal generate Prisma client!"
    exit 1
fi

npm run db:push
if [ $? -ne 0 ]; then
    echo "[ERROR] Gagal setup database!"
    exit 1
fi

echo "[✓] Database siap"

# Start the development server
echo
echo "========================================"
echo "   MEMULAI SERVER DEVELOPMENT"
echo "========================================"
echo
echo "Aplikasi akan berjalan di: http://127.0.0.1:3000"
echo
echo "Tekan Ctrl+C untuk menghentikan server"
echo

npm run dev