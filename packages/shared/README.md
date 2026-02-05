# @grad-project/shared

Shared types, constants, utilities, and validators used across the grad project frontend and backend.

## Purpose

This package provides common code to ensure consistency between frontend and backend:

- **Types**: TypeScript types re-exported from contracts
- **Constants**: Shared enums and constant values (status, priority, categories)
- **Utils**: Common utility functions (date formatting, validation helpers)
- **Validators**: Validation functions using Zod schemas from contracts

## Usage

Install in your frontend or backend package:

```bash
pnpm add @grad-project/shared
```

Import types and utilities:

```typescript
import { Request, Category, Priority, Status } from '@grad-project/shared/types';
import { STATUS_VALUES, PRIORITY_VALUES } from '@grad-project/shared/constants';
import { formatDate, isValidRequestId } from '@grad-project/shared/utils';
import { validateRequest } from '@grad-project/shared/validators';
```

## Development

Build the package:

```bash
pnpm build
```

Watch for changes during development:

```bash
pnpm dev
```

## Structure

- `src/types/` - Type definitions re-exported from contracts
- `src/constants/` - Shared constants and enums
- `src/utils/` - Utility functions
- `src/validators/` - Validation logic using Zod
