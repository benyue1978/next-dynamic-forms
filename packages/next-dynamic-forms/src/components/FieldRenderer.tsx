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
          <div className="relative">
            <Input
              id={field.name}
              value={value || ''}
              onChange={(e: any) => onChange(e.target.value)}
              placeholder={field.placeholder ? t(field.placeholder) : ''}
              required={field.required}
              className="modern-input text-lg py-6"
            />
            {field.icon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
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
              onChange={(e: any) => onChange(e.target.value)}
              placeholder={field.placeholder ? t(field.placeholder) : ''}
              rows={field.rows || 4}
              required={field.required}
              className="modern-input text-lg py-6 resize-none"
            />
            {field.icon && (
              <div className="absolute right-3 top-3 text-muted-foreground">
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
              className="modern-input text-lg py-6 w-full"
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
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {field.icon}
              </div>
            )}
          </div>
        )

      case 'tags':
        return (
          <div className="relative">
            <Input
              id={field.name}
              value={Array.isArray(value) ? value.join(', ') : ''}
              onChange={(e: any) => {
                const tags = e.target.value.split(',').map((s: string) => s.trim()).filter((s: string) => s);
                onChange(tags);
              }}
              placeholder={field.placeholder ? t(field.placeholder) : ''}
              required={field.required}
              className="modern-input text-lg py-6"
            />
            {field.icon && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                {field.icon}
              </div>
            )}
          </div>
        )

      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={field.name}
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="w-5 h-5 text-primary focus:ring-primary border-2 border-muted-foreground rounded"
            />
            {field.icon && (
              <span className="text-muted-foreground">{field.icon}</span>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={field.name} className="text-xl font-semibold text-foreground">
        {t(field.label)} 
        {field.required && <span className="text-red-500 font-bold">*</span>}
        {!field.required && <span className="text-muted-foreground text-sm ml-2">{t('Common.optional')}</span>}
      </Label>
      {renderField()}
      {field.description && (
        <p className="text-sm text-muted-foreground ml-1">
          {t(field.description)}
        </p>
      )}
    </div>
  )
} 