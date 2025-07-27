import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DynamicForm } from '../../src/components/DynamicForm'
import type { FormConfig, DynamicFormData, UIComponents, I18nAdapter } from '../../src/types'

// Mock UI components
const MockInput = vi.fn(({ id, value, onChange, className, ...props }) => (
  <input 
    id={id}
    value={value}
    onChange={onChange}
    className={className}
    data-testid="mock-input"
    {...props}
  />
))

const MockButton = vi.fn(({ children, onClick, disabled, type, ...props }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    type={type}
    data-testid="mock-button"
    {...props}
  >
    {children}
  </button>
))

const MockProgressStep = vi.fn(({ currentStep, totalSteps }) => (
  <div data-testid="mock-progress">
    Step {currentStep} of {totalSteps}
  </div>
))

const MockLabel = vi.fn(({ children, className, ...props }) => (
  <label className={className} data-testid="mock-label" {...props}>
    {children}
  </label>
))

const mockUIComponents: UIComponents = {
  Input: MockInput,
  Textarea: vi.fn(() => <textarea data-testid="mock-textarea" />),
  Label: MockLabel,
  Button: MockButton,
  ProgressStep: MockProgressStep
}

const mockI18n: I18nAdapter = {
  t: (key: string, params?: Record<string, any>) => {
    if (params) {
      return key.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match)
    }
    return key
  }
}

const mockConfig: FormConfig = {
  id: 'test-form',
  templateName: 'test_template',
  steps: [
    {
      id: 'step1',
      title: 'Step 1 Title',
      description: 'Step 1 Description',
      fields: [
        {
          name: 'field1',
          type: 'input',
          label: 'Field 1',
          required: true
        },
        {
          name: 'field2',
          type: 'input',
          label: 'Field 2',
          required: false
        }
      ]
    },
    {
      id: 'step2',
      title: 'Step 2 Title',
      description: 'Step 2 Description',
      fields: [
        {
          name: 'field3',
          type: 'input',
          label: 'Field 3',
          required: true
        }
      ]
    }
  ]
}

describe('DynamicForm', () => {
  const mockProps = {
    config: mockConfig,
    currentStepIndex: 0,
    formData: { taskType: 'new-project' as const, field1: '', field2: '', field3: '' },
    onDataChange: vi.fn(),
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    isFirstStep: true,
    isLastStep: false,
    uiComponents: mockUIComponents,
    i18n: mockI18n
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render form correctly', () => {
      render(<DynamicForm {...mockProps} />)
      
      expect(screen.getByText('Step 1 Title')).toBeInTheDocument()
      expect(screen.getByText('Step 1 Description')).toBeInTheDocument()
      expect(screen.getByTestId('mock-progress')).toBeInTheDocument()
      expect(screen.getByText('Step 1 of 2')).toBeInTheDocument()
    })

    it('should render all fields for current step', () => {
      render(<DynamicForm {...mockProps} />)
      
      const inputs = screen.getAllByTestId('mock-input')
      expect(inputs).toHaveLength(2) // field1 and field2
    })

    it('should render navigation buttons', () => {
      render(<DynamicForm {...mockProps} />)
      
      const buttons = screen.getAllByTestId('mock-button')
      expect(buttons).toHaveLength(2) // Previous and Next buttons
    })
  })

  describe('Navigation', () => {
    it('should handle next button click', () => {
      const formData = { taskType: 'new-project' as const, field1: 'value1', field2: 'value2' }
      
      render(
        <DynamicForm 
          {...mockProps} 
          formData={formData}
        />
      )
      
      const form = document.querySelector('form')!
      fireEvent.submit(form)
      
      expect(mockProps.onNext).toHaveBeenCalled()
    })

    it('should handle previous button click', () => {
      render(
        <DynamicForm 
          {...mockProps} 
          isFirstStep={false}
        />
      )
      
      const buttons = screen.getAllByTestId('mock-button')
      const previousButton = buttons[0]
      fireEvent.click(previousButton)
      
      expect(mockProps.onPrevious).toHaveBeenCalled()
    })

    it('should prevent navigation when required fields are missing', () => {
      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      render(<DynamicForm {...mockProps} />)
      
      const form = document.querySelector('form')!
      fireEvent.submit(form)
      
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('Please fill in all required fields')
      )
      expect(mockProps.onNext).not.toHaveBeenCalled()
      
      alertSpy.mockRestore()
    })

    it('should allow navigation when all required fields are filled', () => {
      const formData = { 
        taskType: 'new-project' as const, 
        field1: 'value1', // Required field is filled
        field2: '' // Optional field can be empty
      }
      
      render(
        <DynamicForm 
          {...mockProps} 
          formData={formData}
        />
      )
      
      const form = document.querySelector('form')!
      fireEvent.submit(form)
      
      expect(mockProps.onNext).toHaveBeenCalled()
    })
  })

  describe('Field interaction', () => {
    it('should handle field changes', () => {
      render(<DynamicForm {...mockProps} />)
      
      const inputs = screen.getAllByTestId('mock-input')
      fireEvent.change(inputs[0], { target: { value: 'new value' } })
      
      expect(mockProps.onDataChange).toHaveBeenCalledWith({ field1: 'new value' })
    })
  })

  describe('Step progression', () => {
    it('should show correct step information for first step', () => {
      render(<DynamicForm {...mockProps} />)
      
      expect(screen.getByText('Step 1 of 2')).toBeInTheDocument()
      expect(screen.getByText('Step 1 Title')).toBeInTheDocument()
    })

    it('should show correct step information for last step', () => {
      render(
        <DynamicForm 
          {...mockProps} 
          currentStepIndex={1}
          isFirstStep={false}
          isLastStep={true}
        />
      )
      
      expect(screen.getByText('Step 2 of 2')).toBeInTheDocument()
      expect(screen.getByText('Step 2 Title')).toBeInTheDocument()
    })
  })

  describe('Custom render props', () => {
    it('should use custom previous button renderer', () => {
      const customPreviousButton = vi.fn((onClick, disabled) => (
        <button onClick={onClick} disabled={disabled} data-testid="custom-previous">
          Custom Previous
        </button>
      ))
      
      render(
        <DynamicForm 
          {...mockProps} 
          renderPreviousButton={customPreviousButton}
        />
      )
      
      expect(screen.getByTestId('custom-previous')).toBeInTheDocument()
      expect(screen.getByText('Custom Previous')).toBeInTheDocument()
      expect(customPreviousButton).toHaveBeenCalledWith(
        expect.any(Function),
        true // isFirstStep
      )
    })

    it('should use custom next button renderer', () => {
      const customNextButton = vi.fn((onClick, isLastStep) => (
        <button onClick={onClick} data-testid="custom-next">
          {isLastStep ? 'Custom Submit' : 'Custom Next'}
        </button>
      ))
      
      render(
        <DynamicForm 
          {...mockProps} 
          renderNextButton={customNextButton}
        />
      )
      
      expect(screen.getByTestId('custom-next')).toBeInTheDocument()
      expect(screen.getByText('Custom Next')).toBeInTheDocument()
      expect(customNextButton).toHaveBeenCalledWith(
        expect.any(Function),
        false // isLastStep
      )
    })

    it('should use custom progress renderer', () => {
      const customProgress = vi.fn((currentStep, totalSteps) => (
        <div data-testid="custom-progress">
          Custom Progress: {currentStep}/{totalSteps}
        </div>
      ))
      
      render(
        <DynamicForm 
          {...mockProps} 
          renderProgress={customProgress}
        />
      )
      
      expect(screen.getByTestId('custom-progress')).toBeInTheDocument()
      expect(screen.getByText('Custom Progress: 1/2')).toBeInTheDocument()
      expect(customProgress).toHaveBeenCalledWith(1, 2)
    })
  })

  describe('Form validation', () => {
    it('should validate array fields correctly', () => {
      const configWithArrayField: FormConfig = {
        ...mockConfig,
        steps: [{
          ...mockConfig.steps[0],
          fields: [{
            name: 'arrayField',
            type: 'tags',
            label: 'Array Field',
            required: true
          }]
        }]
      }
      
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
             render(
         <DynamicForm 
           {...mockProps} 
           config={configWithArrayField}
           formData={{ taskType: 'new-project', arrayField: [] }}
         />
       )
       
       const form = document.querySelector('form')!
       fireEvent.submit(form)
      
      expect(alertSpy).toHaveBeenCalled()
      expect(mockProps.onNext).not.toHaveBeenCalled()
      
      alertSpy.mockRestore()
    })

    it('should allow submission with filled array fields', () => {
      const configWithArrayField: FormConfig = {
        ...mockConfig,
        steps: [{
          ...mockConfig.steps[0],
          fields: [{
            name: 'arrayField',
            type: 'tags',
            label: 'Array Field',
            required: true
          }]
        }]
      }
      
             render(
         <DynamicForm 
           {...mockProps} 
           config={configWithArrayField}
           formData={{ taskType: 'new-project', arrayField: ['tag1', 'tag2'] }}
         />
       )
       
       const form = document.querySelector('form')!
       fireEvent.submit(form)
      
      expect(mockProps.onNext).toHaveBeenCalled()
    })
  })

  describe('Progress display', () => {
    it('should not render progress when no ProgressStep component provided', () => {
      const uiComponentsWithoutProgress = {
        ...mockUIComponents,
        ProgressStep: undefined
      }
      
      render(
        <DynamicForm 
          {...mockProps} 
          uiComponents={uiComponentsWithoutProgress}
        />
      )
      
      // Should not crash and should render form normally
      expect(screen.getByText('Step 1 Title')).toBeInTheDocument()
    })
  })

  describe('Styling customization', () => {
    it('should apply custom container className', () => {
      render(
        <DynamicForm 
          {...mockProps} 
          containerClassName="custom-container"
        />
      )
      
      const container = screen.getByText('Step 1 Title').closest('.dynamic-form-wrapper')
      expect(container).toHaveClass('custom-container')
    })

    it('should apply custom header className', () => {
      render(
        <DynamicForm 
          {...mockProps} 
          headerClassName="custom-header"
        />
      )
      
      const header = screen.getByText('Step 1 Title').closest('.dynamic-form-header')
      expect(header).toHaveClass('custom-header')
    })

    it('should apply custom form className', () => {
      render(
        <DynamicForm 
          {...mockProps} 
          formClassName="custom-form"
        />
      )
      
      const form = screen.getByText('Step 1 Title').closest('.dynamic-form-content')
      expect(form).toHaveClass('custom-form')
    })

    it('should apply custom button container className', () => {
      render(
        <DynamicForm 
          {...mockProps} 
          buttonContainerClassName="custom-button-container"
        />
      )
      
      const buttonContainer = screen.getByText('Next').closest('.dynamic-form-buttons')
      expect(buttonContainer).toHaveClass('custom-button-container')
    })

    it('should apply custom field styling props', () => {
      render(
        <DynamicForm 
          {...mockProps} 
          fieldClassName="custom-field"
          fieldContainerClassName="custom-field-container"
          fieldLabelClassName="custom-field-label"
          fieldInputClassName="custom-field-input"
        />
      )
      
      // Check that field styling props are passed to FieldRenderer
      const inputs = screen.getAllByTestId('mock-input')
      const labels = screen.getAllByTestId('mock-label')
      
      // Check first input and label
      expect(inputs[0]).toHaveClass('custom-field-input')
      expect(labels[0]).toHaveClass('custom-field-label')
    })
  })

  describe('Text customization', () => {
    it('should apply custom button texts', () => {
      render(
        <DynamicForm 
          {...mockProps} 
          buttonTexts={{
            previous: '上一步',
            next: '下一步',
            submit: '提交',
            back: '返回'
          }}
        />
      )
      
      expect(screen.getByText('返回')).toBeInTheDocument() // First step shows back button
      expect(screen.getByText('下一步')).toBeInTheDocument()
    })

    it('should apply custom labels', () => {
      // Create config with optional field
      const configWithOptionalField = {
        ...mockConfig,
        steps: [
          {
            ...mockConfig.steps[0],
            fields: [
              { name: 'field1', type: 'input', label: 'Field 1', required: true },
              { name: 'field2', type: 'input', label: 'Field 2', required: false } // Optional field
            ]
          }
        ]
      }
      
      render(
        <DynamicForm 
          {...mockProps} 
          config={configWithOptionalField}
          labels={{
            optional: '(可选)',
            pleaseSelect: '请选择...'
          }}
        />
      )
      
      // Use getAllByText since there might be multiple elements
      const elements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('(可选)') || false
      })
      expect(elements.length).toBeGreaterThan(0)
    })

    it('should apply custom error messages', () => {
      // Create form data with missing required field
      const formDataWithMissingField = { 
        // Missing taskType which is required
      }
      
      // Mock alert before rendering
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
      
      render(
        <DynamicForm 
          {...mockProps} 
          formData={formDataWithMissingField}
          errorMessages={{
            requiredFieldsMissing: '请填写必填字段: {fields}'
          }}
        />
      )
      
      const form = document.querySelector('form')!
      fireEvent.submit(form)
      
      expect(alertSpy).toHaveBeenCalledWith(
        expect.stringContaining('请填写必填字段')
      )
      
      alertSpy.mockRestore()
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
              { name: 'field1', type: 'input', label: 'Field 1', required: true },
              { name: 'field2', type: 'input', label: 'Field 2', required: false } // Optional field
            ]
          }
        ]
      }
      
      render(
        <DynamicForm 
          {...mockProps} 
          config={configWithOptionalField}
          className="custom-form-wrapper"
          containerClassName="custom-container"
          buttonTexts={{ submit: '提交' }}
          labels={{ optional: '(可选)' }}
          fieldClassName="custom-field"
          fieldInputClassName="custom-input"
        />
      )
      
      // Check styling
      const container = screen.getByText('Step 1 Title').closest('.dynamic-form-wrapper')
      expect(container).toHaveClass('custom-container')
      
      // Check text customization with flexible matcher
      const elements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('(可选)') || false
      })
      expect(elements.length).toBeGreaterThan(0)
      
      // Check field styling
      const inputs = screen.getAllByTestId('mock-input')
      expect(inputs[0]).toHaveClass('custom-input')
    })
  })
}) 