import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  createConfigLoader, 
  createApiConfigLoader, 
  createStaticConfigLoader,
  DEFAULT_TASK_TYPES 
} from '../../src/utils/config-loader'
import type { FormConfig, TaskType } from '../../src/types'

describe('Config Loader', () => {
  const mockConfig: FormConfig = {
    id: 'test-config',
    templateName: 'test_template',
    steps: [
      {
        id: 'step1',
        title: 'Test Step',
        description: 'Test Description',
        fields: [
          {
            name: 'testField',
            type: 'input',
            label: 'Test Field',
            required: true
          }
        ]
      }
    ]
  }

  describe('DEFAULT_TASK_TYPES', () => {
    it('should contain all expected task types', () => {
      expect(DEFAULT_TASK_TYPES).toEqual(['new-project', 'add-feature', 'generate-guide'])
      expect(DEFAULT_TASK_TYPES).toHaveLength(3)
    })
  })

  describe('createConfigLoader', () => {
    it('should create loader with static configs', async () => {
      const configs = {
        'new-project': mockConfig,
        'add-feature': mockConfig,
        'generate-guide': mockConfig
      }
      
      const loader = createConfigLoader(configs)
      
      expect(loader.isValidTaskType('new-project')).toBe(true)
      expect(loader.isValidTaskType('invalid-type')).toBe(false)
      expect(loader.getAvailableTaskTypes()).toEqual(DEFAULT_TASK_TYPES)
      
      const config = await loader.loadConfig('new-project')
      expect(config).toEqual(mockConfig)
    })

    it('should create loader with function', async () => {
      const mockLoadFunction = vi.fn().mockResolvedValue(mockConfig)
      const loader = createConfigLoader(mockLoadFunction)
      
      const config = await loader.loadConfig('new-project')
      expect(config).toEqual(mockConfig)
      expect(mockLoadFunction).toHaveBeenCalledWith('new-project')
    })

    it('should throw error for missing config', async () => {
      const configs = {
        'new-project': mockConfig
      } as Record<TaskType, FormConfig>
      
      const loader = createConfigLoader(configs)
      
      await expect(loader.loadConfig('add-feature' as TaskType)).rejects.toThrow(
        'No configuration found for task type: add-feature'
      )
    })
  })

  describe('createStaticConfigLoader', () => {
    it('should create static config loader', async () => {
      const configs = {
        'new-project': mockConfig,
        'add-feature': mockConfig,
        'generate-guide': mockConfig
      }
      
      const loader = createStaticConfigLoader(configs)
      
      const config = await loader.loadConfig('new-project')
      expect(config).toEqual(mockConfig)
    })
  })

  describe('createApiConfigLoader', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should create API config loader with default endpoint', async () => {
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockConfig
      } as Response)
      
      const loader = createApiConfigLoader()
      const config = await loader.loadConfig('new-project')
      
      expect(config).toEqual(mockConfig)
      expect(mockFetch).toHaveBeenCalledWith('/api/form-configs?taskType=new-project')
    })

    it('should create API config loader with custom endpoint', async () => {
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockConfig
      } as Response)
      
      const loader = createApiConfigLoader('/custom/api/configs')
      const config = await loader.loadConfig('add-feature')
      
      expect(config).toEqual(mockConfig)
      expect(mockFetch).toHaveBeenCalledWith('/custom/api/configs?taskType=add-feature')
    })

    it('should throw error when API request fails', async () => {
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found'
      } as Response)
      
      const loader = createApiConfigLoader()
      
      await expect(loader.loadConfig('new-project')).rejects.toThrow(
        'Failed to load form config: Not Found'
      )
    })

    it('should throw error when fetch throws', async () => {
      const mockFetch = vi.mocked(global.fetch)
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      
      const loader = createApiConfigLoader()
      
      await expect(loader.loadConfig('new-project')).rejects.toThrow('Network error')
    })
  })

  describe('ConfigLoader interface methods', () => {
    it('should validate task types correctly', () => {
      const loader = createStaticConfigLoader({
        'new-project': mockConfig,
        'add-feature': mockConfig,
        'generate-guide': mockConfig
      })
      
      expect(loader.isValidTaskType('new-project')).toBe(true)
      expect(loader.isValidTaskType('add-feature')).toBe(true)
      expect(loader.isValidTaskType('generate-guide')).toBe(true)
      expect(loader.isValidTaskType('invalid-type')).toBe(false)
      expect(loader.isValidTaskType('')).toBe(false)
    })

    it('should return available task types', () => {
      const loader = createStaticConfigLoader({
        'new-project': mockConfig,
        'add-feature': mockConfig,
        'generate-guide': mockConfig
      })
      
      const availableTypes = loader.getAvailableTaskTypes()
      expect(availableTypes).toEqual(DEFAULT_TASK_TYPES)
      expect(availableTypes).toContain('new-project')
      expect(availableTypes).toContain('add-feature')
      expect(availableTypes).toContain('generate-guide')
    })
  })
}) 