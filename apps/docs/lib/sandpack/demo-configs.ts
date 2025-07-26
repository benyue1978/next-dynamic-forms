import { commonFiles, nextjsFiles } from './common-files'
import {
  createBasicAppTemplate,
  createMultiStepAppTemplate,
  createCustomStyledAppTemplate,
  createNextJSAppTemplate,
  createFormConfig
} from './templates'
import type { SandpackConfig } from './types'

// Basic Form Demo
export const basicFormConfig: SandpackConfig = {
  files: {
    ...commonFiles,
    '/form-config.ts': createFormConfig({
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
              name: 'message',
              type: 'textarea',
              label: 'Message',
              placeholder: 'Your message here...',
              required: true
            }
          ]
        }
      ]
    }),
    '/App.tsx': createBasicAppTemplate({
      title: 'Basic Contact Form',
      formConfig: 'formConfig',
      uiComponents: 'uiComponents'
    })
  }
}

// Multi-Step Form Demo
export const multiStepConfig: SandpackConfig = {
  files: {
    ...commonFiles,
    '/form-config.ts': createFormConfig({
      id: 'multi-step-form',
      templateName: 'multi-step',
      steps: [
        {
          id: 'personal',
          title: 'Personal Information',
          description: 'Tell us about yourself',
          fields: [
            { name: 'firstName', type: 'input', label: 'First Name', required: true },
            { name: 'lastName', type: 'input', label: 'Last Name', required: true },
            { name: 'email', type: 'input', label: 'Email', required: true }
          ]
        },
        {
          id: 'company',
          title: 'Company Details',
          description: 'Information about your company',
          fields: [
            { name: 'companyName', type: 'input', label: 'Company Name', required: true },
            { name: 'position', type: 'input', label: 'Position', required: true }
          ]
        },
        {
          id: 'preferences',
          title: 'Preferences',
          description: 'Your preferences and interests',
          fields: [
            { name: 'industry', type: 'input', label: 'Industry', required: true },
            { name: 'teamSize', type: 'input', label: 'Team Size', placeholder: 'e.g., 10-50' }
          ]
        }
      ]
    }),
    '/App.tsx': createMultiStepAppTemplate({
      title: 'Multi-Step Registration Form',
      formConfig: 'formConfig',
      uiComponents: 'uiComponents'
    })
  }
}

// Custom Styling Demo
export const customStylingConfig: SandpackConfig = {
  files: {
    ...commonFiles,
    '/form-config.ts': createFormConfig({
      id: 'styled-form',
      templateName: 'styled',
      steps: [
        {
          id: 'user-details',
          title: 'User Details',
          description: 'Tell us about yourself',
          fields: [
            { name: 'fullName', type: 'input', label: 'Full Name', placeholder: 'John Doe' },
            { name: 'email', type: 'input', label: 'Email Address', placeholder: 'john@example.com' },
            { name: 'bio', type: 'textarea', label: 'About Me', placeholder: 'A short bio...' }
          ]
        }
      ]
    }),
    '/App.tsx': createCustomStyledAppTemplate({
      title: 'Beautiful Styled Form',
      description: 'Modern design with beautiful gradients',
      formConfig: 'formConfig'
    })
  }
}

// Next.js Integration Demo
export const nextjsIntegrationConfig: SandpackConfig = {
  files: {
    ...nextjsFiles,
    '/form-config.ts': createFormConfig({
      id: 'contact-form',
      templateName: 'contact',
      steps: [
        {
          id: 'contact',
          title: 'form.title',
          description: 'form.description',
          fields: [
            {
              name: 'fullName',
              type: 'input',
              label: 'form.name',
              placeholder: 'form.name.placeholder',
              required: true
            },
            {
              name: 'email',
              type: 'input',
              label: 'form.email',
              placeholder: 'form.email.placeholder',
              required: true
            },
            {
              name: 'message',
              type: 'textarea',
              label: 'form.message',
              placeholder: 'form.message.placeholder',
              required: true
            }
          ]
        }
      ]
    }),
    '/App.tsx': createNextJSAppTemplate({
      title: 'form.title',
      description: 'form.description',
      formConfig: 'formConfig',
      successTitle: 'Thank you!',
      successMessage: 'We will get back to you soon.'
    })
  }
}

// Demo Configs
export const demoConfigs = {
  'basic-form': basicFormConfig,
  'multi-step': multiStepConfig,
  'custom-styling': customStylingConfig,
  'nextjs-integration': nextjsIntegrationConfig
} as const 