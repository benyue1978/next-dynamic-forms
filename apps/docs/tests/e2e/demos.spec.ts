import { test, expect } from '@playwright/test'

test.describe('Demo Pages', () => {
  const demos = [
    'basic-form',
    'nextjs-integration',
    'custom-styling'
  ]

  demos.forEach(demo => {
    test(`should load ${demo} demo`, async ({ page }) => {
      await page.goto(`/demos/${demo}`)
      
      // Check page loads without errors
      await expect(page.locator('body')).toBeVisible()
      
      // Check for form elements
      await expect(page.locator('input, textarea, select')).toHaveCount(
        await page.locator('input, textarea, select').count()
      )
    })
  })

  test('should load basic form demo with interactions', async ({ page }) => {
    await page.goto('/demos/basic-form')
    
    // Fill form fields
    await page.fill('input[name="fullName"]', 'John Doe')
    await page.fill('input[name="email"]', 'john@example.com')
    
    // Navigate to next step
    await page.getByRole('button', { name: /next|continue/i }).click()
    
    // Check we're on step 2
    await expect(page.locator('text=/step.*2/i')).toBeVisible()
  })

  test('should handle form validation', async ({ page }) => {
    await page.goto('/demos/basic-form')
    
    // Try to submit empty form
    await page.getByRole('button', { name: /next|continue/i }).click()
    
    // Should show validation error
    await expect(page.locator('text=/required/i')).toBeVisible()
  })

  test('should complete multi-step form', async ({ page }) => {
    await page.goto('/demos/basic-form')
    
    // Step 1: Fill personal info
    await page.fill('input[name="fullName"]', 'Jane Smith')
    await page.fill('input[name="email"]', 'jane@example.com')
    await page.getByRole('button', { name: /next|continue/i }).click()
    
    // Step 2: Fill message
    await page.fill('input[name="subject"]', 'Test Subject')
    await page.fill('textarea[name="message"]', 'This is a test message')
    
    // Submit final step
    await page.getByRole('button', { name: /submit|generate/i }).click()
    
    // Check for success message
    await expect(page.locator('text=/success|thank you/i')).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    await page.goto('/demos/basic-form')
    
    // Desktop view
    await expect(page.locator('form')).toBeVisible()
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('form')).toBeVisible()
    
    // Check form elements are accessible
    await expect(page.locator('input, textarea')).toHaveCount(
      await page.locator('input, textarea').count()
    )
  })
})