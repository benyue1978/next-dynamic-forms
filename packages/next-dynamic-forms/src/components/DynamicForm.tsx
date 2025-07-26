'use client'

import React from 'react'
import { FormConfig, DynamicFormData, UIComponents, I18nAdapter } from '../types'
import { FieldRenderer } from './FieldRenderer'

interface DynamicFormProps {
  config: FormConfig;
  currentStepIndex: number;
  formData: DynamicFormData;
  onDataChange: (data: Partial<DynamicFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  uiComponents: UIComponents;
  i18n: I18nAdapter;
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
}

export function DynamicForm({
  config,
  currentStepIndex,
  formData,
  onDataChange,
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  uiComponents,
  i18n,
  renderPreviousButton,
  renderNextButton,
  renderProgress,
  className = '',
  containerClassName = '',
  headerClassName = '',
  formClassName = '',
  buttonContainerClassName = ''
}: DynamicFormProps) {
  const { Button, ProgressStep } = uiComponents
  const { t } = i18n
  const currentStep = config.steps[currentStepIndex]

  const handleFieldChange = (fieldName: string, value: any) => {
    onDataChange({ [fieldName]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields for current step
    const requiredFields = currentStep.fields.filter(field => field.required)
    const missingFields = requiredFields.filter(field => {
      const value = formData[field.name]
      return !value || (Array.isArray(value) && value.length === 0)
    })

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(field => t(field.label)).join(', ')
      alert(t('Common.requiredFieldsMissing', { fields: fieldNames }))
      return
    }

    onNext()
  }

  const defaultPreviousButton = (onClick: () => void, disabled: boolean) => (
    <Button 
      type="button" 
      variant="outline" 
      onClick={onClick}
      disabled={disabled}
    >
      {isFirstStep ? t('ProjectForm.backToSelection') : t('ProjectForm.previousStep')}
    </Button>
  )

  const defaultNextButton = (onClick: () => void, isLast: boolean) => (
    <Button 
      type="submit"
    >
      {isLast ? t('ProjectForm.generatePrompt') : t('ProjectForm.nextStep')}
    </Button>
  )

  const defaultProgress = (currentStep: number, totalSteps: number) => 
    ProgressStep ? <ProgressStep currentStep={currentStep} totalSteps={totalSteps} /> : null

  return (
    <div className={`dynamic-form-container ${className}`}>
      <div className={`dynamic-form-wrapper ${containerClassName}`}>
        {/* Progress indicator */}
        {(renderProgress || defaultProgress)(currentStepIndex + 1, config.steps.length) && (
          <div className="dynamic-form-progress">
            {(renderProgress || defaultProgress)(currentStepIndex + 1, config.steps.length)}
          </div>
        )}

        <div className={`dynamic-form-content ${formClassName}`}>
          <div className={`dynamic-form-header ${headerClassName}`}>
            <h1 className="dynamic-form-title">
              {t(currentStep.title)}
            </h1>
            <p className="dynamic-form-description">
              {t(currentStep.description)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="dynamic-form-fields">
            {currentStep.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                field={field}
                value={formData[field.name]}
                onChange={(value) => handleFieldChange(field.name, value)}
                uiComponents={uiComponents}
                i18n={i18n}
              />
            ))}

            <div className={`dynamic-form-buttons ${buttonContainerClassName}`}>
              {renderPreviousButton 
                ? renderPreviousButton(onPrevious, isFirstStep)
                : defaultPreviousButton(onPrevious, isFirstStep)
              }
              
              {renderNextButton
                ? renderNextButton(onNext, isLastStep)
                : defaultNextButton(onNext, isLastStep)
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 