# Frontend - Support Request System

React-based frontend application for the Support Request Management System.

## Features

- **Request Intake** (US-01): Submit new support requests via web form
- **Triage Queue** (US-02): View and manage support requests
- **Request Details**: View detailed information about requests
- **Analytics Dashboard** (US-03): Manager insights and metrics

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

From the project root:

```bash
pnpm install
```

### Development

Start the development server:

```bash
cd packages/frontend
pnpm dev
```

The app will be available at http://localhost:3000

### Build

Build for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## Project Structure

```
src/
├── main.tsx              # Application entry point
├── App.tsx               # Main app component with routing
├── pages/                # Page components
│   ├── intake/           # Request submission (US-01)
│   ├── triage/           # Triage queue (US-02)
│   ├── detail/           # Request detail view
│   └── insights/         # Analytics dashboard (US-03)
├── components/           # Reusable UI components
│   └── ui/               # Base UI components
├── services/             # API services
│   ├── api.ts            # Real API client
│   └── mock-api.ts       # Mock API for development
├── hooks/                # Custom React hooks
└── types.ts              # Frontend-specific types
```

## API Integration

The frontend can operate in two modes:

1. **Mock Mode** (default): Uses mock data from `contracts/mock-data/requests.json`
2. **API Mode**: Connects to the backend API

Toggle via the `VITE_USE_MOCK_API` environment variable in `.env`.

## Architecture Decisions

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## UX Design Integration

See [INTEGRATION.md](./docs/INTEGRATION.md) for guidance on integrating UX designs.

## TODO for Students

- [ ] Implement form validation in IntakePage
- [ ] Add filtering and sorting to TriagePage
- [ ] Implement real-time updates (polling or WebSocket)
- [ ] Add error handling and loading states
- [ ] Implement responsive design
- [ ] Add accessibility features
- [ ] Connect to real backend API
- [ ] Add unit and integration tests
