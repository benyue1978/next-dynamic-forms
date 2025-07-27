export interface FieldOption {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  type: 'input' | 'textarea' | 'select' | 'tags' | 'checkbox';
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  icon?: string;
  rows?: number;
  options?: FieldOption[];
}

export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormConfig {
  id: string;
  templateName: string;
  steps: FormStep[];
}

export type TaskType = 'new-project' | 'add-feature' | 'generate-guide';

export interface DynamicFormData {
  taskType: TaskType;
  [key: string]: any;
}

// UI adapter interface
export interface UIComponents {
  Input: React.ComponentType<any>;
  Textarea: React.ComponentType<any>;
  Label: React.ComponentType<any>;
  Button: React.ComponentType<any>;
  ProgressStep?: React.ComponentType<any>;
}

// Internationalization adapter interface
export interface I18nAdapter {
  t: (key: string, params?: Record<string, any>) => string;
}

// Form text configuration interface
export interface FormTextConfig {
  buttonTexts?: {
    previous?: string;
    next?: string;
    submit?: string;
    back?: string;
  };
  labels?: {
    optional?: string;
    pleaseSelect?: string;
  };
  errorMessages?: {
    requiredFieldsMissing?: string;
  };
}

// Form styling configuration interface
export interface FormStylingConfig {
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  formClassName?: string;
  buttonContainerClassName?: string;
  fieldClassName?: string;
  fieldContainerClassName?: string;
  fieldLabelClassName?: string;
  fieldInputClassName?: string;
  fieldIconClassName?: string;
  fieldRequiredClassName?: string;
  fieldOptionalClassName?: string;
} 