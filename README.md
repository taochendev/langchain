# Campaign Generator

A full-stack AI-powered campaign generator built with React/Next.js, Express.js, and Supabase. This application allows users to create, manage, and generate marketing campaigns using GPT-4 through LangChain integration.

## Features

- 🎯 **AI Campaign Generation**: Generate campaign content using GPT-4
- 📊 **Campaign Dashboard**: View and manage all campaigns
- 🔐 **Authentication**: Secure user authentication with Supabase
- 📱 **Responsive Design**: Modern UI built with Tailwind CSS
- 🛡️ **Security**: Input validation, rate limiting, and secure API endpoints
- 🧪 **Testing**: Comprehensive unit and integration tests

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form validation and handling
- **React Query** - Data fetching and caching

### Backend
- **Express.js** - Web framework for Node.js
- **LangChain** - LLM integration framework
- **OpenAI GPT-4** - AI text generation
- **Express Rate Limit** - API rate limiting
- **Joi** - Input validation

### Database & Auth
- **Supabase** - PostgreSQL database and authentication
- **Supabase Auth** - User authentication and authorization

## Project Structure

```
campaign-generator/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # Reusable React components
│   │   ├── lib/             # Utility functions and configurations
│   │   └── types/           # TypeScript type definitions
│   ├── public/              # Static assets
│   └── tests/               # Frontend tests
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic services
│   │   └── utils/           # Utility functions
│   └── tests/               # Backend tests
└── docs/                    # Additional documentation
```

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campaign-generator
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   
   Copy and configure environment files:
   ```bash
   # Frontend
   cp frontend/env.local.example frontend/.env.local
   
   # Backend  
   cp backend/env.example backend/.env
   ```
   
   Edit the files with your actual values:
   
   **Frontend (.env.local):**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
   
   **Backend (.env):**
   ```env
   PORT=3001
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   OPENAI_API_KEY=your_openai_api_key
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database Setup**
   
   Run the SQL migrations in your Supabase SQL editor:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `docs/database-setup.sql`
   - Execute the script

5. **Start Development Servers**
   ```bash
   npm run dev
   ```
   
   This will start both servers concurrently:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

6. **Verify Setup**
   - Visit http://localhost:3000 
   - Create an account or sign in
   - Try creating a campaign or using AI generation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Campaigns
- `GET /api/campaigns` - Get all user campaigns
- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/:id` - Get campaign by ID
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/generate` - Generate campaign content with AI

## Testing

Run all tests:
```bash
npm run test
```

Run frontend tests only:
```bash
npm run test:frontend
```

Run backend tests only:
```bash
npm run test:backend
```

## Security Features

- Input validation with Joi schemas
- Rate limiting on API endpoints
- SQL injection prevention with parameterized queries
- Authentication middleware
- CORS configuration
- Environment variable validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details
