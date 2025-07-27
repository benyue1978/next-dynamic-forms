'use client'

import React from 'react'
import { UIComponents, I18nAdapter, DynamicFormData, FormConfig, FormTextConfig } from '../types'
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
    // Optional styling props
    className?: string;
    containerClassName?: string;
    headerClassName?: string;
    formClassName?: string;
    buttonContainerClassName?: string;
    // Optional text customization
    buttonTexts?: FormTextConfig['buttonTexts'];
    labels?: FormTextConfig['labels'];
    errorMessages?: FormTextConfig['errorMessages'];
    // Optional field styling customization
    fieldClassName?: string;
    fieldContainerClassName?: string;
    fieldLabelClassName?: string;
    fieldInputClassName?: string;
    fieldIconClassName?: string;
    fieldRequiredClassName?: string;
    fieldOptionalClassName?: string;
  }) {
    // Dynamic import of next-intl to avoid bundling issues
    let useTranslations: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const nextIntl = require('next-intl')
      useTranslations = nextIntl.useTranslations
    } catch {
      throw new Error('next-intl is required for createNextJSAdapter. Please install next-intl or use createBasicAdapter instead.')
    }
    
    // Create a fallback translation function for cases where context is not available (e.g., in tests)
    const fallbackTranslator = (key: string, params?: Record<string, any>) => {
      if (params) {
        return key.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match)
      }
      return key
    };
    
    let t = fallbackTranslator;
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      t = useTranslations();
    } catch {
      // If useTranslations throws due to missing context (e.g., in tests), use fallback
      // This can happen when NextIntlClientProvider context is not available
    }
    
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
      } catch {
        throw new Error('next-intl is required for createNextJSFormSystem. Please install next-intl or use createBasicAdapter instead.')
      }
      
      // Create a fallback translation function for cases where context is not available (e.g., in tests)
      const fallbackTranslator = (key: string, params?: Record<string, any>) => {
        if (params) {
          return key.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match)
        }
        return key
      };
      
      let t = fallbackTranslator;
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        t = useTranslations();
      } catch {
        // If useTranslations throws due to missing context (e.g., in tests), use fallback
      }
      
      return {
        t: (key: string, params?: Record<string, any>) => t(key, params)
      }
    }
  }
}

// Export backward compatible aliases
export { createNextJSAdapter as createNextJSAdapterCompat, createNextJSFormSystem as createNextJSFormSystemCompat }