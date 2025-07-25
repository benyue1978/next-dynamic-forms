'use client'

import React from 'react'

const demos = [
  { name: 'basic-form', label: 'Basic Form', description: 'Simple contact form' },
  { name: 'nextjs-integration', label: 'Next.js Integration', description: 'Full Next.js example with i18n' },
  { name: 'custom-styling', label: 'Custom Styling', description: 'Styled with Tailwind CSS' },
  { name: 'multi-step', label: 'Multi-step Form', description: 'Complex multi-step form' },
  { name: 'validation', label: 'Validation', description: 'Form with validation' },
  { name: 'async-loading', label: 'Async Loading', description: 'Load config from API' }
]

interface DemoSelectorProps {
  value: string
  onChange: (demo: string) => void
}

export function DemoSelector({ value, onChange }: DemoSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border rounded bg-white text-sm"
    >
      <option value="">Select a demo...</option>
      {demos.map((demo) => (
        <option key={demo.name} value={demo.name}>
          {demo.label} - {demo.description}
        </option>
      ))}
    </select>
  )
}