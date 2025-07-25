import { describe, it, expect, vi } from 'vitest'
import { loadDemoSnippet } from '../../lib/demo-loader'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Demo Loader', () => {
  it('should load basic form demo', async () => {
    const mockCode = 'export default function BasicForm() { return <div>test</div> }'
    mockFetch.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(mockCode)
    })

    const result = await loadDemoSnippet('basic-form')
    expect(result).toBe(mockCode)
    expect(mockFetch).toHaveBeenCalledWith('/demo-snippets/basic-form.tsx')
  })

  it('should handle missing demo files', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    await expect(loadDemoSnippet('basic-form')).rejects.toThrow('Demo not found')
  })

  it('should handle network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(loadDemoSnippet('basic-form')).rejects.toThrow('Failed to load demo')
  })

  it('should validate demo names', async () => {
    await expect(loadDemoSnippet('' as any)).rejects.toThrow('Invalid demo name')
    await expect(loadDemoSnippet('../invalid' as any)).rejects.toThrow('Invalid demo name')
  })
})