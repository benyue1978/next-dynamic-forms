/**
 * Playground URL parameter parser utilities
 */

const MAX_CODE_SIZE = 50000 // 50KB limit for security

/**
 * Encode code to base64 for URL parameters
 */
export function encodeBase64(code: string): string {
  if (!code) return ''
  
  try {
    return btoa(code)
  } catch (error) {
    // Handle Unicode characters
    return btoa(unescape(encodeURIComponent(code)))
  }
}

/**
 * Decode base64 code from URL parameters
 */
export function decodeBase64(encoded: string): string {
  if (!encoded) return ''
  
  try {
    // Try to decode as UTF-8 first
    return decodeURIComponent(escape(atob(encoded)))
  } catch (error) {
    // Fallback for ASCII
    return atob(encoded)
  }
}

/**
 * Validate URL code parameter
 */
export function validateUrlCode(encoded: string): string {
  if (!encoded) {
    throw new Error('Empty code')
  }

  if (encoded.length > MAX_CODE_SIZE) {
    throw new Error('Code too large')
  }

  try {
    const decoded = decodeBase64(encoded)
    
    if (decoded.length > MAX_CODE_SIZE) {
      throw new Error('Code too large')
    }

    return decoded
  } catch (error) {
    throw new Error('Invalid base64 encoding')
  }
}

/**
 * Extract code from URL parameters
 */
export function getCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  
  const params = new URLSearchParams(window.location.search)
  const src = params.get('src')
  
  if (!src) return null
  
  try {
    return validateUrlCode(src)
  } catch (error) {
    console.warn('Invalid code in URL:', error)
    return null
  }
}

/**
 * Update URL with encoded code
 */
export function updateUrlWithCode(code: string): void {
  if (typeof window === 'undefined') return
  
  const encoded = encodeBase64(code)
  const url = new URL(window.location.href)
  
  if (encoded) {
    url.searchParams.set('src', encoded)
  } else {
    url.searchParams.delete('src')
  }
  
  window.history.replaceState({}, '', url.toString())
}

/**
 * Sanitize code for display (basic XSS prevention)
 */
export function sanitizeCode(code: string): string {
  // Basic sanitization - remove potentially harmful patterns
  return code
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}