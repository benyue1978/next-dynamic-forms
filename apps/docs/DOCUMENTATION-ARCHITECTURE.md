# Documentation Architecture Guide

This document describes the implementation details of the Next Dynamic Forms documentation system, focusing on the demo system and interactive playground.

## Overview

The documentation system is built with:

- **Next.js 15** with **Nextra 3** for documentation
- **Interactive Playground** with Sandpack + Monaco Editor
- **Demo System** with live code examples
- **Comprehensive Testing** with Vitest + Playwright

## Directory Structure

```text
apps/docs/
├── demo-snippets/           # Demo source files
│   ├── basic-form.tsx      # Basic form demo
│   ├── nextjs-integration.tsx # Next.js integration
│   └── [more demos...]
├── lib/                    # Utility libraries
│   ├── demo-loader.ts     # Demo loading system
│   └── playground-parser.ts # URL parameter parser
├── tests/
│   ├── unit/              # Unit tests (Vitest)
│   └── e2e/               # E2E tests (Playwright)
├── pages/                 # Documentation pages
└── components/            # React components
```

## Demo System Implementation

### 1. Demo Loader (`lib/demo-loader.ts`)

**Purpose**: Dynamically load demo snippets from the filesystem

**Key Features**:

- **Type-safe demo loading** with `DemoName` type
- **Security validation** against directory traversal
- **Error handling** for missing/invalid demos
- **Static file serving** via `/demo-snippets/` route

**Usage**:

```typescript
import { loadDemoSnippet } from '../lib/demo-loader'

const code = await loadDemoSnippet('basic-form')
```

**Demo Structure**:
Each demo is a self-contained React component that:

- Uses the `@benyue1978/next-dynamic-forms` package
- Provides UI components via adapters
- Demonstrates real-world usage patterns
- Includes form state management

### 2. Demo Snippets (`demo-snippets/`)

**File Structure**:

- `basic-form.tsx`: Simple contact form with validation
- `nextjs-integration.tsx`: Next.js project setup wizard
- Future demos: custom-styling, validation, multi-step, async-loading

**Demo Template**:

```typescript
// Standard demo structure
import React, { useState } from 'react'
import { createBasicAdapter } from '@benyue1978/next-dynamic-forms'

const uiComponents = { /* UI mapping */ }
const formConfig = { /* form configuration */ }
const DemoForm = createBasicAdapter(uiComponents)

export default function DemoPage() {
  const [formData, setFormData] = useState({ taskType: 'demo' })
  const [currentStep, setCurrentStep] = useState(0)
  
  // Form handling logic
  return <DemoForm {...props} />
}
```

## Interactive Playground

### 1. Playground Parser (`lib/playground-parser.ts`)

**Purpose**: Handle URL-based code sharing and persistence

**Key Features**:

- **Base64 encoding/decoding** for URL-safe code
- **Size validation** (50KB max for security)
- **XSS prevention** with basic sanitization
- **URL parameter management**

**Usage**:

```typescript
import { 
  encodeBase64, 
  decodeBase64, 
  getCodeFromUrl,
  updateUrlWithCode 
} from '../lib/playground-parser'

// Share code via URL
const encoded = encodeBase64(code)
updateUrlWithCode(code)

// Load code from URL
const codeFromUrl = getCodeFromUrl()
```

### 2. Playground Modes

**Sandpack Mode**:

- Full IDE experience with file explorer
- Real-time preview
- Package management (npm)
- Multiple file support

**Monaco Editor Mode**:

- Lightweight code editor
- TypeScript IntelliSense
- Real-time preview
- Faster loading

## Testing Architecture

### Unit Tests (`tests/unit/`)

**Demo Loader Tests** (`demo-loader.test.ts`):

- Demo loading functionality
- Path validation security
- Error handling scenarios
- Invalid demo name handling

**Playground Parser Tests** (`playground-parser.test.ts`):

- Base64 encoding/decoding accuracy
- URL parameter validation
- Security constraints
- Unicode character handling

### E2E Tests (`tests/e2e/`)

**Demo Pages** (`demos.spec.ts`):

- Demo loading and rendering
- Form interaction workflows
- Validation testing
- Responsive design testing

**Documentation Navigation** (`docs-navigation.spec.ts`):

- Page navigation
- Search functionality
- Sidebar responsiveness
- Cross-browser compatibility

**Playground Features** (`playground.spec.ts`):

- Demo loading
- URL parameter handling
- Code sharing functionality
- Mode switching

## Development Workflow

### Adding New Demos

1. **Create demo file** in `demo-snippets/`

   ```bash
   touch demo-snippets/new-feature.tsx
   ```

2. **Add demo to loader** in `lib/demo-loader.ts`

   ```typescript
   const VALID_DEMOS = [
     'basic-form',
     'nextjs-integration',
     'new-feature'  // Add new demo name
   ] as const
   ```

3. **Create documentation** in `pages/examples/`

   ```mdx
   ### New Feature Demo
   
   <Playground demo="new-feature" />
   ```

4. **Add E2E tests** in `tests/e2e/demos.spec.ts`

### URL Sharing Format

**Loading custom code**:

```text
/playground?src={base64-encoded-code}
```

**Loading specific demo**:

```text
/playground?demo=basic-form
```

### Security Considerations

- **Path validation** prevents directory traversal
- **Size limits** prevent oversized code uploads
- **Sanitization** removes potentially harmful patterns
- **Type safety** prevents runtime errors

## Performance Optimizations

- **Code splitting** for demo snippets
- **Lazy loading** for playground modes
- **Static generation** for documentation pages
- **CDN integration** for external dependencies

## Browser Support

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Mobile browsers**: Responsive design
- **IE11**: Not supported (Next.js 15 requirement)

## Configuration

### Environment Variables

```bash
# For local development
NEXT_PUBLIC_DEMO_BASE_URL=http://localhost:3000

# For production
NEXT_PUBLIC_DEMO_BASE_URL=https://docs.example.com
```

### Build Configuration

```typescript
// next.config.js
module.exports = {
  output: 'export', // For static hosting
  trailingSlash: true,
  images: { unoptimized: true }
}
```

## Troubleshooting

### Common Issues

1. **Demo not loading**
   - Check file exists in `demo-snippets/`
   - Verify demo name in `VALID_DEMOS`
   - Check browser network tab

2. **Playground URL issues**
   - Validate base64 encoding
   - Check URL length limits
   - Verify content security policy

3. **Build failures**
   - Check TypeScript errors
   - Verify demo snippet syntax
   - Run `pnpm test:unit` for quick validation

### Debug Mode

Enable debug logging:

```typescript
// In browser console
localStorage.setItem('debug', 'docs:*')
```

This architecture provides a robust, scalable documentation system with comprehensive testing and security measures.
