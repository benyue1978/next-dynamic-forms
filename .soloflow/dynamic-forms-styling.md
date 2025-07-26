# Dynamic Forms Styling Guide

## 🎨 概述

更新后的 `@benyue1978/next-dynamic-forms` 现在支持完全自定义的样式系统，你可以轻松地为表单组件应用不同的视觉风格。

## 🚀 快速开始

### 基本使用（默认样式）

```tsx
import { NextJSDynamicFormWithIntl } from '@/lib/dynamic-forms-adapter'

function MyForm() {
  return (
    <NextJSDynamicFormWithIntl
      config={formConfig}
      currentStepIndex={currentStep}
      formData={data}
      onDataChange={handleChange}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isFirstStep={isFirst}
      isLastStep={isLast}
    />
  )
}
```

### 使用预设样式

```tsx
import { 
  NextJSDynamicFormCompact,
  NextJSDynamicFormGlass,
  NextJSDynamicFormMinimal 
} from '@/lib/dynamic-forms-adapter'

// 紧凑样式
function CompactForm() {
  return <NextJSDynamicFormCompact {...formProps} />
}

// 玻璃效果样式
function GlassForm() {
  return <NextJSDynamicFormGlass {...formProps} />
}

// 简洁样式
function MinimalForm() {
  return <NextJSDynamicFormMinimal {...formProps} />
}
```

### 使用样式预设

```tsx
import { NextJSDynamicFormWithIntl } from '@/lib/dynamic-forms-adapter'

function StyledForm() {
  return (
    <NextJSDynamicFormWithIntl
      {...formProps}
      stylePreset="glass" // 'default' | 'compact' | 'glass' | 'minimal'
    />
  )
}
```

## 🎯 自定义样式

### 覆盖特定样式

```tsx
function CustomStyledForm() {
  return (
    <NextJSDynamicFormWithIntl
      {...formProps}
      stylePreset="default"
      // 自定义容器样式
      containerClassName="modern-card p-12 bg-gradient-to-br from-blue-50 to-indigo-50"
      // 自定义按钮容器样式
      buttonContainerClassName="flex gap-6 justify-center pt-8"
    />
  )
}
```

### 完全自定义样式

```tsx
function FullyCustomForm() {
  return (
    <NextJSDynamicFormWithIntl
      {...formProps}
      className="max-w-2xl mx-auto"
      containerClassName="bg-white shadow-2xl rounded-3xl p-10 border border-gray-100"
      headerClassName="text-center mb-10 space-y-2"
      formClassName="space-y-8"
      buttonContainerClassName="flex gap-4 justify-between pt-8 mt-10 border-t-2 border-gray-100"
    />
  )
}
```

## 📋 样式属性说明

| 属性 | 描述 | 默认值 |
|------|------|--------|
| `className` | 根容器的样式类 | `"w-full"` |
| `containerClassName` | 主容器的样式类 | `"modern-card p-8 space-y-modern animate-fade-in"` |
| `headerClassName` | 头部区域的样式类 | `"text-center mb-8"` |
| `formClassName` | 表单区域的样式类 | `"space-y-6"` |
| `buttonContainerClassName` | 按钮容器的样式类 | `"flex gap-4 justify-between pt-6 mt-8 border-t border-border"` |

## 🎨 预设样式详解

### Default（默认）
- 使用 `modern-card` 样式
- 宽松的间距和填充
- 渐变效果和阴影
- 适合主要表单页面

### Compact（紧凑）
- 较小的间距和填充
- 适合侧边栏或弹窗中的表单
- 保持现代化外观

### Glass（玻璃效果）
- 使用 `glass` 样式类
- 模糊背景效果
- 半透明边框
- 现代科技感

### Minimal（简洁）
- 简单的边框样式
- 最小化的装饰
- 适合内嵌在其他组件中

## 🛠️ 高级用法

### 创建自定义预设

```tsx
import { mergeStyles, stylePresets } from '@/lib/dynamic-forms-adapter'

// 创建自定义样式预设
const customPreset = mergeStyles('default', {
  containerClassName: "modern-card p-6 bg-gradient-to-r from-purple-50 to-pink-50",
  buttonContainerClassName: "flex gap-6 justify-center pt-8"
})

function CustomPresetForm() {
  return (
    <NextJSDynamicFormWithIntl
      {...formProps}
      {...customPreset}
    />
  )
}
```

### 动态样式切换

```tsx
function DynamicStyledForm() {
  const [style, setStyle] = useState<StylePreset>('default')
  
  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setStyle('default')}>Default</button>
        <button onClick={() => setStyle('compact')}>Compact</button>
        <button onClick={() => setStyle('glass')}>Glass</button>
        <button onClick={() => setStyle('minimal')}>Minimal</button>
      </div>
      
      <NextJSDynamicFormWithIntl
        {...formProps}
        stylePreset={style}
      />
    </div>
  )
}
```

## 💡 最佳实践

1. **一致性**: 在整个应用中使用相同的样式预设
2. **响应式**: 确保自定义样式在不同屏幕尺寸下正常显示
3. **可访问性**: 保持足够的颜色对比度和可点击区域大小
4. **性能**: 避免过度复杂的样式，影响渲染性能

## 🔧 故障排除

### 样式不生效
- 检查 CSS 类是否正确导入
- 确保 Tailwind CSS 配置正确
- 验证样式优先级

### 响应式问题
- 使用响应式 Tailwind 类 (`sm:`, `md:`, `lg:`)
- 测试不同屏幕尺寸

### 暗色模式支持
项目的全局样式已支持暗色模式，所有预设样式都会自动适配。
