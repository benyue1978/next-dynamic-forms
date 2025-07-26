'use client'

import React from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import { demoConfigs, type DemoName } from '../lib/sandpack'

interface DemoPreviewProps {
  demo: DemoName
  height?: string
  showEditor?: boolean
  showTabs?: boolean
}

export function DemoPreview({ demo, height = '800px', showEditor = false, showTabs = true }: DemoPreviewProps) {
  const config = demoConfigs[demo]
  
  if (!config) {
    return (
      <div className="text-red-500 p-4 bg-red-50 border border-red-200 rounded-lg">
        Demo "{demo}" not found
      </div>
    )
  }

  return (
    <div style={{ height }}>
      <Sandpack
        template="react-ts"
        theme="dark"
        files={config.files}
        options={{
          visibleFiles: showEditor ? Object.keys(config.files) : [],
          activeFile: '/App.tsx',
          showLineNumbers: true,
          showTabs: showTabs,
          closableTabs: false,
          editorHeight: 800,
          editorWidthPercentage: showEditor ? 50 : 0,
          wrapContent: true,
          recompileMode: 'delayed',
          recompileDelay: 300,
          autorun: true
        }}
        customSetup={{
          dependencies: {
            '@benyue1978/next-dynamic-forms': 'latest',
            'react': '^18.2.0',
            'react-dom': '^18.2.0',
            'next': '^14.0.0',
            'next-intl': '^3.0.0',
            '@types/react': '^18.2.0',
            '@types/react-dom': '^18.2.0'
          }
        }}
      />
    </div>
  )
}

// Default export for simpler usage
export default DemoPreview