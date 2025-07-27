# @benyue1978/next-dynamic-forms

A configuration-driven dynamic form system with multi-step forms, built-in internationalization, and UI component adaptation.

## 🚀 Quick Start

### Installation

```bash
npm install @benyue1978/next-dynamic-forms
# or
pnpm add @benyue1978/next-dynamic-forms
# or
yarn add @benyue1978/next-dynamic-forms
```

### Basic Usage

```tsx
import { DynamicForm } from '@benyue1978/next-dynamic-forms/core'

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
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  
  return (
    <DynamicForm
      config={formConfig}
      currentStepIndex={currentStep}
      formData={formData}
      onDataChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
      onNext={() => setCurrentStep(prev => prev + 1)}
      onPrevious={() => setCurrentStep(prev => prev - 1)}
      isFirstStep={currentStep === 0}
      isLastStep={currentStep === formConfig.steps.length - 1}
      uiComponents={uiComponents}
      i18n={i18nAdapter}
    />
  )
}
```

### Customizing Form Texts

You can customize all form texts without relying on specific translation keys:

```tsx
<DynamicForm
  config={formConfig}
  // ... other props
  buttonTexts={{
    previous: '上一步',
    next: '下一步',
    submit: '提交',
    back: '返回'
  }}
  labels={{
    optional: '(可选)',
    pleaseSelect: '请选择...'
  }}
  errorMessages={{
    requiredFieldsMissing: '请填写必填字段: {fields}'
  }}
/>
```

## 🎯 Next.js + next-intl Integration

### Option 1: Simple Adapter (Recommended)

Create an adapter file `lib/dynamic-forms-adapter.tsx`:

```tsx
'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { DynamicForm, UIComponents, I18nAdapter } from '@benyue1978/next-dynamic-forms/core'
// Import your UI components
import { Input, Textarea, Label, Button } from '@/components/ui'

// Define UI component mapping
export const uiComponents: UIComponents = {
  Input, Textarea, Label, Button
}

// Create Next.js adapter component
export function NextJSDynamicForm(props: {
  config: any
  currentStepIndex: number
  formData: any
  onDataChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  isFirstStep: boolean
  isLastStep: boolean
  // Optional text customization
  buttonTexts?: {
    previous?: string;
    next?: string;
    submit?: string;
    back?: string;
  };
  labels?: {
    optional?: string;
    pleaseSelect?: string;
  };
  errorMessages?: {
    requiredFieldsMissing?: string;
  };
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
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  
  return (
    <NextJSDynamicForm
      config={formConfig}
      currentStepIndex={currentStep}
      formData={formData}
      onDataChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
      onNext={() => setCurrentStep(prev => prev + 1)}
      onPrevious={() => setCurrentStep(prev => prev - 1)}
      isFirstStep={currentStep === 0}
      isLastStep={currentStep === formConfig.steps.length - 1}
      buttonTexts={{
        submit: 'Generate Project',
        back: 'Back to Projects'
      }}
    />
  )
}
```

### Option 2: Built-in Adapter

```tsx
import { createNextJSAdapter } from '@benyue1978/next-dynamic-forms'

const NextJSForm = createNextJSAdapter(uiComponents)

function MyPage() {
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  
  return (
    <NextJSForm 
      config={formConfig}
      currentStepIndex={currentStep}
      formData={formData}
      onDataChange={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
      onNext={() => setCurrentStep(prev => prev + 1)}
      onPrevious={() => setCurrentStep(prev => prev - 1)}
      isFirstStep={currentStep === 0}
      isLastStep={currentStep === formConfig.steps.length - 1}
      buttonTexts={{
        submit: 'Generate Project',
        back: 'Back to Projects'
      }}
    />
  )
}
```

## 🔧 Other Framework Adapters

### React + react-i18next

```tsx
import { useTranslation } from 'react-i18next'
import { DynamicForm } from '@benyue1978/next-dynamic-forms/core'

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
import { createBasicAdapter } from '@benyue1978/next-dynamic-forms'

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
        },
        {
          "name": "description",
          "type": "textarea",
          "label": "Description",
          "placeholder": "Enter project description",
          "rows": 4
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
    onChange: (value: string) => void
    placeholder?: string
    required?: boolean
    className?: string
  }>
  
  Textarea: React.ComponentType<{
    id?: string
    value: string
    onChange: (value: string) => void
    rows?: number
    placeholder?: string
    className?: string
  }>
  
  Label: React.ComponentType<{
    htmlFor?: string
    children: React.ReactNode
    className?: string
  }>
  
  Button: React.ComponentType<{
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit'
    className?: string
  }>
  
  ProgressStep?: React.ComponentType<{
    currentStep: number
    totalSteps: number
    className?: string
  }>
}
```

## 📦 Package Exports

The package provides two entry points:

- **Main entry** (`@benyue1978/next-dynamic-forms`): Includes Next.js adapters
- **Core entry** (`@benyue1978/next-dynamic-forms/core`): Core components only, no Next.js dependencies

```tsx
// For Next.js projects
import { createNextJSAdapter } from '@benyue1978/next-dynamic-forms'

// For other React projects
import { DynamicForm } from '@benyue1978/next-dynamic-forms/core'
```

## 🎨 Text Customization

### Default Texts

The form uses these default texts:

```typescript
// Button texts
{
  previous: 'Previous',
  next: 'Next', 
  submit: 'Submit',
  back: 'Back'
}

// Labels
{
  optional: 'Optional',
  pleaseSelect: 'Please select...'
}

// Error messages
{
  requiredFieldsMissing: 'Please fill in all required fields: {fields}'
}
```

### Customizing Texts

You can override any text by passing the corresponding props:

```tsx
<DynamicForm
  config={formConfig}
  // ... other props
  buttonTexts={{
    submit: 'Generate Project',  // Override submit button
    back: 'Back to Projects'     // Override back button
  }}
  labels={{
    optional: '(Optional)'       // Override optional label
  }}
  errorMessages={{
    requiredFieldsMissing: 'Missing fields: {fields}'  // Override error message
  }}
/>
```

### Internationalization Support

Texts can be internationalized through the i18n adapter:

```tsx
const i18nAdapter = {
  t: (key: string, params?: any) => {
    const translations = {
      'form.buttons.submit': '提交',
      'form.buttons.back': '返回',
      'form.labels.optional': '(可选)',
      // ... other translations
    };
    return translations[key] || key;
  }
};
```

## 🤔 FAQ

### Q: Does every project need to create an adapter?

**A**: No, but it's recommended for better integration:

1. **Flexibility**: Different projects use different UI libraries and i18n solutions
2. **Avoid dependency conflicts**: Direct inclusion would cause version locking
3. **Simplicity**: Adapter code is simple, usually only 10-20 lines

### Q: Can you provide pre-made adapters?

**A**: We provide:

- `createBasicAdapter`: For projects without i18n
- `createNextJSAdapter`: For Next.js + next-intl projects
- Core components for custom implementations

### Q: How to reduce boilerplate code?

**A**: You can:

1. Create project-level hooks
2. Use code snippets/templates
3. Create internal wrappers for teams

### Q: Can I customize form texts without translation keys?

**A**: Yes! The form now supports direct text customization:

```tsx
<DynamicForm
  buttonTexts={{ submit: 'Generate Project' }}
  labels={{ optional: '(Optional)' }}
  errorMessages={{ requiredFieldsMissing: 'Missing: {fields}' }}
/>
```

## 📖 Documentation

Visit our [interactive documentation](https://next-dynamic-forms.withus.fun) for:

- 📚 [Getting Started Guide](https://next-dynamic-forms.withus.fun)
- 🎯 [Examples](https://next-dynamic-forms.withus.fun/demos)
- 🎮 [Interactive Playground](https://next-dynamic-forms.withus.fun/playground)

## 🛠️ Development

```bash
npm run test       # Run tests
npm run build      # Build package
npm run coverage   # Test coverage
```

## 📄 License

MIT © [benyue1978](https://github.com/benyue1978)
