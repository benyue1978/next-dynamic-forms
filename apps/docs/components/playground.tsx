'use client'

import React, { useState, useEffect } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import { MonacoEditor } from './monaco-editor'
import { DemoSelector } from './demo-selector'

const defaultCode = `import React from 'react';
import { createBasicAdapter } from '@benyue1978/next-dynamic-forms';

const uiComponents = {
  Input: ({ value, onChange, ...props }) => (
    <input 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="border rounded px-3 py-2 w-full" 
      {...props} 
    />
  ),
  Textarea: ({ value, onChange, ...props }) => (
    <textarea 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      className="border rounded px-3 py-2 w-full" 
      {...props} 
    />
  ),
  Label: ({ children, ...props }) => (
    <label className="block text-sm font-medium mb-2" {...props}>
      {children}
    </label>
  ),
  Button: ({ children, ...props }) => (
    <button 
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" 
      {...props}
    >
      {children}
    </button>
  )
};

const formConfig = {
  id: 'demo-form',
  templateName: 'demo',
  steps: [
    {
      id: 'step1',
      title: 'User Information',
      description: 'Please provide your basic information',
      fields: [
        {
          name: 'name',
          type: 'input',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true
        },
        {
          name: 'email',
          type: 'input',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true
        }
      ]
    }
  ]
};

const BasicForm = createBasicAdapter(uiComponents);

export default function App() {
  const [formData, setFormData] = React.useState({});
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNext = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Demo Form</h1>
      <BasicForm
        config={formConfig}
        currentStepIndex={currentStep}
        formData={formData}
        onDataChange={setFormData}
        onNext={handleNext}
        onPrevious={() => setCurrentStep(Math.max(0, currentStep - 1))}
        isFirstStep={currentStep === 0}
        isLastStep={currentStep === formConfig.steps.length - 1}
      />
    </div>
  );
}`;

export function Playground() {
  const [code, setCode] = useState(defaultCode)
  const [mode, setMode] = useState<'sandpack' | 'monaco'>('sandpack')
  const [demo, setDemo] = useState('basic-form')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const srcParam = urlParams.get('src')
    const demoParam = urlParams.get('demo')

    if (srcParam) {
      try {
        const decodedCode = atob(srcParam)
        setCode(decodedCode)
        setMode('monaco')
      } catch (error) {
        console.error('Invalid base64 code:', error)
      }
    } else if (demoParam) {
      setDemo(demoParam)
      loadDemo(demoParam)
    }
  }, [])

  const loadDemo = async (demoName: string) => {
    try {
      const response = await fetch(`/demo-snippets/${demoName}.tsx`)
      const demoCode = await response.text()
      setCode(demoCode)
    } catch (error) {
      console.error('Failed to load demo:', error)
    }
  }

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    
    // Update URL with base64 encoded code
    const encodedCode = btoa(newCode)
    const newUrl = `/playground?src=${encodedCode}`
    window.history.replaceState({}, '', newUrl)
  }

  const shareCode = () => {
    const encodedCode = btoa(code)
    const shareUrl = `${window.location.origin}/playground?src=${encodedCode}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Next Dynamic Forms Playground',
        url: shareUrl
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
      alert('Share URL copied to clipboard!')
    }
  }

  const resetCode = () => {
    setCode(defaultCode)
    window.history.replaceState({}, '', '/playground')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Interactive Playground</h1>
        <div className="flex gap-2">
          <DemoSelector value={demo} onChange={loadDemo} />
          <button
            onClick={shareCode}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Share
          </button>
          <button
            onClick={resetCode}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('sandpack')}
          className={`px-3 py-1 rounded \${
            mode === 'sandpack' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Sandpack
        </button>
        <button
          onClick={() => setMode('monaco')}
          className={`px-3 py-1 rounded \${
            mode === 'monaco' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Monaco Editor
        </button>
      </div>

      {mode === 'sandpack' ? (
        <Sandpack
          template="react-ts"
          theme="dark"
          files={{
            '/App.tsx': code,
            '/package.json': {
              code: JSON.stringify({
                dependencies: {
                  '@benyue1978/next-dynamic-forms': 'latest',
                  'react': '^18.2.0',
                  'react-dom': '^18.2.0'
                }
              }, null, 2)
            }
          }}
          options={{
            showLineNumbers: true,
            showInlineErrors: true,
            wrapContent: true,
            editorHeight: 500,
            recompileMode: 'delayed',
            recompileDelay: 500
          }}
        />
      ) : (
        <MonacoEditor
          code={code}
          onChange={handleCodeChange}
          onRun={handleCodeChange}
        />
      )}
    </div>
  )
}