import { test, expect } from '@playwright/test'

test.describe('Playground', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playground')
  })

  test('should load playground page', async ({ page }) => {
    await expect(page).toHaveTitle(/Interactive Playground/)
    await expect(page.locator('h1')).toContainText('Interactive Playground')
  })

  test('should display demo selector', async ({ page }) => {
    const selector = page.locator('select')
    await expect(selector).toBeVisible()
    await expect(selector).toContainText('Basic Form')
    await expect(selector).toContainText('Next.js Integration')
  })

  test('should load basic form demo', async ({ page }) => {
    await page.selectOption('select', 'basic-form')
    
    // Wait for demo to load
    await expect(page.locator('.sandpack')).toBeVisible()
    
    // Check if the demo contains expected content
    const preview = page.frameLocator('iframe').first()
    await expect(preview.locator('h1')).toContainText('Demo Form')
  })

  test('should load code from URL parameter', async ({ page }) => {
    const code = 'export default function Test() { return <h1>Hello World</h1> }'
    const encoded = Buffer.from(code).toString('base64')
    
    await page.goto(`/playground?src=${encoded}`)
    
    // Check if Monaco editor is loaded
    await expect(page.locator('.monaco-editor')).toBeVisible()
  })

  test('should handle invalid base64 code', async ({ page }) => {
    await page.goto('/playground?src=invalid-base64')
    
    // Should show error or fallback to default
    await expect(page.locator('h1')).toContainText('Interactive Playground')
  })

  test('should switch between sandpack and monaco modes', async ({ page }) => {
    // Default to sandpack
    await expect(page.locator('.sandpack')).toBeVisible()
    
    // Switch to Monaco
    await page.getByRole('button', { name: 'Monaco Editor' }).click()
    await expect(page.locator('.monaco-editor')).toBeVisible()
  })

  test('should share code via URL', async ({ page }) => {
    const shareButton = page.getByRole('button', { name: 'Share' })
    await shareButton.click()
    
    // Check URL contains encoded code
    const url = page.url()
    expect(url).toMatch(/\?src=/)
  })

  test('should reset to default', async ({ page }) => {
    await page.selectOption('select', 'basic-form')
    await page.waitForLoadState('networkidle')
    
    const resetButton = page.getByRole('button', { name: 'Reset' })
    await resetButton.click()
    
    // Should reset to playground page without parameters
    await expect(page).toHaveURL(/\/playground$/)
  })
})