// Test script to check if peminjaman page loads vehicle data
const puppeteer = require('puppeteer')

async function testPeminjamanPage() {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  
  try {
    // Go to login page first
    await page.goto('http://localhost:3000')
    
    // Login
    await page.type('input[name="username"]', 'admin')
    await page.type('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // Wait for login to complete
    await page.waitForNavigation()
    
    // Go to peminjaman page
    await page.goto('http://localhost:3000/peminjaman')
    
    // Wait for page to load
    await page.waitForSelector('[data-testid="vehicle-select"]', { timeout: 10000 })
    
    // Check if vehicles are loaded
    const vehicles = await page.evaluate(() => {
      const selectElement = document.querySelector('[data-testid="vehicle-select"]')
      if (selectElement) {
        const options = selectElement.querySelectorAll('option')
        return Array.from(options).map(option => ({
          value: option.value,
          text: option.textContent
        }))
      }
      return []
    })
    
    console.log('Vehicles found:', vehicles)
    
    // Take screenshot
    await page.screenshot({ path: 'peminjaman-test.png' })
    
  } catch (error) {
    console.error('Test failed:', error)
  } finally {
    await browser.close()
  }
}

testPeminjamanPage()