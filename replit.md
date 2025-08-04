# Overview

SupportGPT is a mental health support chatbot application specifically designed for students. The application provides 24/7 anonymous mental health support with automatic language detection and multilingual responses. It features a modern React frontend with a Node.js/Express backend, using an in-memory storage system for chat sessions and integrating with Hugging Face's AI models for generating empathetic responses.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming, including mental health-focused color schemes
- **State Management**: TanStack React Query for server state management and custom hooks for chat functionality
- **Routing**: Wouter for lightweight client-side routing
- **Language Detection**: Client-side language detection using browser APIs and text pattern matching

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with endpoints for chat sessions and message handling
- **Request Logging**: Custom middleware for API request logging and error handling
- **Development**: Hot module replacement with Vite integration for seamless development experience

## Data Storage
- **Primary Storage**: In-memory storage implementation using JavaScript Maps
- **Database Ready**: Drizzle ORM configured for PostgreSQL with migration support (ready for database integration)
- **Session Management**: Automatic cleanup of old chat sessions to prevent memory leaks
- **Data Models**: Strongly typed schemas using Zod for message validation and type safety

## AI Integration
- **Primary Provider**: Hugging Face Inference API using DialoGPT-medium model
- **Fallback System**: Multiple fallback options including predefined empathetic responses for reliability
- **Response Customization**: Mental health-focused system prompts designed for student support scenarios
- **Language Support**: Multi-language response generation with automatic language detection

## External Dependencies
- **Neon Database**: PostgreSQL database service (@neondatabase/serverless) configured but not actively used
- **Hugging Face API**: AI model inference for generating conversational responses
- **Radix UI**: Comprehensive primitive component library for accessible UI elements
- **TanStack React Query**: Server state management and caching solution
- **Drizzle ORM**: Database toolkit with PostgreSQL dialect for future database integration
- **Vite**: Build tool and development server with React plugin support
- **TypeScript**: Type safety across the entire application stack