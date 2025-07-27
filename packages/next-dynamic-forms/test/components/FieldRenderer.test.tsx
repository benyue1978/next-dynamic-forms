import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FieldRenderer } from '../../src/components/FieldRenderer'
import type { FormField, UIComponents, I18nAdapter } from '../../src/types'

// Mock UI components
const MockInput = vi.fn(({ id, value, onChange, ...props }) => (
  <input 
    id={id}
    value={value}
    onChange={onChange}
    data-testid="mock-input"
    {...props}
  />
))

const MockTextarea = vi.fn(({ id, value, onChange, ...props }) => (
  <textarea 
    id={id}
    value={value}
    onChange={onChange}
    data-testid="mock-textarea"
    {...props}
  />
))

const MockLabel = vi.fn(({ htmlFor, children, ...props }) => (
  <label htmlFor={htmlFor} data-testid="mock-label" {...props}>
    {children}
  </label>
))

const mockUIComponents: UIComponents = {
  Input: MockInput,
  Textarea: MockTextarea,
  Label: MockLabel,
  Button: vi.fn(() => <button data-testid="mock-button" />),
  ProgressStep: vi.fn(() => <div data-testid="mock-progress" />)
}

const mockI18n: I18nAdapter = {
  t: (key: string, params?: Record<string, any>) => {
    if (params) {
      return key.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match)
    }
    return key
  }
}

describe('FieldRenderer', () => {
  const mockOnChange = vi.fn()

  // Define test fields at the top level
  const inputField: FormField = {
    name: 'testInput',
    type: 'input',
    label: 'Test Input',
    placeholder: 'Enter text',
    required: false // Make it optional for testing
  }

  const requiredInputField: FormField = {
    name: 'testInput',
    type: 'input',
    label: 'Test Input',
    placeholder: 'Enter text',
    required: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Input field', () => {
    it('should render input field correctly', () => {
      render(
        <FieldRenderer
          field={requiredInputField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      expect(screen.getByTestId('mock-label')).toBeInTheDocument()
      expect(screen.getByTestId('mock-input')).toBeInTheDocument()
      expect(screen.getByText('Test Input')).toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument() // Required indicator
    })

    it('should handle input changes', () => {
      render(
        <FieldRenderer
          field={inputField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const input = screen.getByTestId('mock-input')
      fireEvent.change(input, { target: { value: 'new value' } })

      expect(mockOnChange).toHaveBeenCalledWith('new value')
    })

    it('should show optional indicator for non-required fields', () => {
      render(
        <FieldRenderer
          field={inputField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      expect(screen.getByText('(Optional)')).toBeInTheDocument()
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('should display field description', () => {
      const fieldWithDescription = {
        ...inputField,
        description: 'This is a test field'
      }

      render(
        <FieldRenderer
          field={fieldWithDescription}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      expect(screen.getByText('This is a test field')).toBeInTheDocument()
    })
  })

  describe('Textarea field', () => {
    const textareaField: FormField = {
      name: 'testTextarea',
      type: 'textarea',
      label: 'Test Textarea',
      rows: 5,
      required: false
    }

    it('should render textarea field correctly', () => {
      render(
        <FieldRenderer
          field={textareaField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      expect(screen.getByTestId('mock-textarea')).toBeInTheDocument()
      expect(MockTextarea).toHaveBeenCalledWith(
        expect.objectContaining({
          rows: 5
        }),
        expect.any(Object)
      )
    })
  })

  describe('Select field', () => {
    const selectField: FormField = {
      name: 'testSelect',
      type: 'select',
      label: 'Test Select',
      required: true,
      options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
      ]
    }

    it('should render select field correctly', () => {
      render(
        <FieldRenderer
          field={selectField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
      expect(screen.getByText('Option 1')).toBeInTheDocument()
      expect(screen.getByText('Option 2')).toBeInTheDocument()
    })

    it('should handle select changes', () => {
      render(
        <FieldRenderer
          field={selectField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'option1' } })

      expect(mockOnChange).toHaveBeenCalledWith('option1')
    })
  })

  describe('Tags field', () => {
    const tagsField: FormField = {
      name: 'testTags',
      type: 'tags',
      label: 'Test Tags',
      required: false
    }

    it('should render tags field correctly', () => {
      render(
        <FieldRenderer
          field={tagsField}
          value={['tag1', 'tag2']}
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const input = screen.getByTestId('mock-input')
      expect(input).toHaveValue('tag1, tag2')
    })

    it('should handle tags changes', () => {
      render(
        <FieldRenderer
          field={tagsField}
          value={[]}
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const input = screen.getByTestId('mock-input')
      fireEvent.change(input, { target: { value: 'tag1, tag2, tag3' } })

      expect(mockOnChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3'])
    })

    it('should filter empty tags', () => {
      render(
        <FieldRenderer
          field={tagsField}
          value={[]}
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const input = screen.getByTestId('mock-input')
      fireEvent.change(input, { target: { value: 'tag1, , tag2,  ,tag3' } })

      expect(mockOnChange).toHaveBeenCalledWith(['tag1', 'tag2', 'tag3'])
    })
  })

  describe('Checkbox field', () => {
    const checkboxField: FormField = {
      name: 'testCheckbox',
      type: 'checkbox',
      label: 'Test Checkbox',
      required: false
    }

    it('should render checkbox field correctly', () => {
      render(
        <FieldRenderer
          field={checkboxField}
          value={false}
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).not.toBeChecked()
    })

    it('should handle checkbox changes', () => {
      render(
        <FieldRenderer
          field={checkboxField}
          value={false}
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      expect(mockOnChange).toHaveBeenCalledWith(true)
    })

    it('should show checked state', () => {
      render(
        <FieldRenderer
          field={checkboxField}
          value={true}
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeChecked()
    })
  })

  describe('Unknown field type', () => {
    const unknownField = {
      name: 'unknown',
      type: 'unknown' as any,
      label: 'Unknown Field',
      required: false
    }

    it('should render nothing for unknown field types', () => {
      const { container } = render(
        <FieldRenderer
          field={unknownField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      expect(screen.getByTestId('mock-label')).toBeInTheDocument()
      expect(container.querySelector('input, textarea, select')).not.toBeInTheDocument()
    })
  })

  describe('Icon support', () => {
    it('should display field icon', () => {
      const fieldWithIcon = { 
        ...inputField, 
        icon: '🔍' 
      }
      
      render(
        <FieldRenderer
          field={fieldWithIcon}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      expect(screen.getByText('🔍')).toBeInTheDocument()
    })
  })

  describe('Styling customization', () => {
    it('should apply custom container className', () => {
      render(
        <FieldRenderer
          field={inputField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
          containerClassName="custom-container"
        />
      )

      const container = screen.getByText('Test Input').closest('.field-container')
      expect(container).toHaveClass('custom-container')
    })

    it('should apply custom label className', () => {
      render(
        <FieldRenderer
          field={inputField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
          labelClassName="custom-label"
        />
      )

      const label = screen.getByTestId('mock-label')
      expect(label).toHaveClass('custom-label')
    })

    it('should apply custom input className', () => {
      render(
        <FieldRenderer
          field={inputField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
          inputClassName="custom-input"
        />
      )

      const input = screen.getByTestId('mock-input')
      expect(input).toHaveClass('custom-input')
    })

    it('should apply custom icon className', () => {
      const fieldWithIcon = { 
        ...inputField, 
        icon: '🔍' 
      }
      
      render(
        <FieldRenderer
          field={fieldWithIcon}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
          iconClassName="custom-icon"
        />
      )

      const icon = screen.getByText('🔍')
      expect(icon).toHaveClass('custom-icon')
    })

    it('should apply custom required className', () => {
      const requiredField = { 
        ...inputField, 
        required: true 
      }
      
      render(
        <FieldRenderer
          field={requiredField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
          requiredClassName="custom-required"
        />
      )

      const requiredIndicator = screen.getByText('*')
      expect(requiredIndicator).toHaveClass('custom-required')
    })

    it('should apply custom optional className', () => {
      render(
        <FieldRenderer
          field={inputField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
          optionalClassName="custom-optional"
        />
      )

      const optionalIndicator = screen.getByText('(Optional)')
      expect(optionalIndicator).toHaveClass('custom-optional')
    })

    it('should merge custom classes with default classes', () => {
      render(
        <FieldRenderer
          field={inputField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
          labelClassName="custom-label"
          inputClassName="custom-input"
        />
      )

      const label = screen.getByTestId('mock-label')
      const input = screen.getByTestId('mock-input')

      // Should have both default and custom classes
      expect(label).toHaveClass('flex', 'items-center', 'gap-2', 'custom-label')
      expect(input).toHaveClass('w-full', 'px-3', 'py-2', 'custom-input')
    })
  })

  describe('Icon positioning', () => {
    it('should position icon correctly with relative/absolute layout', () => {
      const fieldWithIcon = { 
        ...inputField, 
        icon: '🔍' 
      }
      
      render(
        <FieldRenderer
          field={fieldWithIcon}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const container = screen.getByText('🔍').closest('.relative')
      const input = screen.getByTestId('mock-input')
      const icon = screen.getByText('🔍')

      expect(container).toBeInTheDocument()
      expect(input).toHaveClass('pr-10') // Should have right padding for icon
      expect(icon).toHaveClass('absolute', 'right-3', 'top-1/2', 'transform', '-translate-y-1/2')
    })

    it('should not add padding when no icon is present', () => {
      render(
        <FieldRenderer
          field={inputField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const input = screen.getByTestId('mock-input')
      expect(input).not.toHaveClass('pr-10')
    })
  })

  describe('Select field styling', () => {
    it('should render select with proper styling and arrow', () => {
      const selectField: FormField = {
        name: 'testSelect',
        type: 'select',
        label: 'Test Select',
        required: true,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      }

      render(
        <FieldRenderer
          field={selectField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('appearance-none', 'bg-white')
      
      // Should have default arrow icon
      const arrow = select.parentElement?.querySelector('svg')
      expect(arrow).toBeInTheDocument()
    })

    it('should handle select with custom icon', () => {
      const selectFieldWithIcon: FormField = {
        name: 'testSelect',
        type: 'select',
        label: 'Test Select',
        required: true,
        icon: '📋',
        options: [
          { value: 'option1', label: 'Option 1' }
        ]
      }

      render(
        <FieldRenderer
          field={selectFieldWithIcon}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const select = screen.getByRole('combobox')
      const customIcon = screen.getByText('📋')
      
      expect(select).toHaveClass('pr-10')
      expect(customIcon).toHaveClass('absolute', 'right-3')
    })
  })

  describe('Checkbox field styling', () => {
    it('should render checkbox with proper styling', () => {
      const checkboxField: FormField = {
        name: 'testCheckbox',
        type: 'checkbox',
        label: 'Test Checkbox',
        required: false
      }

      render(
        <FieldRenderer
          field={checkboxField}
          value={false}
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('w-4', 'h-4', 'text-blue-600', 'bg-gray-100', 'border-gray-300', 'rounded')
    })

    it('should render checkbox with icon', () => {
      const checkboxFieldWithIcon: FormField = {
        name: 'testCheckbox',
        type: 'checkbox',
        label: 'Test Checkbox',
        required: false,
        icon: '✅'
      }

      render(
        <FieldRenderer
          field={checkboxFieldWithIcon}
          value={false}
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      const icon = screen.getByText('✅')
      expect(icon).toHaveClass('text-gray-400')
    })
  })
}) 