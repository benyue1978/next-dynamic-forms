# 📘 动态表单组件库以及文档系统设计文档

## 🧭 目标概述

构建一个文档系统，支持：

1. 使用 Nextra 编写文档内容
2. 所有文档中展示的代码片段来自真实 demo 文件
3. 文档中嵌入或链接到对应 demo 页面，用户可实时交互
4. 支持主题切换、搜索、导航等常用功能
5. 避免重复维护 demo 与文档内容，提升文档长期可维护性
6. 组件名 `@benyue1978/next-dynamic-forms`

---

## 📁 项目结构

采用 Monorepo + Next.js + Nextra 架构：

```text
next-dynamic-forms/
├── apps/
│   ├── docs/                          # 文档网站（Nextra 驱动）
│   │   ├── pages/
│   │   │   ├── docs/
│   │   │   │   ├── getting-started.mdx
│   │   │   │   └── usage.mdx          # 每篇文档对应一个主题
│   │   │   └── demos/
│   │   │       └── basic-usage.tsx    # 可交互 demo 页面
│   │   └── theme.config.ts
│   └── demo-snippets/                 # 存放所有可展示源码的实际组件文件
│       ├── basic-usage.tsx
│       ├── basic-usage.schema.json
│       └── advanced-usage.tsx
├── components/                        # 动态表单核心组件
│   ├── DynamicForm.tsx
│   ├── FormField.tsx
│   └── FormValidator.tsx
├── packages/
│   └── next-dynamic-forms/            # NPM 组件包核心逻辑（可独立发布）
│       ├── package.json
│       ├── src/
│       │   ├── index.ts
│       │   └── components/
│       └── README.md
├── turbo.json                         # Turborepo 配置
├── pnpm-workspace.yaml                # pnpm 工作区配置
└── README.md
```

---

## ⚙️ 技术选型

| 需求 | 工具 / 技术 |
|------|-------------|
| 文档框架 | Nextra |
| 页面渲染 | Next.js (app or pages router 均可) |
| 代码片段引入 | raw-loader 或 fs.readFileSync() |
| 组件交互预览 | 自定义 demo 页面 + `<iframe>` 或链接跳转 |
| Markdown 写作支持 | .mdx |

---

## 🧩 核心实现思路

### 1. 文档中的代码片段 = 实际 demo 代码

```tsx
// basic-usage.tsx
import code from '!!raw-loader!../../../demo-snippets/basic-usage.tsx'
export default code
```

- 用 webpack 的 raw-loader 或编译阶段的 readFileSync() 方式加载代码
- 用 highlight.tsx 自定义组件渲染代码块
- 保证 demo 和文档共用一份代码，避免偏差

### 2. demo 页面可运行

- 所有 demo 页面位于 `/demos/[slug].tsx`
- 可单独访问，或嵌入在文档页面中：

```tsx
<iframe
  src="/demos/basic-usage"
  style={{ width: "100%", height: "500px", border: "1px solid #eee" }}
/>
```

- 页面组件结构参考：

```tsx
// pages/demos/basic-usage.tsx
"use client"
import { DynamicForm } from "components/DynamicForm"
import schema from "demo-snippets/basic-usage.schema.json"

export default function Demo() {
  return <DynamicForm schema={schema} />
}
```

### 3. 链接跳转支持

```markdown
👉 [Try it live](/demos/basic-usage)
```

- 支持点击跳转到独立 demo 页面
- 可选实现"复制到 Playground"跳转（如 `/playground?src=base64(...)`）

### 4. 文档页面风格一致性

- 所有 .mdx 页面使用 Nextra layout
- 可嵌入 `<ComponentPreview>` 自定义组件，用于展示 demo 效果与源代码
- 示例文档结构：

```mdx
# Basic Usage

This is a basic usage of `DynamicForm`.

<ComponentPreview
  title="Basic Form"
  sourcePath="../../../demo-snippets/basic-usage.tsx"
  iframeSrc="/demos/basic-usage"
/>
```

---

## 💡 Playground（可选）

- 增加 `/playground` 页面，加载沙箱（Sandpack 或 Monaco）
- 可从代码片段中跳转，并带入源码内容：

```tsx
<Link href={`/playground?src=${encodeURIComponent(btoa(code))}`}>
  Try in Playground
</Link>
```

---

## ✨ UI/UX 提示

| 项目 | 说明 |
|------|------|
| 代码片段自动高亮 | 使用 shiki、prism-react-renderer 或 Nextra 内置 |
| 文件名展示 | 通过 filename="..." 属性或自定义组件实现 |
| 主题切换 | 使用 Nextra 自带主题系统 |
| 版本切换（可选） | 支持多版本组件切换文档路径 |

---

## 🧪 开发 & 维护建议

| 项目 | 建议 |
|------|------|
| demo-snippets 命名 | 文件名、结构清晰，如 basic-usage.tsx、advanced-*.tsx |
| 同步机制 | 每次开发新 demo 时同步文档路径或自动生成 |
| 文档预览 | 本地运行 `pnpm dev` 后可完整预览所有页面 |
| 代码复用建议 | demo 页面组件与文档页面使用相同 props 数据源 |
| 包发布 | 通过 github action 运行测试，之后发布到 npm 作为 public 包 |
| 包版本号 | npm version patch 机制写入 pnpm package.json |

---

## 🚀 上线建议

| 项目 | 配置 |
|------|------|
| Vercel | 自动部署 Nextra / Next.js 项目 |
| pnpm build | 构建静态页面（SSG + ISR 支持） |
| 路由结构 | 保持 `/docs/*`、`/demos/*` 清晰结构 |

---

## ✅ 总结

- 📦 文档系统基于 Nextra + MDX 实现
- 📄 所有代码片段来自真实 demo 源文件
- 🔁 保证 demo 与文档内容同步更新
- 🌍 支持交互预览（iframe 或跳转）
- 💡 后续可扩展 playground、版本切换、主题注入等功能
