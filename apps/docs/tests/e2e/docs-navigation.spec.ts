import { test, expect } from '@playwright/test'

test.describe('Documentation Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load home page', async ({ page }) => {
    await expect(page).toHaveTitle(/Next Dynamic Forms/)
    await expect(page.locator('h1')).toContainText('Next Dynamic Forms')
  })

  test('should navigate to getting started', async ({ page }) => {
    await page.getByRole('link', { name: 'Getting Started' }).click()
    await expect(page).toHaveURL(/getting-started/)
    await expect(page.locator('h1')).toContainText('Getting Started')
  })

  test('should navigate to API reference', async ({ page }) => {
    await page.getByRole('link', { name: 'API Reference' }).click()
    await expect(page).toHaveURL(/api/)
    await expect(page.locator('h1')).toContainText('API Reference')
  })

  test('should navigate to examples', async ({ page }) => {
    await page.getByRole('link', { name: 'Examples' }).click()
    await expect(page).toHaveURL(/examples/)
    await expect(page.locator('h1')).toContainText('Examples')
  })

  test('should have working search', async ({ page }) => {
    const search = page.getByPlaceholder('Search documentation...')
    await search.click()
    await search.fill('form')
    
    // Wait for search results
    await expect(page.locator('.nextra-search')).toBeVisible()
  })

  test('should have responsive sidebar', async ({ page }) => {
    // Desktop: sidebar should be visible
    await expect(page.locator('nav.nextra-sidebar-container')).toBeVisible()
    
    // Mobile: test sidebar toggle
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('nav.nextra-sidebar-container')).not.toBeVisible()
    
    const menuButton = page.getByRole('button', { name: 'Menu' })
    await menuButton.click()
    await expect(page.locator('nav.nextra-sidebar-container')).toBeVisible()
  })
})