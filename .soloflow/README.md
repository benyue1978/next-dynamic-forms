# Next Dynamic Forms - 项目文档索引

## 📚 文档概览

本目录包含了 `next-dynamic-forms` 项目的完整文档，涵盖了从项目概述到具体实现细节的各个方面。

## 📋 文档列表

### 🎯 项目概述
- **[overview.md](./overview.md)** - 项目整体概述和架构设计
- **[dynamic-form-package.md](./dynamic-form-package.md)** - 核心包的设计和实现

### 🎨 功能实现
- **[dynamic-forms-styling.md](./dynamic-forms-styling.md)** - 样式定制功能实现

### 🧪 测试和发布
- **[testing-and-release-process.md](./testing-and-release-process.md)** - 完整的测试和发布流程
- **[test-coverage-report.md](./test-coverage-report.md)** - 测试覆盖率报告和分析
- **[release-checklist.md](./release-checklist.md)** - 发布检查清单

## 🚀 快速开始

### 开发流程
1. 阅读 [overview.md](./overview.md) 了解项目架构
2. 查看 [dynamic-form-package.md](./dynamic-form-package.md) 了解核心实现
3. 参考 [testing-and-release-process.md](./testing-and-release-process.md) 进行开发和测试

### 发布流程
1. 使用 [release-checklist.md](./release-checklist.md) 进行发布前检查
2. 按照 [testing-and-release-process.md](./testing-and-release-process.md) 执行发布流程
3. 查看 [test-coverage-report.md](./test-coverage-report.md) 确保测试质量

## 📊 项目状态

### 当前版本
- **包版本**: 0.1.2
- **测试覆盖率**: > 90%
- **Lint 状态**: 0 错误，20 警告
- **文档状态**: 完整

### 最近更新
- ✅ 修复了测试文件中的 ESLint 问题
- ✅ 添加了全面的单元测试
- ✅ 完善了样式和文本定制功能
- ✅ 优化了发布流程

## 🔧 常用命令

### 开发
```bash
# 运行测试
cd packages/next-dynamic-forms && pnpm test

# 运行 lint 检查
pnpm lint

# 构建包
pnpm build
```

### 发布
```bash
# 创建 changeset
pnpm changeset add

# 更新版本
pnpm version-packages

# 发布到 npm
pnpm publish
```

## 📝 文档维护

### 更新原则
- 每次重要功能更新后更新相关文档
- 保持文档与实际代码的同步
- 使用清晰的标题和结构
- 包含实际的代码示例

### 文档结构
- 使用 Markdown 格式
- 包含目录和索引
- 使用 emoji 图标增强可读性
- 提供代码示例和命令

---

*最后更新: 2024年12月* 