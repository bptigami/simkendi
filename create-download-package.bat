@echo off
echo 🚗 Membuat Package Download Sistem Manajemen Kendaraan
echo =======================================================

REM Nama package
set PACKAGE_NAME=sistem-manajemen-kendaraan
set PACKAGE_DIR=%PACKAGE_NAME%

REM Hapus package lama dan buat baru
if exist "%PACKAGE_DIR%" rmdir /s /q "%PACKAGE_DIR%"
mkdir "%PACKAGE_DIR%"

echo 📁 Membuat struktur folder...

REM Buat struktur folder lengkap
mkdir "%PACKAGE_DIR%\prisma"
mkdir "%PACKAGE_DIR%\db"
mkdir "%PACKAGE_DIR%\public"
mkdir "%PACKAGE_DIR%\src\app\api\health"
mkdir "%PACKAGE_DIR%\src\app\api\dashboard"
mkdir "%PACKAGE_DIR%\src\app\api\kendaraan\[id]"
mkdir "%PACKAGE_DIR%\src\app\api\peminjam"
mkdir "%PACKAGE_DIR%\src\app\api\peminjaman\[id]"
mkdir "%PACKAGE_DIR%\src\app\api\pengembalian"
mkdir "%PACKAGE_DIR%\src\app\api\laporan"
mkdir "%PACKAGE_DIR%\src\app\api\seed"
mkdir "%PACKAGE_DIR%\src\components\ui"
mkdir "%PACKAGE_DIR%\src\components\dashboard"
mkdir "%PACKAGE_DIR%\src\components\kendaraan"
mkdir "%PACKAGE_DIR%\src\components\peminjaman"
mkdir "%PACKAGE_DIR%\src\components\laporan"
mkdir "%PACKAGE_DIR%\src\lib"
mkdir "%PACKAGE_DIR%\src\hooks"
mkdir "%PACKAGE_DIR%\src\examples\websocket"

echo 📄 Menyalin file konfigurasi...

REM Copy file konfigurasi root
copy "package.json" "%PACKAGE_DIR%\" >nul
copy "package-lock.json" "%PACKAGE_DIR%\" >nul
copy "tsconfig.json" "%PACKAGE_DIR%\" >nul
copy "next.config.ts" "%PACKAGE_DIR%\" >nul
copy "tailwind.config.ts" "%PACKAGE_DIR%\" >nul
copy "postcss.config.mjs" "%PACKAGE_DIR%\" >nul
copy "eslint.config.mjs" "%PACKAGE_DIR%\" >nul
copy "components.json" "%PACKAGE_DIR%\" >nul
copy "server.ts" "%PACKAGE_DIR%\" >nul
copy ".env.example" "%PACKAGE_DIR%\" >nul
copy ".env" "%PACKAGE_DIR%\" >nul
copy "start-xampp.bat" "%PACKAGE_DIR%\" >nul
copy "start-xampp.sh" "%PACKAGE_DIR%\" >nul
copy "README-XAMPP.md" "%PACKAGE_DIR%\" >nul
copy "PANDUAN-XAMPP.md" "%PACKAGE_DIR%\" >nul
copy "DOWNLOAD-GUIDE.md" "%PACKAGE_DIR%\" >nul

echo 🗄️ Menyalin database schema...
copy "prisma\schema.prisma" "%PACKAGE_DIR%\prisma\" >nul

echo 🎨 Menyalin public assets...
copy "public\robots.txt" "%PACKAGE_DIR%\public\" >nul
copy "public\logo.svg" "%PACKAGE_DIR%\public\" >nul
copy "public\favicon.ico" "%PACKAGE_DIR%\public\" >nul

echo 💻 Menyalin source code...

REM Copy app files
copy "src\app\page.tsx" "%PACKAGE_DIR%\src\app\" >nul
copy "src\app\layout.tsx" "%PACKAGE_DIR%\src\app\" >nul
copy "src\app\globals.css" "%PACKAGE_DIR%\src\app\" >nul

REM Copy API routes
copy "src\app\api\health\route.ts" "%PACKAGE_DIR%\src\app\api\health\" >nul
copy "src\app\api\dashboard\route.ts" "%PACKAGE_DIR%\src\app\api\dashboard\" >nul
copy "src\app\api\kendaraan\route.ts" "%PACKAGE_DIR%\src\app\api\kendaraan\" >nul
copy "src\app\api\kendaraan\[id]\route.ts" "%PACKAGE_DIR%\src\app\api\kendaraan\[id]\" >nul
copy "src\app\api\peminjam\route.ts" "%PACKAGE_DIR%\src\app\api\peminjam\" >nul
copy "src\app\api\peminjaman\route.ts" "%PACKAGE_DIR%\src\app\api\peminjaman\" >nul
copy "src\app\api\peminjaman\[id]\route.ts" "%PACKAGE_DIR%\src\app\api\peminjaman\[id]\" >nul
copy "src\app\api\pengembalian\route.ts" "%PACKAGE_DIR%\src\app\api\pengembalian\" >nul
copy "src\app\api\laporan\route.ts" "%PACKAGE_DIR%\src\app\api\laporan\" >nul
copy "src\app\api\seed\route.ts" "%PACKAGE_DIR%\src\app\api\seed\" >nul

REM Copy components
copy "src\components\dashboard\DashboardStats.tsx" "%PACKAGE_DIR%\src\components\dashboard\" >nul
copy "src\components\kendaraan\KendaraanManagement.tsx" "%PACKAGE_DIR%\src\components\kendaraan\" >nul
copy "src\components\peminjaman\PeminjamanSystem.tsx" "%PACKAGE_DIR%\src\components\peminjaman\" >nul
copy "src\components\peminjaman\ApprovalSystem.tsx" "%PACKAGE_DIR%\src\components\peminjaman\" >nul
copy "src\components\peminjaman\PengembalianSystem.tsx" "%PACKAGE_DIR%\src\components\peminjaman\" >nul
copy "src\components\laporan\LaporanSystem.tsx" "%PACKAGE_DIR%\src\components\laporan\" >nul

REM Copy UI components
copy "src\components\ui\*.tsx" "%PACKAGE_DIR%\src\components\ui\" >nul

REM Copy lib files
copy "src\lib\db.ts" "%PACKAGE_DIR%\src\lib\" >nul
copy "src\lib\socket.ts" "%PACKAGE_DIR%\src\lib\" >nul
copy "src\lib\utils.ts" "%PACKAGE_DIR%\src\lib\" >nul

REM Copy hooks
copy "src\hooks\use-mobile.ts" "%PACKAGE_DIR%\src\hooks\" >nul
copy "src\hooks\use-toast.ts" "%PACKAGE_DIR%\src\hooks\" >nul

REM Copy examples
copy "src\examples\websocket\page.tsx" "%PACKAGE_DIR%\src\examples\websocket\" >nul

echo 📦 Membuat package ZIP...

REM Buat ZIP package (jika 7-Zip tersedia)
where 7z >nul 2>nul
if %errorlevel% equ 0 (
    7z a "%PACKAGE_DIR%.zip" "%PACKAGE_DIR%" >nul
    echo ✅ Package ZIP selesai dibuat dengan 7-Zip!
) else (
    REM Coba dengan PowerShell
    powershell -command "Compress-Archive -Path '%PACKAGE_DIR%' -DestinationPath '%PACKAGE_DIR%.zip' -Force" >nul 2>nul
    if %errorlevel% equ 0 (
        echo ✅ Package ZIP selesai dibuat dengan PowerShell!
    ) else (
        echo ⚠️ Tidak bisa membuat ZIP. Silakan buat manual.
        echo 💡 Cara manual: Klik kanan folder %PACKAGE_DIR% > Send to > Compressed (zipped) folder
    )
)

echo.
echo ✅ Package selesai dibuat!
echo.
echo 📁 Package folder: %PACKAGE_DIR%\
if exist "%PACKAGE_DIR%.zip" echo 📦 Package ZIP: %PACKAGE_DIR%.zip
echo.
echo 🚀 Cara instalasi:
echo 1. Extract %PACKAGE_DIR%.zip (atau gunakan folder %PACKAGE_DIR%)
echo 2. cd %PACKAGE_DIR%
echo 3. npm install
echo 4. npm run db:push
echo 5. npm run dev
echo.
echo 🌐 Akses: http://127.0.0.1:3000
echo.
pause