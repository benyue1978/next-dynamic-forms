'use client'

import React from 'react'
import { UIComponents, I18nAdapter, DynamicFormData, FormConfig } from '../types'
import { DynamicForm } from '../components/DynamicForm'



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
    // Dynamic import of next-intl to avoid bundling issues
    let useTranslations: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nextIntl = require('next-intl')
      useTranslations = nextIntl.useTranslations
    } catch (e) {
      throw new Error('next-intl is required for createNextJSAdapter. Please install next-intl or use createBasicAdapter instead.')
    }
    
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
      // Dynamic import of next-intl
      let useTranslations: any;
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const nextIntl = require('next-intl')
        useTranslations = nextIntl.useTranslations
      } catch (e) {
        throw new Error('next-intl is required for createNextJSFormSystem. Please install next-intl or use createBasicAdapter instead.')
      }
      
      const t = useTranslations()
      return {
        t: (key: string, params?: Record<string, any>) => t(key, params)
      }
    }
  }
}

// Export backward compatible aliases
export { createNextJSAdapter as createNextJSAdapterCompat, createNextJSFormSystem as createNextJSFormSystemCompat } 