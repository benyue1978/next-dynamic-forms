# Next Dynamic Forms

A modern, configuration-driven dynamic form system for React and Next.js applications with comprehensive documentation, interactive playground, and automated testing.

[![CI](https://github.com/benyue1978/next-dynamic-forms/workflows/Release/badge.svg)](https://github.com/benyue1978/next-dynamic-forms/actions)
[![npm version](https://badge.fury.io/js/@benyue1978%2Fnext-dynamic-forms.svg)](https://badge.fury.io/js/@benyue1978%2Fnext-dynamic-forms)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Zero Configuration** - Get started with simple JSON configurations
- 🎯 **Framework Agnostic** - Works with any React framework
- 🌍 **I18n Support** - Built-in internationalization with `next-intl`
- 🎨 **Custom Styling** - Fully customizable UI components
- 🔧 **TypeScript First** - Full TypeScript support with strict types
- 📱 **Responsive** - Mobile-first responsive design
- ⚡ **Performance** - Optimized for modern web applications
- 📚 **Interactive Documentation** - Live playground and examples
- 🧪 **Comprehensive Testing** - Unit and E2E tests with high coverage

## 🚀 Quick Start

### Installation

```bash
npm install @benyue1978/next-dynamic-forms
# or
pnpm add @benyue1978/next-dynamic-forms
# or
yarn add @benyue1978/next-dynamic-forms
```

### Basic Usage

```tsx
import { createBasicAdapter } from '@benyue1978/next-dynamic-forms'
import { Input, Textarea, Label, Button } from '@/components/ui'

const uiComponents = { Input, Textarea, Label, Button }
const BasicForm = createBasicAdapter(uiComponents)

function MyForm() {
  const [formData, setFormData] = useState({})
  const [currentStep, setCurrentStep] = useState(0)

  return (
    <BasicForm
      config={formConfig}
      currentStepIndex={currentStep}
      formData={formData}
      onDataChange={setFormData}
      onNext={() => setCurrentStep(prev => prev + 1)}
      onPrevious={() => setCurrentStep(prev => prev - 1)}
      isFirstStep={currentStep === 0}
      isLastStep={currentStep === formConfig.steps.length - 1}
    />
  )
}
```

### Next.js Integration

```tsx
import { createNextJSAdapter } from '@benyue1978/next-dynamic-forms'

const NextJSForm = createNextJSAdapter(uiComponents)

// Use directly without i18n setup
<NextJSForm config={formConfig} />
```

## 🏗️ Monorepo Structure

```text
next-dynamic-forms/
├── apps/
│   └── docs/                    # Documentation site (Next.js + Nextra)
├── demo-snippets/               # Reusable demo code
├── packages/
│   └── next-dynamic-forms/      # Core library package
├── .github/
│   └── workflows/               # CI/CD pipelines
├── .cursor/                     # Cursor AI integration
└── README.md
```

## 🛠️ Development Commands

### Setup
```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development mode
pnpm dev
```

### Testing
```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run E2E tests with Playwright
pnpm test:e2e

# Run E2E tests in UI mode
pnpm test:e2e:ui

# Generate coverage report
pnpm test:coverage
```

### Documentation
```bash
# Start docs development server
pnpm dev:docs

# Build documentation
pnpm build:docs

# Preview built documentation
pnpm preview:docs
```

### Release
```bash
# Create a new release (tags and publishes)
pnpm release

# Create changeset for version bump
pnpm changeset
```

### Quality Assurance
```bash
# Run linting
pnpm lint

# Type checking
pnpm typecheck

# Format code
pnpm format

# Clean all build outputs
pnpm clean
```

## 📖 Documentation

Visit our [interactive documentation](https://next-dynamic-forms.withus.fun) for:

- 📚 [Getting Started Guide](https://next-dynamic-forms.withus.fun)
- 🎯 [Examples](https://next-dynamic-forms.withus.fun/demos)
- 🎮 [Interactive Playground](https://next-dynamic-forms.withus.fun/playground)

## 🧪 Testing

### Unit Tests
- **Library Tests**: `packages/next-dynamic-forms/src/**/*.test.ts`
- **Docs Tests**: `apps/docs/__tests__/**/*.test.ts`
- **Coverage**: >90% for core functionality

### E2E Tests
- **Playwright**: `apps/docs/e2e/**/*.spec.ts`
- **Browsers**: Chrome, Firefox, Safari, Edge
- **Devices**: Desktop, Mobile, Tablet
- **Coverage**: All major user flows

### Test Commands
```bash
# Run specific test suites
pnpm test:unit --filter=next-dynamic-forms
pnpm test:e2e --filter=docs

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test:coverage
```

## 🎮 Interactive Playground

Our [interactive playground](https://next-dynamic-forms.withus.fun/playground) allows you to:

- 🧪 Experiment with live code
- 📋 Copy and paste configurations
- 🔗 Share configurations via URL
- 🎨 Test different UI frameworks
- 📱 Preview responsive behavior

### Playground Features
- **Live Code Editor**: Monaco Editor with TypeScript support
- **Sandpack Integration**: Real browser environment
- **URL Sharing**: Base64 encoded configurations
- **Demo Gallery**: Pre-built examples
- **Mobile Responsive**: Works on all devices

## 🔄 CI/CD Pipeline

### Automated Release Process
1. **Code Quality**: ESLint, TypeScript, Prettier
2. **Testing**: Unit tests (Vitest) + E2E tests (Playwright)
3. **Build Verification**: Docs and library build successfully
4. **Version Management**: Changesets for semantic versioning
5. **NPM Publishing**: Automated on tag push

### GitHub Actions Workflow
- **Triggers**: Git tag push (v*)
- **Matrix Testing**: Multiple Node.js versions
- **Cross-browser Testing**: All major browsers
- **Security**: NPM provenance attestation
- **Reports**: Coverage and test results

## 🎯 Configuration

### Form Configuration Format
```json
{
  "id": "contact-form",
  "templateName": "contact",
  "steps": [
    {
      "id": "personal-info",
      "title": "Personal Information",
      "description": "Please provide your contact details",
      "fields": [
        {
          "name": "fullName",
          "type": "input",
          "label": "Full Name",
          "placeholder": "Enter your full name",
          "required": true
        }
      ]
    }
  ]
}
```

### Supported Field Types
- `input` - Text input fields
- `textarea` - Multi-line text areas
- `select` - Dropdown selections
- `tags` - Tag inputs with comma separation
- `checkbox` - Boolean checkboxes

## 🌍 Internationalization

### Custom i18n
```tsx
const i18nAdapter = {
  t: (key: string, params?: Record<string, any>) => {
    return translate(key, params)
  }
}
```

## 🔧 Customization

### UI Components
```tsx
const uiComponents = {
  Input: MyCustomInput,
  Textarea: MyCustomTextarea,
  Label: MyCustomLabel,
  Button: MyCustomButton,
  ProgressStep: MyCustomProgress
}
```

### Styling
- **CSS Modules**: Use with any CSS framework
- **Tailwind CSS**: Full Tailwind integration
- **Styled Components**: CSS-in-JS support
- **Emotion**: Emotion CSS support

## 📦 Package Details

- **Name**: `@benyue1978/next-dynamic-forms`
- **License**: MIT
- **Size**: <10KB (gzipped)
- **Dependencies**: React 18+, TypeScript 5+
- **Peer Dependencies**: next-intl (optional)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Install dependencies: `pnpm install`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Run tests: `pnpm test`
6. Create a changeset: `pnpm changeset`
7. Submit a pull request

## 📄 License

MIT © [benyue1978](https://github.com/benyue1978)

## 🆘 Support

- 📖 [Documentation](https://next-dynamic-forms.withus.fun)
- 🐛 [Issues](https://github.com/benyue1978/next-dynamic-forms/issues)
- 💬 [Discussions](https://github.com/benyue1978/next-dynamic-forms/discussions)
- 📧 [Email](mailto:yuesong@gmail.com)
