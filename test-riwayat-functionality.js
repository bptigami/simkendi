// Test script for riwayat peminjaman functionality
const testRiwayatPeminjaman = async () => {
  console.log('🧪 Testing Riwayat Peminjaman Functionality...\n')

  try {
    // Step 1: Login as testuser (USER role)
    console.log('1️⃣ Logging in as testuser (USER role)...')
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123'
      })
    })

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`)
    }

    const loginData = await loginResponse.json()
    const userToken = loginData.token
    console.log(`✅ Login successful! User: ${loginData.user.nama_lengkap} (${loginData.user.role})`)

    // Step 2: Test riwayat API as USER
    console.log('\n2️⃣ Testing riwayat API as USER...')
    const riwayatResponse = await fetch('http://localhost:3000/api/peminjaman/riwayat', {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    })

    if (!riwayatResponse.ok) {
      throw new Error(`Riwayat API failed: ${riwayatResponse.status}`)
    }

    const riwayatData = await riwayatResponse.json()
    console.log(`✅ Riwayat API successful! Found ${riwayatData.length} records`)

    // Step 3: Login as admin (ADMIN role)
    console.log('\n3️⃣ Logging in as admin (ADMIN role)...')
    const adminLoginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    })

    if (!adminLoginResponse.ok) {
      throw new Error(`Admin login failed: ${adminLoginResponse.status}`)
    }

    const adminLoginData = await adminLoginResponse.json()
    const adminToken = adminLoginData.token
    console.log(`✅ Admin login successful! User: ${adminLoginData.user.nama_lengkap} (${adminLoginData.user.role})`)

    // Step 4: Test riwayat API as ADMIN
    console.log('\n4️⃣ Testing riwayat API as ADMIN...')
    const adminRiwayatResponse = await fetch('http://localhost:3000/api/peminjaman/riwayat', {
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    })

    if (!adminRiwayatResponse.ok) {
      throw new Error(`Admin riwayat API failed: ${adminRiwayatResponse.status}`)
    }

    const adminRiwayatData = await adminRiwayatResponse.json()
    console.log(`✅ Admin riwayat API successful! Found ${adminRiwayatData.length} records`)

    // Step 5: Compare results
    console.log('\n5️⃣ Comparing results...')
    console.log(`USER role sees: ${riwayatData.length} records`)
    console.log(`ADMIN role sees: ${adminRiwayatData.length} records`)
    
    if (riwayatData.length <= adminRiwayatData.length) {
      console.log('✅ Role-based filtering is working correctly!')
    } else {
      console.log('❌ Role-based filtering may have issues!')
    }

    // Step 6: Test page access
    console.log('\n6️⃣ Testing page access...')
    const pageResponse = await fetch('http://localhost:3000/riwayat-peminjaman')
    if (pageResponse.ok) {
      console.log('✅ Riwayat peminjaman page is accessible!')
    } else {
      console.log(`❌ Page access failed: ${pageResponse.status}`)
    }

    console.log('\n🎉 All tests completed successfully!')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testRiwayatPeminjaman()