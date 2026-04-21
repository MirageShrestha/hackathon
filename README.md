# Sojourner

Sojourner is a mobile-first travel planning web app focused on Nepal. It combines inspiration, itinerary planning, service discovery, and personal trip tracking in one interface.

## What This Project Does

- Shows short-form trekking/travel reels with detail views
- Helps users build and manage itineraries and budgets
- Includes a services marketplace for guides, stays, and transport
- Provides a personal dashboard for saved trips and profile data
- Supports trip story uploads with media and structured plan data

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- Framer Motion
- React Router
- React Hook Form + Zod
- TanStack Query
- Vitest + Testing Library
- ESLint

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### Build Production Assets

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run build:dev` - Build using development mode
- `npm run preview` - Preview built app locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once with Vitest
- `npm run test:watch` - Run Vitest in watch mode

## Project Structure

```text
src/
  assets/              Static images and media
  components/
    trekking/          Reels, itinerary, crew, ticket, and trip detail UI
    trip-upload/       Trip/story upload flow and helpers
    my-trek/           Personal dashboard data and components
    services/          Service marketplace and data models
    ui/                Reusable shadcn/ui components
  hooks/               Shared React hooks
  lib/                 Utility helpers
  pages/               Route-level pages
  test/                Test setup and example tests
  App.tsx              Router/app shell
  main.tsx             Application entry point
```

## Key Source Files

- `src/pages/Index.tsx` - Main application experience
- `src/components/trekking/data.ts` - Trekking reels and itinerary mock data
- `src/components/trip-upload/data.ts` - Trip upload related data
- `src/components/services/data.ts` - Services marketplace data
- `src/App.tsx` - Route wiring

## Development Notes

- Most current data is mock/local and intended for rapid iteration
- UI components follow shadcn patterns under `src/components/ui`
- Keep domain-specific types close to feature folders (`types.ts`)
- Prefer feature-folder updates instead of large cross-folder edits

## Testing

```bash
npm run test
```

For watch mode:

```bash
npm run test:watch
```

## License

This repository is currently intended for hackathon/demo use.
