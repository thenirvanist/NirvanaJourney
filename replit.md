# The Nirvanist - Spiritual Tourism Platform

## Overview

The Nirvanist is a full-stack spiritual tourism platform designed to connect individuals with transformative spiritual experiences. It facilitates spiritual growth through curated global journeys, wisdom teachings, ashram retreats, and community meetups in sacred destinations. The platform aims to be a comprehensive resource for seekers, offering unique spiritual tourism opportunities and fostering a global community.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS with shadcn/ui and Radix UI primitives
- **State Management**: TanStack Query for server state
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **API Design**: RESTful API
- **File Structure**: Modular organization

### Database Architecture
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (Neon serverless)
- **Schema Management**: Drizzle Kit

### UI/UX Decisions
- Dynamic and interactive elements: SVG maps, auto-sliding carousels, hover effects, word-by-word animations.
- Responsive design with a mobile-first approach.
- Theming includes alternating background patterns (white and #F7F2E8).

### Technical Implementations
- **Content Querying**: All content queries (Journeys, Sages, Ashrams, Meetups, Testimonials, Daily Wisdom, Blog Posts) use direct Supabase client hooks with TanStack Query for caching, bypassing backend API endpoints for reads. Backend API routes are primarily for mutations and authentication.
- **Authentication**: Comprehensive system with user registration, login, password reset, email verification, and 5-provider social authentication (Google, Apple, Facebook, X.com, Microsoft) via Supabase.
- **Search & Filtering**: Real-time dynamic filtering for Sages and Ashrams based on various criteria.
- **Performance**: Lazy loading, code splitting, optimized hero sections, resource hints, critical CSS inlining, image optimization with Intersection Observer, loading skeletons, GPU-accelerated animations, and accessibility support for reduced motion.
- **SEO**: Static and dynamic sitemaps, robots.txt, and dynamic SEO routes for content pages.

### Feature Specifications
- **Heal Page**: Custom SVG world map with country-specific data and tooltips, a multi-step donation form, transparency ledger, and donor leaderboard.
- **Spiritual Journeys**: Detailed pages with overview, description, itinerary tabs, and testimonial carousels.
- **Sages & Ashrams**: Grid layouts with search, filtering, and individual detail pages.

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **AI Service**: OpenAI API for chatbot functionality
- **UI Components**: Radix UI primitives, shadcn/ui
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (Inter family)
- **Icons**: Lucide React

### Third-party Integrations
- **Supabase**: For social authentication and direct database client interactions.
- **Connect-pg-simple**: For PostgreSQL session store.