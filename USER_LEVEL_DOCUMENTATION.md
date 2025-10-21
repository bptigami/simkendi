# Sistem Level User (Role-Based Access Control)

## 🎯 Overview

Sistem manajemen kendaraan sekarang telah dilengkapi dengan sistem level user (role-based access control) yang memungkinkan pengaturan hak akses yang berbeda untuk setiap jenis user.

## 📋 Level User

### 1. **ADMIN** 
- **Akses Penuh**: Mengelola seluruh sistem
- **Fitur**: Dashboard, Kendaraan, Peminjam, Peminjaman, Approval, Pengembalian, Laporan, Manajemen User, Settings
- **Deskripsi**: Administrator sistem yang memiliki kontrol penuh

### 2. **PIMPINAN**
- **Akses Terbatas**: Fokus pada approval dan laporan
- **Fitur**: Dashboard, Peminjaman, Approval, Laporan
- **Deskripsi**: Kepala dinas/pimpinan yang bisa menyetujui peminjaman dan melihat laporan

### 3. **PETUGAS**
- **Akses Operasional**: Mengelola data kendaraan dan transaksi
- **Fitur**: Dashboard, Kendaraan, Peminjam, Peminjaman, Pengembalian
- **Deskripsi**: Petugas lapangan yang mengelola kendaraan dan peminjaman

### 4. **USER**
- **Akses Dasar**: Hanya bisa mengajukan peminjaman
- **Fitur**: Dashboard, Peminjaman
- **Deskripsi**: User biasa yang hanya bisa mengajukan peminjaman kendaraan

## 🔑 Login Credentials

### User Default yang Tersedia:

1. **Admin**
   - Username: `admin`
   - Password: `admin123`
   - Role: ADMIN

2. **Pimpinan**
   - Username: `pimpinan`
   - Password: `pimpinan123`
   - Role: PIMPINAN

3. **Petugas**
   - Username: `petugas`
   - Password: `petugas123`
   - Role: PETUGAS

4. **User Biasa**
   - Username: `user1`
   - Password: `user123`
   - Role: USER

## 🛡️ Mekanisme Keamanan

### Authentication
- JWT Token untuk session management
- Password hashing dengan bcryptjs
- Token expiration: 24 jam

### Authorization
- Role-based access control (RBAC)
- Resource-based permission checking
- Route protection berdasarkan role

### API Security
- Bearer token authentication
- Role validation di setiap endpoint
- Admin-only endpoints untuk user management

## 📱 Interface Features

### Login System
- Form login dengan username dan password
- Session management otomatis
- Logout functionality

### Navigation Dinamis
- Menu disesuaikan dengan role user
- Hidden/Show menu berdasarkan permission
- Mobile responsive navigation

### User Management (Admin Only)
- CRUD operations untuk user
- Role assignment
- Status management (aktif/non-aktif)
- Search dan filtering

## 🔄 Workflow

### 1. Login Flow
```
User → Login Form → API Validation → JWT Token → Dashboard
```

### 2. Access Control Flow
```
Request → Token Verification → Role Check → Resource Access → Response
```

### 3. User Management Flow (Admin)
```
Admin → User Management → Create/Edit User → Role Assignment → Save
```

## 📊 Hak Akses Detail

| Fitur | ADMIN | PIMPINAN | PETUGAS | USER |
|-------|-------|----------|---------|------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Kendaraan (CRUD) | ✅ | ❌ | ✅ | ❌ |
| Peminjam (CRUD) | ✅ | ❌ | ✅ | ❌ |
| Peminjaman (Create) | ✅ | ✅ | ✅ | ✅ |
| Approval | ✅ | ✅ | ❌ | ❌ |
| Pengembalian | ✅ | ❌ | ✅ | ❌ |
| Laporan | ✅ | ✅ | ❌ | ❌ |
| User Management | ✅ | ❌ | ❌ | ❌ |
| Settings | ✅ | ❌ | ❌ | ❌ |

## 🚀 Cara Penggunaan

### 1. Login
1. Buka aplikasi di browser
2. Masukkan username dan password
3. Sistem akan mengarahkan ke dashboard sesuai role

### 2. Mengelola User (Admin Only)
1. Login sebagai admin
2. Menu "Manajemen User" akan muncul
3. Tambah, edit, atau non-aktifkan user
4. Assign role sesuai kebutuhan

### 3. Mengakses Fitur
- Menu akan otomatis disesuaikan dengan role
- User hanya bisa mengakses fitur yang diizinkan
- Akses tidak sah akan ditolak dengan pesan error

## 🔧 Technical Implementation

### Database Schema
```sql
User {
  id_user: Int (Primary Key)
  username: String (Unique)
  email: String (Unique)
  password_hash: String
  nama_lengkap: String
  nip: String? (Unique)
  jabatan: String?
  instansi: String?
  role: Role (Enum)
  is_active: Boolean
  last_login: DateTime?
  createdAt: DateTime
  updatedAt: DateTime
}

Role Enum: [ADMIN, PIMPINAN, PETUGAS, USER]
```

### API Endpoints
- `POST /api/auth/login` - Login authentication
- `POST /api/auth/verify` - Token verification
- `GET /api/users` - List users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `GET /api/users/[id]` - User detail (Admin only)
- `PUT /api/users/[id]` - Update user (Admin only)
- `DELETE /api/users/[id]` - Deactivate user (Admin only)

### Frontend Components
- `AuthContext` - State management untuk authentication
- `ProtectedRoute` - Route protection wrapper
- `Navigation` - Dynamic navigation based on role
- `LoginForm` - Login interface
- `UserManagement` - Admin user management interface

## 🎉 Kesimpulan

Sistem level user telah berhasil diimplementasikan dengan:

✅ **4 Level User** dengan hak akses berbeda
✅ **Authentication System** yang aman dengan JWT
✅ **Role-Based Access Control** yang komprehensif
✅ **User Management Interface** untuk admin
✅ **Dynamic Navigation** yang menyesuaikan role
✅ **API Security** dengan proper validation
✅ **Default Users** untuk testing dan demo

Sistem sekarang siap digunakan dengan multi-user capability dan proper access control! 🚀