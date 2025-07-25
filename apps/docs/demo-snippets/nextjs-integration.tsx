import React, { useState } from 'react';
import { createNextJSAdapter } from '@benyue1978/next-dynamic-forms';

// Example UI components (replace with your actual components)
const uiComponents = {
  Input: ({ value, onChange, ...props }: { value: string; onChange: (value: string) => void; [key: string]: any }) => (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...props}
      />
    </div>
  ),
  Textarea: ({ value, onChange, ...props }: { value: string; onChange: (value: string) => void; [key: string]: any }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      {...props}
    />
  ),
  Label: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
    <label className="block text-sm font-medium text-gray-700 mb-2" {...props}>
      {children}
    </label>
  ),
  Button: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
    <button
      className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      {...props}
    >
      {children}
    </button>
  ),
  ProgressStep: ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )
};

const formConfig: import('@benyue1978/next-dynamic-forms').FormConfig = {
  id: 'project-setup',
  templateName: 'project_setup',
  steps: [
    {
      id: 'project-info',
      title: 'Project Information',
      description: 'Tell us about your new project',
      fields: [
        {
          name: 'projectName',
          type: 'input',
          label: 'Project Name',
          placeholder: 'Enter project name',
          required: true,
          icon: '🏗️'
        },
        {
          name: 'projectType',
          type: 'select',
          label: 'Project Type',
          required: true,
          options: [
            { value: 'web-app', label: 'Web Application' },
            { value: 'mobile-app', label: 'Mobile Application' },
            { value: 'api-service', label: 'API Service' },
            { value: 'library', label: 'Library/Package' }
          ]
        }
      ]
    },
    {
      id: 'tech-stack',
      title: 'Technology Stack',
      description: 'Choose your preferred technologies',
      fields: [
        {
          name: 'frontend',
          type: 'select',
          label: 'Frontend Framework',
          required: true,
          options: [
            { value: 'react', label: 'React' },
            { value: 'nextjs', label: 'Next.js' },
            { value: 'vue', label: 'Vue.js' }
          ]
        },
        {
          name: 'styling',
          type: 'select',
          label: 'Styling Solution',
          required: true,
          options: [
            { value: 'tailwind', label: 'Tailwind CSS' },
            { value: 'styled-components', label: 'Styled Components' },
            { value: 'css-modules', label: 'CSS Modules' }
          ]
        }
      ]
    }
  ]
};

const NextJSDynamicForm = createNextJSAdapter(uiComponents);

import { DynamicFormData } from '@benyue1978/next-dynamic-forms';

export default function NextJSProjectForm() {
  const [formData, setFormData] = useState<DynamicFormData>({ taskType: 'new-project' });
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = () => {
    if (currentStep < formConfig.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsGenerating(true);
      console.log('Generating project with:', formData);
      
      setTimeout(() => {
        setIsGenerating(false);
        alert('Project generated successfully! Check console for details.');
      }, 2000);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            New Project Setup
          </h1>
          <p className="text-gray-600">
            Let's configure your new project step by step
          </p>
        </div>

        <NextJSDynamicForm
          config={formConfig}
          currentStepIndex={currentStep}
          formData={formData}
          onDataChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirstStep={currentStep === 0}
          isLastStep={currentStep === formConfig.steps.length - 1}
        />
      </div>
    </div>
  );
}