'use client'

import React from 'react'
import { UIComponents, I18nAdapter, DynamicFormData, FormConfig, FormTextConfig } from '../types'
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