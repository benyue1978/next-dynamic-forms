import { FormConfig, TaskType } from '../types'

// Configuration loader interface
export interface ConfigLoader {
  loadConfig: (taskType: TaskType) => Promise<FormConfig>;
  isValidTaskType: (taskType: string) => taskType is TaskType;
  getAvailableTaskTypes: () => TaskType[];
}

// Default task types
export const DEFAULT_TASK_TYPES: TaskType[] = ['new-project', 'add-feature', 'generate-guide']

// Basic configuration loader implementation
export function createConfigLoader(
  configSource: Record<TaskType, FormConfig> | ((taskType: TaskType) => Promise<FormConfig>)
): ConfigLoader {
  const isFunction = typeof configSource === 'function'
  
  return {
    async loadConfig(taskType: TaskType): Promise<FormConfig> {
      if (isFunction) {
        return await configSource(taskType)
      } else {
        const config = configSource[taskType]
        if (!config) {
          throw new Error(`No configuration found for task type: ${taskType}`)
        }
        return config
      }
    },
    
    isValidTaskType(taskType: string): taskType is TaskType {
      return DEFAULT_TASK_TYPES.includes(taskType as TaskType)
    },
    
    getAvailableTaskTypes(): TaskType[] {
      return [...DEFAULT_TASK_TYPES]
    }
  }
}

// API configuration loader (adapt existing API routes)
export function createApiConfigLoader(apiEndpoint: string = '/api/form-configs'): ConfigLoader {
  return createConfigLoader(async (taskType: TaskType) => {
    const response = await fetch(`${apiEndpoint}?taskType=${taskType}`)
    if (!response.ok) {
      throw new Error(`Failed to load form config: ${response.statusText}`)
    }
    return await response.json()
  })
}

// Static configuration loader
export function createStaticConfigLoader(configs: Record<TaskType, FormConfig>): ConfigLoader {
  return createConfigLoader(configs)
} 