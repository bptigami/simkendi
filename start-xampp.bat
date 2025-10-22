@echo off
echo ========================================
echo   SISTEM MANAJEMEN KENDARAAN
echo   Starting with XAMPP Support
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak terinstall!
    echo Silakan install Node.js dari https://nodejs.org/
    pause
    exit /b 1
)

echo [✓] Node.js terdeteksi

:: Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm tidak tersedia!
    pause
    exit /b 1
)

echo [✓] npm terdeteksi

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo.
    echo [INFO] Menginstall dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Gagal install dependencies!
        pause
        exit /b 1
    )
    echo [✓] Dependencies terinstall
)

:: Check if .env file exists
if not exist ".env" (
    echo.
    echo [INFO] Membuat file .env...
    (
        echo # Database
        echo DATABASE_URL="file:./db/custom.db"
        echo.
        echo # Next.js
        echo NEXTAUTH_URL="http://127.0.0.1:3000"
        echo NEXTAUTH_SECRET="your-secret-key-here"
        echo.
        echo # Environment
        echo NODE_ENV="development"
    ) > .env
    echo [✓] File .env dibuat
)

:: Setup database
echo.
echo [INFO] Setup database...
npm run db:generate
if %errorlevel% neq 0 (
    echo [ERROR] Gagal generate Prisma client!
    pause
    exit /b 1
)

npm run db:push
if %errorlevel% neq 0 (
    echo [ERROR] Gagal setup database!
    pause
    exit /b 1
)

echo [✓] Database siap

:: Start the development server
echo.
echo ========================================
echo   MEMULAI SERVER DEVELOPMENT
echo ========================================
echo.
echo Aplikasi akan berjalan di: http://127.0.0.1:3000
echo.
echo Tekan Ctrl+C untuk menghentikan server
echo.

npm run dev

pause