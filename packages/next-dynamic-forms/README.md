# @benyue1978/dynamic-forms

A configuration-driven dynamic form system with multi-step forms, built-in internationalization, and UI component adaptation.

## 🚀 Quick Start

### Basic Usage

```bash
npm install @benyue1978/dynamic-forms
```

```tsx
import { DynamicForm, createApiConfigLoader } from '@benyue1978/dynamic-forms'

// 1. Define UI components
const uiComponents = {
  Input: MyInput,
  Textarea: MyTextarea,
  Label: MyLabel,
  Button: MyButton,
  ProgressStep: MyProgressStep
}

// 2. Define i18n adapter
const i18nAdapter = {
  t: (key: string, params?: Record<string, any>) => {
    // Your translation logic
    return translate(key, params)
  }
}

// 3. Use the component
function MyForm() {
  const configLoader = createApiConfigLoader()
  
  return (
    <DynamicForm
      config={formConfig}
      currentStepIndex={0}
      formData={data}
      onDataChange={handleChange}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isFirstStep={true}
      isLastStep={false}
      uiComponents={uiComponents}
      i18n={i18nAdapter}
    />
  )
}
```

## 🎯 Next.js + next-intl Integration

### Option 1: Simple Adapter (Recommended)

Create an adapter file `lib/dynamic-forms-adapter.tsx`:

```tsx
'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { DynamicForm, UIComponents, I18nAdapter } from '@benyue1978/dynamic-forms'
// Import your UI components
import { Input, Textarea, Label, Button } from '@/components/ui'

// Define UI component mapping
export const uiComponents: UIComponents = {
  Input, Textarea, Label, Button
}

// Create Next.js adapter component
export function NextJSDynamicForm(props: {
  // ... all DynamicForm props
}) {
  const t = useTranslations()
  
  const i18nAdapter: I18nAdapter = {
    t: (key: string, params?: Record<string, any>) => t(key, params)
  }

  return (
    <DynamicForm
      {...props}
      uiComponents={uiComponents}
      i18n={i18nAdapter}
    />
  )
}
```

Usage:

```tsx
import { NextJSDynamicForm } from '@/lib/dynamic-forms-adapter'

function MyPage() {
  return (
    <NextJSDynamicForm
      config={formConfig}
      // ... other props
    />
  )
}
```

### Option 2: Built-in Adapter (Experimental)

```tsx
import { createNextJSAdapter } from '@benyue1978/dynamic-forms'

const NextJSForm = createNextJSAdapter(uiComponents)

function MyPage() {
  return <NextJSForm config={formConfig} /* ... */ />
}
```

**Note**: Built-in adapters may have dependency version conflicts. Option 1 is recommended.

## 🔧 Other Framework Adapters

### React + react-i18next

```tsx
import { useTranslation } from 'react-i18next'
import { DynamicForm } from '@benyue1978/dynamic-forms'

function ReactI18nForm(props) {
  const { t } = useTranslation()
  
  const i18nAdapter = {
    t: (key: string, params?: Record<string, any>) => t(key, params)
  }

  return <DynamicForm {...props} i18n={i18nAdapter} />
}
```

### No Internationalization

```tsx
import { createBasicAdapter } from '@benyue1978/dynamic-forms'

const BasicForm = createBasicAdapter(uiComponents)
// Will use keys as display text
```

## 📝 Configuration File Format

```json
{
  "id": "new-project",
  "templateName": "new_project_template",
  "steps": [
    {
      "id": "step1",
      "title": "Basic Information",
      "description": "Please fill in the basic project information",
      "fields": [
        {
          "name": "projectName",
          "type": "input",
          "label": "Project Name",
          "placeholder": "Enter project name",
          "required": true
        }
      ]
    }
  ]
}
```

## 🎨 UI Component Requirements

Your UI components need to satisfy the following interface:

```tsx
interface UIComponents {
  Input: React.ComponentType<{
    id?: string
    value: string
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    required?: boolean
  }>
  
  Textarea: React.ComponentType<{
    id?: string
    value: string
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
    rows?: number
    placeholder?: string
  }>
  
  Label: React.ComponentType<{
    htmlFor?: string
    children: React.ReactNode
  }>
  
  Button: React.ComponentType<{
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit'
  }>
  
  ProgressStep?: React.ComponentType<{
    currentStep: number
    totalSteps: number
  }>
}
```

## 🤔 FAQ

### Q: Does every project need to create an adapter?

**A**: Yes, but this is a deliberate design decision:

1. **Flexibility**: Different projects use different UI libraries and i18n solutions
2. **Avoid dependency conflicts**: Direct inclusion would cause version locking
3. **Simplicity**: Adapter code is simple, usually only 10-20 lines

### Q: Can you provide pre-made adapters?

**A**: We are considering providing:

- Template code generators
- Adapter examples for common UI libraries
- More simplified APIs

### Q: How to reduce boilerplate code?

**A**: You can:

1. Create project-level hooks
2. Use code snippets/templates
3. Create internal wrappers for teams

## 📦 Complete Examples

Check the [examples/](./examples/) directory for complete example projects.

## 🛠️ Development

```bash
npm run test       # Run tests
npm run build      # Build package
npm run coverage   # Test coverage
```
