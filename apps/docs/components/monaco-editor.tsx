'use client'

import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { SandpackProvider, SandpackLayout, SandpackPreview, SandpackCodeEditor } from '@codesandbox/sandpack-react'

interface MonacoEditorProps {
  code: string
  onChange: (code: string) => void
  onRun: (code: string) => void
}

const defaultFiles = {
  '/App.tsx': '',
  '/index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);`,
  '/package.json': `{
  "dependencies": {
    "@benyue1978/next-dynamic-forms": "latest",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}`
}

export function MonacoEditor({ code, onChange, onRun }: MonacoEditorProps) {
  const [currentCode, setCurrentCode] = useState(code)

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || ''
    setCurrentCode(newCode)
    onChange(newCode)
  }

  const runCode = () => {
    onRun(currentCode)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
          <span className="text-sm font-medium">Editor</span>
          <button
            onClick={runCode}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            Run Code
          </button>
        </div>
        <Editor
          height="calc(600px - 48px)"
          defaultLanguage="typescript"
          defaultValue={currentCode}
          theme="vs-dark"
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on'
          }}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 border-b">
          <span className="text-sm font-medium">Preview</span>
        </div>
        <div className="h-[calc(600px-48px)]">
          <SandpackProvider
            template="react-ts"
            files={{
              ...defaultFiles,
              '/App.tsx': currentCode
            }}
            options={{}}
          >
            <SandpackLayout>
              <SandpackPreview showOpenInCodeSandbox={false} />
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
    </div>
  )
}