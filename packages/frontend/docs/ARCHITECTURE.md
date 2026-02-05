# Frontend Architecture

## Overview

The frontend is a React-based single-page application (SPA) built with Vite, TypeScript, and React Router.

## Technology Stack

- **React 18**: UI library with hooks and functional components
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

## Architecture Decisions

### Component Structure

We use a feature-based organization:

```
src/
├── pages/           # Page-level components (one per route)
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── services/        # API and business logic
└── types.ts         # Type definitions
```

### State Management

Currently using local component state with hooks. For future consideration:
- Context API for global state (auth, theme)
- React Query or SWR for server state
- Zustand or Redux for complex client state

### API Integration

Two modes:
1. **Mock API**: Uses `contracts/mock-data/` for development
2. **Real API**: Connects to backend Express server

Toggle via `VITE_USE_MOCK_API` environment variable.

### Type Safety

- All types imported from `@grad-project/shared`
- Shared types ensure frontend/backend consistency
- Contract schemas define the source of truth

### Routing

Using React Router v6 with these routes:
- `/` - Request intake form (US-01)
- `/triage` - Triage queue (US-02)
- `/request/:id` - Request detail view
- `/insights` - Analytics dashboard (US-03)

## Development Patterns

### Hooks Pattern

Custom hooks encapsulate data fetching and state:
- `useRequests()` - Manage request list
- `useRequest(id)` - Manage single request (TODO)
- `useAnalytics()` - Manage metrics (TODO)

### Component Pattern

Functional components with TypeScript props:

```typescript
interface Props {
  request: Request;
  onUpdate: (data: Partial<Request>) => void;
}

function RequestCard({ request, onUpdate }: Props) {
  // Implementation
}
```

## Performance Considerations

- Code splitting by route (lazy loading)
- Memoization with `useMemo` and `useCallback`
- Virtual scrolling for large lists (TODO)
- Optimistic updates for better UX (TODO)

## Testing Strategy (TODO)

- Unit tests: Component logic with Vitest
- Integration tests: User flows with Testing Library
- E2E tests: Critical paths with Playwright

## Future Enhancements

- [ ] Real-time updates via WebSocket
- [ ] Offline support with service workers
- [ ] Advanced data visualization
- [ ] Keyboard shortcuts and accessibility
- [ ] Mobile responsive design
- [ ] Progressive Web App (PWA) features
