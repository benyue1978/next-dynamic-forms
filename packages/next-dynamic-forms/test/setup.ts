import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Make React available globally
global.React = React

// Mock next-intl for testing
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, any>) => {
    if (params) {
      return key.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match)
    }
    return key
  }
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useParams: () => ({}),
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock fetch globally
global.fetch = vi.fn() 