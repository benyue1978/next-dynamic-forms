/**
 * Demo snippet loader utility
 */

const VALID_DEMOS = [
  'basic-form',
  'nextjs-integration',
  'custom-styling',
  'multi-step',
  'validation',
  'async-loading'
] as const

export type DemoName = typeof VALID_DEMOS[number]

/**
 * Load demo snippet from file system
 * @param name - Name of the demo to load
 * @returns Promise resolving to the demo code
 */
export async function loadDemoSnippet(name: DemoName): Promise<string> {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid demo name')
  }

  if (!VALID_DEMOS.includes(name)) {
    throw new Error(`Invalid demo name: ${name}. Valid demos: ${VALID_DEMOS.join(', ')}`)
  }

  if (name.includes('..') || name.includes('/')) {
    throw new Error('Invalid demo name')
  }

  try {
    const response = await fetch(`/demo-snippets/${name}.tsx`)
    
    if (!response.ok) {
      throw new Error(`Demo not found: ${name}`)
    }

    return await response.text()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load demo: ${error.message}`)
    }
    throw new Error('Failed to load demo')
  }
}

/**
 * Get list of available demos
 */
export function getAvailableDemos(): readonly DemoName[] {
  return VALID_DEMOS
}

/**
 * Check if a demo exists
 */
export function isValidDemo(name: string): name is DemoName {
  return VALID_DEMOS.includes(name as DemoName)
}