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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Input field', () => {
    const inputField: FormField = {
      name: 'testInput',
      type: 'input',
      label: 'Test Input',
      placeholder: 'Enter text',
      required: true
    }

    it('should render input field correctly', () => {
      render(
        <FieldRenderer
          field={inputField}
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
      const optionalField = { ...inputField, required: false }
      
      render(
        <FieldRenderer
          field={optionalField}
          value=""
          onChange={mockOnChange}
          uiComponents={mockUIComponents}
          i18n={mockI18n}
        />
      )

      expect(screen.getByText('Common.optional')).toBeInTheDocument()
      expect(screen.queryByText('*')).not.toBeInTheDocument()
    })

    it('should display field description', () => {
      const fieldWithDescription = { 
        ...inputField, 
        description: 'This is a description' 
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

      expect(screen.getByText('This is a description')).toBeInTheDocument()
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
        undefined
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
    const fieldWithIcon: FormField = {
      name: 'iconField',
      type: 'input',
      label: 'Field with Icon',
      icon: '🔍',
      required: false
    }

    it('should display field icon', () => {
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
}) 