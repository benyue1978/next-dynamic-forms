import React, { useState } from 'react';
import { createBasicAdapter } from '@benyue1978/next-dynamic-forms';

const uiComponents = {
  Input: ({ value, onChange, ...props }: { value: string; onChange: (value: string) => void; [key: string]: any }) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  ),
  Textarea: ({ value, onChange, ...props }: { value: string; onChange: (value: string) => void; [key: string]: any }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    >
      {children}
    </button>
  )
};

const formConfig: import('@benyue1978/next-dynamic-forms').FormConfig = {
  id: 'contact-form',
  templateName: 'contact',
  steps: [
    {
      id: 'personal-info',
      title: 'Personal Information',
      description: 'Please provide your contact details',
      fields: [
        {
          name: 'fullName',
          type: 'input',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true
        },
        {
          name: 'email',
          type: 'input',
          label: 'Email Address',
          placeholder: 'Enter your email',
          required: true
        },
        {
          name: 'phone',
          type: 'input',
          label: 'Phone Number',
          placeholder: 'Enter your phone number',
          required: false
        }
      ]
    },
    {
      id: 'message',
      title: 'Message',
      description: 'Tell us what you need help with',
      fields: [
        {
          name: 'subject',
          type: 'input',
          label: 'Subject',
          placeholder: 'Enter message subject',
          required: true
        },
        {
          name: 'message',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message here...',
          required: true,
          rows: 4
        }
      ]
    }
  ]
};

const BasicForm = createBasicAdapter(uiComponents);

import { DynamicFormData } from '@benyue1978/next-dynamic-forms';

export default function ContactForm() {
  const [formData, setFormData] = useState<DynamicFormData>({ taskType: 'new-project' });
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (currentStep < formConfig.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
      console.log('Form submitted:', formData);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Thank you!
          </h2>
          <p className="text-green-600">
            Your message has been submitted successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {formConfig.steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / formConfig.steps.length) * 100}%` }}
          />
        </div>
      </div>

      <BasicForm
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
  );
}