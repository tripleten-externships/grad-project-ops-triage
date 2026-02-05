# Backend - Support Request API

Express-based RESTful API for the Support Request Management System.

## Features

- RESTful API following OpenAPI contract specifications
- MongoDB database with Mongoose ODM
- Request validation using Zod schemas
- CRUD operations for support requests
- Triage operations (assign, update priority)
- Analytics endpoints
- Webhook event emission
- TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- MongoDB 6+ (local or Atlas)

### Installation

From the project root:

```bash
pnpm install
```

### Configuration

Copy the example environment file:

```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` with your configuration.

### Database Setup

1. Start MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in `.env`
3. Seed the database with sample data:

```bash
pnpm seed
```

### Development

Start the development server with auto-reload:

```bash
pnpm dev
```

The API will be available at http://localhost:4000

### Build

Build for production:

```bash
pnpm build
```

Run production build:

```bash
pnpm start
```

## Project Structure

```
src/
├── server.ts                    # Express server setup
├── routes/                      # API route definitions
│   ├── requests.routes.ts       # Request CRUD endpoints
│   ├── users.routes.ts          # User management
│   ├── triage.routes.ts         # Triage operations
│   └── analytics.routes.ts      # Analytics endpoints
├── controllers/                 # Request handlers
│   └── requests.controller.ts
├── services/                    # Business logic
│   ├── request.service.ts
│   └── webhook.service.ts
├── models/                      # Mongoose schemas
│   ├── Request.ts
│   └── User.ts
├── middleware/                  # Express middleware
│   ├── auth.middleware.ts
│   └── validation.middleware.ts
└── utils/                       # Utility scripts
    └── seed-database.ts
```

## API Endpoints

See [API.md](./docs/API.md) for detailed API documentation.

### Core Endpoints

- `GET /api/requests` - List all requests (with filters)
- `POST /api/requests` - Create new request
- `GET /api/requests/:id` - Get request by ID
- `PATCH /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request

### Triage Endpoints

- `POST /api/triage/:id/assign` - Assign request to agent
- `PATCH /api/triage/:id/priority` - Update priority

### Analytics Endpoints

- `GET /api/analytics/metrics` - Get dashboard metrics

## Architecture

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for architectural decisions.

## Docker Support

Build and run with Docker:

```bash
docker build -t grad-project-backend .
docker run -p 4000:4000 --env-file .env grad-project-backend
```

Or use docker-compose from the project root.

## TODO for Students

- [ ] Implement authentication/authorization
- [ ] Add comprehensive error handling
- [ ] Implement request validation middleware
- [ ] Add pagination to list endpoints
- [ ] Implement webhook event system
- [ ] Add request logging
- [ ] Implement rate limiting
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Write unit and integration tests
- [ ] Add database indexes for performance
- [ ] Implement caching strategy
