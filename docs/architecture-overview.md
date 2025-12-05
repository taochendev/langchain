# Architecture Overview

This document provides a high-level overview of the Campaign Generator application architecture.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   External      │
│   (Next.js)     │────│   (Express.js)  │────│   Services      │
│                 │    │                 │    │                 │
│ • React UI      │    │ • REST API      │    │ • Supabase DB   │
│ • Auth          │    │ • Authentication│    │ • OpenAI API    │
│ • State Mgmt    │    │ • LangChain     │    │ • Supabase Auth │
│ • Form Handling │    │ • Validation    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture (Next.js)

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

### Key Components

#### Authentication Layer
- `AuthProvider`: Manages user session and authentication state
- `LoginForm` / `SignUpForm`: Handle user authentication
- Protected routes redirect unauthenticated users

#### Campaign Management
- `CampaignCard`: Displays campaign summary
- `CampaignForm`: Create/edit campaign form
- `GenerateForm`: AI generation interface
- `Dashboard`: Main application interface

#### UI Components
- Reusable components: Button, Input, Textarea, Select, Card
- Consistent styling with Tailwind CSS utilities
- Responsive design for mobile and desktop

### Data Flow
1. User authentication via Supabase
2. API calls through centralized `api.ts` client
3. State management with React Query for caching and sync
4. Form state managed by React Hook Form
5. Real-time updates through query invalidation

## Backend Architecture (Express.js)

### Technology Stack
- **Framework**: Express.js with TypeScript
- **Authentication**: Supabase JWT verification
- **Validation**: Joi schemas
- **AI Integration**: LangChain with OpenAI GPT-4
- **Database**: Supabase (PostgreSQL)
- **Security**: Helmet, CORS, Rate limiting

### Layer Architecture

#### 1. Routes Layer (`/routes`)
- Define API endpoints and HTTP methods
- Apply middleware (auth, validation, rate limiting)
- Route to appropriate controllers

#### 2. Controllers Layer (`/controllers`)
- Handle HTTP requests and responses
- Coordinate between services
- Format API responses

#### 3. Services Layer (`/services`)
- Business logic implementation
- Database operations
- External service integration (OpenAI)

#### 4. Middleware Layer (`/middleware`)
- Authentication verification
- Request validation
- Error handling
- Rate limiting

#### 5. Utils Layer (`/utils`)
- Shared utilities
- Database client
- Validation schemas

### API Design

#### RESTful Endpoints
```
GET    /api/campaigns           - List campaigns
POST   /api/campaigns           - Create campaign
GET    /api/campaigns/:id       - Get campaign
PUT    /api/campaigns/:id       - Update campaign
DELETE /api/campaigns/:id       - Delete campaign
POST   /api/campaigns/generate  - Generate with AI
GET    /api/health              - Health check
```

#### Response Format
```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "errors": string[]
}
```

## Database Architecture (Supabase)

### Tables

#### campaigns
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES auth.users(id)
title           VARCHAR(200) NOT NULL
description     TEXT NOT NULL
target_audience VARCHAR(500) NOT NULL
campaign_type   VARCHAR(20) CHECK (email|social|web|print)
content         TEXT DEFAULT ''
status          VARCHAR(20) DEFAULT 'draft'
created_at      TIMESTAMP WITH TIME ZONE
updated_at      TIMESTAMP WITH TIME ZONE
```

### Security Features
- **Row Level Security (RLS)**: Users can only access their own campaigns
- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Data Validation**: Database constraints and API validation

### Indexes
- `campaigns(user_id)` - Fast user campaign queries
- `campaigns(status)` - Status-based filtering
- `campaigns(created_at DESC)` - Chronological ordering

## External Services Integration

### Supabase
- **Database**: PostgreSQL with real-time capabilities
- **Authentication**: JWT-based auth with multiple providers
- **Storage**: File storage (if needed for future features)
- **Edge Functions**: Serverless functions (potential future use)

### OpenAI (via LangChain)
- **Model**: GPT-4 for content generation
- **Integration**: LangChain framework for LLM operations
- **Prompt Engineering**: Structured prompts for campaign generation
- **Error Handling**: Graceful fallbacks and error recovery

## Security Architecture

### Authentication & Authorization
- JWT tokens for stateless authentication
- User session management via Supabase
- Route-level authentication middleware
- Resource-level authorization (RLS)

### Input Validation
- Client-side validation with Zod schemas
- Server-side validation with Joi schemas
- SQL injection prevention via parameterized queries
- XSS prevention via input sanitization

### API Security
- Rate limiting to prevent abuse
- CORS configuration for cross-origin requests
- Helmet.js for security headers
- HTTPS enforcement in production

### Data Security
- Environment variable management
- Secure secret storage
- Database encryption at rest
- Secure communication (HTTPS/TLS)

## Performance Considerations

### Frontend Optimization
- React Query caching for reduced API calls
- Component memoization where appropriate
- Lazy loading for large components
- Image optimization with Next.js

### Backend Optimization
- Database indexing for fast queries
- Request/response compression
- Connection pooling
- Caching strategies for frequently accessed data

### Infrastructure
- CDN for static assets (Vercel/Netlify)
- Database connection optimization
- Auto-scaling capabilities
- Load balancing (when needed)

## Monitoring & Observability

### Error Tracking
- Structured error responses
- Error logging and monitoring
- Client-side error boundaries
- Server-side error handling

### Performance Monitoring
- API response time tracking
- Database query performance
- Frontend performance metrics
- User experience monitoring

### Logging
- Structured logging format
- Request/response logging
- Error logging
- Security event logging

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Database read replicas
- Microservice architecture potential
- Container deployment ready

### Vertical Scaling
- Resource usage optimization
- Database performance tuning
- Caching implementations
- Code optimization

### Future Enhancements
- Redis for session storage
- Message queues for async processing
- Microservice decomposition
- Advanced analytics and reporting
