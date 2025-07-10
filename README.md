# MarketHub - Multi-Marketplace E-commerce Management System

## Overview

MarketHub is a comprehensive e-commerce management system built with a React frontend and Express backend. It enables businesses to manage products, customers, orders, and marketplace integrations from a single dashboard. The application follows a modern full-stack architecture with TypeScript, PostgreSQL database, and a component-based UI using shadcn/ui.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **API Pattern**: RESTful APIs with standardized error handling

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Database**: PostgreSQL with decimal precision for financial data
- **Validation**: Zod schemas for runtime type validation

## Key Components

### Core Entities
1. **Users**: Authentication and user management
2. **Products**: Product catalog with SKU, pricing, and inventory
3. **Customers**: Customer information and contact details
4. **Orders**: Order management with order items and status tracking
5. **Marketplaces**: Third-party marketplace integrations (Amazon, eBay, Shopify, etc.)

### Frontend Pages
- **Dashboard**: Analytics overview with sales statistics and charts
- **Orders**: Order management with filtering and status updates
- **Products**: Product catalog management with CRUD operations
- **Customers**: Customer database management
- **Marketplaces**: Marketplace connection and configuration

### UI Components
- **Layout**: Fixed sidebar navigation with responsive header
- **Forms**: React Hook Form with Zod validation
- **Data Display**: Tables, cards, and charts using Recharts
- **Notifications**: Toast notifications for user feedback
- **Modals**: Dialog components for forms and confirmations

## Data Flow

### Client-Server Communication
1. **API Requests**: Fetch API with credential-based authentication
2. **Error Handling**: Standardized error responses with HTTP status codes
3. **State Management**: React Query for caching and synchronization
4. **Real-time Updates**: Optimistic updates with query invalidation

### Database Operations
1. **Type Safety**: Drizzle ORM ensures compile-time type checking
2. **Migrations**: Schema changes managed through Drizzle Kit
3. **Relationships**: Foreign key constraints for data integrity
4. **Transactions**: Atomic operations for complex business logic

### Authentication Flow
- Session-based authentication with PostgreSQL storage
- User context management across the application
- Protected routes and API endpoints

## External Dependencies

### Core Libraries
- **React Ecosystem**: React, React DOM, React Hook Form
- **Database**: Drizzle ORM, Neon Database serverless driver
- **UI Framework**: Radix UI primitives, Tailwind CSS
- **State Management**: TanStack Query for server state
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation

### Development Tools
- **Build Tools**: Vite with React plugin
- **TypeScript**: Full TypeScript support across the stack
- **Code Quality**: ESLint configuration for code standards
- **Runtime**: tsx for TypeScript execution in development

### Third-party Integrations
- **Marketplace APIs**: Extensible architecture for marketplace connectors
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for consistent iconography

## Deployment Strategy

### Development Environment
- **Dev Server**: Vite dev server with HMR for frontend
- **Backend**: tsx for TypeScript execution with nodemon-like behavior
- **Database**: Neon Database with connection pooling
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite build with optimized bundle splitting
- **Backend**: esbuild for efficient Node.js bundle creation
- **Static Assets**: Served from dist/public directory
- **Database**: PostgreSQL with migration support

### Hosting Considerations
- **Database**: Neon Database (serverless PostgreSQL)
- **Static Files**: Can be served via CDN
- **API**: Express server with middleware for CORS and security
- **Environment**: Node.js runtime with ES module support

## Changelog

```
Changelog:
- July 06, 2025. Initial setup with in-memory storage
- July 06, 2025. Added PostgreSQL database integration with Drizzle ORM
  - Created database schema with proper relations
  - Migrated from MemStorage to DatabaseStorage
  - Added database seeding with sample data
  - All data now persists in PostgreSQL database
- July 06, 2025. Implemented advanced stock management system
  - Added stock tracking settings per marketplace (enable/disable)
  - Auto stock update functionality across connected marketplaces
  - Real-time stock synchronization when orders are received
  - SKU-based stock updates with marketplace API integration ready
  - Enhanced marketplace configuration with stock control options
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```