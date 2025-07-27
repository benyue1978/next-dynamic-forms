# 发布检查清单

## 🚀 发布前检查

### 1. 代码质量检查
- [ ] 运行所有测试: `pnpm test`
- [ ] 运行 lint 检查: `pnpm lint`
- [ ] 运行类型检查: `pnpm typecheck`
- [ ] 构建包: `pnpm build`

### 2. 版本管理
- [ ] 创建 changeset: `pnpm changeset add`
- [ ] 检查 changeset 状态: `pnpm changeset status`
- [ ] 更新版本: `pnpm version-packages`

### 3. 发布准备
- [ ] 检查 npm 登录状态: `npm whoami`
- [ ] 确认包版本号正确
- [ ] 检查 CHANGELOG 内容
- [ ] 确认所有文件已提交

## 📦 发布命令

```bash
# 1. 进入包目录
cd packages/next-dynamic-forms

# 2. 运行完整检查
pnpm test && pnpm lint && pnpm typecheck && pnpm build

# 3. 发布到 npm
pnpm publish
```

## 🔄 自动化发布

### GitHub Actions 触发
```bash
# 创建并推送标签触发自动发布
git tag v0.1.3
git push origin v0.1.3
```

### 手动发布
```bash
# 如果 CI/CD 失败，可以手动发布
cd packages/next-dynamic-forms
pnpm publish --access public
```

## 📊 发布后验证

### 1. 检查 npm 包
- [ ] 包已成功发布到 npm
- [ ] 版本号正确
- [ ] 文件内容完整

### 2. 验证安装
```bash
# 测试新版本安装
npm install @benyue1978/next-dynamic-forms@latest

# 或使用 pnpm
pnpm add @benyue1978/next-dynamic-forms@latest
```

### 3. 文档更新
- [ ] 更新 README.md 中的版本信息
- [ ] 检查文档网站是否需要更新
- [ ] 更新示例代码（如果需要）

## 🚨 紧急回滚

如果发布出现问题，可以：

```bash
# 1. 取消发布（15分钟内）
npm unpublish @benyue1978/next-dynamic-forms@0.1.3

# 2. 发布修复版本
pnpm changeset add
# 选择 patch 版本
pnpm version-packages
pnpm publish
```

## 📝 发布记录

| 版本 | 日期 | 主要变更 | 状态 |
|------|------|----------|------|
| 0.1.0 | 2024-12-XX | 初始版本 | ✅ 已发布 |
| 0.1.1 | 2024-12-XX | 修复和优化 | ✅ 已发布 |
| 0.1.2 | 2024-12-XX | 样式和文本定制 | ✅ 已发布 |
| 0.1.3 | 2024-12-XX | Lint 问题修复和测试改进 | ✅ 已发布 |

---

*最后更新: 2024年12月* 