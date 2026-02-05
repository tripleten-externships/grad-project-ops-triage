# Software Engineering Discipline Guide

## 🎯 Role Overview

As a **Software Engineer** on this project, you are responsible for building the complete application stack—both frontend and backend. You'll create the user interface, implement API endpoints, manage data persistence, and ensure all components integrate seamlessly.

### Your Impact

- **Users depend on you** to create an intuitive, functional interface
- **Other disciplines integrate through your APIs** (Data Science, AI Automation, BIA)
- **The system only works** if your code is solid and well-tested

## 📋 Required Deliverables

### Frontend (React + TypeScript)

| Deliverable | Location | Description |
|-------------|----------|-------------|
| **Intake Page** | [`packages/frontend/src/pages/intake/`](../../packages/frontend/src/pages/intake/) | Form for users to submit IT requests |
| **Triage Queue** | [`packages/frontend/src/pages/triage/`](../../packages/frontend/src/pages/triage/) | Agent view of pending requests |
| **Request Detail** | [`packages/frontend/src/pages/detail/`](../../packages/frontend/src/pages/detail/) | Full request details and editing |
| **Insights Dashboard** | [`packages/frontend/src/pages/insights/`](../../packages/frontend/src/pages/insights/) | Metrics and analytics visualization |
| **API Service** | [`packages/frontend/src/services/api.ts`](../../packages/frontend/src/services/api.ts) | All API calls to backend |
| **Type Definitions** | [`packages/frontend/src/types.ts`](../../packages/frontend/src/types.ts) | TypeScript interfaces matching contracts |

### Backend (Express + Node.js + MongoDB)

| Deliverable | Location | Description |
|-------------|----------|-------------|
| **Request Routes** | [`packages/backend/src/routes/requests.routes.ts`](../../packages/backend/src/routes/requests.routes.ts) | CRUD endpoints for requests |
| **Triage Routes** | [`packages/backend/src/routes/triage.routes.ts`](../../packages/backend/src/routes/triage.routes.ts) | Auto-triage endpoints |
| **Analytics Routes** | [`packages/backend/src/routes/analytics.routes.ts`](../../packages/backend/src/routes/analytics.routes.ts) | Metrics and reporting |
| **User Routes** | [`packages/backend/src/routes/users.routes.ts`](../../packages/backend/src/routes/users.routes.ts) | User management |
| **Models** | [`packages/backend/src/models/`](../../packages/backend/src/models/) | Mongoose schemas |
| **Webhook Service** | [`packages/backend/src/services/webhook.service.ts`](../../packages/backend/src/services/webhook.service.ts) | Event emission for AI Automation |
| **Seed Script** | [`packages/backend/src/utils/seed-database.ts`](../../packages/backend/src/utils/seed-database.ts) | Database population |

## 🛠️ Tools & Technologies

### Core Stack

```yaml
Frontend:
  - React 18 (UI library)
  - TypeScript 5 (Type safety)
  - Vite (Build tool)
  - React Router (Navigation)

Backend:
  - Node.js 18+ (Runtime)
  - Express.js (Web framework)
  - TypeScript 5 (Type safety)
  - MongoDB + Mongoose (Database)

Development:
  - pnpm (Package manager)
  - ESLint (Linting)
  - Prettier (Formatting)
  - Git (Version control)
```

### Recommended Libraries

**Frontend**:
- **UI Components**: Material-UI, Chakra UI, or shadcn/ui
- **HTTP Client**: Fetch API or Axios
- **Form Handling**: React Hook Form
- **Data Visualization**: Recharts, Chart.js, or D3.js
- **Date Handling**: date-fns

**Backend**:
- **Validation**: Ajv, express-validator
- **Security**: Helmet, cors, bcrypt, jsonwebtoken
- **Environment**: dotenv
- **Date/Time**: date-fns
- **Logging**: winston, morgan

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
# From project root
pnpm install

# Or install individually
cd packages/frontend && pnpm install
cd packages/backend && pnpm install
```

### 2. Configure Environment Variables

**Frontend** (`packages/frontend/.env`):
```env
VITE_API_URL=http://localhost:3000
```

**Backend** (`packages/backend/.env`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ops-triage
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ops-triage

JWT_SECRET=your-secret-key-here
NODE_ENV=development

# Optional integrations
DS_API_URL=http://localhost:8000
AI_WEBHOOK_URL=http://localhost:3001/webhooks
```

### 3. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt install mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas** (Recommended)
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Get connection string
4. Add to `.env`

### 4. Seed the Database

```bash
cd packages/backend
pnpm seed
```

This loads sample users and requests from [`contracts/mock-data/`](../../contracts/mock-data/).

### 5. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd packages/backend
pnpm dev
# Runs on http://localhost:3000
```

**Terminal 2 - Frontend**:
```bash
cd packages/frontend
pnpm dev
# Runs on http://localhost:5173
```

### 6. Verify Setup

- Frontend: Open [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- Test API: `curl http://localhost:3000/api/requests`

## 📖 Development Workflow

### Step 1: Review User Stories

Read all user stories in [`contracts/user-stories/`](../../contracts/user-stories/):
- **US-01**: Submit Request
- **US-02**: Agent Triage
- **US-03**: Manager Dashboard

### Step 2: Understand the Contracts

Review:
- **Data schemas**: [`contracts/schemas/`](../../contracts/schemas/)
- **API contract**: [`contracts/schemas/api-contract.yml`](../../contracts/schemas/api-contract.yml)
- **Business rules**: [`contracts/data-models/business-rules.md`](../../contracts/data-models/business-rules.md)

### Step 3: Backend-First or Frontend-First?

**Recommended: Backend-first approach**

**Days 1-3: Backend Foundation**
1. Set up database models
2. Implement CRUD endpoints
3. Add validation middleware
4. Test with Postman/Insomnia

**Days 4-5: Frontend Development**
1. Create page components
2. Implement API calls
3. Add forms and validation
4. Style with CSS/UI library

**Days 6-7: Integration & Testing**
1. Connect frontend to backend
2. Test full user flows
3. Fix bugs
4. Add error handling

### Step 4: Implementation Order

**Backend**:
1. ✅ Set up Express server (`server.ts`)
2. ✅ Create Mongoose models (`Request.ts`, `User.ts`)
3. ✅ Implement request routes (GET, POST, PATCH)
4. ✅ Add validation middleware
5. ✅ Implement triage endpoints
6. ✅ Add analytics endpoints
7. ✅ Implement webhook service
8. ✅ Test with Postman

**Frontend**:
1. ✅ Set up routing (React Router)
2. ✅ Create intake form page
3. ✅ Implement API service layer
4. ✅ Create triage queue page
5. ✅ Build request detail page
6. ✅ Add insights dashboard
7. ✅ Style all pages
8. ✅ Add loading/error states

## 💡 Key Implementation Guidance

### Backend: Express API Structure

```typescript
// packages/backend/src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import requestRoutes from './routes/requests.routes';
import triageRoutes from './routes/triage.routes';
import analyticsRoutes from './routes/analytics.routes';
import { connectDatabase } from './config/database';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes
app.use('/api/requests', requestRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Connect to database and start server
connectDatabase().then(() => {
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
});
```

### Backend: Mongoose Model Example

```typescript
// packages/backend/src/models/Request.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IRequest extends Document {
  id: string;
  title: string;
  description: string;
  category: 'Hardware' | 'Software' | 'Network' | 'Access' | 'Other';
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  submittedBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  slaDeadline: Date;
}

const RequestSchema = new Schema<IRequest>({
  title: { type: String, required: true, minlength: 5, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  category: { 
    type: String, 
    enum: ['Hardware', 'Software', 'Network', 'Access', 'Other'],
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['P0', 'P1', 'P2', 'P3'],
    default: 'P3'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  submittedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  slaDeadline: { type: Date, required: true }
}, {
  timestamps: true
});

// Indexes for common queries
RequestSchema.index({ status: 1, createdAt: -1 });
RequestSchema.index({ category: 1 });

export default mongoose.model<IRequest>('Request', RequestSchema);
```

### Backend: Request Controller Example

```typescript
// packages/backend/src/controllers/requests.controller.ts
import { Request, Response } from 'express';
import RequestModel from '../models/Request';
import { calculateSLADeadline } from '../utils/sla';

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { title, description, category, submittedBy } = req.body;
    
    // Calculate SLA deadline based on priority
    const priority = req.body.priority || 'P3';
    const slaDeadline = calculateSLADeadline(priority);
    
    const request = new RequestModel({
      title,
      description,
      category,
      priority,
      submittedBy,
      slaDeadline
    });
    
    await request.save();
    await request.populate('submittedBy');
    
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create request' });
  }
};

export const listRequests = async (req: Request, res: Response) => {
  try {
    const { status, category, limit = 50, offset = 0 } = req.query;
    
    const filter: any = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    const requests = await RequestModel
      .find(filter)
      .populate('submittedBy assignedTo')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset));
    
    const total = await RequestModel.countDocuments(filter);
    
    res.json({
      data: requests,
      meta: { total, limit, offset }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};
```

### Frontend: API Service Layer

```typescript
// packages/frontend/src/services/api.ts
import { Request, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Requests
  async getRequests(params?: { status?: string; category?: string }) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ data: Request[]; meta: any }>(`/api/requests?${query}`);
  }

  async getRequest(id: string) {
    return this.request<Request>(`/api/requests/${id}`);
  }

  async createRequest(data: Partial<Request>) {
    return this.request<Request>('/api/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRequest(id: string, data: Partial<Request>) {
    return this.request<Request>(`/api/requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Analytics
  async getAnalyticsSummary() {
    return this.request<any>('/api/analytics/summary');
  }
}

export const api = new ApiService();
```

### Frontend: React Component Example

```typescript
// packages/frontend/src/pages/intake/IntakePage.tsx
import React, { useState } from 'react';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const IntakePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Software' as const,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const request = await api.createRequest({
        ...formData,
        submittedBy: 'current-user-id', // TODO: Get from auth
      });
      
      navigate(`/requests/${request.id}`);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="intake-page">
      <h1>Submit IT Support Request</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            minLength={5}
            maxLength={200}
          />
        </div>

        <div>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            maxLength={2000}
            rows={6}
          />
        </div>

        <div>
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
          >
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Network">Network</option>
            <option value="Access">Access</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};
```

## 🔗 Using Contracts

### Import Contract Types

```typescript
// Generate TypeScript types from JSON schemas
import { Request } from '@contracts/schemas/request.schema';

// Or define manually based on schema
interface Request {
  id: string;
  title: string;
  description: string;
  // ... match the contract exactly
}
```

### Validate Against Schemas

```typescript
// Backend validation
import Ajv from 'ajv';
import requestSchema from '@contracts/schemas/request.schema.json';

const ajv = new Ajv();
const validate = ajv.compile(requestSchema);

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const valid = validate(req.body);
  if (!valid) {
    return res.status(400).json({ errors: validate.errors });
  }
  next();
};
```

## 🔌 Integration with Other Disciplines

### With Data Science

```typescript
// Call DS model for predictions
async function getPredictions(request: Request) {
  const response = await fetch(`${DS_API_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: request.title,
      description: request.description,
      department: request.submittedBy.department
    })
  });
  
  return response.json(); // Matches ds-model-output.schema.json
}
```

### With AI Automation

```typescript
// Emit webhook events
import { WebhookService } from './services/webhook.service';

// After creating request
await webhookService.emit('request.created', {
  id: request.id,
  title: request.title,
  status: request.status
});
```

### With BIA

```typescript
// Provide analytics endpoints
router.get('/api/analytics/summary', async (req, res) => {
  const stats = await RequestModel.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgResolutionTime: { $avg: '$resolutionTime' }
      }
    }
  ]);
  
  res.json(stats);
});
```

## ✅ Testing Requirements

### Unit Tests (Optional but Recommended)

```typescript
// packages/backend/src/__tests__/requests.test.ts
import request from 'supertest';
import app from '../server';

describe('POST /api/requests', () => {
  it('creates a new request', async () => {
    const response = await request(app)
      .post('/api/requests')
      .send({
        title: 'Laptop not working',
        description: 'Screen is black',
        category: 'Hardware',
        submittedBy: 'user-id'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Laptop not working');
  });
});
```

### Manual Testing Checklist

- [ ] Can submit a new request through frontend
- [ ] Request appears in triage queue
- [ ] Can update request status
- [ ] Can assign request to agent
- [ ] Analytics page shows correct metrics
- [ ] Error messages display properly
- [ ] Loading states work
- [ ] Pagination works for large lists

## 🎯 Stretch Goals

- [ ] **Authentication**: JWT-based login/logout
- [ ] **Real-time Updates**: WebSockets for live queue updates
- [ ] **File Uploads**: Handle attachments on requests
- [ ] **Search**: Full-text search across requests
- [ ] **Notifications**: Email/in-app notifications
- [ ] **Audit Log**: Track all changes to requests
- [ ] **Export**: CSV/PDF export of requests
- [ ] **Advanced Filtering**: Multi-criteria filters with AND/OR logic

## 📚 Additional Resources

- **[API Documentation](../../packages/backend/docs/API.md)** - Complete API reference
- **[Frontend Architecture](../../packages/frontend/docs/ARCHITECTURE.md)** - Frontend design patterns
- **[Backend Architecture](../../packages/backend/docs/ARCHITECTURE.md)** - Backend design patterns
- **[Integration Guide](../INTEGRATION.md)** - How components connect
- **React Docs**: [react.dev](https://react.dev)
- **Express Docs**: [expressjs.com](https://expressjs.com)
- **MongoDB Docs**: [mongodb.com/docs](https://www.mongodb.com/docs/)

## ❓ Common Questions

**Q: Frontend or backend first?**  
A: Backend first. Easier to test with Postman, then connect frontend.

**Q: How do I test without Data Science API?**  
A: Skip ML predictions initially, add later. Use mock responses.

**Q: What if MongoDB is complex?**  
A: Use MongoDB Atlas free tier. GUI makes it easier.

**Q: Do I need tests?**  
A: Manual testing is minimum. Unit tests are stretch goal.

---

**You've got this!** Follow this guide step-by-step, refer to the contracts, and build something great. 🚀
