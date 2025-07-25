// Core types
export type {
  FormField,
  FormStep,
  FormConfig,
  TaskType,
  DynamicFormData,
  UIComponents,
  I18nAdapter
} from './types'

// Core components
export { DynamicForm } from './components/DynamicForm'
export { FieldRenderer } from './components/FieldRenderer'

// Configuration loaders
export type { ConfigLoader } from './utils/config-loader'
export {
  createConfigLoader,
  createApiConfigLoader,
  createStaticConfigLoader,
  DEFAULT_TASK_TYPES
} from './utils/config-loader'

// Adapters
export {
  createBasicAdapter,        // Basic adapter, no specific framework dependency
  createNextJSAdapter,       // Next.js + next-intl adapter
  createNextJSFormSystem     // Complete Next.js system
} from './adapters/nextjs'

// Backward compatible aliases
export {
  createNextJSAdapterCompat as createNextJSAdapterLegacy,
  createNextJSFormSystemCompat as createNextJSFormSystemLegacy
} from './adapters/nextjs' 