# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@benyue1978/next-dynamic-forms`, a configuration-driven dynamic form system with multi-step forms, built-in internationalization, and UI component adaptation. It's a React/Next.js library published as an NPM package.

## Architecture

### Core Components

- **DynamicForm** (`src/components/DynamicForm.tsx`): Main form component handling multi-step navigation and validation
- **FieldRenderer** (`src/components/FieldRenderer.tsx`): Renders individual form fields based on type
- **Configuration System**: JSON-based form definitions with support for multiple task types

### Key Concepts

- **UI Adapters**: Framework-specific wrappers (Next.js, React, basic)
- **I18n Adapters**: Internationalization integration (next-intl, react-i18next, basic)
- **Config Loaders**: Static, API-based, or function-based configuration loading
- **Task Types**: `new-project`, `add-feature`, `generate-guide`

### File Structure

```text
src/
├── components/
│   ├── DynamicForm.tsx      # Main form component
│   └── FieldRenderer.tsx    # Field rendering logic
├── types/
│   └── index.ts            # TypeScript interfaces
├── utils/
│   └── config-loader.ts    # Configuration loading utilities
├── adapters/
│   └── nextjs.tsx          # Framework-specific adapters
└── index.ts               # Public API exports
```

## Development Commands

### Building

```bash
npm run build     # Build package with tsup (CJS + ESM + DTS)
npm run dev       # Watch mode development build
npm run clean     # Clean dist folder
```

### Testing

```bash
npm run test          # Run vitest in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run with coverage report
```

### Package Management

- Package name: `@benyue1978/next-dynamic-forms`
- Main entry: `dist/index.js`
- Type definitions: `dist/index.d.ts`
- Build tool: `tsup` with dual CJS/ESM output

## Usage Patterns

### Quick Integration (Next.js)

```tsx
import { createNextJSAdapter } from '@benyue1978/dynamic-forms'

const NextJSForm = createNextJSAdapter(uiComponents)
// Use as <NextJSForm config={...} />
```

### Manual Adapter Creation

```tsx
import { DynamicForm } from '@benyue1978/dynamic-forms'

// Create custom i18n adapter
const i18nAdapter = {
  t: (key: string, params?: Record<string, any>) => translate(key, params)
}

// Use with custom UI components
<DynamicForm
  config={formConfig}
  uiComponents={uiComponents}
  i18n={i18nAdapter}
  // ... other props
/>
```

## Configuration Format

Form configurations are JSON objects with:

- `id`: Unique identifier
- `templateName`: Template reference
- `steps`: Array of form steps containing fields

Each field supports: `input`, `textarea`, `select`, `tags`, `checkbox` types with validation and i18n support.

## Testing Framework

- **Test runner**: Vitest with jsdom environment
- **Testing library**: React Testing Library
- **Coverage**: Built-in vitest coverage
- **Setup**: `test/setup.ts` configures testing environment

## TypeScript Configuration

- Target: ES2020
- Module: ESNext with bundler resolution
- JSX: Preserve (for Next.js)
- Strict mode enabled
- Declaration files generated

## Dependencies

### Peer Dependencies

- next: >=14.0.0
- next-intl: >=3.0.0  
- react: >=18.0.0
- react-dom: >=18.0.0

### Dev Dependencies

- TypeScript 5.x
- Vitest 3.x
- React Testing Library
- JSDOM for testing
