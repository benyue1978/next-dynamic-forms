import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DynamicForm } from '../../src/components/DynamicForm'
import type { FormConfig, DynamicFormData, UIComponents, I18nAdapter } from '../../src/types'

// Mock UI components
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
        expect.stringContaining('Common.requiredFieldsMissing')
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
      const uiWithoutProgress = {
        ...mockUIComponents,
        ProgressStep: undefined
      }
      
      render(
        <DynamicForm 
          {...mockProps} 
          uiComponents={uiWithoutProgress}
        />
      )
      
      expect(screen.queryByTestId('mock-progress')).not.toBeInTheDocument()
    })
  })
}) 