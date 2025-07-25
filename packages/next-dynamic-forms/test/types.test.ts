import { describe, it, expect } from 'vitest'
import type { 
  FieldOption, 
  FormField, 
  FormStep, 
  FormConfig, 
  TaskType, 
  DynamicFormData,
  UIComponents,
  I18nAdapter
} from '../src/types'

describe('Types', () => {
  describe('FieldOption', () => {
    it('should have correct structure', () => {
      const option: FieldOption = {
        value: 'test-value',
        label: 'Test Label'
      }
      
      expect(option.value).toBe('test-value')
      expect(option.label).toBe('Test Label')
    })
  })

  describe('FormField', () => {
    it('should support all field types', () => {
      const inputField: FormField = {
        name: 'testInput',
        type: 'input',
        label: 'Test Input',
        required: true
      }

      const textareaField: FormField = {
        name: 'testTextarea',
        type: 'textarea',
        label: 'Test Textarea',
        required: false,
        rows: 4
      }

      const selectField: FormField = {
        name: 'testSelect',
        type: 'select',
        label: 'Test Select',
        required: true,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      }

      const tagsField: FormField = {
        name: 'testTags',
        type: 'tags',
        label: 'Test Tags',
        required: false,
        placeholder: 'Enter tags'
      }

      const checkboxField: FormField = {
        name: 'testCheckbox',
        type: 'checkbox',
        label: 'Test Checkbox',
        required: false
      }

      expect(inputField.type).toBe('input')
      expect(textareaField.type).toBe('textarea')
      expect(selectField.type).toBe('select')
      expect(tagsField.type).toBe('tags')
      expect(checkboxField.type).toBe('checkbox')
    })
  })

  describe('FormStep', () => {
    it('should have correct structure', () => {
      const step: FormStep = {
        id: 'step1',
        title: 'Step 1',
        description: 'First step',
        fields: [
          {
            name: 'field1',
            type: 'input',
            label: 'Field 1',
            required: true
          }
        ]
      }
      
      expect(step.id).toBe('step1')
      expect(step.fields).toHaveLength(1)
      expect(step.fields[0].name).toBe('field1')
    })
  })

  describe('FormConfig', () => {
    it('should have correct structure', () => {
      const config: FormConfig = {
        id: 'test-form',
        templateName: 'test_template',
        steps: [
          {
            id: 'step1',
            title: 'Step 1',
            description: 'First step',
            fields: [
              {
                name: 'field1',
                type: 'input',
                label: 'Field 1',
                required: true
              }
            ]
          }
        ]
      }
      
      expect(config.id).toBe('test-form')
      expect(config.templateName).toBe('test_template')
      expect(config.steps).toHaveLength(1)
    })
  })

  describe('TaskType', () => {
    it('should support all task types', () => {
      const taskTypes: TaskType[] = ['new-project', 'add-feature', 'generate-guide']
      
      taskTypes.forEach(taskType => {
        expect(['new-project', 'add-feature', 'generate-guide']).toContain(taskType)
      })
    })
  })

  describe('DynamicFormData', () => {
    it('should support flexible data structure', () => {
      const formData: DynamicFormData = {
        taskType: 'new-project',
        projectName: 'Test Project',
        features: ['auth', 'api'],
        isPublic: true
      }
      
      expect(formData.taskType).toBe('new-project')
      expect(formData.projectName).toBe('Test Project')
      expect(formData.features).toEqual(['auth', 'api'])
      expect(formData.isPublic).toBe(true)
    })
  })

  describe('UIComponents', () => {
    it('should define required UI component interface', () => {
      const mockComponent = () => null

      const uiComponents: UIComponents = {
        Input: mockComponent,
        Textarea: mockComponent,
        Label: mockComponent,
        Button: mockComponent,
        ProgressStep: mockComponent
      }
      
      expect(typeof uiComponents.Input).toBe('function')
      expect(typeof uiComponents.Textarea).toBe('function')
      expect(typeof uiComponents.Label).toBe('function')
      expect(typeof uiComponents.Button).toBe('function')
      expect(typeof uiComponents.ProgressStep).toBe('function')
    })
  })

  describe('I18nAdapter', () => {
    it('should define translation interface', () => {
      const i18nAdapter: I18nAdapter = {
        t: (key: string, params?: Record<string, any>) => {
          if (params) {
            return key.replace(/\{(\w+)\}/g, (match, paramKey) => params[paramKey] || match)
          }
          return key
        }
      }
      
      expect(typeof i18nAdapter.t).toBe('function')
      expect(i18nAdapter.t('test.key')).toBe('test.key')
      expect(i18nAdapter.t('hello.{name}', { name: 'World' })).toBe('hello.World')
    })
  })
}) 