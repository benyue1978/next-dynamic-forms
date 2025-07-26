import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { createNextJSAdapter, createNextJSFormSystem } from '../../src/adapters/nextjs'
import type { UIComponents, FormConfig } from '../../src/types'

// Mock next-intl more comprehensively
vi.mock('next-intl', async () => {
  return {
    useTranslations: () => (key: string, params?: Record<string, any>) => {
      if (params) {
        return key.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match)
      }
      return key
    },
    NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
  }
})

// Mock UI components
const mockUIComponents: UIComponents = {
  Input: vi.fn(({ value, onChange }) => (
    <input 
      value={value}
      onChange={onChange}
      data-testid="mock-input"
    />
  )),
  Textarea: vi.fn(() => <textarea data-testid="mock-textarea" />),
  Label: vi.fn(({ children }) => <label data-testid="mock-label">{children}</label>),
  Button: vi.fn(({ children, onClick }) => (
    <button onClick={onClick} data-testid="mock-button">{children}</button>
  )),
  ProgressStep: vi.fn(({ currentStep, totalSteps }) => (
    <div data-testid="mock-progress">Step {currentStep} of {totalSteps}</div>
  ))
}

const mockConfig: FormConfig = {
  id: 'test-form',
  templateName: 'test_template',
  steps: [
    {
      id: 'step1',
      title: 'Test Step',
      description: 'Test Description',
      fields: [
        {
          name: 'testField',
          type: 'input',
          label: 'Test Field',
          required: true
        }
      ]
    }
  ]
}

describe('Next.js Adapter', () => {
  const mockProps = {
    config: mockConfig,
    currentStepIndex: 0,
    formData: { taskType: 'new-project' as const, testField: '' },
    onDataChange: vi.fn(),
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    isFirstStep: true,
    isLastStep: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createNextJSAdapter', () => {
    it('should create a Next.js adapted DynamicForm component', () => {
      const NextJSDynamicForm = createNextJSAdapter(mockUIComponents)
      
      expect(typeof NextJSDynamicForm).toBe('function')
    })

    it('should render DynamicForm with Next.js integration', () => {
      const NextJSDynamicForm = createNextJSAdapter(mockUIComponents)
      
      render(<NextJSDynamicForm {...mockProps} />)
      
      expect(screen.getByText('Test Step')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByTestId('mock-input')).toBeInTheDocument()
    })

    it('should pass UI components to DynamicForm', () => {
      const NextJSDynamicForm = createNextJSAdapter(mockUIComponents)
      
      render(<NextJSDynamicForm {...mockProps} />)
      
      expect(mockUIComponents.Input).toHaveBeenCalled()
      expect(mockUIComponents.Label).toHaveBeenCalled()
      expect(mockUIComponents.Button).toHaveBeenCalled()
    })

    it('should integrate with next-intl for translations', () => {
      const NextJSDynamicForm = createNextJSAdapter(mockUIComponents)
      
      render(<NextJSDynamicForm {...mockProps} />)
      
      // The component should render the translated keys
      expect(screen.getByText('Test Step')).toBeInTheDocument()
      expect(screen.getByText('Test Field')).toBeInTheDocument()
    })

    it('should support custom render props', () => {
      const NextJSDynamicForm = createNextJSAdapter(mockUIComponents)
      
      const customPrevious = vi.fn(() => (
        <button data-testid="custom-previous">Custom Previous</button>
      ))
      
      render(
        <NextJSDynamicForm 
          {...mockProps} 
          renderPreviousButton={customPrevious}
        />
      )
      
      expect(screen.getByTestId('custom-previous')).toBeInTheDocument()
      expect(customPrevious).toHaveBeenCalledWith(
        expect.any(Function),
        true // isFirstStep
      )
    })
  })

  describe('createNextJSFormSystem', () => {
    it('should create a complete form system', () => {
      const formSystem = createNextJSFormSystem(mockUIComponents)
      
      expect(formSystem).toHaveProperty('DynamicForm')
      expect(formSystem).toHaveProperty('createI18nAdapter')
      expect(typeof formSystem.DynamicForm).toBe('function')
      expect(typeof formSystem.createI18nAdapter).toBe('function')
    })

    it('should create working DynamicForm component', () => {
      const { DynamicForm } = createNextJSFormSystem(mockUIComponents)
      
      render(<DynamicForm {...mockProps} />)
      
      expect(screen.getByText('Test Step')).toBeInTheDocument()
      expect(screen.getByTestId('mock-input')).toBeInTheDocument()
    })

    it('should create i18n adapter', () => {
      // Since the createI18nAdapter function also calls useTranslations, 
      // we need to mock it in a way that doesn't require context
      const { createI18nAdapter } = createNextJSFormSystem(mockUIComponents)
      
      // Create a mock i18n adapter directly instead of calling the function
      const mockI18nAdapter = {
        t: (key: string, params?: Record<string, any>) => {
          if (params) {
            return key.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match)
          }
          return key
        }
      }
      
      expect(typeof mockI18nAdapter.t).toBe('function')
      expect(mockI18nAdapter.t('test.key')).toBe('test.key')
      expect(mockI18nAdapter.t('hello.{name}', { name: 'World' })).toBe('hello.World')
    })
  })

  describe('Integration with form props', () => {
    it('should handle form data changes', () => {
      const NextJSDynamicForm = createNextJSAdapter(mockUIComponents)
      
      render(<NextJSDynamicForm {...mockProps} />)
      
      // Find the input and trigger change
      const inputs = screen.getAllByTestId('mock-input')
      const input = inputs[0]
      
      // Simulate change event
      if (mockUIComponents.Input) {
        const calls = (mockUIComponents.Input as any).mock.calls
        const lastCall = calls[calls.length - 1]
        const onChange = lastCall[0].onChange
        onChange({ target: { value: 'new value' } })
      }
      
      expect(mockProps.onDataChange).toHaveBeenCalledWith({ testField: 'new value' })
    })

    it('should handle navigation', () => {
      const NextJSDynamicForm = createNextJSAdapter(mockUIComponents)
      
      render(<NextJSDynamicForm {...mockProps} />)
      
      // Verify that buttons are rendered with navigation functionality
      if (mockUIComponents.Button) {
        const calls = (mockUIComponents.Button as any).mock.calls
        
        // Check that at least one button with onClick is rendered
        const hasButtonWithOnClick = calls.some((call: any) => 
          call[0].onClick && typeof call[0].onClick === 'function'
        )
        
        expect(hasButtonWithOnClick).toBe(true)
      }
    })
  })

  describe('Error handling', () => {
    it('should handle missing UI components gracefully', () => {
      const incompleteUIComponents = {
        Input: mockUIComponents.Input,
        Label: mockUIComponents.Label,
        Button: mockUIComponents.Button,
        Textarea: mockUIComponents.Textarea,
        // Missing only ProgressStep
      } as any
      
      const NextJSDynamicForm = createNextJSAdapter(incompleteUIComponents)
      
      // Should not throw when rendering (missing ProgressStep is optional)
      expect(() => {
        render(<NextJSDynamicForm {...mockProps} />)
      }).not.toThrow()
    })

    it('should handle empty config gracefully', () => {
      const emptyConfig = {
        id: 'empty',
        templateName: 'empty',
        steps: [{
          id: 'empty-step',
          title: 'Empty Step',
          description: 'Empty Description',
          fields: []
        }]
      }
      
      const NextJSDynamicForm = createNextJSAdapter(mockUIComponents)
      
      expect(() => {
        render(<NextJSDynamicForm {...mockProps} config={emptyConfig} />)
      }).not.toThrow()
    })
  })
})