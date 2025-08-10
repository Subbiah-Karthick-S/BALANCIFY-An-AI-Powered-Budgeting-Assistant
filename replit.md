# Overview

Balancify AI is a sophisticated financial budgeting assistant that provides AI-powered insights for lifestyle and needs-based consumption analysis. The application features an advanced space-themed dark interface with interactive 3D visualizations, charts, and animations. Users complete a comprehensive financial questionnaire with automatic session persistence and receive personalized AI analysis with spending breakdowns, recommendations, and goal timelines.

## Recent Updates (January 2025)
- **Session Management System**: Complete localStorage-based session persistence with 24-hour expiry
- **Network Resilience**: Questionnaire data survives browser crashes, refreshes, and network issues
- **Session Recovery**: Homepage detects active sessions and offers continuation from exact step
- **Server-Side Sessions**: Post-questionnaire server session creation with unique session IDs
- **Real Data Calculations**: What If simulator now uses actual user financial data instead of fallbacks

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and building
- **Styling**: TailwindCSS with shadcn/ui component library for consistent UI components
- **Theme**: Dark space/cosmic theme with custom CSS variables and animations
- **State Management**: React Query (TanStack Query) for server state management and local React state for UI state
- **Navigation**: Simple state-based navigation between Home, Questionnaire, and Dashboard pages
- **Session Recovery**: Automatic detection and restoration of incomplete questionnaire sessions
- **Charts**: Recharts library for advanced data visualizations including pie charts, bar charts, and line charts
- **Forms**: React Hook Form with Zod validation for questionnaire data collection
- **Session Persistence**: localStorage-based automatic saving with 24-hour session expiry

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for schema management and queries
- **Development**: In-memory storage fallback for development/testing scenarios
- **API Design**: Session-based RESTful endpoints with financial session management
- **Session Management**: Server-side session storage with unique session IDs for analysis linking
- **Build System**: ESBuild for production bundling with platform-specific optimizations

## Data Layer
- **ORM**: Drizzle with PostgreSQL dialect for type-safe database operations
- **Schema**: Three main entities - Users, Questionnaires, and Financial Analyses
- **Validation**: Zod schemas for runtime type checking and data validation
- **Migrations**: Drizzle Kit for database schema migrations and management

## AI Integration
- **Provider**: Google Gemini AI for financial analysis and insights generation
- **Processing**: Server-side AI analysis of questionnaire data to generate spending patterns, optimization opportunities, investment recommendations, and risk analysis
- **Output**: Structured JSON responses with categorized insights and recommendations

## Authentication & Security
- **Current State**: No authentication implemented (userId nullable in schema)
- **Future Ready**: Database schema prepared for user authentication with user table structure
- **Data Validation**: Comprehensive input validation using Zod schemas on both client and server

## File Generation
- **PDF Reports**: PDFKit integration for generating downloadable financial analysis reports
- **Content**: Automated report generation including charts, insights, and recommendations

# External Dependencies

## Core Infrastructure
- **Database**: PostgreSQL via Neon Database serverless hosting
- **AI Service**: Google Gemini AI API for financial analysis and insights
- **Session Storage**: Browser localStorage for client-side persistence + in-memory server sessions
- **Session Architecture**: Client localStorage → Server sessions → Analysis results with session linking

## Frontend Libraries
- **UI Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS, Radix UI primitives, shadcn/ui components
- **Charts**: Recharts for data visualization
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Validation**: Zod for schema validation
- **Utilities**: clsx, class-variance-authority for styling utilities

## Development Tools
- **Build Tool**: Vite with React plugin and runtime error overlay
- **Database Tools**: Drizzle Kit for migrations and schema management
- **TypeScript**: Full TypeScript setup with strict configuration
- **Development**: TSX for running TypeScript directly in development

## Fonts & Assets
- **Typography**: Google Fonts (Orbitron, Inter) for space-themed styling
- **Icons**: Font Awesome 6.4.0 and Lucide React for UI icons
- **Theme**: Custom cosmic color palette with CSS variables for dark theme