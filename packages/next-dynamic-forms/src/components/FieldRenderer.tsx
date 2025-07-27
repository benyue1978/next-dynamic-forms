'use client'

import React from 'react'
import { FormField, UIComponents, I18nAdapter } from '../types'

interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  uiComponents: UIComponents;
  i18n: I18nAdapter;
  // Optional text customization
  labels?: {
    optional?: string;
    pleaseSelect?: string;
  };
  // Optional styling customization
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  iconClassName?: string;
  requiredClassName?: string;
  optionalClassName?: string;
}

export function FieldRenderer({ 
  field, 
  value, 
  onChange, 
  uiComponents, 
  i18n,
  labels = {},
  className = '',
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
  iconClassName = '',
  requiredClassName = '',
  optionalClassName = ''
}: FieldRendererProps) {
  const { Input, Textarea, Label } = uiComponents
  const { t } = i18n

  // Default labels
  const defaultLabels = {
    optional: 'Optional',
    pleaseSelect: 'Please select...'
  }

  // Merge with provided labels
  const finalLabels = { ...defaultLabels, ...labels }

  // Default CSS classes
  const defaultClasses = {
    container: 'field-container',
    label: 'flex items-center gap-2 text-sm font-medium text-gray-700 mb-2',
    input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    icon: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none',
    required: 'text-red-500 font-bold',
    optional: 'text-gray-500 text-sm font-normal'
  }

  // Merge with provided classes
  const classes = {
    container: `${defaultClasses.container} ${containerClassName}`.trim(),
    label: `${defaultClasses.label} ${labelClassName}`.trim(),
    input: `${defaultClasses.input} ${inputClassName}`.trim(),
    icon: `${defaultClasses.icon} ${iconClassName}`.trim(),
    required: `${defaultClasses.required} ${requiredClassName}`.trim(),
    optional: `${defaultClasses.optional} ${optionalClassName}`.trim()
  }

  const renderField = () => {
    switch (field.type) {
      case 'input':
        return (
          <div className="relative">
            <Input
              id={field.name}
              value={value || ''}
              onChange={(newValue: any) => {
                // Handle both event objects and direct values
                const finalValue = newValue?.target?.value ?? newValue;
                onChange(finalValue);
              }}
              placeholder={field.placeholder ? t(field.placeholder) : ''}
              required={field.required}
              className={`${classes.input} ${field.icon ? 'pr-10' : ''}`}
            />
            {field.icon && (
              <div className={classes.icon}>
                {field.icon}
              </div>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div className="relative">
            <Textarea
              id={field.name}
              value={value || ''}
              onChange={(newValue: any) => {
                // Handle both event objects and direct values
                const finalValue = newValue?.target?.value ?? newValue;
                onChange(finalValue);
              }}
              placeholder={field.placeholder ? t(field.placeholder) : ''}
              rows={field.rows || 4}
              required={field.required}
              className={`${classes.input} ${field.icon ? 'pr-10' : ''}`}
            />
            {field.icon && (
              <div className={classes.icon}>
                {field.icon}
              </div>
            )}
          </div>
        )

      case 'select':
        return (
          <div className="relative">
            <select
              id={field.name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
              className={`${classes.input} ${field.icon ? 'pr-10' : ''} appearance-none bg-white`}
            >
              <option value="" disabled>
                {field.placeholder ? t(field.placeholder) : finalLabels.pleaseSelect}
              </option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.icon && (
              <div className={classes.icon}>
                {field.icon}
              </div>
            )}
            {/* Default select arrow */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )

      case 'tags':
        return (
          <div className="relative">
            <Input
              id={field.name}
              value={Array.isArray(value) ? value.join(', ') : ''}
              onChange={(newValue: any) => {
                // Handle both event objects and direct values
                const finalValue = newValue?.target?.value ?? newValue;
                const tags = finalValue.split(',').map((s: string) => s.trim()).filter((s: string) => s);
                onChange(tags);
              }}
              placeholder={field.placeholder ? t(field.placeholder) : ''}
              required={field.required}
              className={`${classes.input} ${field.icon ? 'pr-10' : ''}`}
            />
            {field.icon && (
              <div className={classes.icon}>
                {field.icon}
              </div>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={field.name}
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            {field.icon && (
              <span className="text-gray-400">{field.icon}</span>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={`${classes.container} ${className}`}>
      <Label htmlFor={field.name} className={classes.label}>
        {t(field.label)}
        {field.required && <span className={classes.required}>*</span>}
        {!field.required && <span className={classes.optional}>({finalLabels.optional})</span>}
      </Label>
      {renderField()}
      {field.description && (
        <p className="mt-1 text-sm text-gray-500">
          {t(field.description)}
        </p>
      )}
    </div>
  )
} 