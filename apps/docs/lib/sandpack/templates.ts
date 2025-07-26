import React from 'react'
import type { FormConfig } from './types'
import { DynamicForm } from '@benyue1978/next-dynamic-forms/core'

// Basic App Template Generator
export function createBasicAppTemplate(options: {
  title: string
  description?: string
  formConfig: string
  uiComponents: 'uiComponents' | 'customUiComponents'
  containerClass?: string
  cardClass?: string
  successTitle?: string
  successMessage?: string
}) {
  const {
    title,
    description,
    formConfig,
    uiComponents,
    containerClass = 'form-container',
    cardClass = 'form-card',
    successTitle = 'Thank you!',
    successMessage = 'Your message has been submitted successfully.'
  } = options

  return `import React, { useState } from 'react';
import { DynamicForm } from '@benyue1978/next-dynamic-forms/core';
import { ${uiComponents} } from './${uiComponents === 'uiComponents' ? 'ui-components' : 'custom-ui-components'}';
import { formConfig } from './form-config';
import { i18nAdapter } from './i18n';
import './global.css';

export default function App() {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return React.createElement('div', { className: '${containerClass}' },
      React.createElement('div', { className: 'success-card' },
        React.createElement('h2', { className: 'success-title' }, '${successTitle}'),
        React.createElement('p', { className: 'success-message' }, 
          '${successMessage}'
        )
      )
    );
  }

  return React.createElement('div', { className: '${containerClass}' },
    React.createElement('div', { className: '${cardClass}' },
      React.createElement('h1', { 
        style: { fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' } 
      }, '${title}'),
      ${description ? `React.createElement('p', { 
        style: { color: '#64748b', marginBottom: '32px', textAlign: 'center' }
      }, '${description}'),` : ''}
      React.createElement(DynamicForm, {
        config: formConfig,
        currentStepIndex: 0,
        formData: formData,
        onDataChange: setFormData,
        onNext: () => setSubmitted(true),
        onPrevious: () => {},
        isFirstStep: true,
        isLastStep: true,
        uiComponents: ${uiComponents},
        i18n: i18nAdapter
      })
    )
  );
}`
}

// Multi-step App Template Generator
export function createMultiStepAppTemplate(options: {
  title: string
  description?: string
  formConfig: string
  uiComponents: 'uiComponents' | 'customUiComponents'
  showProgress?: boolean
  successMessage?: string
}) {
  const {
    title,
    description,
    formConfig,
    uiComponents,
    showProgress = true,
    successMessage = 'Form submitted successfully!'
  } = options

  return `import React, { useState } from 'react';
import { DynamicForm } from '@benyue1978/next-dynamic-forms/core';
import { ${uiComponents} } from './${uiComponents === 'uiComponents' ? 'ui-components' : 'custom-ui-components'}';
import { formConfig } from './form-config';
import { i18nAdapter } from './i18n';
import './global.css';

export default function App() {
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, formConfig.steps.length - 1));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 0));

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('${successMessage}');
  };

  return React.createElement('div', { className: 'form-container' },
    React.createElement('div', { className: 'form-card' },
      React.createElement('h1', { 
        style: { fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', textAlign: 'center' }
      }, '${title}'),
      ${description ? `React.createElement('p', { 
        style: { color: '#64748b', marginBottom: '32px', textAlign: 'center' }
      }, '${description}'),` : ''}
      ${showProgress ? `
      React.createElement('div', { className: 'progress-container' },
        React.createElement('div', { className: 'progress-text' },
          \`Step \${currentStep + 1} of \${formConfig.steps.length}\`
        ),
        React.createElement('div', { className: 'progress-bar' },
          React.createElement('div', { 
            className: 'progress-fill',
            style: { width: \`\${((currentStep + 1) / formConfig.steps.length) * 100}%\` }
          })
        )
      ),` : ''}

      React.createElement(DynamicForm, {
        config: formConfig,
        currentStepIndex: currentStep,
        formData: formData,
        onDataChange: setFormData,
        onNext: currentStep === formConfig.steps.length - 1 ? handleSubmit : nextStep,
        onPrevious: prevStep,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === formConfig.steps.length - 1,
        uiComponents: ${uiComponents},
        i18n: i18nAdapter
      })
    )
  );
}`
}

// Custom Styled App Template Generator
export function createCustomStyledAppTemplate(options: {
  title: string
  description?: string
  formConfig: string
  successMessage?: string
}) {
  const {
    title,
    description,
    formConfig,
    successMessage = 'Beautiful form submitted!'
  } = options

  return `import React, { useState } from 'react';
import { DynamicForm } from '@benyue1978/next-dynamic-forms/core';
import { customUiComponents } from './custom-ui-components';
import { formConfig } from './form-config';
import { i18nAdapter } from './i18n';
import './global.css';

export default function App() {
  const [formData, setFormData] = useState({});

  return React.createElement('div', { className: 'gradient-bg' },
    React.createElement('div', { className: 'form-container' },
      React.createElement('div', { className: 'gradient-card' },
        React.createElement('div', { style: { textAlign: 'center', marginBottom: '32px' } },
          React.createElement('h1', { 
            className: 'gradient-title',
            style: { fontSize: '48px', fontWeight: 'bold', marginBottom: '8px' }
          }, '${title}'),
          ${description ? `React.createElement('p', { 
            style: { color: '#64748b', fontSize: '18px' }
          }, '${description}'),` : ''}
        ),
        
        React.createElement(DynamicForm, {
          config: formConfig,
          currentStepIndex: 0,
          formData: formData,
          onDataChange: setFormData,
          onNext: () => {
            console.log('Form data:', formData);
            alert('${successMessage}');
          },
          onPrevious: () => {},
          isFirstStep: true,
          isLastStep: true,
          uiComponents: customUiComponents,
          i18n: i18nAdapter
        })
      )
    )
  );
}`
}

// Next.js App Template Generator (using full package and next-intl)
export function createNextJSAppTemplate(options: {
  title: string
  description?: string
  formConfig: string
  successTitle?: string
  successMessage?: string
}) {
  const {
    title,
    description,
    formConfig,
    successTitle = 'Thank you!',
    successMessage = 'We will get back to you soon.'
  } = options

  return `import React, { useState } from 'react';
import { DynamicForm } from '@benyue1978/next-dynamic-forms/core';
import { uiComponents } from './ui-components';
import { formConfig } from './form-config';
import './global.css';

/*
 * Multilingual Form Implementation Example
 * 
 * This demo shows how to directly use DynamicForm to implement multilingual forms.
 * In real projects, you can choose one of the following two approaches:
 * 
 * Approach 1: Using createNextJSAdapter (recommended for Next.js + next-intl projects)
 * \`\`\`tsx
 * import { createNextJSAdapter } from '@next-dynamic-forms';
 * import { useTranslations } from 'next-intl';
 * 
 * const NextJSForm = createNextJSAdapter(uiComponents);
 * 
 * export default function ContactPage() {
 *   const t = useTranslations();
 *   
 *   return (
 *     <NextIntlClientProvider messages={messages}>
 *       <NextJSForm
 *         config={formConfig}
 *         currentStepIndex={0}
 *         formData={formData}
 *         onDataChange={handleDataChange}
 *         onNext={handleNext}
 *         isFirstStep={true}
 *         isLastStep={true}
 *         onPrevious={() => {}}
 *       />
 *     </NextIntlClientProvider>
 *   );
 * }
 * \`\`\`
 * 
 * Approach 2: Directly using DynamicForm (suitable for any React project)
 * \`\`\`tsx
 * import { DynamicForm } from '@next-dynamic-forms/core';
 * 
 * export default function ContactPage() {
 *   const i18nAdapter = {
 *     t: (key, params) => {
 *       // Implement your translation logic
 *       return translatedText;
 *     }
 *   };
 *   
 *   return (
 *     <DynamicForm
 *       config={formConfig}
 *       uiComponents={uiComponents}
 *       i18n={i18nAdapter}
 *       // ... other props
 *     />
 *   );
 * }
 * \`\`\`
 */

// Multilingual Messages Library
const messages = {
  en: {
    'form.title': 'Next.js Integration Demo',
    'form.description': 'We would love to hear from you',
    'form.submit': 'Submit',
    'form.next': 'Next',
    'form.previous': 'Previous',
    'form.backToSelection': 'Back to Selection',
    'form.generatePrompt': 'Generate Prompt',
    'ProjectForm.backToSelection': 'Back',
    'ProjectForm.generatePrompt': 'Submit',
    'form.name': 'Full Name',
    'form.name.placeholder': 'Enter your full name',
    'form.email': 'Email Address',
    'form.email.placeholder': 'Enter your email',
    'form.message': 'Message',
    'form.message.placeholder': 'Your message',
    'form.category': 'Category',
    'form.priority': 'Priority',
    'form.tags': 'Tags',
    'form.agree': 'I agree to the terms',
    'form.language': 'Language',
    'form.language.en': 'English',
    'form.language.zh': '中文',
    'form.language.es': 'Español',
    'form.success.title': 'Thank you!',
    'form.success.message': 'We will get back to you soon.',
    'form.success.submitAnother': 'Submit Another'
  },
  zh: {
    'form.title': 'Next.js 集成演示',
    'form.description': '我们期待听到您的声音',
    'form.submit': '提交',
    'form.next': '下一步',
    'form.previous': '上一步',
    'form.backToSelection': '返回选择',
    'form.generatePrompt': '生成提示',
    'ProjectForm.backToSelection': '返回',
    'ProjectForm.generatePrompt': '提交',
    'form.name': '姓名',
    'form.name.placeholder': '请输入您的姓名',
    'form.email': '邮箱地址',
    'form.email.placeholder': '请输入您的邮箱',
    'form.message': '消息',
    'form.message.placeholder': '您的消息',
    'form.category': '分类',
    'form.priority': '优先级',
    'form.tags': '标签',
    'form.agree': '我同意条款',
    'form.language': '语言',
    'form.language.en': 'English',
    'form.language.zh': '中文',
    'form.language.es': 'Español',
    'form.success.title': '提交成功！',
    'form.success.message': '我们会尽快回复您',
    'form.success.submitAnother': '再次提交'
  },
  es: {
    'form.title': 'Demo de Integración Next.js',
    'form.description': 'Nos encantaría saber de ti',
    'form.submit': 'Enviar',
    'form.next': 'Siguiente',
    'form.previous': 'Anterior',
    'form.backToSelection': 'Volver a la selección',
    'form.generatePrompt': 'Generar prompt',
    'ProjectForm.backToSelection': 'Volver',
    'ProjectForm.generatePrompt': 'Enviar',
    'form.name': 'Nombre completo',
    'form.name.placeholder': 'Ingresa tu nombre completo',
    'form.email': 'Correo electrónico',
    'form.email.placeholder': 'Ingresa tu correo',
    'form.message': 'Mensaje',
    'form.message.placeholder': 'Tu mensaje',
    'form.category': 'Categoría',
    'form.priority': 'Prioridad',
    'form.tags': 'Etiquetas',
    'form.agree': 'Acepto los términos',
    'form.language': 'Idioma',
    'form.language.en': 'English',
    'form.language.zh': '中文',
    'form.language.es': 'Español',
    'form.success.title': '¡Gracias!',
    'form.success.message': 'Nos pondremos en contacto contigo pronto',
    'form.success.submitAnother': 'Enviar otro'
  }
};

// Language Selector Component
function LanguageSelector({ currentLocale, onLocaleChange }) {
  return React.createElement('div', { className: 'language-selector' },
    React.createElement('label', { className: 'language-label' }, 'Language:'),
    React.createElement('select', {
      value: currentLocale,
      onChange: (e) => onLocaleChange(e.target.value),
      className: 'language-select'
    },
      React.createElement('option', { value: 'en' }, 'English'),
      React.createElement('option', { value: 'zh' }, '中文'),
      React.createElement('option', { value: 'es' }, 'Español')
    )
  );
}

export default function App() {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentLocale, setCurrentLocale] = useState('en');

  const handleDataChange = (newData) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };

  const handleNext = () => {
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  // Create i18n adapter - this is the key part
  const i18nAdapter = {
    t: (key, params) => {
      const localeMessages = messages[currentLocale] || messages.en || {};
      let result = localeMessages[key] || key;
      
      if (params) {
        Object.keys(params).forEach(paramKey => {
          result = result.replace(new RegExp('\\\\{' + paramKey + '\\\\}', 'g'), params[paramKey]);
        });
      }
      
      return result;
    }
  };

  if (submitted) {
    return React.createElement('div', { className: 'form-container' },
      React.createElement('div', { className: 'success-card' },
        React.createElement('h2', { className: 'success-title' }, i18nAdapter.t('form.success.title')),
        React.createElement('p', { className: 'success-message' }, i18nAdapter.t('form.success.message')),
        React.createElement('button', {
          className: 'btn btn-primary',
          onClick: () => setSubmitted(false)
        }, i18nAdapter.t('form.success.submitAnother'))
      )
    );
  }

  return React.createElement('div', { className: 'form-container' },
    React.createElement('div', { className: 'form-card' },
      React.createElement('div', { className: 'form-header' },
        React.createElement('h1', { className: 'form-title' }, i18nAdapter.t('form.title')),
        React.createElement(LanguageSelector, {
          currentLocale: currentLocale,
          onLocaleChange: setCurrentLocale
        })
      ),
      ${description ? `React.createElement('p', { className: 'form-description' }, i18nAdapter.t('form.description')),` : ''}
      React.createElement(DynamicForm, {
        config: ${formConfig},
        currentStepIndex: 0,
        formData: formData,
        onDataChange: handleDataChange,
        onNext: handleNext,
        onPrevious: () => {},
        isFirstStep: true,
        isLastStep: true,
        uiComponents: uiComponents,
        i18n: i18nAdapter
      })
    )
  );
}`
}

// Form Configuration Generator
export function createFormConfig(config: {
  id: string
  templateName: string
  steps: Array<{
    id: string
    title: string
    description: string
    fields: Array<{
      name: string
      type: 'input' | 'textarea' | 'select' | 'checkbox' | 'tags'
      label: string
      placeholder?: string
      required?: boolean
      description?: string
    }>
  }>
}) {
  return `export const formConfig = ${JSON.stringify(config, null, 2)};`
}