// CSS style file
export const globalCSS = `
/* Base styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: #f8fafc;
}

/* Form container */
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Input styles */
.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Label styles */
.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: #374151;
}

/* Button styles */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.btn-full {
  width: 100%;
}

/* Gradient styles for custom styling demo */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 24px;
}

.gradient-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.gradient-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-input {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.gradient-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.gradient-btn {
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.gradient-btn:hover {
  transform: translateY(-2px);
}

/* Progress bar */
.progress-container {
  margin-bottom: 32px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

/* Form field spacing */
.form-field {
  margin-bottom: 24px;
}

/* Button group */
.button-group {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;
}

/* Dynamic Form base styles */
.dynamic-form-container {
  width: 100%;
}

.dynamic-form-wrapper {
  width: 100%;
}

.dynamic-form-content {
  width: 100%;
}

.dynamic-form-header {
  margin-bottom: 24px;
  text-align: center;
}

.dynamic-form-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
}

.dynamic-form-description {
  color: #6b7280;
  margin-bottom: 0;
}

.dynamic-form-fields {
  width: 100%;
}

.dynamic-form-buttons {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;
}

.dynamic-form-progress {
  margin-bottom: 24px;
}

/* Field container styles */
.field-container {
  margin-bottom: 24px;
}

.field-input-container,
.field-textarea-container,
.field-select-container,
.field-tags-container {
  position: relative;
}

.field-checkbox-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.field-label {
  /* Inherit from form-label */
}

.field-required {
  color: #ef4444;
  font-weight: bold;
  margin-left: 4px;
}

.field-optional {
  color: #6b7280;
  font-size: 14px;
  margin-left: 8px;
}

.field-description {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.field-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  transition: border-color 0.2s ease;
}

.field-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
}

.field-checkbox:checked {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.field-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

/* Success message */
.success-card {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
}

.success-title {
  color: #166534;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.success-message {
  color: #15803d;
}

/* Form header with language selector */
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  position: relative;
}

.form-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 16px;
}

.language-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
}

.language-select {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.language-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Form description */
.form-description {
  margin: 0 0 24px 0;
  color: #6b7280;
  font-size: 16px;
  line-height: 1.5;
}
`

// UI Components
export const uiComponentsCode = `import React from 'react';

export const uiComponents = {
  Input: ({ value, onChange, className = '', ...props }) => 
    React.createElement('input', {
      value: value || '',
      onChange: (e) => onChange(e.target.value),
      className: \`form-input \${className}\`,
      ...props
    }),
    
  Textarea: ({ value, onChange, className = '', ...props }) => 
    React.createElement('textarea', {
      value: value || '',
      onChange: (e) => onChange(e.target.value),
      className: \`form-textarea \${className}\`,
      ...props
    }),
    
  Label: ({ children, className = '' }) => 
    React.createElement('label', {
      className: \`form-label \${className}\`
    }, children),
    
  Button: ({ children, variant = 'primary', className = '', ...props }) => 
    React.createElement('button', {
      className: \`btn btn-\${variant} \${className}\`,
      ...props
    }, children)
};`

// Custom Styled UI Components
export const customUiComponentsCode = `import React from 'react';

export const customUiComponents = {
  Input: ({ value, onChange, className = '', ...props }) => 
    React.createElement('input', {
      value: value || '',
      onChange: (e) => onChange(e.target.value),
      className: \`gradient-input \${className}\`,
      ...props
    }),
    
  Textarea: ({ value, onChange, className = '', ...props }) => 
    React.createElement('textarea', {
      value: value || '',
      onChange: (e) => onChange(e.target.value),
      className: \`gradient-input \${className}\`,
      style: { minHeight: '120px' },
      ...props
    }),
    
  Label: ({ children, className = '' }) => 
    React.createElement('label', {
      className: \`form-label \${className}\`,
      style: { fontWeight: '600', color: '#4c1d95' }
    }, children),
    
  Button: ({ children, className = '', ...props }) => 
    React.createElement('button', {
      className: \`gradient-btn \${className}\`,
      ...props
    }, children)
};`

// i18n Adapter
export const i18nAdapterCode = `export const i18nAdapter = {
  t: (key: string, params?: Record<string, any>) => {
    const translations: Record<string, string> = {
      // Common
      'Common.optional': 'Optional',
      'Common.requiredFieldsMissing': 'Please fill in required fields: {fields}',
      
      // Form actions
      'ProjectForm.backToSelection': 'Back',
      'ProjectForm.generatePrompt': 'Submit',
      'ProjectForm.nextStep': 'Next',
      'ProjectForm.previousStep': 'Previous',
      
      // Basic form
      'Full Name': 'Full Name',
      'Email Address': 'Email Address', 
      'Message': 'Message',
      'Enter your full name': 'Enter your full name',
      'Enter your email': 'Enter your email',
      'Your message here...': 'Your message here...',
      'Personal Information': 'Personal Information',
      'Please provide your contact details': 'Please provide your contact details',
      'Basic Contact Form': 'Basic Contact Form',
      'Thank you!': 'Thank you!',
      'Your message has been submitted successfully.': 'Your message has been submitted successfully.',
      
      // Multi-step form
      'First Name': 'First Name',
      'Last Name': 'Last Name',
      'Email': 'Email',
      'Company Name': 'Company Name',
      'Position': 'Position',
      'Industry': 'Industry',
      'Team Size': 'Team Size',
      'e.g., 10-50': 'e.g., 10-50',
      'Tell us about yourself': 'Tell us about yourself',
      'Company Details': 'Company Details',
      'Information about your company': 'Information about your company',
      'Preferences': 'Preferences',
      'Your preferences and interests': 'Your preferences and interests',
      'Multi-Step Registration Form': 'Multi-Step Registration Form',
      'Form submitted successfully!': 'Form submitted successfully!',
      'Step {step} of {total}': 'Step {step} of {total}',
      
      // Custom styling
      'About Me': 'About Me',
      'John Doe': 'John Doe',
      'john@example.com': 'john@example.com',
      'A short bio...': 'A short bio...',
      'Beautiful Styled Form': 'Beautiful Styled Form',
      'Modern design with Tailwind CSS': 'Modern design with Tailwind CSS',
      'Beautiful form submitted!': 'Beautiful form submitted!',
      'User Details': 'User Details',
      
      // Next.js integration
      'Contact Us': 'Contact Us',
      'We would love to hear from you': 'We would love to hear from you',
      'We will get back to you soon.': 'We will get back to you soon.',
      'Next.js Integration Demo': 'Next.js Integration Demo'
    };
    
    let result = translations[key] || key;
    if (params) {
      Object.keys(params).forEach(paramKey => {
        result = result.replace(new RegExp('\\\\{' + paramKey + '\\\\}', 'g'), params[paramKey]);
      });
    }
    return result;
  }
};`

// package.json
export const packageJsonCode = JSON.stringify({
  name: 'dynamic-forms-demo',
  version: '1.0.0',
  dependencies: {
    '@benyue1978/next-dynamic-forms': 'latest',
    'react': '^18.2.0',
    'react-dom': '^18.2.0'
  }
}, null, 2)

// Next.js Specific Translation File
export const nextjsTranslationsCode = `// Mock next-intl translations for demo
const translations = {
  contact: {
    title: 'Contact Us',
    description: 'We would love to hear from you',
    fields: {
      fullName: 'Full Name',
      email: 'Email Address',
      message: 'Message'
    },
    placeholders: {
      fullName: 'Enter your full name',
      email: 'Enter your email address',
      message: 'Your message here...'
    },
    buttons: {
      back: 'Back',
      submit: 'Send Message',
      next: 'Next',
      previous: 'Previous'
    },
    success: {
      title: 'Thank you!',
      message: 'We will get back to you soon.'
    },
    common: {
      optional: 'Optional',
      requiredFieldsMissing: 'Please fill in required fields: {fields}'
    }
  }
};

// Mock useTranslations hook for demo
export const useTranslations = (namespace) => {
  return (key, params) => {
    const keys = key.split('.');
    let value = translations[namespace];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (typeof value !== 'string') {
      return key; // fallback
    }
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        value = value.replace(new RegExp('\\\\{' + paramKey + '\\\\}', 'g'), params[paramKey]);
      });
    }
    
    return value;
  };
};`

// Independent translation system, supports Chinese and English switching
export const translationsCode = `export const translations = {
  en: {
    title: 'Next.js Integration Demo',
    description: 'We would love to hear from you',
    fields: {
      fullName: 'Full Name',
      email: 'Email Address',
      message: 'Message'
    },
    placeholders: {
      fullName: 'Enter your full name',
      email: 'Enter your email address',
      message: 'Your message here...'
    },
    buttons: {
      back: 'Back',
      submit: 'Send Message',
      next: 'Next',
      previous: 'Previous',
      submitAnother: 'Submit Another'
    },
    success: {
      title: 'Thank you!',
      message: 'We will get back to you soon.'
    },
    common: {
      optional: 'Optional',
      requiredFieldsMissing: 'Please fill in required fields: {fields}'
    }
  },
  zh: {
    title: 'Next.js 集成演示',
    description: '我们很乐意听到您的声音',
    fields: {
      fullName: '姓名',
      email: '邮箱地址',
      message: '留言'
    },
    placeholders: {
      fullName: '请输入您的姓名',
      email: '请输入邮箱地址',
      message: '请输入您的留言...'
    },
    buttons: {
      back: '返回',
      submit: '发送消息',
      next: '下一步',
      previous: '上一步',
      submitAnother: '再提交一个'
    },
    success: {
      title: '谢谢！',
      message: '我们会尽快回复您。
    },
    common: {
      optional: '可选',
      requiredFieldsMissing: '请填写以下必填字段：{fields}'
    }
  }
};`

// Common file collection
export const commonFiles = {
  '/global.css': globalCSS,
  '/ui-components.tsx': uiComponentsCode,
  '/custom-ui-components.tsx': customUiComponentsCode,
  '/i18n.ts': i18nAdapterCode,
  '/package.json': packageJsonCode
}

// Mock next-intl module for Sandpack - Ultra simple version
export const mockNextIntlCode = `// Mock next-intl with no context requirements
export const useTranslations = (namespace) => {
  return (key, params) => {
    const messages = {
      'ProjectForm.backToSelection': 'Back',
      'ProjectForm.generatePrompt': 'Submit', 
      'ProjectForm.nextStep': 'Next',
      'ProjectForm.previousStep': 'Previous',
      'Common.optional': 'Optional',
      'Common.requiredFieldsMissing': 'Please fill in required fields: {fields}'
    };
    
    let result = messages[key] || key;
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        result = result.replace(new RegExp('\\\\{' + paramKey + '\\\\}', 'g'), params[paramKey]);
      });
    }
    
    return result;
  };
};

// Dummy provider that does nothing
export const NextIntlClientProvider = ({ children }) => children;`

// Next.js specific NextIntlClientProvider file
export const nextIntlProviderCode = `import { NextIntlClientProvider as Provider } from './node_modules/next-intl/index.js';

export const NextIntlClientProvider = Provider;`

// Next.js specific file collection
export const nextjsFiles = {
  '/global.css': globalCSS,
  '/ui-components.tsx': uiComponentsCode,
  '/translations.ts': translationsCode,
  '/package.json': JSON.stringify({
    name: 'nextjs-dynamic-forms-demo',
    version: '1.0.0',
    dependencies: {
      '@benyue1978/next-dynamic-forms': 'latest',
      'react': '^18.0.0',
      'react-dom': '^18.0.0'
    }
  }, null, 2)
}