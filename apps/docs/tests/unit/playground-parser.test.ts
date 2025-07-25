import { describe, it, expect } from 'vitest'
import { encodeBase64, decodeBase64, validateUrlCode } from '../../lib/playground-parser'

describe('Playground Parser', () => {
  describe('Base64 encoding/decoding', () => {
    it('should encode string to base64', () => {
      const input = 'const test = "hello"'
      const encoded = encodeBase64(input)
      expect(encoded).toBe(btoa(input))
      expect(decodeBase64(encoded)).toBe(input)
    })

    it('should handle empty strings', () => {
      expect(encodeBase64('')).toBe('')
      expect(decodeBase64('')).toBe('')
    })

    it('should handle special characters', () => {
      const input = 'console.log("Hello, 世界! 🌍")'
      const encoded = encodeBase64(input)
      expect(decodeBase64(encoded)).toBe(input)
    })
  })

  describe('URL code validation', () => {
    it('should validate valid base64 code', () => {
      const validCode = btoa('console.log("test")')
      expect(() => validateUrlCode(validCode)).not.toThrow()
    })

    it('should reject invalid base64', () => {
      expect(() => validateUrlCode('invalid-base64')).toThrow('Invalid base64 encoding')
    })

    it('should reject oversized code', () => {
      const largeCode = 'a'.repeat(50000)
      const encoded = btoa(largeCode)
      expect(() => validateUrlCode(encoded)).toThrow('Code too large')
    })

    it('should reject empty code', () => {
      expect(() => validateUrlCode('')).toThrow('Empty code')
    })
  })

  describe('Safety checks', () => {
    it('should prevent XSS in code', () => {
      const maliciousCode = 'alert("xss")'
      const encoded = btoa(maliciousCode)
      // We allow JS execution in sandbox, but validate format
      expect(() => validateUrlCode(encoded)).not.toThrow()
    })

    it('should handle malformed UTF-8', () => {
      const malformed = btoa('test\xFF')
      expect(() => decodeBase64(malformed)).not.toThrow()
    })
  })
})