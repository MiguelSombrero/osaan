# Osaan UI

Next.js application for USER and MANAGER roles in the Osaan competence management system.

## Overview

This is a modern web application built with Next.js that allows users to:

- Browse available skills from the skill catalog
- Create and manage competence profiles
- Link skills to employees with ratings (1-5)

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **API Integration**: Next.js API Routes as proxy to microservices

## Architecture

The application uses Next.js API routes (`/src/app/api/*`) to proxy requests to backend microservices:

```
Browser → Next.js API Routes → Microservices
                ↓
        - skill-catalog-service (port 8092)
        - competence-profile-service (port 8090)
        - employee-service (port 8091)
```

This architecture provides:

- Single origin for the frontend (no CORS issues)
- Future integration point for authentication/authorization
- Session management with Redis (future)
- Request logging and monitoring

## Project Structure

```
src/
├── app/
│   ├── api/                 # API routes (proxy to microservices)
│   │   ├── skills/
│   │   ├── competences/
│   │   └── employees/
│   ├── competences/         # Competences management page
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── lib/
│   └── api-client.ts        # Client-side API functions
├── providers/
│   └── query-provider.tsx   # TanStack Query provider
└── types/
    ├── skill.ts             # Skill-related types
    ├── competence.ts        # Competence-related types
    └── employee.ts          # Employee-related types
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Running microservices (skill-catalog-service, competence-profile-service, employee-service)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your microservice URLs
```

### Development

```bash
# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Microservice endpoints
SKILL_CATALOG_API_URL=http://localhost:8092
COMPETENCE_PROFILE_API_URL=http://localhost:8090
EMPLOYEE_API_URL=http://localhost:8091

# Future: Keycloak authentication
# KEYCLOAK_ENABLED=false
# KEYCLOAK_ISSUER_BASE_URL=
# KEYCLOAK_CLIENT_ID=
# KEYCLOAK_CLIENT_SECRET=

# Future: Redis session store
# REDIS_ENABLED=false
# REDIS_URL=
```

## Features

### Current Features (MVP)

- **Browse Skills**: View all available skills with search and pagination
- **Skill Search**: Filter skills by name
- **Pagination**: Navigate through large skill lists
- **Clean UI**: Modern, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript support

### Planned Features

- **Competence Profile Creation**: Add skills with ratings to employee profiles
- **Employee Management**: Create and link employee records
- **Authentication**: Keycloak integration for secure access
- **Session Management**: Redis-backed sessions
- **Authorization**: Role-based access control (USER/MANAGER)
- **Real-time Updates**: Optimistic updates with React Query

## API Endpoints

### Skills API

- `GET /api/skills?query=java&page=0&size=20` - Fetch skills with pagination

### Competences API

- `POST /api/competences/:employeeId` - Create competences for an employee

### Employees API

- `POST /api/employees` - Create a new employee record

## Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t osaan-ui .

# Run container
docker run -p 3000:3000 \
  -e SKILL_CATALOG_API_URL=http://skill-catalog-service:8092 \
  -e COMPETENCE_PROFILE_API_URL=http://competence-profile-service:8090 \
  -e EMPLOYEE_API_URL=http://employee-service:8091 \
  osaan-ui
```

### K3d Deployment

This application is designed to be deployed in a K3d cluster. Ensure the microservices are accessible within the cluster network.

## Development Notes

### Adding New Microservice Integrations

1. Add the microservice URL to `.env.local.example` and `.env.local`
2. Create TypeScript types in `src/types/`
3. Add API route in `src/app/api/[resource]/route.ts`
4. Add client function in `src/lib/api-client.ts`
5. Use in components with TanStack Query

### Code Style

- Use TypeScript for type safety
- Follow Next.js 15 App Router conventions
- Use `'use client'` directive only when necessary
- Prefer Server Components over Client Components
- Use Tailwind CSS for styling

## Comparison with osaan-admin-ui

Unlike `osaan-admin-ui` (Node + Express backend + React SPA), this application uses:

- **Next.js** instead of separate Express backend and React frontend
- **App Router** for routing and API routes
- **Server Components** for better performance
- **Built-in API routes** instead of standalone Express proxy
- **Simplified deployment** with single container

## Future Enhancements

1. **Authentication & Authorization**
   - Integrate Keycloak for SSO
   - Extract user identity from OAuth tokens
   - Implement role-based access control

2. **Session Management**
   - Redis-backed sessions
   - Secure cookie handling

3. **Competence Profile UI**
   - Form for adding skills with ratings
   - Visual skill matrix
   - Employee profile page

4. **Performance**
   - Server-side rendering for initial page load
   - Optimistic UI updates
   - Request deduplication

5. **Observability**
   - OpenTelemetry tracing
   - Error tracking
   - Performance monitorin
