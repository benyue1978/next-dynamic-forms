# Next Dynamic Forms - 测试和发布流程

## 📋 概述

本文档记录了 `@benyue1978/next-dynamic-forms` 包的完整测试和发布流程，包括单元测试、lint 检查、版本管理和 npm 发布。

## 🧪 测试流程

### 1. 运行单元测试

```bash
# 进入包目录
cd packages/next-dynamic-forms

# 运行所有测试
pnpm test

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 运行特定测试文件
pnpm test FieldRenderer.test.tsx
```

### 2. 测试文件结构

```
packages/next-dynamic-forms/test/
├── components/
│   ├── DynamicForm.test.tsx      # 核心表单组件测试
│   └── FieldRenderer.test.tsx    # 字段渲染器测试
├── adapters/
│   ├── basic.test.tsx            # 基础适配器测试
│   └── nextjs.test.tsx           # Next.js 适配器测试
├── utils/
│   └── config-loader.test.ts     # 配置加载器测试
├── types.test.ts                 # 类型定义测试
└── setup.ts                      # 测试环境设置
```

### 3. 测试覆盖范围

#### 核心组件测试
- **DynamicForm**: 表单渲染、数据验证、提交处理
- **FieldRenderer**: 字段渲染、样式定制、图标定位
- **适配器**: 基础适配器和 Next.js 适配器功能
- **工具函数**: 配置加载、类型验证

#### 新增功能测试
- **样式定制**: 自定义 CSS 类名、图标定位
- **文本定制**: 按钮文本、标签文本、错误消息
- **组合功能**: 样式和文本定制同时使用

### 4. 测试环境配置

#### Vitest 配置 (`vitest.config.ts`)
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
  },
})
```

#### 测试设置 (`test/setup.ts`)
```typescript
import '@testing-library/jest-dom'

// 全局测试环境设置
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.alert
global.alert = vi.fn()
```

## 🔍 Lint 检查流程

### 1. ESLint 配置

#### 主配置文件 (`eslint.config.js`)
- 使用新的 ESLint 配置格式
- 支持 TypeScript 和 React
- 为测试文件提供特殊配置

#### 测试文件特殊规则
```javascript
{
  files: ['test/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
  languageOptions: {
    globals: {
      describe: 'readonly',
      it: 'readonly',
      expect: 'readonly',
      beforeEach: 'readonly',
      vi: 'readonly',
      document: 'readonly',
      window: 'readonly',
      // ... 其他测试全局变量
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'react-hooks/rules-of-hooks': 'off',
    'no-undef': 'off',
  },
}
```

### 2. 运行 Lint 检查

```bash
# 运行 ESLint 检查
pnpm lint

# 自动修复可修复的问题
pnpm lint --fix
```

### 3. 常见 Lint 问题及解决方案

#### 测试环境问题
- **问题**: `beforeEach`, `document`, `window` 未定义
- **解决**: 在 ESLint 配置中添加测试全局变量

#### React Hooks 规则
- **问题**: 在非 React 组件中调用 Hooks
- **解决**: 在测试文件中禁用 `react-hooks/rules-of-hooks` 规则

#### TypeScript 类型问题
- **问题**: 大量 `any` 类型警告
- **解决**: 在测试文件中禁用 `@typescript-eslint/no-explicit-any` 规则

## 📦 发布流程

### 1. 版本管理 (Changesets)

#### 创建 Changeset
```bash
# 交互式创建 changeset
pnpm changeset add

# 或手动创建 .changeset/xxx.md 文件
```

#### Changeset 文件格式
```markdown
---
"@benyue1978/next-dynamic-forms": patch
---

fix: resolve ESLint linting issues in test files and source code

- Fix test environment configuration in ESLint
- Add proper global variable definitions for test files
- Remove unused imports and fix React type definitions
- Add comprehensive unit tests for styling and text customization features
- Improve error handling in nextjs adapter
```

### 2. 版本更新

```bash
# 更新版本号并生成 CHANGELOG
pnpm version-packages

# 检查版本状态
pnpm changeset status
```

### 3. 构建和发布

```bash
# 构建包
pnpm build

# 发布到 npm
pnpm publish
```

### 4. 发布前检查清单

- [ ] 所有测试通过 (`pnpm test`)
- [ ] Lint 检查通过 (`pnpm lint`)
- [ ] 类型检查通过 (`pnpm typecheck`)
- [ ] 构建成功 (`pnpm build`)
- [ ] Changeset 已创建
- [ ] 版本号已更新
- [ ] CHANGELOG 已生成

## 🚀 自动化发布 (GitHub Actions)

### 发布工作流 (`.github/workflows/release.yml`)

```yaml
name: Release

on:
  push:
    branches:
      - main
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm ci:version
      - run: pnpm ci:publish
```

### 环境变量
- `NPM_TOKEN`: npm 发布令牌
- `TURBO_TOKEN`: Turborepo 远程缓存令牌
- `TURBO_TEAM`: Turborepo 团队名称

## 📊 质量指标

### 测试覆盖率目标
- **语句覆盖率**: > 90%
- **分支覆盖率**: > 85%
- **函数覆盖率**: > 90%
- **行覆盖率**: > 90%

### 代码质量指标
- **ESLint 错误**: 0
- **ESLint 警告**: < 20 (主要是 `any` 类型使用)
- **TypeScript 错误**: 0

## 🔧 故障排除

### 常见问题

#### 1. 测试失败
```bash
# 检查测试环境
pnpm test --reporter=verbose

# 运行单个测试文件
pnpm test DynamicForm.test.tsx
```

#### 2. Lint 错误
```bash
# 检查 ESLint 配置
pnpm lint --debug

# 自动修复
pnpm lint --fix
```

#### 3. 发布失败
```bash
# 检查 npm 登录状态
npm whoami

# 检查包版本
pnpm changeset status

# 重新构建
pnpm clean && pnpm build
```

### 调试技巧

#### 测试调试
```bash
# 运行测试并显示详细输出
pnpm test --reporter=verbose

# 运行特定测试
pnpm test --run FieldRenderer.test.tsx
```

#### Lint 调试
```bash
# 检查特定文件的 lint 问题
pnpm eslint src/components/DynamicForm.tsx

# 显示规则详情
pnpm eslint src/components/DynamicForm.tsx --debug
```

## 📝 最佳实践

### 1. 测试编写
- 每个组件至少有一个测试文件
- 测试覆盖正常流程和异常情况
- 使用描述性的测试名称
- 避免测试间的依赖关系

### 2. 代码质量
- 定期运行 lint 检查
- 及时修复 lint 警告
- 保持测试覆盖率在目标范围内
- 使用 TypeScript 严格模式

### 3. 发布管理
- 每次发布前运行完整的测试套件
- 使用语义化版本号
- 在 CHANGELOG 中记录所有变更
- 发布前进行本地测试

## 🔄 持续集成

### 本地开发流程
1. 编写代码
2. 运行测试 (`pnpm test`)
3. 运行 lint 检查 (`pnpm lint`)
4. 创建 changeset (`pnpm changeset add`)
5. 提交代码
6. 推送并触发 CI/CD

### CI/CD 流程
1. 安装依赖
2. 运行测试
3. 运行 lint 检查
4. 构建包
5. 发布到 npm (仅在标签推送时)

---

*最后更新: 2024年12月* 