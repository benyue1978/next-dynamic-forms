'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { UIComponents, I18nAdapter, DynamicFormData, FormConfig } from '../types'
import { DynamicForm } from '../components/DynamicForm'

// Basic adapter (no next-intl dependency, for other frameworks)
export function createBasicAdapter(uiComponents: UIComponents) {
  return function BasicDynamicForm(props: {
    config: FormConfig;
    currentStepIndex: number;
    formData: DynamicFormData;
    onDataChange: (data: Partial<DynamicFormData>) => void;
    onNext: () => void;
    onPrevious: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    // Optional custom render functions
    renderPreviousButton?: (onClick: () => void, disabled: boolean) => React.ReactNode;
    renderNextButton?: (onClick: () => void, isLastStep: boolean) => React.ReactNode;
    renderProgress?: (currentStep: number, totalSteps: number) => React.ReactNode;
  }) {
    // Create a simple i18n adapter, using keys as default values
    const i18nAdapter: I18nAdapter = {
      t: (key: string, params?: Record<string, any>) => {
        // Simple parameter replacement
        if (params) {
          return key.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match)
        }
        return key
      }
    }

    return (
      <DynamicForm
        {...props}
        uiComponents={uiComponents}
        i18n={i18nAdapter}
      />
    )
  }
}

// Next.js + next-intl specific adapter (out-of-the-box)
export function createNextJSAdapter(uiComponents: UIComponents) {
  return function NextJSDynamicForm(props: {
    config: FormConfig;
    currentStepIndex: number;
    formData: DynamicFormData;
    onDataChange: (data: Partial<DynamicFormData>) => void;
    onNext: () => void;
    onPrevious: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
    // Optional custom render functions
    renderPreviousButton?: (onClick: () => void, disabled: boolean) => React.ReactNode;
    renderNextButton?: (onClick: () => void, isLastStep: boolean) => React.ReactNode;
    renderProgress?: (currentStep: number, totalSteps: number) => React.ReactNode;
  }) {
    const t = useTranslations()
    
    const i18nAdapter: I18nAdapter = {
      t: (key: string, params?: Record<string, any>) => t(key, params)
    }

    return (
      <DynamicForm
        {...props}
        uiComponents={uiComponents}
        i18n={i18nAdapter}
      />
    )
  }
}

// Convenience function: create complete Next.js adapter system
export function createNextJSFormSystem(uiComponents: UIComponents) {
  const NextJSDynamicForm = createNextJSAdapter(uiComponents)
  
  return {
    DynamicForm: NextJSDynamicForm,
    createI18nAdapter: (): I18nAdapter => {
      const t = useTranslations()
      return {
        t: (key: string, params?: Record<string, any>) => t(key, params)
      }
    }
  }
}

// Export backward compatible aliases
export { createNextJSAdapter as createNextJSAdapterCompat, createNextJSFormSystem as createNextJSFormSystemCompat } 