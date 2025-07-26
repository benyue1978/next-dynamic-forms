export interface SandpackConfig {
  files: Record<string, string>
}

export type DemoName = 'basic-form' | 'multi-step' | 'custom-styling' | 'nextjs-integration'

export interface FormField {
  name: string
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'tags'
  label: string
  placeholder?: string
  required?: boolean
  description?: string
  options?: string[]
}

export interface FormStep {
  id: string
  title: string
  description: string
  fields: FormField[]
}

export interface FormConfig {
  id: string
  templateName: string
  steps: FormStep[]
} 