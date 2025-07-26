'use client'

import React from 'react'
import { FormField, UIComponents, I18nAdapter } from '../types'

interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  uiComponents: UIComponents;
  i18n: I18nAdapter;
}

export function FieldRenderer({ field, value, onChange, uiComponents, i18n }: FieldRendererProps) {
  const { Input, Textarea, Label } = uiComponents
  const { t } = i18n

  const renderField = () => {
    switch (field.type) {
      case 'input':
        return (
          <div className="field-input-container">
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
            />
            {field.icon && (
              <div className="field-icon">
                {field.icon}
              </div>
            )}
          </div>
        )

      case 'textarea':
        return (
          <div className="field-textarea-container">
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
            />
            {field.icon && (
              <div className="field-icon">
                {field.icon}
              </div>
            )}
          </div>
        )

      case 'select':
        return (
          <div className="field-select-container">
            <select
              id={field.name}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
              className="field-select"
            >
              <option value="" disabled>
                {field.placeholder ? t(field.placeholder) : t('Common.pleaseSelect')}
              </option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.icon && (
              <div className="field-icon">
                {field.icon}
              </div>
            )}
          </div>
        )

      case 'tags':
        return (
          <div className="field-tags-container">
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
            />
            {field.icon && (
              <div className="field-icon">
                {field.icon}
              </div>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div className="field-checkbox-container">
            <input
              type="checkbox"
              id={field.name}
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="field-checkbox"
            />
            {field.icon && (
              <span className="field-icon">{field.icon}</span>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="field-container">
      <Label htmlFor={field.name} className="field-label">
        {t(field.label)} 
        {field.required && <span className="field-required">*</span>}
        {!field.required && <span className="field-optional">{t('Common.optional')}</span>}
      </Label>
      {renderField()}
      {field.description && (
        <p className="field-description">
          {t(field.description)}
        </p>
      )}
    </div>
  )
} 