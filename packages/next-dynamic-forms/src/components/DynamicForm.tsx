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
  renderProgress
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
      className="border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-10 py-4 text-lg backdrop-blur-sm"
    >
      <div className="flex items-center space-x-2">
        <span>←</span>
        <span>{isFirstStep ? t('ProjectForm.backToSelection') : t('ProjectForm.previousStep')}</span>
      </div>
    </Button>
  )

  const defaultNextButton = (onClick: () => void, isLast: boolean) => (
    <Button 
      type="submit"
      className="modern-button px-10 py-4 text-lg"
    >
      {isLast ? (
        <span>{t('ProjectForm.generatePrompt')}</span>
      ) : (
        <div className="flex items-center space-x-2">
          <span>{t('ProjectForm.nextStep')}</span>
          <span>→</span>
        </div>
      )}
    </Button>
  )

  const defaultProgress = (currentStep: number, totalSteps: number) => 
    ProgressStep ? <ProgressStep currentStep={currentStep} totalSteps={totalSteps} /> : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        {(renderProgress || defaultProgress)(currentStepIndex + 1, config.steps.length) && (
          <div className="mb-12 animate-fade-in">
            {(renderProgress || defaultProgress)(currentStepIndex + 1, config.steps.length)}
          </div>
        )}

        <div className="modern-card p-12 animate-fade-in">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="tech-dot mr-3"></div>
              <h1 className="text-4xl font-bold gradient-text">
                {t(currentStep.title)}
              </h1>
              <div className="tech-dot ml-3"></div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t(currentStep.description)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
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

            <div className="flex justify-between pt-8">
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