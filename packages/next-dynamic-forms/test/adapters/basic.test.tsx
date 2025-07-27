import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { createBasicAdapter } from '../../src/adapters/basic'
import { FormConfig, FormField, DynamicFormData } from '../../src/types'

// Mock UI components
const mockUIComponents = {
  Input: ({ id, value, onChange, placeholder, required, className }: any) => (
    <input
      data-testid="mock-input"
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={className}
    />
  ),
  Textarea: ({ id, value, onChange, rows, placeholder, className }: any) => (
    <textarea
      data-testid="mock-textarea"
      id={id}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className={className}
    />
  ),
  Label: ({ htmlFor, children, className }: any) => (
    <label data-testid="mock-label" htmlFor={htmlFor} className={className}>
      {children}
    </label>
  ),
  Button: ({ children, onClick, disabled, type, className }: any) => (
    <button
      data-testid="mock-button"
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </button>
  )
}

// Mock form configuration
const mockConfig: FormConfig = {
  id: 'test-form',
  templateName: 'test-template',
  steps: [
    {
      id: 'step1',
      title: 'Test Step',
      description: 'Test Description',
      fields: [
        {
          name: 'field1',
          type: 'input',
          label: 'Test Field',
          required: true
        }
      ]
    }
  ]
}

const mockFormData: DynamicFormData = {
  taskType: 'new-project',
  field1: 'test value'
}

describe('createBasicAdapter', () => {
  const mockOnDataChange = vi.fn()
  const mockOnNext = vi.fn()
  const mockOnPrevious = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic functionality', () => {
    it('should create a functional form component', () => {
      const BasicForm = createBasicAdapter(mockUIComponents)
      
      render(
        <BasicForm
          config={mockConfig}
          currentStepIndex={0}
          formData={mockFormData}
          onDataChange={mockOnDataChange}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isFirstStep={true}
          isLastStep={false}
        />
      )
      
      expect(screen.getByText('Test Step')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Field')).toBeInTheDocument()
    })

    it('should handle field changes', () => {
      const BasicForm = createBasicAdapter(mockUIComponents)
      
      render(
        <BasicForm
          config={mockConfig}
          currentStepIndex={0}
          formData={mockFormData}
          onDataChange={mockOnDataChange}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isFirstStep={true}
          isLastStep={false}
        />
      )
      
      const input = screen.getByTestId('mock-input')
      fireEvent.change(input, { target: { value: 'new value' } })
      
      expect(mockOnDataChange).toHaveBeenCalledWith({ field1: 'new value' })
    })

    it('should handle form submission', () => {
      const BasicForm = createBasicAdapter(mockUIComponents)
      
      render(
        <BasicForm
          config={mockConfig}
          currentStepIndex={0}
          formData={mockFormData}
          onDataChange={mockOnDataChange}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isFirstStep={true}
          isLastStep={false}
        />
      )
      
      const form = document.querySelector('form')!
      fireEvent.submit(form)
      
      expect(mockOnNext).toHaveBeenCalled()
    })
  })

  describe('Styling customization', () => {
    it('should pass styling props to DynamicForm', () => {
      const BasicForm = createBasicAdapter(mockUIComponents)
      
      render(
        <BasicForm
          config={mockConfig}
          currentStepIndex={0}
          formData={mockFormData}
          onDataChange={mockOnDataChange}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isFirstStep={true}
          isLastStep={false}
          className="custom-form"
          containerClassName="custom-container"
          headerClassName="custom-header"
          formClassName="custom-form-content"
          buttonContainerClassName="custom-buttons"
          fieldClassName="custom-field"
          fieldInputClassName="custom-input"
        />
      )
      
      // Check that styling props are applied
      const container = screen.getByText('Test Step').closest('.dynamic-form-wrapper')
      expect(container).toHaveClass('custom-container')
      
      const input = screen.getByTestId('mock-input')
      expect(input).toHaveClass('custom-input')
    })
  })

  describe('Text customization', () => {
    it('should pass text customization props to DynamicForm', () => {
      // Create config with optional field
      const configWithOptionalField = {
        ...mockConfig,
        steps: [
          {
            ...mockConfig.steps[0],
            fields: [
              { name: 'field1', type: 'input', label: 'Test Field', required: false } // Optional field
            ]
          }
        ]
      }
      
      const BasicForm = createBasicAdapter(mockUIComponents)
      
      render(
        <BasicForm
          config={configWithOptionalField}
          currentStepIndex={0}
          formData={mockFormData}
          onDataChange={mockOnDataChange}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isFirstStep={true}
          isLastStep={false}
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
      )
      
      // Check that text customization is applied
      expect(screen.getByText('返回')).toBeInTheDocument()
      expect(screen.getByText('下一步')).toBeInTheDocument()
      // Use flexible text matcher for optional text
      const elements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('(可选)') || false
      })
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  describe('Combined customization', () => {
    it('should handle both styling and text customization together', () => {
      // Create config with optional field
      const configWithOptionalField = {
        ...mockConfig,
        steps: [
          {
            ...mockConfig.steps[0],
            fields: [
              { name: 'field1', type: 'input', label: 'Test Field', required: false } // Optional field
            ]
          }
        ]
      }
      
      const BasicForm = createBasicAdapter(mockUIComponents)
      
      render(
        <BasicForm
          config={configWithOptionalField}
          currentStepIndex={0}
          formData={mockFormData}
          onDataChange={mockOnDataChange}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isFirstStep={true}
          isLastStep={false}
          className="custom-form"
          containerClassName="custom-container"
          fieldInputClassName="custom-input"
          buttonTexts={{ back: 'Back', next: 'Next' }}
          labels={{ optional: '(可选)' }}
        />
      )
      
      // Check styling
      const container = screen.getByText('Test Step').closest('.dynamic-form-wrapper')
      expect(container).toHaveClass('custom-container')
      
      // Check text
      const elements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('(可选)') || false
      })
      expect(elements.length).toBeGreaterThan(0)
    })
  })

  describe('I18n adapter', () => {
    it('should provide fallback translation function', () => {
      const BasicForm = createBasicAdapter(mockUIComponents)
      
      render(
        <BasicForm
          config={mockConfig}
          currentStepIndex={0}
          formData={mockFormData}
          onDataChange={mockOnDataChange}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isFirstStep={true}
          isLastStep={false}
        />
      )
      
      // The adapter should handle translation keys as fallback
      expect(screen.getByText('Test Step')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('should handle parameter replacement in translations', () => {
      const configWithParams: FormConfig = {
        ...mockConfig,
        steps: [
          {
            ...mockConfig.steps[0],
            title: 'Step {number}',
            description: 'Description for step {number}'
          }
        ]
      }
      
      const BasicForm = createBasicAdapter(mockUIComponents)
      
      render(
        <BasicForm
          config={configWithParams}
          currentStepIndex={0}
          formData={mockFormData}
          onDataChange={mockOnDataChange}
          onNext={mockOnNext}
          onPrevious={mockOnPrevious}
          isFirstStep={true}
          isLastStep={false}
        />
      )
      
      // Should show the key as fallback when no parameters provided
      expect(screen.getByText('Step {number}')).toBeInTheDocument()
      expect(screen.getByText('Description for step {number}')).toBeInTheDocument()
    })
  })
}) 